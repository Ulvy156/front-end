import { ElNotification } from 'element-plus'

type NotifyType = 'success' | 'warning' | 'info' | 'error'

export function useNotify() {
  const { t } = useI18n()

  const notify = (
    title: string,
    message: string,
    type: NotifyType = 'info'
  ) => {
    if (import.meta.server) return

    ElNotification({
      title,
      message,
      type,
      duration: 3000,
      position: 'top-right',
    })
  }

  const success = (message: string, title?: string) =>
    notify(title ?? t('success'), message, 'success')

  const warning = (message: string, title?: string) =>
    notify(title ?? t('warning'), message, 'warning')

  const error = (message: string, title?: string) =>
    notify(title ?? t('error'), message, 'error')

  const info = (message: string, title?: string) =>
    notify(title ?? t('info'), message, 'info')

  return { notify, success, warning, error, info }
}
