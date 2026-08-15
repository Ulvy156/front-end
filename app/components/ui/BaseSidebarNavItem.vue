<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseTooltip from '~/components/ui/BaseTooltip.vue'

const props = defineProps<{
  to: string
  icon: string
  label: string
  badge?: number
  exact?: boolean
  collapsed?: boolean
}>()

const route = useRoute()

const isActive = computed(() => {
  if (props.exact) return route.path === props.to
  return route.path === props.to || route.path.startsWith(props.to + '/')
})
</script>

<template>
  <BaseTooltip :content="label" placement="right" :disabled="!collapsed">
    <NuxtLink
      :to="to"
      class="relative flex items-center px-3 py-2 rounded-lg text-sm overflow-hidden transition-colors duration-200"
      :class="[
        isActive
          ? 'bg-[var(--nav-active)] text-[var(--nav-active-item)] font-medium'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
        collapsed ? 'justify-center' : 'gap-3'
      ]"
    >
      <BaseIcon :name="icon" :size="16" class="shrink-0" />
      <span
        class="whitespace-nowrap overflow-hidden transition-all duration-200 ease-in-out"
        :class="collapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100 flex-1'"
      >{{ label }}</span>
      <span
        v-if="badge"
        class="shrink-0 whitespace-nowrap overflow-hidden rounded-full font-medium bg-emerald-100 text-[var(--nav-active-item)] transition-all duration-200 ease-in-out"
        :class="collapsed ? 'max-w-0 opacity-0' : 'max-w-10 opacity-100 text-xs px-2 py-0.5'"
      >{{ badge }}</span>
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <span
          v-if="collapsed && badge"
          class="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-emerald-500"
        />
      </Transition>
    </NuxtLink>
  </BaseTooltip>
</template>
