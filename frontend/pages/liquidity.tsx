import { ContractCallRegularOptions, openContractCall } from '@stacks/connect'
import {
  createAssetInfo,
  FungibleConditionCode,
  makeStandardFungiblePostCondition,
  makeStandardSTXPostCondition,
  uintCV,
} from '@stacks/transactions'
import { useEffect, useState } from 'react'
import ActionButton from '../components/ActionButton'
import Auth from '../components/Auth'
import NumberInput from '../components/NumberInput'
import PageHeading from '../components/PageHeading'
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
      createAssetInfo(contractOwnerAddress, 'liquid', 'liquid')
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
        1 'STX' = <b>{+exchangeRatio.toFixed(6)}</b> 'Liquid'
      </p>
    )
  }

  return (
    <div className="m-auto flex max-w-4xl flex-col items-stretch gap-8">
      <PageHeading>Provide Liquidity</PageHeading>

      <Auth />

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
            'STX' to provide
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
            'Liquid' tokens to provide
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
    </div>
  )
}
