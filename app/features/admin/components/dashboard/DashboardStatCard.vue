<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'

interface SubStat {
  label: string
  value: string | number
  color?: 'red' | 'amber' | 'green' | 'blue' | 'gray'
}

defineProps<{
  icon: string
  iconBg: string
  title: string
  total: number
  subStats: SubStat[]
  loading?: boolean
}>()

const colorClass: Record<string, string> = {
  red:   'text-red-500',
  amber: 'text-amber-500',
  green: 'text-emerald-600',
  blue:  'text-blue-500',
  gray:  'text-gray-400',
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-5">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ title }}</span>
      <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="iconBg">
        <BaseIcon :name="icon" :size="16" />
      </div>
    </div>

    <!-- Main number -->
    <BaseSkeleton v-if="loading" :rows="1" class="mb-3">
      <template #default>
        <el-skeleton-item variant="h1" style="width: 60px; height: 36px;" />
      </template>
    </BaseSkeleton>
    <p v-else class="text-3xl font-bold text-gray-900 mb-3">
      {{ total.toLocaleString() }}
    </p>

    <!-- Sub-stats -->
    <div class="space-y-1.5 border-t border-gray-100 pt-3">
      <BaseSkeleton v-if="loading" :rows="subStats.length || 2" :lines="1" />
      <div v-for="stat in subStats" v-else :key="stat.label" class="flex items-center justify-between">
        <span class="text-xs text-gray-400">{{ stat.label }}</span>
        <span class="text-xs font-semibold" :class="colorClass[stat.color ?? 'gray']">
          {{ stat.value }}
        </span>
      </div>
    </div>
  </div>
</template>
