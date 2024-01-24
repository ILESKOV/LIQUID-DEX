import { ChangeEvent } from 'react'

interface NumberInputProps {
  decimals: number
  name: string
  required: boolean
  placeholder?: number
  defaultValue?: number
  extraClasses?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function NumberInput({
  decimals,
  name,
  required,
  placeholder,
  defaultValue,
  extraClasses,
  onChange,
}: NumberInputProps) {
  const step = 1 / Math.pow(10, decimals)

  return (
    <input
      type="number"
      step={step}
      id={name}
      name={name}
      min={0}
      defaultValue={defaultValue}
      required={required}
      onBlur={(e) => {
        const value = e.target.valueAsNumber
        const rounded = +value.toFixed(decimals)
        e.currentTarget.valueAsNumber = rounded
      }}
      onChange={onChange}
      className={`block w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm ${
        extraClasses ?? ''
      }`}
      placeholder={placeholder?.toString()}
    />
  )
}
