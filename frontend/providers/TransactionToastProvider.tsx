import { StacksMocknet } from '@stacks/network'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import toast from 'react-hot-toast'

interface TransactionsToastContextValue {
  addTransactionToast: (transactionId: string, pendingMessage: string) => void
}

const TransactionToastsContext = createContext<
  TransactionsToastContextValue | undefined
>(undefined)

export default function TransactionToastProvider({
  children,
}: PropsWithChildren<{}>) {
  const network = new StacksMocknet()
  const [transactionIds, setTransactionIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const interval = setInterval(() => {
      updateAllTransactions(transactionIds)
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [transactionIds])

  async function updateAllTransactions(transactionIds: Set<string>) {
    transactionIds.forEach(async (transactionId) => {
      console.log('Checking latest status of transaction:', transactionId)
      await getTransactionStatus(transactionId)
    })
  }

  async function getTransactionStatus(transactionId: string) {
    const apiUrl = network.coreApiUrl
    const url = `${apiUrl}/extended/v1/tx/${transactionId}`
    const res = await fetch(url)
    const json = await res.json()

    const status = json['tx_status']
    if (status === 'pending') {
      return
    }

    if (status === 'success') {
      toast.success('Done!', { id: transactionId })
    } else {
      toast.error('Transaction failed', { id: transactionId })
    }
    setTransactionIds((transactionIds) => {
      const newTransactionIds = new Set(transactionIds)
      newTransactionIds.delete(transactionId)
      return newTransactionIds
    })
  }

  function addTransactionToast(transactionId: string, pendingMessage: string) {
    console.log(`listening to updates for transaction ${transactionId}`)
    toast.loading(pendingMessage, { id: transactionId })
    setTransactionIds((transactionIds) => transactionIds.add(transactionId))
  }

  const value: TransactionsToastContextValue = { addTransactionToast }

  return (
    <TransactionToastsContext.Provider value={value}>
      {children}
    </TransactionToastsContext.Provider>
  )
}

export function useTransactionToasts() {
  const context = useContext(TransactionToastsContext)
  if (context === undefined) {
    throw new Error(
      'useTransactionToasts must be used within a TransactionToastProvider'
    )
  }
  return context
}
