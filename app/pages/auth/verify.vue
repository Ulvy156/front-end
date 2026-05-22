<template>
  <section class="min-h-dvh flex items-center justify-center bg-slate-50 px-6 py-14">
    <OtpVerify
      v-if="email"
      :email="email"
      @back="navigateTo('/auth/login')"
    />
    <div v-else class="text-center text-slate-500 text-sm space-y-4">
      <p>{{ $t('auth.noEmailProvided') }}</p>
      <NuxtLink to="/auth/login" class="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
        {{ $t('auth.backLogin') }}
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import OtpVerify from '~/features/auth/components/OtpVerify.vue'

definePageMeta({ layout: 'auth' })

const route = useRoute()
const email = computed(() => (route.query.email as string | undefined) ?? '')
</script>
