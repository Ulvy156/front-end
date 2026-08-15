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
import type { PropertyDraft } from '../services/property-draft'
import { useLandlordDrafts } from '../composables/useLandlordDrafts'

dayjs.extend(relativeTime)

const props = defineProps<{ draft: PropertyDraft }>()

const { t } = useI18n()
const router = useRouter()
const { success, error: notifyError } = useNotify()
const { extract, getValidationMessages } = useErrorMsg()
const { deleteDraftMutation, publishDraftMutation } = useLandlordDrafts()

const publishErrors = ref<string[] | null>(null)

const title = computed(() => props.draft.data.title || t('landlord.drafts.untitled'))
const coverImage = computed(() => props.draft.images[0]?.key ?? '')

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
  <div class="draft-card">
    <div class="relative overflow-hidden rounded-lg">
      <BaseImage
        :src="coverImage"
        :width="400"
        :height="180"
        class="w-full"
      />
    </div>

    <div class="mt-3 flex flex-col gap-2">
      <h3 class="text-sm font-semibold text-gray-900 truncate">{{ title }}</h3>
      <p class="text-xs text-gray-400 flex items-center gap-1">
        <BaseIcon name="clock" :size="13" />
        {{ t('landlord.drafts.lastUpdated', { time: dayjs(draft.updatedAt).fromNow() }) }}
      </p>

      <div class="flex items-center gap-2 mt-1">
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
