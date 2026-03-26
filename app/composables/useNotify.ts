import { ElNotification } from 'element-plus'

type NotifyType = 'success' | 'warning' | 'info' | 'error'

export function useNotify() {
  const notify = (
    title: string,
    message: string,
    type: NotifyType = 'info'
  ) => {
    ElNotification({
      title,
      message,
      type,
      duration: 3000,
      position: 'top-right',
    })
  }

  const success = (message: string, title = 'Success') =>
    notify(title, message, 'success')

  const warning = (message: string, title = 'Warning') =>
    notify(title, message, 'warning')

  const error = (message: string, title = 'Error') =>
    notify(title, message, 'error')

  const info = (message: string, title = 'Info') =>
    notify(title, message, 'info')

  return {
    notify,
    success,
    warning,
    error,
    info,
  }
}
