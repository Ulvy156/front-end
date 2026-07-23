<template>
  <LegalDocument :content="data?.content" :pending="pending" :error="errorMessage" />
</template>

<script lang="ts" setup>
import LegalDocument from '~/components/legal/legal-document.vue'
import { fetchLegalDocument } from '~/features/legal/services/legal.service'

const { t } = useI18n()
const { extract } = useErrorMsg()
const api = useApi()

const { data, pending, error } = await useAsyncData('legal-privacy-policy', () =>
  fetchLegalDocument(api, 'privacy-policy'),
)

const errorMessage = computed(() => (error.value ? extract(error.value) : undefined))

useSeoMeta({
  title: () => `${t('footer.privacy')} | RokPteah`,
})
</script>
