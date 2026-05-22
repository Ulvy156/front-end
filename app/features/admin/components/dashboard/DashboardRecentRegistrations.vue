<script setup lang="ts">
import type { RecentRegistration } from '../../types/dashboard'
import AdminRoleBadge from '../shared/AdminRoleBadge.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

defineProps<{
  items: RecentRegistration[]
  loading?: boolean
}>()

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-5">
    <h3 class="text-sm font-semibold text-gray-900 mb-4">
      {{ $t('admin.dashboard.recentRegistrations') }}
    </h3>

    <!-- Skeleton -->
    <BaseSkeleton v-if="loading" :rows="5" leading="circle" leading-size="32px" />

    <!-- Empty -->
    <p v-else-if="items.length === 0" class="text-sm text-gray-400 py-4 text-center">
      {{ $t('admin.dashboard.noData') }}
    </p>

    <!-- List -->
    <ul v-else class="space-y-3">
      <li v-for="user in items" :key="user.id" class="flex items-center gap-3">
        <!-- Avatar initials -->
        <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
          {{ initials(user.name) }}
        </div>

        <!-- Name + email -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <p class="text-sm font-medium text-gray-900 truncate">{{ user.name }}</p>
            <span v-if="user.isLocked" class="text-red-400 text-xs">🔒</span>
          </div>
          <p class="text-xs text-gray-400 truncate">{{ user.email }}</p>
        </div>

        <!-- Role + date -->
        <div class="flex flex-col items-end gap-1 shrink-0">
          <AdminRoleBadge :role="user.role" />
          <span class="text-xs text-gray-400">{{ dayjs(user.createdAt).fromNow() }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
