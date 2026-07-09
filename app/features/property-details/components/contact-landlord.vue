<template>
  <aside class="border border-gray-200 rounded-lg p-5 shadow-[0_4px_20px_rgba(17,24,39,0.04)] overflow-hidden bg-white">
    <!-- Indigo top accent bar -->
    <div class="h-[3px] bg-(--nav-active-item) rounded-full -mx-5 -mt-5 mb-4"></div>

    <!-- Price -->
    <div class="flex items-baseline gap-1.5 mb-1">
      <span class="text-[38px] font-extrabold text-gray-800 leading-none">${{ property.monthly_price }}</span>
      <span class="text-[15px] text-gray-400">/ {{ $t('month') }}</span>
    </div>
    <div class="text-[13px] text-gray-400 mb-4 pb-4 border-b border-gray-200">
      {{ formatDuration(property.minimumStayLength) }} {{ $t('property.price.lease').toLowerCase() }} · ${{ property.deposit }} {{ $t('property.price.deposit').toLowerCase() }}
    </div>

    <!-- Landlord -->
    <div class="flex items-center gap-3 mb-4">
      <BaseAvatar :name="property.user.name" :src="property.user.imgUrl" />
      <div>
        <div class="flex items-center gap-1">
          <NuxtLink
            :to="`/landlord/profile/${property.userId}`"
            class="text-[15px] font-semibold text-gray-800 hover:text-(--nav-active-item) transition-colors"
          >
            {{ property.user.name }}
          </NuxtLink>
          <BaseVerifiedBadge
            v-if="property.user.isVerified"
            :size="19"
            :title="$t('property.verified')"
          />
        </div>
        <div class="text-xs text-gray-400">{{ property.user.role }}</div>
      </div>
    </div>

    <!-- Contact button -->
    <a
      v-if="phoneNumber.length"
      :href="`tel:${phoneNumber[0].phoneNumber}`"
      class="w-full bg-(--nav-active-item) text-white rounded-lg py-3.5 text-[15px] font-semibold text-center block"
    >
      {{ $t('property.contact') }}
    </a>
    <button
      v-else
      class="w-full bg-(--nav-active-item) text-white border-none rounded-lg py-3.5 text-[15px] font-semibold cursor-pointer"
    >
      {{ $t('property.contact') }}
    </button>

    <!-- Call now -->
    <a
      v-if="phoneNumber.length"
      :href="`tel:${phoneNumber[0].phoneNumber}`"
      class="w-full flex items-center justify-center gap-2 bg-green-500 text-white rounded-lg py-3.5 text-[15px] font-semibold mt-2.5 text-center"
    >
      <BaseIconClient name="phone-call" :size="17" />
      {{ $t('property.call') }}
    </a>

    <!-- Contact rows -->
    <div class="flex flex-col gap-2 mt-3.5">
      <div
        v-if="property.user.email"
        class="flex items-center gap-2.5 bg-[#f4f5f7] rounded-lg px-3.5 py-2.5"
      >
        <BaseIconClient name="mail" :size="16" color="var(--nav-active-item)" />
        <span class="flex-1 text-[13px] text-gray-500 truncate">{{ property.user.email }}</span>
        <BaseIconClient name="copy" :size="15" class="text-gray-400 cursor-pointer shrink-0" @click="copy(property.user.email!)" />
      </div>
      <div
        v-for="phone in phoneNumber"
        :key="phone.phoneNumber"
        class="flex items-center gap-2.5 bg-[#f4f5f7] rounded-lg px-3.5 py-2.5"
      >
        <BaseIconClient name="phone" :size="16" color="var(--nav-active-item)" />
        <span class="flex-1 text-[13px] text-gray-500">{{ phone.phoneNumber }}</span>
        <BaseIconClient name="copy" :size="15" class="text-gray-400 cursor-pointer shrink-0" @click="copy(phone.phoneNumber)" />
      </div>
    </div>

    <!-- Telegram -->
    <a
      v-if="telegram.length"
      target="_blank"
      :href="getTelegramLink(telegram[0].phoneNumber)!"
      class="w-full flex items-center justify-center gap-2 bg-white text-(--nav-active-item) border-[1.5px] border-(--nav-active-item) rounded-lg py-3 text-[15px] font-semibold mt-2 text-center"
    >
      <BaseIconClient name="message-square-text" :size="17" />
      {{ $t('property.telegram') }}
    </a>

    <!-- Share -->
    <div class="border-t border-gray-200 mt-4 pt-4">
      <div class="flex items-center gap-3 mb-3.5">
        <span class="text-[13px] font-semibold text-gray-400">{{ $t('property.share') }}</span>
        <div class="flex gap-2">
          <button
            class="share-btn"
            @click="openShare('FB', shareUrl, property.title)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M6.5 10v4h3v7h4v-7h3l1-4h-4V8c0-.545.455-1 1-1h3V3h-3c-2.723 0-5 2.277-5 5v2z" />
            </svg>
          </button>
          <button
            class="share-btn"
            @click="openShare('TG', shareUrl, property.title)"
          >
            <BaseIconClient name="message-square-text" :size="18" />
          </button>
          <button
            class="share-btn"
            @click="copy(useFullUrl().getFullUrl())"
          >
            <BaseIconClient name="link" :size="17" />
          </button>
        </div>
      </div>
    </div>

    <!-- Report -->
    <button
      class="w-full flex items-center justify-center gap-2 bg-transparent text-red-500 border border-red-200 rounded-lg py-3 text-sm font-semibold cursor-pointer"
      @click="handleReport"
    >
      <BaseIconClient name="flag" :size="15" />
      {{ $t('property.report') }}
    </button>
    <reportPropertyDialog ref="reportDialog" :property-id="property.id" />
  </aside>
</template>

<script lang="ts" setup>
import BaseAvatar from "~/components/ui/BaseAvatar.vue"
import BaseIconClient from "~/components/ui/BaseIcon.client.vue"
import BaseVerifiedBadge from "~/components/ui/BaseVerifiedBadge.vue"
import reportPropertyDialog from "./report-property-dialog.vue"
import type { PropertyDetail } from "../interface/properties-details"
import { useFullUrl } from "#imports"
import { useCopy } from "#imports"
import { getTelegramLink } from "#imports"
import { openShare } from "#imports"

const route = useRoute()
const { requireAuth } = useRequireAuth()

const reportDialog = ref<InstanceType<typeof reportPropertyDialog>>()

function handleReport() {
  requireAuth(() => reportDialog.value?.open())
}

const shareUrl = computed(() =>
  import.meta.client ? window.location.origin + route.fullPath : ''
)

const props = defineProps<{
  property: PropertyDetail
}>()

const { copy } = useCopy()

const phoneNumber = computed(
  () => props.property?.user?.phones?.filter((item) => item.type === "PHONE") ?? [],
)
const telegram = computed(
  () => props.property?.user?.phones?.filter((item) => item.type === "TELEGRAM") ?? [],
)
</script>

<style scoped>
.share-btn {
  width: 40px;
  height: 40px;
  background: #f4f5f7;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--nav-active-item);
  transition: background 0.2s;
}
.share-btn:hover {
  background: var(--nav-active);
}
</style>
