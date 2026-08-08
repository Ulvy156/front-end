<template>
  <footer class="bg-gray-900 text-gray-300 mt-36 pb-(--bottom-nav-clearance) lg:pb-0">
    <div class="max-w-7xl mx-auto px-6 py-14">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10">

        <!-- Brand -->
        <div>
          <div class="flex items-center mb-4 ">
            <NuxtImg src="/rokpteah-logo.webp" class="size-12" alt="RokPteah" width="48" height="48" />
            <span class="text-xl font-semibold text-white">{{ $t('nav.title')}}</span>
          </div>

          <p class="text-sm text-gray-400 max-w-sm leading-relaxed">
            {{ $t('footer.description') }}
          </p>

          <div class="flex gap-3 mt-5">
            <button class="social-btn" :aria-label="$t('footer.social.facebook')">
              <Icon name="mdi:facebook" :size="18" />
            </button>
            <button class="social-btn" :aria-label="$t('footer.social.telegram')">
              <Icon name="mdi:telegram" :size="18" />
            </button>
            <button class="social-btn" :aria-label="$t('footer.social.email')">
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
            <template v-for="link in quickLinks" :key="link.to">
              <li v-if="link.can" v-can="link.can">
                <NuxtLink :to="link.to" class="footer-link">{{ link.label }}</NuxtLink>
              </li>
              <li v-else>
                <NuxtLink :to="link.to" class="footer-link">{{ link.label }}</NuxtLink>
              </li>
            </template>
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
              <span>rentifykh@gmail.com</span>
            </li>
            <li class="flex items-center gap-3">
              <Icon name="mdi:telegram" :size="18" />
              <span>@rentifykh</span>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h4 class="text-white font-semibold mb-4">
            {{ $t('footer.legal') }}
          </h4>
          <ul class="space-y-3 text-sm">
            <li>
              <NuxtLink to="/terms" class="footer-link">{{ $t('footer.terms') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/privacy" class="footer-link">{{ $t('footer.privacy') }}</NuxtLink>
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
            <BaseIcon name="globe" :size="16" />
            <button class="hover:text-white transition cursor-pointer" @click="setLocale('en')">
              {{ $t('footer.english') }}
            </button>
            <span class="opacity-40">|</span>
            <button class="hover:text-white transition cursor-pointer" @click="setLocale('km')">
              {{ $t('footer.khmer') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import BaseIcon from '../ui/BaseIcon.client.vue'

const { t, setLocale } = useI18n()

const quickLinks = computed(() => [
  { to: '/', label: t('nav.home') },
  { to: '/properties', label: t('nav.browseRoom') },
  { to: '/landlord/post-property', label: t('nav.postRoom'), can: 'landlord' },
  { to: '/user/favourites', label: t('nav.favourites') },
])
</script>

<style scoped>
.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  background-color: rgb(255 255 255 / 0.1);
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.social-btn:hover {
  background-color: rgb(255 255 255 / 0.2);
}

.footer-link {
  color: inherit;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: white;
}
</style>
