<script setup lang="ts">
import dayjs from 'dayjs'
import { marked } from 'marked'
import TurndownService from 'turndown'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseRichEditor from '~/components/ui/BaseRichEditor.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import { useAdminLegal } from '~/features/admin/composables/useAdminLegal'
import type { LegalSlug } from '~/features/admin/types/legal'

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()

const turndownService = new TurndownService({ headingStyle: 'atx' })

const documents: { slug: LegalSlug; label: string }[] = [
  { slug: 'privacy-policy', label: t('admin.legal.privacyPolicy') },
  { slug: 'terms-of-service', label: t('admin.legal.termsOfService') },
]

const selectedSlug = ref<LegalSlug>('privacy-policy')
const activeLang = ref<'en' | 'kh'>('en')

const { data, isPending, isError, updateLegal } = useAdminLegal(selectedSlug)

const contentEnHtml = ref('')
const contentKhHtml = ref('')

watch(() => data.value?.id, () => {
  if (!data.value) return
  contentEnHtml.value = data.value.contentEn ? (marked.parse(data.value.contentEn, { async: false }) as string) : ''
  contentKhHtml.value = data.value.contentKh ? (marked.parse(data.value.contentKh, { async: false }) as string) : ''
}, { immediate: true })

const isHtmlEmpty = (html: string) => html.replace(/<[^>]*>/g, '').trim().length === 0

const canSave = computed(() => !isHtmlEmpty(contentEnHtml.value) && !isHtmlEmpty(contentKhHtml.value))

const isSubmitting = ref(false)

const save = async () => {
  if (!canSave.value || isSubmitting.value) return
  isSubmitting.value = true
  try {
    await updateLegal.mutateAsync({
      contentEn: turndownService.turndown(contentEnHtml.value),
      contentKh: turndownService.turndown(contentKhHtml.value),
    })
    success(t('admin.legal.saveSuccess'))
  } catch (err) {
    notifyError(extract(err))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl">
    <el-radio-group v-model="selectedSlug" class="mb-4">
      <el-radio-button v-for="doc in documents" :key="doc.slug" :value="doc.slug">
        {{ doc.label }}
      </el-radio-button>
    </el-radio-group>

    <div v-if="isPending" class="bg-white rounded-xl border border-gray-200 p-5">
      <BaseSkeleton :rows="8" :lines="1" />
    </div>

    <p v-else-if="isError" class="text-sm text-gray-600">
      {{ t('admin.legal.loadError') }}
    </p>

    <div v-else class="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <el-tabs v-model="activeLang">
        <el-tab-pane :label="t('admin.legal.english')" name="en" lazy>
          <BaseRichEditor v-model="contentEnHtml" :placeholder="t('admin.legal.contentPlaceholder')" />
        </el-tab-pane>
        <el-tab-pane :label="t('admin.legal.khmer')" name="kh" lazy>
          <BaseRichEditor v-model="contentKhHtml" :placeholder="t('admin.legal.contentPlaceholder')" />
        </el-tab-pane>
      </el-tabs>

      <div class="flex items-center justify-between pt-2">
        <p v-if="data?.updatedAt" class="text-xs text-gray-400">
          {{ t('admin.legal.lastUpdated', { date: dayjs(data.updatedAt).format('MMM D, YYYY h:mm A') }) }}
        </p>
        <BaseButton
          type="primary"
          :loading="isSubmitting"
          :disabled="!canSave"
          class="ml-auto"
          @click="save"
        >
          {{ t('admin.legal.save') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
