<template>
  <article class="w-[91%] max-w-5xl m-auto py-10 lg:py-14">
    <NuxtLink to="/" class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors mb-6">
      <BaseIcon name="arrow-left" :size="16" />
      {{ $t('legal.backHome') }}
    </NuxtLink>

    <div class="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
      <nav v-if="toc.length" class="hidden lg:block" aria-label="Table of contents">
        <div class="sticky top-20">
          <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">{{ $t('legal.onThisPage') }}</p>
          <ul class="space-y-1 border-l border-gray-200">
            <li v-for="item in toc" :key="item.id">
              <a
                :href="`#${item.id}`"
                class="-ml-px block border-l-2 py-1 pl-3 text-sm transition-colors"
                :class="activeId === item.id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-900'"
              >
                {{ item.text }}
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div ref="contentEl" class="legal-content min-w-0">
        <slot />
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
import BaseIcon from '~/components/ui/BaseIcon.client.vue'

const contentEl = ref<HTMLElement | null>(null)
const toc = ref<{ id: string; text: string }[]>([])
const activeId = ref('')

onMounted(() => {
  if (!contentEl.value) return

  const headings = Array.from(contentEl.value.querySelectorAll<HTMLElement>('h2[id]'))
  toc.value = headings.map((heading) => ({ id: heading.id, text: heading.textContent ?? '' }))

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting)
      if (visible) activeId.value = visible.target.id
    },
    { rootMargin: '-96px 0px -70% 0px' },
  )

  headings.forEach((heading) => observer.observe(heading))
  onBeforeUnmount(() => observer.disconnect())
})
</script>

<style scoped>
.legal-content :deep(h1) {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 0.5rem;
}

.legal-content :deep(.badge) {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  border-radius: 9999px;
  background-color: var(--color-gray-100);
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-gray-600);
}

.legal-content :deep(.intro) {
  max-width: 42rem;
  font-size: 1rem;
  line-height: 1.9;
  color: var(--color-gray-700);
  margin-top: 1rem;
  margin-bottom: 2.5rem;
}

.legal-content :deep(h2) {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-gray-900);
  scroll-margin-top: 5rem;
  margin-top: 2.5rem;
  margin-bottom: 0.75rem;
}

.legal-content :deep(h2:first-of-type) {
  margin-top: 0;
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

.legal-content :deep(a) {
  color: var(--color-primary, #16a34a);
  text-decoration: underline;
}

.legal-content :deep(strong) {
  font-weight: 600;
  color: var(--color-gray-900);
}

.legal-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  display: block;
  overflow-x: auto;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
}

.legal-content :deep(th),
.legal-content :deep(td) {
  border-bottom: 1px solid var(--color-gray-200);
  padding: 0.6rem 0.9rem;
  text-align: left;
  vertical-align: top;
}

.legal-content :deep(th) {
  background-color: var(--color-gray-50);
  font-weight: 600;
  color: var(--color-gray-900);
}
</style>
