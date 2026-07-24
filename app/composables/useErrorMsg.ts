import type { AxiosError } from 'axios'

const responseMessage = (err: unknown): string | string[] | undefined => {
  const data = (err as AxiosError)?.response?.data as { message?: unknown } | undefined
  return data?.message as string | string[] | undefined
}

export const useErrorMsg = () => {
  const { t } = useI18n()

  const extract = (err: unknown): string => {
    // useAsyncData wraps thrown errors in a NuxtError, moving the original
    // (the actual AxiosError, with the backend's response body) to `.cause` —
    // check both so callers get the real backend message either way.
    const msg = responseMessage(err) ?? responseMessage((err as { cause?: unknown })?.cause)
    if (Array.isArray(msg) && msg.length) return msg.join(', ')
    if (typeof msg === 'string' && msg) return msg
    return t('common.somethingWentWrong')
  }

  return { extract }
}
