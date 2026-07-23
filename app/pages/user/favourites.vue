<template>
  <section class="py-8">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">{{ t('favourites.title') }}</h1>
        <p v-if="items.length" class="mt-1 text-sm text-slate-500">
          {{ t('favourites.count', items.length) }}
        </p>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="!isFetched" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in 3" :key="n" class="h-72 rounded-xl bg-slate-100 animate-pulse" />
    </div>

    <!-- Empty state -->
    <div v-else-if="items.length === 0"
      class="flex flex-col items-center justify-center gap-y-5 py-24 text-center">
      <div class="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
        <BaseIcon name="heart" :size="28" class="text-slate-400" />
      </div>
      <p class="text-slate-700 font-medium">{{ t('favourites.empty') }}</p>
      <NuxtLink to="/properties"
        class="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white
               hover:bg-blue-700 transition-colors">
        {{ t('favourites.browse') }}
      </NuxtLink>
    </div>

    <!-- Property grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <BrowsePropertyCard
        v-for="item in items"
        :key="item.id"
        :item="item.property"
        :hide-compare-icon="true"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import BrowsePropertyCard from '~/features/browse-properties/components/property-card.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import { useFavourites } from '~/features/favourite/composable/useFavourites'

definePageMeta({ layout: 'default', middleware: 'user' })

const { t } = useI18n()

const { items, isFetched } = useFavourites()

useSeoMeta({
  title: `${t('favourites.title')} | Rokpteah`,
  robots: 'noindex',
})
</script>
