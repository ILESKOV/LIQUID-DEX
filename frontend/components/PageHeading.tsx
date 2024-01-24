import { PropsWithChildren } from 'react'

export default function PageHeading({ children }: PropsWithChildren<{}>) {
  return (
    <h1 className="self-center bg-gradient-to-r from-gray-400 to-gray-200 bg-clip-text pb-8 text-8xl font-extrabold text-transparent">
      {children}
    </h1>
  )
}
