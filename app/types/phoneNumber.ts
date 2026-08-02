export const PHONE_NUMBER_TYPE = {
  PHONE: 'PHONE',
  TELEGRAM: 'TELEGRAM',
} as const

export type PhoneNumberType = (typeof PHONE_NUMBER_TYPE)[keyof typeof PHONE_NUMBER_TYPE]