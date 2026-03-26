export function useCopy() {
  const { t } = useI18n()
  const message = useMessage()

  async function copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)

      message.showMessage(
        t('copied'),
        'success',
        'bottom-right'
      )

      return true
    } catch (error) {
      message.showMessage(
        t('copy_failed'),
        'error',
        'bottom-right'
      )
      return false
    }
  }

  return { copy }
}
