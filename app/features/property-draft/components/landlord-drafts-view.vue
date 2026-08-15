<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseEmpty from '~/components/ui/BaseEmpty.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import DraftCard from './draft-card.vue'
import { useLandlordDrafts } from '../composables/useLandlordDrafts'

const { t } = useI18n()
const router = useRouter()
const { data, isPending } = useLandlordDrafts()

const drafts = computed(() => data.value ?? [])

const heading = computed(() =>
  !isPending.value && drafts.value.length
    ? t('landlord.drafts.titleWithCount', { n: drafts.value.length })
    : t('landlord.drafts.title'),
)

function newDraft() {
  router.push('/landlord/post-property')
}
</script>

<template>
  <section class="w-full px-4 mt-6 md:w-[80%] md:px-0 md:mt-10 m-auto">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-gray-900">{{ heading }}</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ t('landlord.drafts.subtitle') }}</p>
      </div>
      <BaseButton @click="newDraft">
        <BaseIcon name="circle-plus" :size="16" />
        {{ t('landlord.drafts.newDraft') }}
      </BaseButton>
    </div>

    <div v-if="isPending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="n in 3" :key="n" class="bg-white rounded-xl border border-gray-200 p-3">
        <div class="aspect-video w-full animate-pulse rounded-lg bg-gray-200" />
        <BaseSkeleton class="mt-2.5" :rows="1" :lines="2" />
      </div>
    </div>

    <div v-else-if="!drafts.length" class="py-16">
      <BaseEmpty :description="t('landlord.drafts.empty')" />
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <DraftCard v-for="draft in drafts" :key="draft.id" :draft="draft" />
    </div>
  </section>
</template>
