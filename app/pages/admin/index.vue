<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import DashboardStatCard from '~/components/dashboard/DashboardStatCard.vue'
import DashboardRecentRegistrations from '~/features/admin/components/dashboard/DashboardRecentRegistrations.vue'
import DashboardRecentFeedback from '~/features/admin/components/dashboard/DashboardRecentFeedback.vue'
import DashboardLatestListings from '~/features/admin/components/dashboard/DashboardLatestListings.vue'
import DashboardTopProperties from '~/features/admin/components/dashboard/DashboardTopProperties.vue'
import { useAdminDashboard } from '~/features/admin/composables/useAdminDashboard'

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const { t } = useI18n()
const { extract } = useErrorMsg()
const { data, pending, error, refresh } = useAdminDashboard()

const userSubStats = computed(() => {
  const s = data.value?.stats.users
  if (!s) return []
  return [
    { label: t('admin.dashboard.stats.locked'),       value: s.locked,              color: 'red'   as const },
    { label: t('admin.dashboard.stats.unverified'),   value: s.unverified,          color: 'amber' as const },
    { label: t('admin.dashboard.stats.newThisMonth'), value: `+${s.newThisMonth}`,  color: 'green' as const },
  ]
})

const landlordSubStats = computed(() => {
  const s = data.value?.stats.landlords
  if (!s) return []
  return [
    { label: t('admin.dashboard.stats.newThisMonth'), value: `+${s.newThisMonth}`, color: 'green' as const },
  ]
})

const propertySubStats = computed(() => {
  const s = data.value?.stats.properties
  if (!s) return []
  return [
    { label: t('admin.dashboard.stats.published'),   value: s.published,                  color: 'green' as const },
    { label: t('admin.dashboard.stats.unpublished'), value: s.unpublished,                color: 'gray'  as const },
    { label: t('admin.dashboard.stats.unavailable'), value: s.unavailable,                color: 'amber' as const },
    { label: t('admin.dashboard.stats.featured'),    value: `${s.featured}/${s.featuredMax}`, color: 'blue' as const },
  ]
})

const feedbackSubStats = computed(() => {
  const s = data.value?.stats.feedback
  if (!s) return []
  return [
    { label: t('admin.dashboard.stats.bug'),        value: s.byType.BUG,        color: 'red'  as const },
    { label: t('admin.dashboard.stats.suggestion'), value: s.byType.SUGGESTION, color: 'blue' as const },
    { label: t('admin.dashboard.stats.other'),      value: s.byType.OTHER,      color: 'gray' as const },
  ]
})

const engagementSubStats = computed(() => {
  const s = data.value?.stats.engagement
  if (!s) return []
  return [
    { label: t('admin.dashboard.stats.favourites'), value: s.totalFavourites, color: 'red'   as const },
    { label: t('admin.dashboard.stats.reports'),    value: s.totalReports,    color: 'amber' as const },
  ]
})
</script>

<template>
  <!-- Error state -->
  <div v-if="error" class="flex flex-col items-center justify-center py-20 gap-3">
    <p class="text-sm text-gray-500">{{ extract(error) }}</p>
    <BaseButton @click="refresh">{{ $t('admin.dashboard.retry') }}</BaseButton>
  </div>

  <template v-else>
    <!-- Row 1: Stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <DashboardStatCard
        icon="users"
        icon-bg="bg-blue-50 text-blue-600"
        :title="t('admin.dashboard.stats.users')"
        :total="data?.stats.users.total ?? 0"
        :sub-stats="userSubStats"
        :loading="pending"
      />
      <DashboardStatCard
        icon="user-check"
        icon-bg="bg-emerald-50 text-emerald-700"
        :title="t('admin.dashboard.stats.landlords')"
        :total="data?.stats.landlords.total ?? 0"
        :sub-stats="landlordSubStats"
        :loading="pending"
      />
      <DashboardStatCard
        icon="building"
        icon-bg="bg-amber-50 text-amber-600"
        :title="t('admin.dashboard.stats.properties')"
        :total="data?.stats.properties.total ?? 0"
        :sub-stats="propertySubStats"
        :loading="pending"
      />
      <DashboardStatCard
        icon="message-square"
        icon-bg="bg-red-50 text-red-500"
        :title="t('admin.dashboard.stats.feedback')"
        :total="data?.stats.feedback.total ?? 0"
        :sub-stats="feedbackSubStats"
        :loading="pending"
      />
      <DashboardStatCard
        icon="bar-chart-3"
        icon-bg="bg-violet-50 text-violet-600"
        :title="t('admin.dashboard.stats.engagement')"
        :total="data?.stats.engagement.totalViews ?? 0"
        :sub-stats="engagementSubStats"
        :loading="pending"
      />
    </div>

    <!-- Row 2: Recent Registrations + Recent Feedback -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <DashboardRecentRegistrations
        :items="data?.recentRegistrations ?? []"
        :loading="pending"
      />
      <DashboardRecentFeedback
        :items="data?.recentFeedback ?? []"
        :loading="pending"
      />
    </div>

    <!-- Row 3: Latest Listings + Top by Views -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <DashboardLatestListings
        :items="data?.latestProperties ?? []"
        :loading="pending"
      />
      <DashboardTopProperties
        :items="data?.topProperties ?? []"
        :loading="pending"
      />
    </div>
  </template>
</template>
