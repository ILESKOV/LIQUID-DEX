// Borrowed from https://stackoverflow.com/a/5723274/1375972
export default function truncateMiddle(fullString: string) {
  const targetLength = 11
  const separator = "..."

  const sepLen = separator.length
  const charsToShow = targetLength - sepLen
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)

  return fullString.substring(0, frontChars) +
    separator +
    fullString.substring(fullString.length - backChars)
}
