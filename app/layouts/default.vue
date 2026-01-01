<template>
  <header>
    <AppNavbar/>
  </header>

  <main>
    <slot></slot>
  </main>

  <footerApp/>
</template>


<script setup lang="ts">
import AppNavbar from '~/components/navbar/AppNavbar.vue'
import footerApp from '~/components/footer/footer-app.vue'

const { locale, setLocale } = useI18n()
useHead(() => ({
  htmlAttrs: {
    lang: locale.value,
  },
}))

onMounted(() => {
  const saved = localStorage.getItem('lang')
  if (saved === 'en' || saved === 'km') {
    setLocale(saved)   
  }

})
</script>