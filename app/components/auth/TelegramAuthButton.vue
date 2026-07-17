<template>
    <button type="button" @click="loginWithTelegram" class="w-full flex items-center justify-center gap-x-3
           rounded-xl border border-slate-200 bg-white
           py-2.5 font-medium text-slate-700 text-sm
           hover:border-slate-300 hover:shadow-sm
           active:scale-[0.99] transition-all duration-150 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 240 240">
            <circle cx="120" cy="120" r="120" fill="#229ED9" />
            <path fill="#fff"
                d="M53 118l125-48c6-2 11 1 9 10l-21 100c-2 8-7 10-14 6l-38-28-18 17c-2 2-4 3-7 3l3-38 68-62c3-3-1-4-4-2l-84 53-36-11c-8-2-8-7 2-11z" />
        </svg>
        <span>{{ label ?? t('auth.telegram') }}</span>
    </button>
</template>

<script setup lang="ts">
const TELEGRAM_BOT_ID = '8359470124'

defineProps<{ label?: string }>()

const { t } = useI18n()

const loginWithTelegram = () => {
    const origin = window.location.origin
    const returnTo = `${origin}/auth/telegram-callback`
    const url = `https://oauth.telegram.org/auth?bot_id=${TELEGRAM_BOT_ID}&origin=${encodeURIComponent(origin)}&request_access=write&return_to=${encodeURIComponent(returnTo)}`
    window.location.href = url
}
</script>
