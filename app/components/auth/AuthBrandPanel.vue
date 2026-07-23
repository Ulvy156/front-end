<template>
    <div class="hidden lg:flex lg:w-5/12 xl:w-[45%] relative overflow-hidden
                flex-col justify-between p-12 text-white bg-emerald-700 bg-cover bg-center"
        style="background-image: url('/bg.png')">

        <div class="absolute inset-0 bg-gradient-to-t from-emerald-900/85 via-emerald-900/50 to-emerald-900/20" />

        <NuxtLink to="/" class="relative z-10 flex items-center gap-2.5 w-fit rounded-full bg-white/10 backdrop-blur-sm
                   pl-3 pr-5 py-2 border border-white/20 shadow-lg
                   hover:bg-white/20 hover:border-white/30 transition-colors">
            <NuxtImg src="/rokpteah-logo.webp" alt="RokPteah" class="h-9" />
            <span class="text-2xl font-bold tracking-tight text-white">RokPteah</span>
        </NuxtLink>

        <div class="relative z-10 space-y-8">
            <div class="space-y-4">
                <h1 class="text-4xl font-bold leading-tight">{{ title }}</h1>
                <p class="text-emerald-50 text-base leading-relaxed max-w-xs">{{ description }}</p>
            </div>

            <ul class="space-y-3.5">
                <li v-for="item in features" :key="item.text" class="flex items-center gap-x-3 text-emerald-50">
                    <div class="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                        <BaseIcon :name="item.icon" :size="16" />
                    </div>
                    <span class="text-sm">{{ item.text }}</span>
                </li>
            </ul>
        </div>

        <p class="relative z-10 text-emerald-100/80 text-xs">{{ t('auth.agreement') }}</p>
    </div>
</template>

<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.client.vue'

defineProps<{
    title: string
    description: string
    features: { icon: string, text: string }[]
}>()

const { t } = useI18n()
</script>
