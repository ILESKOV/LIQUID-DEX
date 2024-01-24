import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import TransactionToastProvider from '../providers/TransactionToastProvider'
import { Toaster } from 'react-hot-toast'
import StacksProvider from '../providers/StacksProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StacksProvider>
      <TransactionToastProvider>
        <Toaster position="bottom-right" />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </TransactionToastProvider>
    </StacksProvider>
  )
}

export default MyApp
