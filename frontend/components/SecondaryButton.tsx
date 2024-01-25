import { ButtonHTMLAttributes } from 'react'

export default function ActionButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { children, ...rest } = props

  return (
    <button
      {...rest}
      className="inline-flex max-w-fit items-center rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    >
      {props.children}
    </button>
  )
}
