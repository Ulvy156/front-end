<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import type { LatestProperty } from '../../types/dashboard'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

defineProps<{
  items: LatestProperty[]
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
      {{ $t('admin.dashboard.latestListings') }}
    </h3>

    <!-- Skeleton -->
    <BaseSkeleton v-if="loading" :rows="5" leading="square" />

    <!-- Empty -->
    <p v-else-if="items.length === 0" class="text-sm text-gray-400 py-4 text-center">
      {{ $t('admin.dashboard.noData') }}
    </p>

    <!-- List -->
    <ul v-else class="space-y-3">
      <li v-for="prop in items" :key="prop.id" class="flex items-center gap-3">
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

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{{ prop.title }}</p>
          <p class="text-xs text-gray-400 truncate">
            {{ $t('admin.dashboard.postedBy', { name: prop.user.name }) }}
          </p>
        </div>

        <!-- Status badges + date -->
        <div class="flex flex-col items-end gap-1 shrink-0">
          <div class="flex gap-1">
            <span
              v-if="prop.isFeatured"
              class="text-xs px-1.5 py-0.5 rounded-full font-medium bg-amber-50 text-amber-600"
            >
              {{ $t('admin.dashboard.featured') }}
            </span>
            <span
              class="text-xs px-1.5 py-0.5 rounded-full font-medium"
              :class="prop.isPublished
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-gray-100 text-gray-500'"
            >
              {{ prop.isPublished ? $t('admin.dashboard.published') : $t('admin.dashboard.unpublished') }}
            </span>
          </div>
          <span class="text-xs text-gray-400">{{ dayjs(prop.createdAt).fromNow() }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
