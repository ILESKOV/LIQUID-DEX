import { PropsWithChildren } from 'react'

export default function SectionHeading({ children }: PropsWithChildren<{}>) {
  return (
    <h3 className="my-2 self-center text-2xl font-bold text-gray-300">
      {children}
    </h3>
  )
}
