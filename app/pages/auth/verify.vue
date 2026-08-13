<template>
  <AuthShell :title="t('auth.brandTitle')" :description="t('auth.brandDesc')" :features="brandFeatures">
    <OtpVerify
      v-if="email"
      :email="email"
      :auto-send-otp="true"
      @back="navigateTo('/auth/login')"
    />
    <div v-else class="text-center text-slate-500 text-sm space-y-4">
      <p>{{ t('auth.noEmailProvided') }}</p>
      <NuxtLink to="/auth/login" class="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
        {{ t('auth.backLogin') }}
      </NuxtLink>
    </div>
  </AuthShell>
</template>

<script setup lang="ts">
import AuthShell from '~/components/auth/AuthShell.vue'
import OtpVerify from '~/features/auth/components/OtpVerify.vue'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const route = useRoute()
const email = computed(() => (route.query.email as string | undefined) ?? '')

const brandFeatures = computed(() => [
  { icon: 'map-pin', text: t('auth.brandFeature1') },
  { icon: 'message-circle', text: t('auth.brandFeature2') },
  { icon: 'heart', text: t('auth.brandFeature3') },
])
</script>
