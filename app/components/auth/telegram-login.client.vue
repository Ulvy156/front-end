<template>
  <div ref="wrapperEl" class="group relative w-full h-10">
    <!-- Custom label. The real Telegram widget below doesn't support
         custom button text, so this is a visual skin only: the actual
         (invisible) widget iframe sits on top and receives the click. -->
    <button
      type="button"
      tabindex="-1"
      class="absolute inset-0 w-full flex items-center justify-center gap-x-2
             rounded-xl border border-slate-200 bg-white
             font-medium text-slate-700 text-sm
             group-hover:border-slate-300 group-hover:shadow-sm
             group-active:scale-[0.99] transition-all duration-150"
    >
      <Icon name="mdi:telegram" :size="18" class="text-[#26A5E4]" />
      <span>{{ t('auth.telegram') }}</span>
    </button>

    <div
      v-if="!isWidgetReady"
      class="absolute inset-0 rounded-xl bg-gray-100 animate-pulse"
    />

    <!-- Telegram only ever renders its iframe at a fixed 238x40 ("large")
         size. To make the actual clickable area line up with the
         full-width custom button above, it's scaled via CSS transform
         (which stretches hit-testing, not just paint) rather than resized
         with layout properties, which the iframe's internal fixed-width
         content wouldn't reflow to fill anyway. -->
    <div
      ref="telegramBtn"
      class="absolute left-0 top-0 h-10 w-59.5 origin-left opacity-0 overflow-hidden"
      :style="{ transform: `scaleX(${scaleX})` }"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ authUrl?: string }>(), {
  authUrl: '/auth/telegram-callback',
})

useHead({
  link: [
    { rel: 'preload', href: 'https://telegram.org/js/telegram-widget.js?22', as: 'script', crossorigin: 'anonymous' },
    { rel: 'preconnect', href: 'https://oauth.telegram.org' },
  ],
})

const telegramBtn = ref<HTMLDivElement | null>(null)
const wrapperEl = ref<HTMLDivElement | null>(null)
const isWidgetReady = ref(false)
const scaleX = ref(1)
const TELEGRAM_WIDGET_WIDTH = 238
const { t } = useI18n()

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  if (wrapperEl.value) {
    resizeObserver = new ResizeObserver(([entry]) => {
      if (entry) scaleX.value = entry.contentRect.width / TELEGRAM_WIDGET_WIDTH
    })
    resizeObserver.observe(wrapperEl.value)
  }
  onUnmounted(() => resizeObserver?.disconnect())

  const onMessage = (e: MessageEvent) => {
    if (e.origin !== 'https://oauth.telegram.org') return
    try {
      const data = JSON.parse(e.data)
      if (data.event === 'ready') isWidgetReady.value = true
    } catch {
      // ignore non-JSON messages from other origins
    }
  }
  window.addEventListener('message', onMessage)
  onUnmounted(() => window.removeEventListener('message', onMessage))

  const script = document.createElement('script')
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-telegram-login', 'rentify156_bot')
  script.setAttribute('data-size', 'large')
  script.setAttribute('data-userpic', 'true')
  script.setAttribute('data-request-access', 'write')
  // data-auth-url (a plain top-level redirect) instead of data-onauth: the
  // latter makes the widget inject an inline <script> to invoke the page
  // callback, which violates script-src without 'unsafe-inline'.
  script.setAttribute('data-auth-url', props.authUrl)

  telegramBtn.value?.appendChild(script)
})
</script>
