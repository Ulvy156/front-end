<script setup lang="ts">
import dayjs from 'dayjs'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseImage from '~/components/ui/BaseImage.vue'
import BaseDrawer from '~/components/ui/BaseDrawer.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import { initials } from '~/utils/initials'
import { useAdminReportDetail } from '../../composables/useAdminReportDetail'
import type { AdminReportDetail } from '../../types/report'

const props = defineProps<{
  modelValue: boolean
  reportId: number | null
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const reportIdRef = computed(() => props.reportId)
const { data, isPending } = useAdminReportDetail(reportIdRef)

const { t } = useI18n()
const langKey = useLangKey()
const { copy } = useCopy()

const typeBadgeClass: Record<string, string> = {
  'alert-triangle': 'bg-red-50 text-red-600',
  'ban': 'bg-orange-50 text-orange-600',
  'copy': 'bg-blue-50 text-blue-600',
  'info': 'bg-gray-100 text-gray-500',
}

function badgeClass(icon: string) {
  return typeBadgeClass[icon] || 'bg-gray-100 text-gray-500'
}

function locationLabel(property: AdminReportDetail['property']) {
  const d = property.district
  return `${d[langKey.value]}, ${d.province[langKey.value]}`
}

function viewProperty() {
  if (!data.value) return
  isOpen.value = false
  navigateTo({ path: '/admin/properties', query: { propertyId: data.value.property.id } })
}
</script>

<template>
  <BaseDrawer
    v-model="isOpen"
    :title="t('admin.reports.detailsDrawer.title')"
    size="480px"
    direction="rtl"
    :destroy-on-close="true"
  >
    <!-- Loading -->
    <template v-if="isPending">
      <BaseSkeleton :rows="1" leading="circle" leading-size="48px" />
      <div class="mt-6">
        <BaseSkeleton :rows="3" />
      </div>
    </template>

    <template v-else-if="data">
      <!-- Type + date -->
      <div class="flex items-center justify-between mb-4">
        <span
          class="text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1"
          :class="badgeClass(data.reportType.icon)"
        >
          <BaseIcon :name="data.reportType.icon" :size="12" />
          {{ data.reportType[langKey] }}
        </span>
        <span class="text-xs text-gray-400">
          {{ dayjs(data.createdAt).format('MMM D, YYYY h:mm A') }}
        </span>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-700 mb-6 pb-6 border-b border-gray-100">
        {{ data.description }}
      </p>

      <!-- Reporter -->
      <div class="mb-6 pb-6 border-b border-gray-100">
        <p class="text-xs font-medium text-gray-400 uppercase mb-3">
          {{ t('admin.reports.detailsDrawer.reporter') }}
        </p>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0 overflow-hidden">
            <BaseImage v-if="data.user.imgUrl" :src="data.user.imgUrl" fit="cover" class="w-full h-full" :alt="data.user.name" />
            <span v-else>{{ initials(data.user.name) }}</span>
          </div>
          <div class="min-w-0">
            <p class="font-medium text-gray-900 truncate">{{ data.user.name }}</p>
            <p class="text-sm text-gray-400 truncate">{{ data.user.email }}</p>
          </div>
        </div>
      </div>

      <!-- Reported property -->
      <div>
        <p class="text-xs font-medium text-gray-400 uppercase mb-3">
          {{ t('admin.reports.detailsDrawer.reportedProperty') }}
        </p>

        <div class="flex gap-3 mb-3">
          <!-- Thumbnail -->
          <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
            <BaseImage v-if="data.property.images.length" :src="data.property.images[0].imageKey" :alt="data.property.title" />
            <BaseIcon v-else name="building" :size="20" class="text-gray-300" />
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ data.property.title }}</p>
            <p class="text-xs text-gray-400 truncate mt-0.5">{{ locationLabel(data.property) }}</p>
          </div>

          <div class="shrink-0 text-right">
            <p class="text-sm font-semibold text-gray-900">${{ data.property.monthly_price }}<span class="text-xs font-normal text-gray-400">/mo</span></p>
          </div>
        </div>

        <!-- Property ID -->
        <div class="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-gray-50">
          <span class="text-xs text-gray-400 shrink-0">{{ t('admin.reports.detailsDrawer.propertyId') }}</span>
          <span class="text-xs font-mono text-gray-600 truncate flex-1">{{ data.property.id }}</span>
          <BaseIcon
            name="copy"
            :size="14"
            class="text-gray-400 hover:text-gray-600 cursor-pointer shrink-0"
            @click="copy(data.property.id)"
          />
        </div>

        <BaseButton class="w-full!" @click="viewProperty">
          <BaseIcon name="external-link" :size="14" class="mr-1.5" />
          {{ t('admin.reports.detailsDrawer.viewProperty') }}
        </BaseButton>
      </div>
    </template>
  </BaseDrawer>
</template>
