<template>
  <section class="lg:min-h-[60dvh] md:min-h-[40dvh] min-h-[50dvh] bg-black relative flex items-center justify-center">
    <NuxtImg
      src="/bg.png"
      alt=""
      loading="eager"
      fetchpriority="high"
      preload
      format="webp"
      width="1536"
      height="1024"
      class="absolute inset-0 w-full h-full object-cover"
    />
    <!-- Dark overlay for readability -->
    <div class="absolute inset-0 bg-black/45"></div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col items-center px-6 py-8 md:py-16 lg:py-32 text-white text-center">
      <!-- Badge -->
      <!-- <div class="inline-flex items-center gap-2 bg-white/18 px-3.5 py-1.5 rounded-full text-[13px] font-bold mb-5">
        <span class="w-1.75 h-1.75 rounded-full bg-green-200"></span>
        {{ totalListings }} {{ t('home.hero.badge') }}
      </div> -->

      <!-- Headline -->
      <h1 class="text-[clamp(2.25rem,5vw,50px)] leading-[1.06] font-extrabold tracking-[-0.03em] mb-4 max-w-155">
        {{ t('home.hero.title') }}
      </h1>
      <p class="text-[17px] leading-relaxed opacity-90 max-w-115">
        {{ t('home.hero.content') }}
      </p>

      <!-- Search CTA -->
      <NuxtLink
        to="/properties"
        :aria-label="t('home.hero.search.button')"
        class="group mt-8 w-full max-w-115 flex items-center justify-center gap-3 rounded-full bg-transparent text-white border-2 border-white font-semibold text-[16px] px-10 py-4.5 shadow-[0_18px_44px_-16px_rgba(2,6,23,0.5)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_22px_50px_-14px_rgba(2,6,23,0.55)] active:translate-y-0 active:scale-95"
      >
        <BaseIconClient name="search" :size="22" class="transition-transform duration-300 group-hover:rotate-12" />
        <span>{{ t('home.hero.search.button') }}</span>
      </NuxtLink>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'

// defineProps<{ totalListings: number }>()

const { t } = useI18n()
</script>
