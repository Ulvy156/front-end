import { ElMessage } from 'element-plus'

import type { MessagePlacement, MessageType } from 'element-plus'

export function useMessage() {
  const showMessage = (
    message: string,
    type: MessageType = 'info',
    placement: MessagePlacement = 'top'
  ) => {
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
