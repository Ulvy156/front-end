<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import { useAdminFeedback } from '../../composables/useAdminFeedback'
import type { FeedbackItem, FeedbackType } from '../../types/feedback'

dayjs.extend(relativeTime)

const { t } = useI18n()
const { data, isPending } = useAdminFeedback()

const typeFilter = ref<'all' | FeedbackType>('all')
const searchQuery = ref('')

const filteredItems = computed<FeedbackItem[]>(() => {
  if (!data.value) return []
  let list = data.value
  if (typeFilter.value !== 'all') list = list.filter(f => f.type === typeFilter.value)
  const q = searchQuery.value.trim().toLowerCase()
  if (q) list = list.filter(f =>
    f.description.toLowerCase().includes(q) || f.user.name.toLowerCase().includes(q) || f.user.email.toLowerCase().includes(q),
  )
  return list
})

const typeCounts = computed(() => {
  if (!data.value) return { BUG: 0, SUGGESTION: 0, OTHER: 0 }
  return {
    BUG: data.value.filter(f => f.type === 'BUG').length,
    SUGGESTION: data.value.filter(f => f.type === 'SUGGESTION').length,
    OTHER: data.value.filter(f => f.type === 'OTHER').length,
  }
})

const typeBadge: Record<string, { class: string; icon: string }> = {
  BUG:        { class: 'bg-red-50 text-red-600', icon: 'bug' },
  SUGGESTION: { class: 'bg-blue-50 text-blue-600', icon: 'lightbulb' },
  OTHER:      { class: 'bg-gray-100 text-gray-500', icon: 'message-circle' },
}

const expandedId = ref<string | null>(null)

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<template>
  <div>
    <!-- Subtitle -->
    <p class="text-sm text-gray-400 mb-4">
      {{ $t('admin.feedback.totalCount', { n: data?.length ?? 0 }) }}
    </p>

    <!-- Type stat cards -->
    <div class="grid grid-cols-3 gap-3 mb-4">
      <button
        v-for="type in (['BUG', 'SUGGESTION', 'OTHER'] as FeedbackType[])"
        :key="type"
        class="flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer"
        :class="typeFilter === type ? 'border-gray-400 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'"
        @click="typeFilter = typeFilter === type ? 'all' : type"
      >
        <div class="w-9 h-9 rounded-lg flex items-center justify-center" :class="typeBadge[type].class">
          <BaseIcon :name="typeBadge[type].icon" :size="16" />
        </div>
        <div class="text-left">
          <p class="text-lg font-semibold text-gray-900">{{ typeCounts[type] }}</p>
          <p class="text-xs text-gray-400">{{ $t(`admin.feedback.types.${type}`) }}</p>
        </div>
      </button>
    </div>

    <!-- Search -->
    <div class="mb-4">
      <el-input v-model="searchQuery" :placeholder="$t('admin.feedback.searchPlaceholder')" clearable class="max-w-72">
        <template #prefix>
          <BaseIcon name="search" :size="14" class="text-gray-400" />
        </template>
      </el-input>
    </div>

    <!-- Skeleton -->
    <div v-if="isPending" class="bg-white rounded-xl border border-gray-200 p-5">
      <BaseSkeleton :rows="6" :lines="2" />
    </div>

    <!-- Empty -->
    <div v-else-if="filteredItems.length === 0" class="bg-white rounded-xl border border-gray-200 p-10 text-center">
      <BaseIcon name="inbox" :size="32" class="text-gray-300 mx-auto mb-2" />
      <p class="text-sm text-gray-400">{{ $t('admin.feedback.empty') }}</p>
    </div>

    <!-- Feedback list -->
    <div v-else class="space-y-3">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors cursor-pointer"
        @click="toggleExpand(item.id)"
      >
        <div class="flex items-start gap-3">
          <!-- Type badge -->
          <span
            class="text-xs px-2 py-1 rounded-full font-medium shrink-0 flex items-center gap-1"
            :class="typeBadge[item.type].class"
          >
            <BaseIcon :name="typeBadge[item.type].icon" :size="12" />
            {{ $t(`admin.feedback.types.${item.type}`) }}
          </span>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p
              class="text-sm text-gray-700"
              :class="expandedId === item.id ? '' : 'line-clamp-2'"
            >
              {{ item.description }}
            </p>
            <div class="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <span class="flex items-center gap-1">
                <BaseIcon name="user" :size="12" />
                {{ item.user.name }}
              </span>
              <span>{{ item.user.email }}</span>
              <span class="ml-auto">{{ dayjs(item.createdAt).fromNow() }}</span>
            </div>
          </div>

          <!-- Expand icon -->
          <BaseIcon
            :name="expandedId === item.id ? 'chevron-up' : 'chevron-down'"
            :size="14"
            class="text-gray-400 shrink-0 mt-1"
          />
        </div>
      </div>
    </div>
  </div>
</template>
