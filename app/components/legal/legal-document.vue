<template>
  <article class="w-[91%] max-w-3xl m-auto py-14">
    <NuxtLink to="/" class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors mb-6">
      <BaseIcon name="arrow-left" :size="16" />
      {{ $t('legal.backHome') }}
    </NuxtLink>

    <BaseSkeleton v-if="pending" :rows="8" :lines="1" />

    <p v-else-if="error" class="text-base text-gray-600">
      {{ error }}
    </p>

    <div v-else class="legal-content" v-html="renderedHtml" />
  </article>
</template>

<script lang="ts" setup>
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'

const props = defineProps<{
  content: string | undefined
  pending: boolean
  error?: string
}>()

const LEGAL_ROUTE_BY_FILENAME: Record<string, string> = {
  'PRIVACY-POLICY.md': '/privacy',
  'TERMS-OF-SERVICE.md': '/terms',
}

const renderedHtml = computed(() => {
  if (!props.content) return ''

  let html = marked.parse(props.content, { async: false }) as string

  for (const [filename, route] of Object.entries(LEGAL_ROUTE_BY_FILENAME)) {
    html = html.replaceAll(`href="./${filename}"`, `href="${route}"`)
  }

  return import.meta.client ? DOMPurify.sanitize(html) : html
})
</script>

<style scoped>
.legal-content :deep(h1) {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 0.5rem;
}

.legal-content :deep(h2) {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.legal-content :deep(h3) {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.legal-content :deep(p) {
  font-size: 1rem;
  line-height: 1.9;
  color: var(--color-gray-700);
  margin-bottom: 1rem;
}

.legal-content :deep(ul),
.legal-content :deep(ol) {
  font-size: 1rem;
  line-height: 1.9;
  color: var(--color-gray-700);
  padding-left: 1.25rem;
  margin-bottom: 1rem;
}

.legal-content :deep(ul) {
  list-style: disc outside;
}

.legal-content :deep(ol) {
  list-style: decimal outside;
}

.legal-content :deep(li) {
  margin-bottom: 0.5rem;
}

.legal-content :deep(li > p) {
  margin-bottom: 0;
}

.legal-content :deep(a) {
  color: var(--color-primary, #16a34a);
  text-decoration: underline;
}

.legal-content :deep(strong) {
  font-weight: 600;
  color: var(--color-gray-900);
}

.legal-content :deep(blockquote) {
  border-left: 3px solid var(--color-gray-300);
  padding-left: 1rem;
  color: var(--color-gray-500);
  font-size: 0.95rem;
  margin: 1.5rem 0;
}

.legal-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-gray-200);
  margin: 2rem 0;
}

.legal-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  display: block;
  overflow-x: auto;
}

.legal-content :deep(th),
.legal-content :deep(td) {
  border: 1px solid var(--color-gray-200);
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.legal-content :deep(th) {
  background-color: var(--color-gray-50);
  font-weight: 600;
}
</style>
