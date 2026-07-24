export function useCountdown() {
  const remaining = ref(0)
  let timer: ReturnType<typeof setInterval> | null = null

  const clear = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  const start = (seconds: number) => {
    clear()
    remaining.value = Math.max(0, Math.floor(seconds))
    if (remaining.value === 0) return
    timer = setInterval(() => {
      remaining.value -= 1
      if (remaining.value <= 0) clear()
    }, 1000)
  }

  const isActive = computed(() => remaining.value > 0)
  const mmss = computed(() => {
    const m = Math.floor(remaining.value / 60)
    const s = remaining.value % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  })

  onUnmounted(clear)

  return { remaining, mmss, isActive, start, stop: clear }
}
