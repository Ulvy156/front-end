<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseImage from '~/components/ui/BaseImage.vue'
import BaseTooltip from '~/components/ui/BaseTooltip.vue'
import { usePropertyTypeOptions } from '~/features/browse-properties/composable/usePropertyTypeOptions'
import { useLangKey } from '~/composables/useLangKey'
import { localizedName } from '~/utils/localizedName'
import type { PropertyDraft } from '../services/property-draft'
import { useLandlordDrafts } from '../composables/useLandlordDrafts'

dayjs.extend(relativeTime)

const props = defineProps<{ draft: PropertyDraft }>()

const { t } = useI18n()
const router = useRouter()
const langKey = useLangKey()
const { success, error: notifyError } = useNotify()
const { extract, getValidationMessages } = useErrorMsg()
const { deleteDraftMutation, publishDraftMutation } = useLandlordDrafts()
const { data: propertyTypeOptions } = usePropertyTypeOptions()

const publishErrors = ref<string[] | null>(null)

const title = computed(() => props.draft.data.title || t('landlord.drafts.untitled'))
const coverImage = computed(() => props.draft.images[0]?.key ?? '')
const location = computed(() => props.draft.data.address?.trim() || '')
const price = computed(() => props.draft.data.monthly_price)
const propertyTypeLabel = computed(() => {
  const match = propertyTypeOptions.value.find(pt => pt.id === props.draft.data.propertyTypeId)
  return match ? localizedName(match, langKey.value) : ''
})

function editDraft() {
  router.push(`/landlord/post-property?draftId=${props.draft.id}`)
}

async function deleteDraft() {
  try {
    await ElMessageBox.confirm(
      t('landlord.drafts.deleteConfirm', { title: title.value }),
      t('landlord.drafts.deleteTitle'),
      { type: 'warning', confirmButtonText: t('landlord.drafts.delete'), cancelButtonText: t('landlord.drafts.cancel') },
    )
  } catch { return }

  try {
    await deleteDraftMutation.mutateAsync(props.draft.id)
    success(t('landlord.drafts.deleteSuccess'))
  } catch (err) {
    notifyError(extract(err))
  }
}

async function publishDraft() {
  publishErrors.value = null
  try {
    const result = await publishDraftMutation.mutateAsync(props.draft.id)
    success(t('landlord.drafts.publishSuccess'))
    router.push(`/landlord/properties/${result.id}`)
  } catch (err) {
    const messages = getValidationMessages(err)
    if (messages) {
      publishErrors.value = messages
    } else {
      notifyError(extract(err))
    }
  }
}
</script>

<template>
  <div class="draft-card flex h-full flex-col">
    <div class="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
      <BaseImage
        v-if="coverImage"
        :src="coverImage"
        :width="400"
        :height="225"
        class="h-full w-full"
      />
      <div v-else class="flex h-full w-full flex-col items-center justify-center gap-1 text-gray-400">
        <BaseIcon name="camera" :size="20" />
        <span class="text-[11px] font-medium">{{ t('landlord.drafts.noPhotos') }}</span>
      </div>

      <span class="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-50/95 px-2 py-0.5 text-[11px] font-bold text-amber-700 shadow-sm backdrop-blur-sm">
        <span class="h-1.5 w-1.5 rounded-full bg-amber-500" />
        {{ t('landlord.drafts.draftBadge') }}
      </span>
    </div>

    <div class="mt-2.5 flex flex-1 flex-col gap-1">
      <h3 class="text-sm font-semibold text-gray-900 truncate">{{ title }}</h3>

      <p v-if="location" class="flex items-center gap-1 text-xs text-gray-500 truncate">
        <BaseIcon name="map-pin" :size="12" class="shrink-0 text-gray-400" />
        <span class="truncate">{{ location }}</span>
      </p>

      <div v-if="propertyTypeLabel || price" class="flex items-center justify-between gap-2">
        <span v-if="propertyTypeLabel" class="truncate text-xs font-medium text-gray-500">{{ propertyTypeLabel }}</span>
        <span v-if="price" class="ml-auto whitespace-nowrap text-sm font-bold text-(--nav-active-item)">
          ${{ Number(price).toLocaleString() }}<span class="text-xs font-normal text-gray-400">/mo</span>
        </span>
      </div>

      <p class="flex items-center gap-1 text-xs text-gray-400">
        <BaseIcon name="clock" :size="12" />
        {{ t('landlord.drafts.lastUpdated', { time: dayjs(draft.updatedAt).fromNow() }) }}
      </p>

      <div class="mt-auto flex items-center gap-2 pt-2.5">
        <BaseButton size="small" type="info" class="flex-1" @click="editDraft">
          <BaseIcon name="pencil" :size="14" />
          {{ t('landlord.drafts.edit') }}
        </BaseButton>
        <BaseButton
          size="small"
          class="flex-1"
          :loading="publishDraftMutation.isPending.value"
          @click="publishDraft"
        >
          <BaseIcon v-if="!publishDraftMutation.isPending.value" name="upload" :size="14" />
          {{ t('landlord.drafts.publish') }}
        </BaseButton>
        <BaseTooltip :content="t('landlord.drafts.deleteTooltip')">
          <BaseButton
            size="small"
            circle
            text
            type="info"
            class="text-red-500!"
            :loading="deleteDraftMutation.isPending.value"
            @click="deleteDraft"
          >
            <BaseIcon name="trash-2" :size="15" />
          </BaseButton>
        </BaseTooltip>
      </div>

      <div v-if="publishErrors" class="mt-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
        <p class="text-xs font-semibold text-red-700 mb-1.5">{{ t('landlord.drafts.publishErrorsTitle') }}</p>
        <ul class="text-xs text-red-600 space-y-1 list-disc pl-4">
          <li v-for="(msg, i) in publishErrors" :key="i">{{ msg }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.draft-card {
  border-radius: 8px;
  padding: 12px;
  background: var(--card);
  border: 1px solid #e5e7eb;
}
</style>
