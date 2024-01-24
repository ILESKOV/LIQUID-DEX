import { PropsWithChildren } from 'react'
import Link from 'next/link'

interface NavbarLinkProps {
  href: string;
}

function NavbarLink({ href, children }: PropsWithChildren<NavbarLinkProps>) {
  return (
    <Link href={href}>
      <a className="text-2xl text-grey-darkest hover:scale-105 hover:text-pink-600">
        {children}
      </a>
    </Link>
  )
}

export default function Navbar() {
  return (
    <nav className="flex justify-center w-full h-10 gap-4 px-4 pt-4 pb-20 font-sans md:px-20 ">
      <NavbarLink href="/admin">Admin</NavbarLink>
      <NavbarLink href="/liquidity">Liquidity</NavbarLink>
      <NavbarLink href="/swap">Swap</NavbarLink>
    </nav>
  )
}
