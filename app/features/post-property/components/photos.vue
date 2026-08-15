<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6">

    <div class="mb-4">
      <h2 class="text-lg font-medium text-gray-900 mb-0.5">{{ t('post_property.photos.title') }}</h2>
      <p class="text-sm text-gray-500">{{ t('post_property.photos.subtitle') }}</p>
    </div>

    <hr class="border-gray-200 mb-5">

    <div class="mb-2">
      <label class="text-sm font-medium text-gray-800">
        {{ t('post_property.photos.property_photos') }}
        <span class="text-red-500">*</span>
      </label>
      <p class="text-xs text-gray-400 mt-0.5">{{ t('post_property.photos.cover_hint') }}</p>
    </div>

    <!-- Upload area -->
    <el-form-item prop="photoFiles">
      <div
        class="border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-9 mb-4 cursor-pointer transition w-full border-emerald-200 bg-emerald-50/50 hover:border-emerald-400 hover:bg-emerald-50"
        @click="fileInput?.click()"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <BaseIconClient name="image-plus" :size="26" class="text-(--nav-active-item) mb-2" />
        <p class="text-[14.5px] font-semibold text-(--nav-active-item)">{{ t('post_property.photos.drag_drop') }}</p>
        <p class="text-xs text-emerald-600 mt-0.5">{{ t('post_property.photos.or_browse') }}</p>
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          multiple
          accept="image/png, image/jpeg, image/webp"
          @change="handleFiles"
        />
      </div>
    </el-form-item>

    <p v-if="uploadError" class="text-xs text-red-500 -mt-3 mb-4">{{ uploadError }}</p>

    <!-- Status banner -->
    <div
      :class="hasEnoughPhotos
        ? 'bg-emerald-50 border-emerald-200 text-(--nav-active-item)'
        : 'bg-amber-50 border-amber-200 text-amber-700'"
      class="flex items-center gap-2 border rounded-xl px-3.5 py-2.5 mb-5 text-[13px] font-semibold"
    >
      <BaseIconClient :name="hasEnoughPhotos ? 'circle-check-big' : 'triangle-alert'" :size="16" class="shrink-0" />
      <span>
        {{ hasEnoughPhotos
          ? t('post_property.photos.enough_photos', { count: form.photos?.length ?? 0 })
          : t('post_property.photos.need_more_photos', { count: Math.max(0, 3 - (form.photos?.length ?? 0)) }) }}
      </span>
    </div>

    <!-- Photo Guidelines -->
    <div class="bg-gray-50 rounded-lg px-4 py-3 mb-5 border border-gray-100">
      <p class="text-xs font-medium text-emerald-700 flex items-center gap-1.5 mb-2">
        <BaseIconClient name="info" :size="14" />
        {{ t('post_property.photos.guidelines_title') }}
      </p>
      <ul class="text-xs text-gray-500 space-y-1 list-disc pl-4">
        <li>{{ t('post_property.photos.guideline_1', { max: maxPhotos }) }}</li>
        <li>{{ t('post_property.photos.guideline_2') }}</li>
        <li>{{ t('post_property.photos.guideline_3') }}</li>
        <li>{{ t('post_property.photos.guideline_4') }}</li>
      </ul>
    </div>

    <!-- Photo count + reorder hint -->
    <div v-if="form.photos && form.photos.length" class="flex items-center justify-between mb-3">
      <p class="text-xs font-medium text-gray-600">
        {{ form.photos.length }} {{ t('post_property.photos.photos_added') }}
      </p>
      <p class="text-xs text-gray-400">{{ t('post_property.photos.reorder_hint') }}</p>
    </div>

    <!-- Photo list -->
    <div class="space-y-2">
      <div
        v-for="(photo, index) in form.photos"
        :key="index"
        :class="index === coverIndex
          ? 'border-emerald-400 bg-emerald-50/30'
          : 'border-gray-200 bg-white'"
        class="flex items-center gap-3 border rounded-xl px-3 py-2.5 transition"
        draggable="true"
        @dragstart="dragStart(index as number)"
        @dragover.prevent
        @drop.prevent="dragDrop(index as number)"
      >
        <BaseIconClient name="grip-vertical" :size="16" class="text-gray-300 shrink-0 cursor-grab" />

        <div class="relative shrink-0">
          <img :src="photo" alt="" class="w-14 h-14 object-cover rounded-lg">
          <span
            v-if="index === coverIndex"
            class="absolute -top-1.5 -left-1.5 bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-md font-medium leading-tight"
          >
            {{ t('post_property.photos.cover') }}
          </span>
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-700 truncate">
            {{ t('post_property.photos.photo_label') }} {{ index as number + 1 }}
          </p>
          <p class="text-xs text-gray-400 truncate">{{ photoNames[index as number] || '' }}</p>
        </div>

        <div class="hidden sm:flex items-center gap-1">
          <button
            type="button"
            :disabled="index === 0"
            @click="movePhoto(index as number, -1)"
            class="w-7.5 h-7.5 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer flex items-center justify-center"
          >
            <BaseIconClient name="chevron-left" :size="14" />
          </button>
          <button
            type="button"
            :disabled="index === (form.photos?.length ?? 1) - 1"
            @click="movePhoto(index as number, 1)"
            class="w-7.5 h-7.5 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer flex items-center justify-center"
          >
            <BaseIconClient name="chevron-right" :size="14" />
          </button>
        </div>

        <BaseButton
          text
          circle
          size="small"
          :type="index === coverIndex ? 'warning' : 'info'"
          @click="setCover(index as number)"
        >
          <BaseIconClient name="star" :size="16" />
        </BaseButton>

        <BaseButton text circle size="small" type="info" @click="removePhoto(index as number)">
          <BaseIconClient name="x" :size="14" />
        </BaseButton>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'
