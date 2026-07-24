<template>
  <!-- Error state -->
  <div v-if="error" class="flex flex-col items-center justify-center py-20 gap-3">
    <p class="text-sm text-gray-500">{{ extract(error) }}</p>
    <el-button @click="refresh">{{ $t('landlord.dashboard.retry') }}</el-button>
  </div>

  <!-- Loading skeleton for header -->
  <template v-else-if="pending && !landlord">
    <div class="animate-pulse space-y-6">
      <div class="rounded-(--radius) border border-(--border-gray) p-6 bg-(--card)">
        <div class="flex items-start gap-x-5">
          <div class="w-20 h-20 rounded-full bg-gray-200" />
          <div class="flex-1 space-y-3">
            <div class="h-6 bg-gray-200 rounded w-48" />
            <div class="h-4 bg-gray-200 rounded w-36" />
            <div class="h-4 bg-gray-200 rounded w-64" />
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <SkeletonProperty :number-of-items="6" :is-hide="false" />
      </div>
    </div>
  </template>

  <!-- Content -->
  <template v-else-if="landlord">
    <div class="space-y-8">
      <LandlordProfileHeader :landlord="landlord" />

      <LandlordProfileProperties
        :items="properties"
        :meta="meta"
        :page="page"
        :page-size="pageSize"
        :pending="pending"
        @update:page="page = $event"
      />
    </div>
  </template>
</template>

<script lang="ts" setup>
import { useLandlordProfile } from '../composables/useLandlordProfile'
import LandlordProfileHeader from './landlord-profile-header.vue'
import LandlordProfileProperties from './landlord-profile-properties.vue'
import SkeletonProperty from '~/components/animation/skeleton-property.vue'

const route = useRoute()
const { t } = useI18n()
const { extract } = useErrorMsg()

const id = route.params.id as string

const {
  landlord,
  properties,
  meta,
  page,
  pageSize,
  pending,
  error,
  refresh,
} = useLandlordProfile(id)

const SEO = useSEO()

watchEffect(() => {
  if (landlord.value) {
    SEO.setSEO({
      title: t('landlord.publicProfile.seoTitle', { name: landlord.value.name }),
      description: t('landlord.publicProfile.seoDescription', {
        name: landlord.value.name,
        count: landlord.value.totalPublishedProperties,
      }),
    })
  }
})
</script>
