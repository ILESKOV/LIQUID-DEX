import { ButtonHTMLAttributes } from "react";

export default function ActionButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { children, ...rest } = props;

  return <button
    {...rest}
    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm max-w-fit hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none"
  >{children}</button>
}