import { exceedsFileSize } from '~/utils/fileSize'
import { compressImage } from '~/utils/imageCompression'
import { useAppSettingsStore } from '~/stores/appSettings'

const { t } = useI18n()
const appSettingsStore = useAppSettingsStore()

const form = inject<any>('postPropertyForm', {})

// Fallback of 20 only covers the brief window before /settings resolves —
// the backend enforces the real maxImagesPerProperty regardless.
const maxPhotos = computed(() => appSettingsStore.maxImagesPerProperty ?? 20)

const fileInput   = ref<HTMLInputElement | null>(null)
const coverIndex  = ref(0)
const photoNames  = ref<string[]>([])
const dragIndex   = ref<number | null>(null)
const uploadError = ref('')

const hasEnoughPhotos = computed(() => (form.photos?.length ?? 0) >= 3)

function handleFiles(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files) return
  loadFiles(Array.from(target.files))
  console.log('Files selected via input:', target.files.length)
}

function handleDrop(event: DragEvent) {
  const files = event.dataTransfer?.files
  if (!files) return
  loadFiles(Array.from(files))
  console.log('Files dropped:', files.length)
}

async function loadFiles(files: File[]) {
  if (!form.photos) form.photos = []
  if (!form.photoFiles) form.photoFiles = []
  if (!form.photoKeys) form.photoKeys = []
  for (const file of files) {
    if (form.photos.length >= maxPhotos.value) {
      uploadError.value = t('post_property.errors.photos_max', { max: maxPhotos.value })
      break
    }
    if (exceedsFileSize(file, 10)) {
      continue
    }
    photoNames.value.push(file.name)
    try {
      const { file: compressed, dataUrl } = await compressImage(file)
      form.photos.push(dataUrl)
      form.photoFiles.push(compressed)
      form.photoKeys.push(null)
    } catch {
      const reader = new FileReader()
      reader.onload = (e) => {
        form.photos.push(e.target?.result as string)
        form.photoFiles.push(file)
        form.photoKeys.push(null)
      }
      reader.readAsDataURL(file)
      continue
    }
  }
}

function setCover(index: number) {
  coverIndex.value = index
}

function removePhoto(index: number) {
  const key = form.photoKeys?.[index]
  if (key) {
    if (!form.removeImageKeys) form.removeImageKeys = []
    form.removeImageKeys.push(key)
  }
  form.photos?.splice(index, 1)
  form.photoFiles?.splice(index, 1)
  form.photoKeys?.splice(index, 1)
  photoNames.value.splice(index, 1)
  if (coverIndex.value >= form.photos.length) coverIndex.value = 0
  if (form.photos.length < maxPhotos.value) uploadError.value = ''
}

function movePhoto(index: number, dir: 1 | -1) {
  const toIndex = index + dir
  if (toIndex < 0 || toIndex >= (form.photos?.length ?? 0)) return
  const photos = form.photos
  const files  = form.photoFiles
  const keys   = form.photoKeys
  const names  = photoNames.value
  ;[photos[index], photos[toIndex]] = [photos[toIndex], photos[index]]
  if (files) [files[index], files[toIndex]] = [files[toIndex], files[index]]
  if (keys) [keys[index], keys[toIndex]] = [keys[toIndex], keys[index]]
  ;[names[index], names[toIndex]] = [names[toIndex], names[index]]
  if (coverIndex.value === index) coverIndex.value = toIndex
  else if (coverIndex.value === toIndex) coverIndex.value = index
}

function dragStart(index: number) {
  dragIndex.value = index
}

function dragDrop(toIndex: number) {
  if (dragIndex.value === null || dragIndex.value === toIndex) return
  const photos = form.photos
  const files  = form.photoFiles
  const keys   = form.photoKeys
  const names  = photoNames.value
  const [movedPhoto] = photos.splice(dragIndex.value, 1)
  const [movedFile]  = files ? files.splice(dragIndex.value, 1) : [undefined]
  const [movedKey]   = keys ? keys.splice(dragIndex.value, 1) : [undefined]
  const [movedName]  = names.splice(dragIndex.value, 1)
  photos.splice(toIndex, 0, movedPhoto)
  if (files) files.splice(toIndex, 0, movedFile)
  if (keys) keys.splice(toIndex, 0, movedKey)
  names.splice(toIndex, 0, movedName as string)
  if (coverIndex.value === dragIndex.value) {
    coverIndex.value = toIndex
  } else if (dragIndex.value < coverIndex.value && toIndex >= coverIndex.value) {
    coverIndex.value--
  } else if (dragIndex.value > coverIndex.value && toIndex <= coverIndex.value) {
    coverIndex.value++
  }
  dragIndex.value = null
}
</script>