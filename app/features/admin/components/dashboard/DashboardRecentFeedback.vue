<script setup lang="ts">
import type { RecentFeedbackItem } from '../../types/dashboard'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

defineProps<{
  items: RecentFeedbackItem[]
  loading?: boolean
}>()

const typeBadge: Record<string, string> = {
  BUG:        'bg-red-50 text-red-600',
  SUGGESTION: 'bg-blue-50 text-blue-600',
  OTHER:      'bg-gray-100 text-gray-500',
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-5">
    <h3 class="text-sm font-semibold text-gray-900 mb-4">
      {{ $t('admin.dashboard.recentFeedback') }}
    </h3>

    <!-- Skeleton: pill badge + 2 text lines -->
    <BaseSkeleton v-if="loading" :rows="5">
      <template #default>
        <div class="flex gap-3 items-center">
          <el-skeleton-item variant="text" style="width: 70px; height: 20px; border-radius: 9999px; flex-shrink: 0;" />
          <div style="flex: 1; display: flex; flex-direction: column; gap: 5px;">
            <el-skeleton-item variant="text" style="width: 100%; height: 14px;" />
            <el-skeleton-item variant="text" style="width: 50%; height: 12px;" />
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
      <li v-for="item in items" :key="item.id" class="flex gap-3">
        <span
          class="text-xs px-2 py-0.5 rounded-full font-medium h-fit mt-0.5 shrink-0"
          :class="typeBadge[item.type]"
        >
          {{ item.type }}
        </span>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-700 line-clamp-1">{{ item.description }}</p>
          <div class="flex items-center justify-between mt-0.5">
            <span class="text-xs text-gray-400">{{ item.user.name }}</span>
            <span class="text-xs text-gray-400">{{ dayjs(item.createdAt).fromNow() }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
