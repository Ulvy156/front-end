<template>
  <footer class=" text-gray-300 mt-36">
    <div class="max-w-7xl mx-auto px-6 py-14">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">

        <!-- Brand -->
        <div>
          <div class="flex items-center mb-4 ">
            <NuxtImg src="./rentify-logo.webp" class="size-12"/>
            <span class="text-xl font-semibold text-white">{{ $t('nav.title')}}</span>
          </div>

          <p class="text-sm text-gray-400 max-w-sm leading-relaxed">
            {{ $t('footer.description') }}
          </p>

          <div class="flex gap-3 mt-5">
            <button class="social-btn">
              <Icon name="mdi:facebook" size="18" />
            </button>
            <button class="social-btn">
              <BaseIcon name="send" :size="18"/>
            </button>
            <button class="social-btn">
              <BaseIcon name="mail-check" :size="18"/>
            </button>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-white font-semibold mb-4">
            {{ $t('footer.quickLinks') }}
          </h4>
          <ul class="space-y-3 text-sm">
            <li><NuxtLink to="/about" class="footer-link">{{ $t('footer.about') }}</NuxtLink></li>
            <li><NuxtLink to="/contact" class="footer-link">{{ $t('footer.contact') }}</NuxtLink></li>
            <li><NuxtLink to="/terms" class="footer-link">{{ $t('footer.terms') }}</NuxtLink></li>
            <li><NuxtLink to="/privacy" class="footer-link">{{ $t('footer.privacy') }}</NuxtLink></li>
            <li><NuxtLink to="/help" class="footer-link">{{ $t('footer.help') }}</NuxtLink></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-white font-semibold mb-4">
            {{ $t('footer.contact') }}
          </h4>
          <ul class="space-y-4 text-sm">
            <li class="flex items-center gap-3">
              <BaseIcon name="phone-call" :size="18"/>
              <span>+855 12 345 678</span>
            </li>
            <li class="flex items-center gap-3">
              <BaseIcon name="mail-check" :size="18"/>
              <span>hello@roomkh.com</span>
            </li>
            <li class="flex items-center gap-3">
              <Icon name="mdi:telegram" size="18" />
              <span>@roomkh</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom -->
      <div
        class="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400"
      >
        <p>{{ $t('footer.copyright') }}</p>

        <div class="flex items-center gap-6">
          <p>🇰🇭 {{ $t('footer.madeIn') }}</p>

          <!-- Language Switch -->
          <div class="flex items-center gap-2">
            <Icon name="mdi:earth" size="16" />
            <button
              class="hover:text-white transition cursor-pointer"
              @click="setLocale('en')"
            >
              {{ $t('footer.english') }}
            </button>
            <span class="opacity-40">|</span>
            <button
              class="hover:text-white transition cursor-pointer"
              @click="setLocale('km')"
            >
              {{ $t('footer.khmer') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import BaseIcon from '../ui/BaseIcon.client.vue';

const { setLocale } = useI18n()
</script>

<style scoped>
footer {
    background-color: #111827;
}
</style>
