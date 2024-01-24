import { PropsWithChildren } from 'react'
import Link from 'next/link'

interface NavbarLinkProps {
  href: string
}

function NavbarLink({ href, children }: PropsWithChildren<NavbarLinkProps>) {
  return (
    <Link href={href}>
      <a className="text-2xl text-gray-300 hover:text-gray-400">{children}</a>
    </Link>
  )
}

export default function Navbar() {
  return (
    <nav className="flex h-10 w-full justify-center gap-4 px-4 pt-4 pb-20 font-sans md:px-20">
      <NavbarLink href="/admin">Admin</NavbarLink>
      <NavbarLink href="/liquidity">Liquidity</NavbarLink>
      <NavbarLink href="/swap">Swap</NavbarLink>
    </nav>
  )
}
