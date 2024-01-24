import ActionButton from './ActionButton'
import NumberInput from './NumberInput'

interface SwapFormProps {
  inputCurrency: string
  decimals: number
  swapFunction: (amount: number) => Promise<void>
}

export default function SwapForm({
  inputCurrency,
  decimals,
  swapFunction,
}: SwapFormProps) {
  const performSwap = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const amount = (
      e.currentTarget.elements.namedItem('amount') as HTMLInputElement
    ).valueAsNumber
    await swapFunction(amount)
  }

  return (
    <form className="flex flex-row items-end gap-4" onSubmit={performSwap}>
      <div>
        <label htmlFor="amount" className="sr-only">
          {inputCurrency} to provide
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <NumberInput
            name="amount"
            placeholder={123}
            required={true}
            decimals={decimals}
            extraClasses="pr-12"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm" id="amount-currency">
              {inputCurrency}
            </span>
          </div>
        </div>
      </div>

      <ActionButton type="submit">Swap!</ActionButton>
    </form>
  )
}
