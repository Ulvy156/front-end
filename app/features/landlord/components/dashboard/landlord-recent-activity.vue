<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseImage from '~/components/ui/BaseImage.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import { initials } from '~/utils/initials'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import type { LandlordRecentActivity } from '../../types/dashboard'

dayjs.extend(relativeTime)

defineProps<{
  items: LandlordRecentActivity[]
  loading?: boolean
}>()
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-5">
    <h3 class="text-sm font-semibold text-gray-900 mb-4">
      {{ $t('landlord.dashboard.recentActivity') }}
    </h3>

    <!-- Skeleton -->
    <BaseSkeleton v-if="loading" :rows="5" leading="circle" leading-size="32px" />

    <!-- Empty -->
    <p v-else-if="items.length === 0" class="text-sm text-gray-400 py-4 text-center">
      {{ $t('landlord.dashboard.noData') }}
    </p>

    <!-- List -->
    <ul v-else class="space-y-3">
      <li v-for="activity in items" :key="activity.id" class="flex items-center gap-3">
        <!-- User avatar -->
        <div class="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
          <BaseImage
            v-if="activity.user.imgUrl"
            :src="activity.user.imgUrl"
            :alt="activity.user.name"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-xs font-bold text-gray-500">
            {{ initials(activity.user.name) }}
          </span>
        </div>

        <!-- Activity text -->
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-900 truncate">
            <span class="font-medium">{{ activity.user.name }}</span>
            <span class="text-gray-500"> {{ $t('landlord.dashboard.favourited') }} </span>
            <span class="font-medium">{{ activity.property.title }}</span>
          </p>
          <span class="text-xs text-gray-400">{{ dayjs(activity.createdAt).fromNow() }}</span>
        </div>

        <!-- Property thumbnail -->
        <div class="w-8 h-8 rounded-md overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
          <BaseImage
            v-if="activity.property.images.length"
            :src="activity.property.images[0].imageKey"
            :alt="activity.property.title"
            class="w-full h-full object-cover"
          />
          <BaseIcon v-else name="building" :size="14" class="text-gray-300" />
        </div>
      </li>
    </ul>
  </div>
</template>
