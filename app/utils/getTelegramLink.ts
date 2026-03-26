export function getTelegramLink(phone: string): string | null {
  if (!phone) return null

  // remove spaces and dashes
  const cleaned = phone.replace(/\s|-/g, '')

  let formatted = cleaned

  // convert local KH number (012xxxxxx) → +85512xxxxxx
  if (cleaned.startsWith('0')) {
    formatted = '+855' + cleaned.slice(1)
  }

  // already international (starts with +)
  if (!formatted.startsWith('+')) {
    formatted = '+' + formatted
  }

  return `https://t.me/${formatted}`
}
