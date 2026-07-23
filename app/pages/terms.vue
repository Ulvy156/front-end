<template>
  <LegalDocument :content="data?.content" :pending="pending" :error="errorMessage" />
</template>

<script lang="ts" setup>
import LegalDocument from '~/components/legal/legal-document.vue'
import { fetchLegalDocument } from '~/features/legal/services/legal.service'

const { t } = useI18n()
const { extract } = useErrorMsg()
const api = useApi()

const { data, pending, error } = await useAsyncData('legal-terms-of-service', () =>
  fetchLegalDocument(api, 'terms-of-service'),
)

const errorMessage = computed(() => (error.value ? extract(error.value) : undefined))

useSeoMeta({
  title: () => `${t('footer.terms')} | RokPteah`,
})
</script>
