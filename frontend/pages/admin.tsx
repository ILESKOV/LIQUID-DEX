import { ContractCallRegularOptions, openContractCall } from '@stacks/connect'
import {
  contractPrincipalCV,
  standardPrincipalCV,
  uintCV,
} from '@stacks/transactions'
import { useState } from 'react'
import ActionButton from '../components/ActionButton'
import Auth from '../components/Auth'
import NumberInput from '../components/NumberInput'
import PageHeading from '../components/PageHeading'
import {
  appDetails,
  contractOwnerAddress,
  exchangeContractName,
} from '../lib/constants'
import truncateMiddle from '../lib/truncate'
import { useStacks } from '../providers/StacksProvider'
import { useTransactionToasts } from '../providers/TransactionToastProvider'

export default function AdminPage() {
  const [exchangeToken, setExchangeToken] = useState<string>('')
  const [lpToken, setLpToken] = useState<string>('')
  const [mintAmount, setMintAmount] = useState<number>(1_000_000)
  const { network, address } = useStacks()
  const { addTransactionToast } = useTransactionToasts()

  const mintTokens = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log(`Minting ${mintAmount} of ${exchangeToken}`)

    // (contract-call? .liquid mint u1000000 tx-sender)
    const options: ContractCallRegularOptions = {
      contractAddress: contractOwnerAddress,
      contractName: exchangeToken,
      functionName: 'mint',
      functionArgs: [
        uintCV(mintAmount),
        standardPrincipalCV(contractOwnerAddress),
      ],
      network,
      appDetails,
      onFinish: ({ txId }) =>
        addTransactionToast(
          txId,
          `Minting ${exchangeToken} to ${truncateMiddle(
            contractOwnerAddress
          )}...`
        ),
    }

    await openContractCall(options)
  }

  const setLpMinterPermission = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()

    // (contract-call? .liquid-lp set-minter .liquidstalk-exchange)
    const options: ContractCallRegularOptions = {
      contractAddress: contractOwnerAddress,
      contractName: lpToken,
      functionName: 'set-minter',
      functionArgs: [
        // Create a contract principal which combines the exchange address + name
        contractPrincipalCV(contractOwnerAddress, exchangeContractName),
      ],
      network,
      appDetails,
      onFinish: ({ txId }) =>
        addTransactionToast(txId, `Setting minter permission on ${lpToken}...`),
    }

    await openContractCall(options)
  }

  return (
    <div className="m-auto flex max-w-4xl flex-col items-stretch gap-8">
      <PageHeading>Admin</PageHeading>

      <Auth />

      <form className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="exchange-token"
            className="block text-sm font-medium text-gray-400"
          >
            Exchange Token
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="exchange-token"
              defaultValue={exchangeToken}
              onChange={(e) => setExchangeToken(e.target.value)}
              className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="some-token"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="lp-token"
            className="block text-sm font-medium text-gray-400"
          >
            LP Token
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="lp-token"
              defaultValue={lpToken}
              onChange={(e) => setLpToken(e.target.value)}
              className="block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="some-token-lp"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="mint-amount"
            className="block text-sm font-medium text-gray-400"
          >
            Mint Amount
          </label>
          <div className="mt-1">
            <NumberInput
              name="mint-amount"
              decimals={0}
              required={false}
              defaultValue={mintAmount}
              onChange={(e) => setMintAmount(e.target.valueAsNumber)}
            />
          </div>
        </div>

        <div className="flex flex-row gap-8">
          <ActionButton
            type="button"
            disabled={!exchangeToken || !address}
            onClick={mintTokens}
          >
            Mint Tokens
          </ActionButton>

          <ActionButton
            type="button"
            disabled={!lpToken || !address}
            onClick={setLpMinterPermission}
          >
            Set LP Minter Permission
          </ActionButton>
        </div>
      </form>
    </div>
  )
}
