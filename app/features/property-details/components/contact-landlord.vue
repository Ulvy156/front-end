<template>
  <aside class="border border-gray-200 rounded-lg p-5 shadow-[0_4px_20px_rgba(17,24,39,0.04)] overflow-hidden bg-white">
    <!-- Indigo top accent bar -->
    <div class="h-[3px] bg-(--nav-active-item) rounded-full -mx-5 -mt-5 mb-4"></div>

    <!-- Price -->
    <div class="flex items-baseline gap-1.5 mb-1">
      <span class="text-[38px] font-extrabold text-gray-800 leading-none">${{ property.monthly_price }}</span>
      <span class="text-[15px] text-gray-600">/ {{ $t('month') }}</span>
    </div>
    <div class="text-[13px] text-gray-600 mb-4 pb-4 border-b border-gray-200">
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
            v-if="property.user.hasVerifiedBadge"
            :size="19"
            :title="$t('property.verified')"
          />
        </div>
        <div class="text-xs text-gray-600">{{ property.user.role }}</div>
      </div>
    </div>

    <!-- Call -->
    <BaseButton
      v-if="hasPhone"
      block
      tag="a"
      :href="`tel:${phoneNumber[0]!.phoneNumber}`"
      class="flex! items-center justify-center gap-2 bg-(--nav-active-item)! text-white! border-none! rounded-lg! py-3.5! h-auto! text-[15px]! font-semibold!"
    >
      <BaseIconClient name="phone-call" class="mr-3" :size="17" />
      {{ $t('property.call') }}
    </BaseButton>
    <BaseButton
      v-else-if="!hasTelegram"
      block
      disabled
      class="bg-gray-300! text-white! border-none! rounded-lg! py-3.5! h-auto! text-[15px]! font-semibold! cursor-not-allowed!"
    >
      {{ $t('property.contact') }}
    </BaseButton>

    <!-- Telegram -->
    <a
      v-if="hasTelegram"
      target="_blank"
      :href="getTelegramLink(telegram[0]!.phoneNumber)!"
      class="w-full flex items-center justify-center gap-2 rounded-lg py-3 text-[15px] font-semibold text-center"
      :class="hasPhone
        ? 'bg-white text-(--nav-active-item) border-[1.5px] border-(--nav-active-item) mt-2'
        : 'bg-(--nav-active-item) text-white border-none'"
    >
      <BaseIconClient name="mdi:telegram" :size="17" />
      {{ $t('property.contact_telegram') }}
    </a>

    <!-- Contact rows -->
    <div class="flex flex-col gap-2 mt-3.5">
      <div
        v-if="property.user.email"
        class="flex items-center gap-2.5 bg-[#f4f5f7] rounded-lg px-3.5 py-2.5"
      >
        <BaseIconClient name="mail" :size="16" color="var(--nav-active-item)" />
        <span class="flex-1 text-[13px] text-gray-600 truncate">{{ property.user.email }}</span>
        <button
          type="button"
          class="shrink-0 text-gray-400 cursor-pointer"
          :aria-label="$t('property.copy_email')"
          @click="copy(property.user.email!)"
        >
          <BaseIconClient name="copy" :size="15" />
        </button>
      </div>
      <a
        v-for="phone in phoneNumber"
        :key="phone.phoneNumber"
        :href="`tel:${phone.phoneNumber}`"
        class="flex items-center gap-2.5 bg-[#f4f5f7] rounded-lg px-3.5 py-2.5"
      >
        <BaseIconClient name="phone" :size="16" color="var(--nav-active-item)" />
        <span class="flex-1 text-[13px] text-gray-600">{{ phone.phoneNumber }}</span>
        <button
          type="button"
          class="shrink-0 text-gray-400 cursor-pointer"
          :aria-label="$t('property.copy_phone')"
          @click.prevent.stop="copy(phone.phoneNumber)"
        >
          <BaseIconClient name="copy" :size="15" />
        </button>
      </a>
    </div>

    <!-- Share -->
    <div class="border-t border-gray-200 mt-4 pt-4">
      <div class="flex items-center gap-3 mb-3.5">
        <span class="text-[13px] font-semibold text-gray-600">{{ $t('property.share') }}</span>
        <div class="flex gap-2">
          <button
            class="share-btn"
            :aria-label="$t('property.share_facebook')"
            @click="openShare('FB', shareUrl, property.title)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M6.5 10v4h3v7h4v-7h3l1-4h-4V8c0-.545.455-1 1-1h3V3h-3c-2.723 0-5 2.277-5 5v2z" />
            </svg>
          </button>
          <button
            class="share-btn"
            :aria-label="$t('property.share_telegram')"
            @click="openShare('TG', shareUrl, property.title)"
          >
            <Icon name="mdi:telegram" :size="18" />
          </button>
          <button
            class="share-btn"
            :aria-label="$t('property.copy_link')"
            @click="copy(useFullUrl().getFullUrl())"
          >
            <BaseIconClient name="link" :size="17" />
          </button>
        </div>
      </div>
    </div>

    <!-- Report -->
    <button
      class="w-full flex items-center justify-center gap-2 bg-transparent text-red-600 border border-red-200 rounded-lg py-3 text-sm font-semibold cursor-pointer"
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
import BaseButton from "~/components/ui/BaseButton.vue"
import BaseIconClient from "~/components/ui/BaseIcon.client.vue"
import BaseVerifiedBadge from "~/components/ui/BaseVerifiedBadge.vue"
import reportPropertyDialog from "./report-property-dialog.vue"
import type { PropertyDetail } from "../interface/properties-details"
import { PHONE_NUMBER_TYPE } from "~/types/phoneNumber"
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
  () => props.property?.user?.phones?.filter((item) => item.type === PHONE_NUMBER_TYPE.PHONE) ?? [],
)
const telegram = computed(
  () => props.property?.user?.phones?.filter((item) => item.type === PHONE_NUMBER_TYPE.TELEGRAM) ?? [],
)
const hasPhone = computed(() => phoneNumber.value.length > 0)
const hasTelegram = computed(() => telegram.value.length > 0)
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
