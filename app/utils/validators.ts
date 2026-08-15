export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const isStrongPassword = (value: string): boolean =>
  value.length >= 8 &&
  /[A-Z]/.test(value) &&
  /[a-z]/.test(value) &&
  /[0-9]/.test(value) &&
  /[^A-Za-z0-9]/.test(value)

// Accepts the placeholders users are shown (e.g. "0xx xxx xxxx", "+855 12 345 678")
// and normalizes to the local 0-prefixed format the backend expects.
export const normalizePhoneNumber = (value: string): string => {
  const digits = value.trim().replace(/[\s-]/g, '')
  if (digits.startsWith('+855')) return `0${digits.slice(4)}`
  if (digits.startsWith('855')) return `0${digits.slice(3)}`
  return digits
}

export const isValidPhone = (value: string): boolean =>
  /^0\d{7,10}$/.test(normalizePhoneNumber(value))

// Empty/unset values pass through so `required` rules can flag them separately
export const isNonNegativeNumber = (value: unknown): boolean =>
  value === '' || value === null || value === undefined || Number(value) >= 0
