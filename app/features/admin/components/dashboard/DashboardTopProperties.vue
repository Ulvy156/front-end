<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import type { TopProperty } from '../../types/dashboard'

defineProps<{
  items: TopProperty[]
  loading?: boolean
}>()

const config = useRuntimeConfig()

function imageUrl(imageKey: string) {
  return `${config.public.R2_PUB_URL}/${imageKey}`
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-5">
    <h3 class="text-sm font-semibold text-gray-900 mb-4">
      {{ $t('admin.dashboard.topProperties') }}
    </h3>

    <!-- Skeleton: rank number + image + 2 text lines -->
    <BaseSkeleton v-if="loading" :rows="5">
      <template #default>
        <div class="flex items-center gap-3">
          <el-skeleton-item variant="text" style="width: 16px; height: 14px; flex-shrink: 0;" />
          <el-skeleton-item variant="image" style="width: 40px; height: 40px; border-radius: 8px; flex-shrink: 0;" />
          <div style="flex: 1; display: flex; flex-direction: column; gap: 5px;">
            <el-skeleton-item variant="text" style="width: 70%; height: 14px;" />
            <el-skeleton-item variant="text" style="width: 30%; height: 12px;" />
          </div>
        </div>
      </template>
    </BaseSkeleton>

    <!-- Empty -->
    <p v-else-if="items.length === 0" class="text-sm text-gray-400 py-4 text-center">
      {{ $t('admin.dashboard.noData') }}
    </p>

    <!-- List -->
    <ul v-else class="space-y-3">
      <li v-for="(prop, i) in items" :key="prop.id" class="flex items-center gap-3">
        <!-- Rank -->
        <span class="text-xs font-bold text-gray-300 w-4 text-center shrink-0">{{ i + 1 }}</span>

        <!-- Thumbnail -->
        <div class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
          <img
            v-if="prop.images.length"
            :src="imageUrl(prop.images[0].imageKey)"
            :alt="prop.title"
            class="w-full h-full object-cover"
          />
          <BaseIcon v-else name="building" :size="18" class="text-gray-300" />
        </div>

        <!-- Title + availability -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{{ prop.title }}</p>
          <span
            class="text-xs"
            :class="prop.isAvailable ? 'text-emerald-600' : 'text-gray-400'"
          >
            {{ prop.isAvailable ? $t('admin.dashboard.available') : $t('admin.dashboard.unavailable') }}
          </span>
        </div>

        <!-- Views + favourites -->
        <div class="flex flex-col items-end gap-1 shrink-0 text-xs text-gray-500">
          <span class="flex items-center gap-1">
            <BaseIcon name="eye" :size="12" />
            {{ prop.totalViews.toLocaleString() }}
          </span>
          <span class="flex items-center gap-1">
            <BaseIcon name="heart" :size="12" />
            {{ prop.favouriteCount }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>
