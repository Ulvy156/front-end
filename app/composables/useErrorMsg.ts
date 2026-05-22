import type { AxiosError } from 'axios'

export const useErrorMsg = () => {
  const { t } = useI18n()

  const extract = (err: unknown): string => {
    const data = (err as AxiosError)?.response?.data as { message?: unknown } | undefined
    const msg = data?.message
    if (Array.isArray(msg)) return msg.join(', ')
    if (typeof msg === 'string' && msg) return msg
    return t('common.somethingWentWrong')
  }

  return { extract }
}
