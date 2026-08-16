export const RESET_PASSWORD_CHANNEL = {
  EMAIL: 'email',
  TELEGRAM: 'telegram',
} as const

export type ResetPasswordChannel = (typeof RESET_PASSWORD_CHANNEL)[keyof typeof RESET_PASSWORD_CHANNEL]
