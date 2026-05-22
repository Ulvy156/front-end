<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.client.vue'

const props = defineProps<{
  to: string
  icon: string
  label: string
  badge?: number
  exact?: boolean
}>()

const route = useRoute()

const isActive = computed(() => {
  if (props.exact) return route.path === props.to
  return route.path === props.to || route.path.startsWith(props.to + '/')
})
</script>

<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
    :class="isActive
      ? 'bg-[var(--nav-active)] text-[var(--nav-active-item)] font-medium'
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
  >
    <BaseIcon :name="icon" :size="16" class="shrink-0" />
    <span class="flex-1 truncate">{{ label }}</span>
    <span
      v-if="badge"
      class="text-xs rounded-full px-2 py-0.5 font-medium bg-emerald-100 text-[var(--nav-active-item)]"
    >{{ badge }}</span>
  </NuxtLink>
</template>
