import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import TransactionToastProvider from '../providers/TransactionToastProvider'
import { Toaster } from 'react-hot-toast'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TransactionToastProvider>
      <Toaster position="bottom-right" />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </TransactionToastProvider>
  )
}

export default MyApp
