import { StacksNetwork } from '@stacks/network'
import { callReadOnlyFunction, cvToValue } from '@stacks/transactions'
import {
  contractOwnerAddress,
  exchangeContractName,
  microstacksPerSTX,
} from './constants'

export interface ExchangeInfo {
  stxBalance: number
  tokenBalance: number
}

export default async function fetchExchangeInfo(
  network: StacksNetwork,
  userAddress: string
): Promise<ExchangeInfo> {
  const stxBalanceResponse = await callReadOnlyFunction({
    contractAddress: contractOwnerAddress,
    contractName: exchangeContractName,
    functionName: 'get-stx-balance',
    functionArgs: [],
    network,
    senderAddress: userAddress,
  })

  // stxBalanceResponse is a uint clarity value
  // cvToValue(stxBalanceResponse) is a bigint, balance in microstacks
  const microstacks: bigint = cvToValue(stxBalanceResponse)
  const stxBalance = Number(microstacks) / microstacksPerSTX

  const tokenBalanceResponse = await callReadOnlyFunction({
    contractAddress: contractOwnerAddress,
    contractName: exchangeContractName,
    functionName: 'get-token-balance',
    functionArgs: [],
    network,
    senderAddress: userAddress,
  })

  // tokenBalanceResponse is a uint clarity value
  // cvToValue(tokenBalanceResponse) is a bigint, balance in tokens
  const tokenBalance = Number(cvToValue(tokenBalanceResponse))

  return {
    stxBalance,
    tokenBalance,
  }
}
