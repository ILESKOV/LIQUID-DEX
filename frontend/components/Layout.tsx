import { PropsWithChildren } from 'react'
import Footer from './Footer'
import Navbar from './Navbar'

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="flex min-h-screen flex-col gap-16 bg-gray-900 text-white">
      <Navbar />
      <main className="mb-auto">{children}</main>
      <Footer />
    </div>
  )
}
