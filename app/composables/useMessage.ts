import { ElMessage } from 'element-plus'

import type { MessagePlacement, MessageType } from 'element-plus'

export function useMessage() {
  const showMessage = (
    message: string,
    type: MessageType = 'info',
    placement: MessagePlacement = 'top'
  ) => {
    if (import.meta.server) {
      return
    }

    ElMessage({
      message,
      type,
      placement,
    })
  }

  return {
    showMessage,
  }
}
