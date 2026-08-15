import type { AxiosError } from 'axios'

const responseMessage = (err: unknown): string | string[] | undefined => {
  const data = (err as AxiosError)?.response?.data as { message?: unknown } | undefined
  return data?.message as string | string[] | undefined
}

export const useErrorMsg = () => {
  const { t } = useI18n()

  const extract = (err: unknown, fallback = t('common.somethingWentWrong')): string => {
    // useAsyncData wraps thrown errors in a NuxtError, moving the original
    // (the actual AxiosError, with the backend's response body) to `.cause` —
    // check both so callers get the real backend message either way.
    const msg = responseMessage(err) ?? responseMessage((err as { cause?: unknown })?.cause)
    if (Array.isArray(msg) && msg.length) return msg.join(', ')
    if (typeof msg === 'string' && msg) return msg
    return fallback
  }

  // Unlike extract() (which flattens an array into one string for a toast),
  // this keeps each validation message separate — for the one UI that needs
  // to show every problem as its own checklist item (draft publish errors).
  const getValidationMessages = (err: unknown): string[] | null => {
    const msg = responseMessage(err) ?? responseMessage((err as { cause?: unknown })?.cause)
    if (Array.isArray(msg) && msg.length) return msg
    return null
  }

  return { extract, getValidationMessages }
}
