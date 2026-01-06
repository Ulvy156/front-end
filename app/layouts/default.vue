<template>
  <AppNavbar/>

  <main :class="overlay">
    <slot></slot>
  </main>

  <footerApp/>
</template>


<script setup lang="ts">
import AppNavbar from '~/components/navbar/AppNavbar.vue'
import footerApp from '~/components/footer/footer-app.vue'

const route = useRoute()

// if on home page keep navbar as fixed 
// otherwise keep it as stikcy
const overlay = computed(() => {
  if(route.meta.headerOverlay === true) {
    return 'w-full';
  }
  return 'w-[84%] m-auto ';
})

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