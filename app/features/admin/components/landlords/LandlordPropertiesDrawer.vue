<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseImage from '~/components/ui/BaseImage.vue'
import BaseDrawer from '~/components/ui/BaseDrawer.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import { useAdminLandlordProperties } from '../../composables/useAdminLandlordProperties'
import { initials } from '~/utils/initials'
import dayjs from 'dayjs'

const props = defineProps<{
  modelValue: boolean
  landlordId: string | null
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const landlordIdRef = computed(() => props.landlordId)
const { data, isPending } = useAdminLandlordProperties(landlordIdRef)

const langKey = useLangKey()

function locationLabel(property: typeof data.value.properties[0]) {
  const d = property.district
  return `${d[langKey.value]}, ${d.province[langKey.value]}`
}
</script>

<template>
  <BaseDrawer
    v-model="isOpen"
    :title="$t('admin.landlords.propertiesDrawer.title')"
    size="560px"
    direction="rtl"
    :destroy-on-close="true"
  >
    <!-- Loading -->
    <template v-if="isPending">
      <div class="mb-6 pb-6 border-b border-gray-100">
        <BaseSkeleton :rows="1" leading="circle" leading-size="48px" />
      </div>
      <BaseSkeleton :rows="4" leading="square" leading-size="56px" />
    </template>

    <template v-else-if="data">
      <!-- Landlord profile header -->
      <div class="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0 overflow-hidden">
          <BaseImage v-if="data.landlord.imgUrl" :src="data.landlord.imgUrl" fit="cover" class="w-full h-full" :alt="data.landlord.name" />
          <span v-else>{{ initials(data.landlord.name) }}</span>
        </div>
        <div class="min-w-0">
          <p class="font-semibold text-gray-900">{{ data.landlord.name }}</p>
          <p class="text-sm text-gray-400 truncate">{{ data.landlord.email }}</p>
          <p class="text-xs text-gray-400 mt-0.5">
            {{ $t('admin.landlords.propertiesDrawer.joined', { date: dayjs(data.landlord.createdAt).format('MMM D, YYYY') }) }}
          </p>
        </div>
        <div class="ml-auto shrink-0 text-right">
          <p class="text-2xl font-bold text-gray-900">{{ data.properties.length }}</p>
          <p class="text-xs text-gray-400">{{ $t('admin.landlords.propertiesDrawer.listings') }}</p>
        </div>
      </div>

      <!-- Empty -->
      <div v-if="data.properties.length === 0" class="py-10 text-center text-sm text-gray-400">
        {{ $t('admin.landlords.propertiesDrawer.noProperties') }}
      </div>

      <!-- Properties list -->
      <ul v-else class="space-y-3">
        <li
          v-for="prop in data.properties"
          :key="prop.id"
          class="flex gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
        >
          <!-- Thumbnail -->
          <div class="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
            <BaseImage v-if="prop.images.length" :src="prop.images[0].imageKey" :alt="prop.title" />
            <BaseIcon v-else name="building" :size="20" class="text-gray-300" />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ prop.title }}</p>
            <p class="text-xs text-gray-400 truncate mt-0.5">{{ locationLabel(prop) }}</p>

            <!-- Status badges -->
            <div class="flex flex-wrap gap-1 mt-2">
              <span
                class="text-xs px-1.5 py-0.5 rounded-full font-medium"
                :class="prop.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'"
              >
                {{ prop.isPublished ? $t('admin.landlords.propertiesDrawer.published') : $t('admin.landlords.propertiesDrawer.unpublished') }}
              </span>
              <span
                class="text-xs px-1.5 py-0.5 rounded-full font-medium"
                :class="prop.isAvailable ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'"
              >
                {{ prop.isAvailable ? $t('admin.landlords.propertiesDrawer.available') : $t('admin.landlords.propertiesDrawer.unavailable') }}
              </span>
              <span v-if="prop.isFeatured" class="text-xs px-1.5 py-0.5 rounded-full font-medium bg-amber-50 text-amber-600">
                {{ $t('admin.landlords.propertiesDrawer.featured') }}
              </span>
            </div>
          </div>

          <!-- Price + stats -->
          <div class="shrink-0 text-right">
            <p class="text-sm font-semibold text-gray-900">${{ prop.monthly_price }}<span class="text-xs font-normal text-gray-400">/mo</span></p>
            <div class="flex items-center justify-end gap-2 mt-1.5 text-xs text-gray-400">
              <span class="flex items-center gap-0.5">
                <BaseIcon name="eye" :size="11" /> {{ prop.totalViews.toLocaleString() }}
              </span>
              <span class="flex items-center gap-0.5">
                <BaseIcon name="heart" :size="11" /> {{ prop.favouriteCount }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </template>
  </BaseDrawer>
</template>
