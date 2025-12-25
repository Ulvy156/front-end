<template>
  <header :class="fontClass">
    <AppNavbar/>
  </header>

  <main :class="fontClass">
    <slot></slot>
  </main>

  <footer :class="fontClass">
    
  </footer>
</template>


<script setup lang="ts">
import AppNavbar from '~/components/navbar/AppNavbar.vue'

const { locale, setLocale } = useI18n()
useHead(() => ({
  htmlAttrs: {
    lang: locale.value,
  },
}))

const fontClass = computed(() =>
  locale.value === 'km' ? 'font-km' : 'font-en'
)

onMounted(() => {
  const saved = localStorage.getItem('lang')
  if (saved === 'en' || saved === 'km') {
    setLocale(saved)   
  }

})
</script>