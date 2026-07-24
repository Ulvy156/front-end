<script setup lang="ts">
import DashboardStatCard from '~/components/dashboard/DashboardStatCard.vue'
import LandlordRecentActivity from '~/features/landlord/components/dashboard/landlord-recent-activity.vue'
import LandlordTopProperties from '~/features/landlord/components/dashboard/landlord-top-properties.vue'
import { useLandlordDashboard } from '~/features/landlord/composables/useLandlordDashboard'

definePageMeta({ middleware: 'landlord', layout: 'landlord' })

const { t } = useI18n()
const { extract } = useErrorMsg()
const { data, pending, error, refresh } = useLandlordDashboard()

const propertySubStats = computed(() => {
  const s = data.value?.stats
  if (!s) return []
  return [
    { label: t('landlord.dashboard.stats.published'),   value: s.published,   color: 'green' as const },
    { label: t('landlord.dashboard.stats.unpublished'), value: s.unpublished, color: 'gray'  as const },
    { label: t('landlord.dashboard.stats.available'),   value: s.available,   color: 'blue'  as const },
    { label: t('landlord.dashboard.stats.unavailable'), value: s.unavailable, color: 'amber' as const },
  ]
})

const postingLimitSubStats = computed(() => {
  const s = data.value?.stats
  if (!s) return []
  return [
    { label: t('landlord.dashboard.stats.postedThisMonth'), value: s.propertiesThisMonth, color: 'blue'  as const },
    { label: t('landlord.dashboard.stats.remaining'),       value: s.propertiesRemaining,  color: s.propertiesRemaining === 0 ? 'red' as const : 'green' as const },
  ]
})

const viewSubStats = computed(() => [] as { label: string; value: string | number; color: 'gray' }[])

const favouriteSubStats = computed(() => [] as { label: string; value: string | number; color: 'gray' }[])
</script>

<template>
  <!-- Error state -->
  <div v-if="error" class="flex flex-col items-center justify-center py-20 gap-3">
    <p class="text-sm text-gray-500">{{ extract(error) }}</p>
    <el-button @click="refresh">{{ $t('landlord.dashboard.retry') }}</el-button>
  </div>

  <template v-else>
    <!-- Row 1: Stat cards -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <DashboardStatCard
        icon="building"
        icon-bg="bg-blue-50 text-blue-600"
        :title="t('landlord.dashboard.stats.properties')"
        :total="data?.stats.totalProperties ?? 0"
        :sub-stats="propertySubStats"
        :loading="pending"
      />
      <DashboardStatCard
        icon="calendar-plus"
        icon-bg="bg-violet-50 text-violet-600"
        :title="t('landlord.dashboard.stats.monthlyLimit')"
        :total="data?.stats.monthlyLimit ?? 0"
        :sub-stats="postingLimitSubStats"
        :loading="pending"
      />
      <DashboardStatCard
        icon="eye"
        icon-bg="bg-amber-50 text-amber-600"
        :title="t('landlord.dashboard.stats.views')"
        :total="data?.stats.totalViews ?? 0"
        :sub-stats="viewSubStats"
        :loading="pending"
      />
      <DashboardStatCard
        icon="heart"
        icon-bg="bg-red-50 text-red-500"
        :title="t('landlord.dashboard.stats.favourites')"
        :total="data?.stats.totalFavourites ?? 0"
        :sub-stats="favouriteSubStats"
        :loading="pending"
      />
    </div>

    <!-- Row 2: Recent Activity + Top Properties -->
    <div class="grid grid-cols-2 gap-4">
      <LandlordRecentActivity
        :items="data?.recentActivity ?? []"
        :loading="pending"
      />
      <LandlordTopProperties
        :items="data?.topProperties ?? []"
        :loading="pending"
      />
    </div>
  </template>
</template>
