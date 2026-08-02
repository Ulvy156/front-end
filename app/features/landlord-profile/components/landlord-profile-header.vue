<template>
  <div class="rounded-(--radius) border border-(--border-gray) p-6 bg-(--card)">
    <div class="flex items-start gap-x-5">
      <BaseAvatar
        :name="landlord.name"
        :src="landlord.imgUrl"
        :size="80"
      />
      <div class="flex-1">
        <h2 class="text-xl font-semibold">{{ landlord.name }}</h2>
        <p v-if="landlord.email" class="text-(--gray) text-sm mt-1">{{ landlord.email }}</p>

        <div class="flex items-center gap-x-4 mt-3 text-sm text-(--gray)">
          <span class="flex items-center gap-x-1.5">
            <BaseIconClient name="calendar-days" :size="16" />
            {{ $t('landlord.publicProfile.memberSince') }}
            {{ formattedDate }}
          </span>
          <span class="flex items-center gap-x-1.5">
            <BaseIconClient name="building" :size="16" />
            {{ $t('landlord.publicProfile.totalListings', { n: landlord.totalPublishedProperties }) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Contact info -->
    <div v-if="phones.length > 0 || telegram.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
      <div
        v-for="phone in phones"
        :key="phone.phoneNumber"
        class="flex items-center justify-between gap-x-3 bg-(--bg-gray) p-3 rounded-(--radius)"
      >
        <div class="flex items-center gap-x-3">
          <BaseIconClient name="phone-call" :size="18" />
          <p>{{ phone.phoneNumber }}</p>
        </div>
        <BaseIconClient
          class="cursor-pointer"
          name="copy"
          :size="18"
          @click="copy(phone.phoneNumber)"
        />
      </div>

      <a
        v-if="telegram.length > 0"
        target="_blank"
        :href="getTelegramLink(telegram[0]!.phoneNumber)!"
        class="flex items-center justify-center gap-x-3 bg-(--bg-gray) p-3 rounded-(--radius) hover:bg-(--nav-active) transition-all"
      >
        <BaseIconClient name="message-square-text" :size="18" />
        <p>{{ $t('property.telegram') }}</p>
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'

import BaseAvatar from '~/components/ui/BaseAvatar.vue'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'
import { useCopy } from '#imports'
import { getTelegramLink } from '#imports'
import type { PublicLandlord } from '../interface/landlord-profile'
import { PHONE_NUMBER_TYPE } from '~/types/phoneNumber'

const props = defineProps<{
  landlord: PublicLandlord
}>()

const { copy } = useCopy()

const phones = computed(() =>
  props.landlord.phones.filter(p => p.type === PHONE_NUMBER_TYPE.PHONE),
)

const telegram = computed(() =>
  props.landlord.phones.filter(p => p.type === PHONE_NUMBER_TYPE.TELEGRAM),
)

const formattedDate = computed(() =>
  dayjs(props.landlord.createdAt).format('MMM YYYY'),
)
</script>
