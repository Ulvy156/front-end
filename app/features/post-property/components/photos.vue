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
        <span v-if="formErrors.photos" class="text-red-500 text-xs font-normal ml-1">
          {{ formErrors.photos }}
        </span>
      </label>
      <p class="text-xs text-gray-400 mt-0.5">{{ t('post_property.photos.cover_hint') }}</p>
    </div>

    <!-- Upload area -->
    <div
      :class="formErrors.photos
        ? 'border-red-300 hover:border-red-400'
        : 'border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30'"
      class="border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-10 mb-5 cursor-pointer transition"
      @click="fileInput?.click(); formErrors.photos = ''"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <div class="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center mb-3 bg-white">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4"/>
        </svg>
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

    <!-- Photo Guidelines -->
    <div class="bg-gray-50 rounded-lg px-4 py-3 mb-5 border border-gray-100">
      <p class="text-xs font-medium text-emerald-700 flex items-center gap-1.5 mb-2">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 15a1 1 0 110-2 1 1 0 010 2zm1-4h-2V7h2v6z"/>
        </svg>
        {{ t('post_property.photos.guidelines_title') }}
      </p>
      <ul class="text-xs text-gray-500 space-y-1 list-disc pl-4">
        <li>{{ t('post_property.photos.guideline_1') }}</li>
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
        @dragstart="dragStart(index)"
        @dragover.prevent
        @drop.prevent="dragDrop(index)"
      >
        <svg class="w-4 h-4 text-gray-300 shrink-0 cursor-grab" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/>
          <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
          <circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
        </svg>

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
            {{ t('post_property.photos.photo_label') }} {{ index + 1 }}
          </p>
          <p class="text-xs text-gray-400 truncate">{{ photoNames[index] || '' }}</p>
        </div>

        <BaseButton
          text
          circle
          size="small"
          :type="index === coverIndex ? 'warning' : 'info'"
          @click="setCover(index)"
        >
          <BaseIconClient name="star" :size="16" />
        </BaseButton>

        <BaseButton text circle size="small" type="info" @click="removePhoto(index)">
          <BaseIconClient name="x" :size="14" />
        </BaseButton>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'

const { t } = useI18n()

const form       = inject<any>('postPropertyForm', {})
const formErrors = inject<any>('formErrors', {})

const fileInput  = ref<HTMLInputElement | null>(null)
const coverIndex = ref(0)
const photoNames = ref<string[]>([])
const dragIndex  = ref<number | null>(null)

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

function loadFiles(files: File[]) {
  if (!form.photos) form.photos = []
  if (!form.photoFiles) form.photoFiles = []
  for (const file of files) {
    if (form.photos.length >= 20) {
      break
    }
    if (file.size > 10 * 1024 * 1024) {
      continue
    }
    photoNames.value.push(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      form.photos.push(e.target?.result as string)
      form.photoFiles.push(file)
      if (form.photos.length >= 3) formErrors.photos = ''
      console.log('Photo loaded:', file.name, 'Total photos:', form.photos.length)
    }
    reader.readAsDataURL(file)
  }
}

function setCover(index: number) {
  coverIndex.value = index
  console.log('Cover photo set to index:', index)
}

function removePhoto(index: number) {
  form.photos?.splice(index, 1)
  form.photoFiles?.splice(index, 1)
  photoNames.value.splice(index, 1)
  if (coverIndex.value >= form.photos.length) coverIndex.value = 0
  console.log('Photo removed at index:', index, 'Total photos:', form.photos.length)
}

function dragStart(index: number) {
  dragIndex.value = index
}

function dragDrop(toIndex: number) {
  if (dragIndex.value === null || dragIndex.value === toIndex) return
  const photos = form.photos
  const names  = photoNames.value
  const [movedPhoto] = photos.splice(dragIndex.value, 1)
  const [movedName]  = names.splice(dragIndex.value, 1)
  photos.splice(toIndex, 0, movedPhoto)
  names.splice(toIndex, 0, movedName)
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