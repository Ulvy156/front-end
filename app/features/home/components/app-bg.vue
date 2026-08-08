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

      <!-- Search bar -->
      <div class="search-bar">
        <div class="search-segment flex-[1.4]">
          <div class="text-[11px] font-bold text-(--nav-active-item) uppercase tracking-[0.06em]">
            {{ t('home.hero.search.location') }}
          </div>
          <div class="text-[15px] font-semibold text-gray-900 mt-0.5">
            {{ t('home.hero.search.location_placeholder') }}
          </div>
        </div>
        <div class="search-divider"></div>
        <div class="search-segment flex-1">
          <div class="text-[11px] font-bold text-(--nav-active-item) uppercase tracking-[0.06em]">
            {{ t('home.hero.search.type') }}
          </div>
          <div class="text-[15px] font-semibold text-gray-900 mt-0.5">
            {{ t('home.hero.search.type_placeholder') }}
          </div>
        </div>
        <div class="search-divider"></div>
        <div class="search-segment flex-1">
          <div class="text-[11px] font-bold text-(--nav-active-item) uppercase tracking-[0.06em]">
            {{ t('home.hero.search.budget') }}
          </div>
          <div class="text-[15px] font-semibold text-gray-900 mt-0.5">
            {{ t('home.hero.search.budget_placeholder') }}
          </div>
        </div>
        <NuxtLink
          to="/properties"
          :aria-label="t('home.hero.search.button')"
          class="w-full h-12 mt-2 md:mt-0 md:w-13 md:h-13 rounded-xl bg-transparent md:bg-(--nav-active-item) text-(--nav-active-item) md:text-white border md:border-0 border-(--nav-active-item) flex items-center justify-center shrink-0 gap-2"
        >
          <BaseIconClient name="search" :size="22" />
          <span class="text-[15px] font-semibold md:hidden">{{ t('home.hero.search.button') }}</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'

// defineProps<{ totalListings: number }>()

const { t } = useI18n()
</script>

<style scoped>
.search-bar {
  margin-top: 32px;
  background: #fff;
  border-radius: 14px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 780px;
  width: 100%;
  box-shadow: 0 18px 44px -16px rgba(2, 6, 23, 0.4);
}

.search-segment {
  padding: 8px 16px;
}

.search-divider {
  width: 1px;
  height: 38px;
  background: #e2e8f0;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 8px;
  }
  .search-divider {
    width: 100%;
    height: 1px;
  }
  .search-segment {
    padding: 10px 14px;
  }
}
</style>
