<template>
  <div ref="telegramBtn"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const telegramBtn = ref<HTMLDivElement | null>(null)

onMounted(() => {
  // expose callback globally (Telegram requirement)
  ;(window as any).onTelegramAuth = (user: any) => {
    fetch('/api/auth/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
  }

  const script = document.createElement('script')
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-telegram-login', 'rentify156_bot')
  script.setAttribute('data-size', 'large')
  script.setAttribute('data-userpic', 'true')
  script.setAttribute('data-request-access', 'write')
  script.setAttribute('data-on-auth', 'onTelegramAuth')

  telegramBtn.value?.appendChild(script)
})
</script>
