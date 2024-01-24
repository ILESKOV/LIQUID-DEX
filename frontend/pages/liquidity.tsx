import { ContractCallRegularOptions, openContractCall } from '@stacks/connect'
import {
  createAssetInfo,
  FungibleConditionCode,
  makeContractFungiblePostCondition,
  makeContractSTXPostCondition,
  makeStandardFungiblePostCondition,
  makeStandardSTXPostCondition,
  uintCV,
} from '@stacks/transactions'
import { useEffect, useState } from 'react'
import ActionButton from '../components/ActionButton'
import Auth from '../components/Auth'
import NumberInput from '../components/NumberInput'
import PageHeading from '../components/PageHeading'
import SectionHeading from '../components/SectionHeading'
import {
  appDetails,
  contractOwnerAddress,
  exchangeContractName,
  microstacksPerSTX,
} from '../lib/constants'
import fetchExchangeInfo, { ExchangeInfo } from '../lib/fetchExchangeInfo'
import { useStacks } from '../providers/StacksProvider'
import { useTransactionToasts } from '../providers/TransactionToastProvider'

export default function LiquidityPage() {
  const { addTransactionToast } = useTransactionToasts()
  const { network, address } = useStacks()
  const [exchangeInfo, setExchangeInfo] = useState<ExchangeInfo | undefined>(
    undefined
  )

  const exchangeRatio =
    exchangeInfo && exchangeInfo.stxBalance
      ? exchangeInfo.tokenBalance / exchangeInfo.stxBalance
      : undefined

  const fetchExchangeInfoOnLoad = async () => {
    if (!address) {
      console.log("Can't fetch exchange info without sender address")
      return
    }

    const exchangeInfo = await fetchExchangeInfo(network, address)
    setExchangeInfo(exchangeInfo)
  }

  useEffect(() => {
    fetchExchangeInfoOnLoad()
  }, [address])

  const provideLiquidity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!address) {
      console.error('Must be logged in to provide liquidity')
      return
    }

    console.log('Providing liquidity...')

    // (contract-call? .beanstalk-exchange provide-liquidity u1000 u2000)
    const stxAmount = (
      e.currentTarget.elements.namedItem('stx-amount') as HTMLInputElement
    ).valueAsNumber
    const microstacksAmount = stxAmount * microstacksPerSTX

    const tokenAmount = (
      e.currentTarget.elements.namedItem('token-amount') as HTMLInputElement
    ).valueAsNumber

    const stxPostCondition = makeStandardSTXPostCondition(
      address,
      FungibleConditionCode.Equal,
      microstacksAmount
    )

    const tokenPostCondition = makeStandardFungiblePostCondition(
      address,
      FungibleConditionCode.Equal,
      tokenAmount,
      createAssetInfo(contractOwnerAddress, 'magic-beans', 'magic-beans')
    )

    const options: ContractCallRegularOptions = {
      contractAddress: contractOwnerAddress,
      contractName: exchangeContractName,
      functionName: 'provide-liquidity',
      functionArgs: [uintCV(microstacksAmount), uintCV(tokenAmount)],
      postConditions: [stxPostCondition, tokenPostCondition],
      network,
      appDetails,
      onFinish: ({ txId }) =>
        addTransactionToast(txId, `Providing liquidity (${stxAmount} STX)...`),
    }

    await openContractCall(options)
  }

  const removeLiquidity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Removing liquidity...')

    if (!address || !exchangeInfo) {
      console.error('Address and exchangeInfo are required for removeLiquidity')
      return
    }

    // (contract-call? .my-exchange remove-liquidity u5000)
    const burnAmount = (
      e.currentTarget.elements.namedItem('burn-amount') as HTMLInputElement
    ).valueAsNumber

    // Our LP token has 6 decimals

    const functionArgs = [uintCV(burnAmount)]

    const burnPostCondition = makeStandardFungiblePostCondition(
      address,
      FungibleConditionCode.Equal,
      burnAmount,
      createAssetInfo(contractOwnerAddress, 'magic-beans-lp', 'magic-beans-lp')
    )

    // Since we don't know exactly how much STX/tokens, just say >0
    // Optionally you could extend `fetchExchangeInfo` to get the number, and then use that to calculate the amount
    // Could also add another input and let the user set what they expect!
    const stxPostCondition = makeContractSTXPostCondition(
      contractOwnerAddress,
      exchangeContractName,
      FungibleConditionCode.Greater,
      0
    )

    const tokenPostCondition = makeContractFungiblePostCondition(
      contractOwnerAddress,
      exchangeContractName,
      FungibleConditionCode.Greater,
      0,
      createAssetInfo(contractOwnerAddress, 'magic-beans', 'magic-beans')
    )

    const options: ContractCallRegularOptions = {
      contractAddress: contractOwnerAddress,
      contractName: exchangeContractName,
      functionName: 'remove-liquidity',
      functionArgs,
      postConditions: [burnPostCondition, stxPostCondition, tokenPostCondition],
      network,
      appDetails,
      onFinish: ({ txId }) => {
        addTransactionToast(
          txId,
          `Burning liquidity (${burnAmount.toLocaleString()} MAGIC-LP)...`
        )
      },
    }

    await openContractCall(options)
  }

  const makeExchangeRatioSection = () => {
    if (!exchangeInfo) {
      return <p>Fetching exchange data...</p>
    }
    if (!exchangeRatio) {
      return <p>No liquidity yet!</p>
    }

    // toFixed(6) rounds to 6 decimal places, the + removes trailing 0s. Eg. 0.050000 -> 0.05
    return (
      <p>
        1 STX = <b>{+exchangeRatio.toFixed(6)}</b> Magic Beans
      </p>
    )
  }

  return (
    <div className="m-auto flex max-w-4xl flex-col items-stretch gap-8">
      <PageHeading>Liquidity</PageHeading>

      <Auth />

      <section className="flex flex-col gap-8">
        <SectionHeading>Provide Liquidity</SectionHeading>

        {makeExchangeRatioSection()}

        <form
          className="flex flex-row items-end gap-4"
          onSubmit={provideLiquidity}
        >
          <div>
            <label
              htmlFor="stx-amount"
              className="block text-sm font-medium text-gray-700"
            >
              STX to provide
            </label>
            <div className="mt-1">
              <NumberInput
                name="stx-amount"
                placeholder={123}
                required={true}
                decimals={6}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="token"
              className="block text-sm font-medium text-gray-700"
            >
              Magic Beans to provide
            </label>
            <div className="mt-1">
              <NumberInput
                name="token-amount"
                placeholder={456}
                required={true}
                decimals={0}
              />
            </div>
          </div>

          <ActionButton type="submit">Provide Liquidity</ActionButton>
        </form>
      </section>

      <section className="flex flex-col gap-8">
        <SectionHeading>Remove Liquidity</SectionHeading>

        <form
          className="flex flex-row items-end gap-4"
          onSubmit={removeLiquidity}
        >
          <div>
            <label
              htmlFor="burn-amount"
              className="block text-sm font-medium text-gray-700"
            >
              MAGIC-LP to burn
            </label>
            <div className="mt-1">
              <NumberInput
                name="burn-amount"
                placeholder={123}
                required={true}
                decimals={0}
              />
            </div>
          </div>

          <ActionButton type="submit">Remove Liquidity</ActionButton>
        </form>
      </section>
    </div>
  )
}
