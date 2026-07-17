<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6">
    <div class="mb-4">
      <h2 class="text-lg font-medium text-gray-900 mb-0.5">{{ t('landlord.editProperty.photos') }}</h2>
      <p class="text-sm text-gray-500">{{ t('landlord.editProperty.photosSubtitle') }}</p>
    </div>

    <hr class="border-gray-200 mb-5">

    <!-- Existing images -->
    <div v-if="existingImages.length" class="mb-6">
      <p class="text-sm font-medium text-gray-700 mb-3">
        {{ t('landlord.editProperty.currentPhotos') }} ({{ existingImages.length }})
      </p>
      <div class="grid grid-cols-4 gap-3">
        <div
          v-for="img in existingImages"
          :key="img.id"
          class="relative group rounded-lg overflow-hidden border-2 transition"
          :class="img.isCover ? 'border-emerald-500' : 'border-gray-200'"
        >
          <BaseImage
            :src="img.imageKey"
            fit="cover"
            class="w-full h-28"
          />
          <span
            v-if="img.isCover"
            class="absolute top-1.5 left-1.5 bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-md font-medium"
          >
            {{ t('landlord.editProperty.cover') }}
          </span>

          <!-- Actions overlay -->
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
            <BaseButton
              v-if="!img.isCover"
              circle
              size="small"
              type="info"
              :title="t('landlord.editProperty.setCover')"
              :disabled="imageLoading"
              @click="handleSetCover(img.id)"
            >
              <BaseIconClient name="star" :size="14" class="text-emerald-600" />
            </BaseButton>
            <BaseButton
              circle
              size="small"
              type="danger"
              :title="t('landlord.editProperty.deletePhoto')"
              :disabled="imageLoading"
              @click="handleDeleteImage(img.id)"
            >
              <BaseIconClient name="trash-2" :size="14" />
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload new photos -->
    <div>
      <p class="text-sm font-medium text-gray-700 mb-3">{{ t('landlord.editProperty.addPhotos') }}</p>
      <div
        class="border-2 border-dashed border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30 rounded-xl flex flex-col items-center justify-center py-8 cursor-pointer transition"
        @click="fileInput?.click()"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <div class="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center mb-3 bg-white">
          <BaseIconClient name="upload" :size="20" class="text-gray-400" />
        </div>
        <p class="text-sm font-medium text-gray-700">{{ t('post_property.photos.drag_drop') }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ t('post_property.photos.or_browse') }}</p>
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          multiple
          accept="image/png, image/jpeg, image/webp"
          @change="handleFiles"
        />
      </div>
    </div>

    <!-- Pending uploads list -->
    <div v-if="pendingFiles.length" class="mt-4 space-y-2">
      <p class="text-sm font-medium text-gray-700">
        {{ t('landlord.editProperty.pendingUploads') }} ({{ pendingFiles.length }})
      </p>
      <div
        v-for="(file, index) in pendingFiles"
        :key="index"
        class="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2.5"
      >
        <img :src="pendingPreviews[index]" class="w-14 h-14 object-cover rounded-lg" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-700 truncate">{{ file.name }}</p>
          <p class="text-xs text-gray-400">{{ formatFileSize(file.size) }}</p>
        </div>
        <BaseButton text circle size="small" type="info" @click="removePending(index)">
          <BaseIconClient name="x" :size="14" class="text-gray-400" />
        </BaseButton>
      </div>
    </div>

    <!-- Upload button -->
    <div v-if="pendingFiles.length" class="mt-4">
      <BaseButton
        type="success"
        :loading="uploading"
        @click="uploadAll"
      >
        <BaseIconClient v-if="!uploading" name="upload" :size="16" class="mr-1" />
        {{ uploading ? t('landlord.editProperty.uploading') : t('landlord.editProperty.uploadPhotos') }}
      </BaseButton>
    </div>

    <!-- Guidelines -->
    <div class="bg-gray-50 rounded-lg px-4 py-3 mt-5 border border-gray-100">
      <p class="text-xs font-medium text-emerald-700 flex items-center gap-1.5 mb-2">
        <BaseIconClient name="info" :size="14" />
        {{ t('post_property.photos.guidelines_title') }}
      </p>
      <ul class="text-xs text-gray-500 space-y-1 list-disc pl-4">
        <li>{{ t('post_property.photos.guideline_1') }}</li>
        <li>{{ t('post_property.photos.guideline_2') }}</li>
        <li>{{ t('post_property.photos.guideline_3') }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'
import BaseImage from '~/components/ui/BaseImage.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { uploadPropertyImage, deletePropertyImage, setCoverImage } from '../services/property-image'
import { useQueryClient } from '@tanstack/vue-query'
import { exceedsFileSize, formatFileSize } from '~/utils/fileSize'

const props = defineProps<{
  propertyId: string
  images: Array<{ id: string; imageKey: string; isCover: boolean }>
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const { t } = useI18n()
const { $axios } = useNuxtApp()
const { extract } = useErrorMsg()
const notify = useNotify()
const queryClient = useQueryClient()

const existingImages = computed(() => props.images ?? [])
const fileInput = ref<HTMLInputElement | null>(null)
const pendingFiles = ref<File[]>([])
const pendingPreviews = ref<string[]>([])
const uploading = ref(false)
const imageLoading = ref(false)

function handleFiles(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files) return
  addFiles(Array.from(target.files))
  target.value = ''
}

function handleDrop(event: DragEvent) {
  const files = event.dataTransfer?.files
  if (!files) return
  addFiles(Array.from(files))
}

function addFiles(files: File[]) {
  for (const file of files) {
    if (exceedsFileSize(file, 1)) continue
    pendingFiles.value.push(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      pendingPreviews.value.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }
}

function removePending(index: number) {
  pendingFiles.value.splice(index, 1)
  pendingPreviews.value.splice(index, 1)
}

async function uploadAll() {
  uploading.value = true
  try {
    for (const file of pendingFiles.value) {
      await uploadPropertyImage($axios, props.propertyId, file)
    }
    pendingFiles.value = []
    pendingPreviews.value = []
    notify.success(t('landlord.editProperty.uploadSuccess'))
    invalidateAndRefresh()
  } catch (err) {
    notify.error(extract(err))
  } finally {
    uploading.value = false
  }
}

async function handleSetCover(imageId: string) {
  imageLoading.value = true
  try {
    await setCoverImage($axios, imageId)
    notify.success(t('landlord.editProperty.coverSet'))
    invalidateAndRefresh()
  } catch (err) {
    notify.error(extract(err))
  } finally {
    imageLoading.value = false
  }
}

async function handleDeleteImage(imageId: string) {
  imageLoading.value = true
  try {
    await deletePropertyImage($axios, imageId)
    notify.success(t('landlord.editProperty.photoDeleted'))
    invalidateAndRefresh()
  } catch (err) {
    notify.error(extract(err))
  } finally {
    imageLoading.value = false
  }
}

function invalidateAndRefresh() {
  queryClient.invalidateQueries({ queryKey: ['edit-property', props.propertyId] })
  queryClient.invalidateQueries({ queryKey: ['landlord-property-detail', props.propertyId] })
  emit('refresh')
}

</script>
