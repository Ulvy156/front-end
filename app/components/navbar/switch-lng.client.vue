<template>
  <div class="flex items-center gap-2 py-2 px-2">
    <button
      class="flex items-center gap-2 rounded-full text-sm transition cursor-pointer"
      @click="toggleLng"
    >
      <span>{{ locale === 'en' ? '🇬🇧 EN' : '🇰🇭 KM' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()

type Lang = 'en' | 'km'

function toggleLng() {
  const next: Lang = locale.value === 'en' ? 'km' : 'en'
  localStorage.setItem('lang', next);
  setLocale(next)
}
</script>