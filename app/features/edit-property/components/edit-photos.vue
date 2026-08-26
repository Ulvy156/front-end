<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
    <div class="mb-4">
      <h2 class="text-lg font-medium text-gray-900 mb-0.5">{{ t('landlord.editProperty.photos') }}</h2>
      <p class="text-sm text-gray-500">{{ t('landlord.editProperty.photosSubtitle') }}</p>
    </div>

    <hr class="border-gray-200 mb-5">

    <!-- Photo count status -->
    <div
      :class="hasEnoughPhotos
        ? 'bg-emerald-50 border-emerald-200 text-(--nav-active-item)'
        : 'bg-amber-50 border-amber-200 text-amber-700'"
      class="flex items-center gap-2 border rounded-xl px-3.5 py-2.5 mb-5 text-[13px] font-semibold"
    >
      <BaseIconClient :name="hasEnoughPhotos ? 'circle-check-big' : 'triangle-alert'" :size="16" class="shrink-0" />
      <span>
        {{ hasEnoughPhotos
          ? t('post_property.photos.enough_photos', { count: photoUrls.length })
          : t('post_property.photos.need_more_photos', { count: Math.max(0, 3 - photoUrls.length) }) }}
      </span>
    </div>

    <!-- Existing images -->
    <div v-if="existingImages.length" class="mb-6">
      <p class="text-sm font-medium text-gray-700 mb-3">
        {{ t('landlord.editProperty.currentPhotos') }} ({{ existingImages.length }})
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          v-for="img in existingImages"
          :key="img.id"
          class="relative group rounded-lg overflow-hidden border-2 transition"
          :class="img.removed ? 'border-gray-200 opacity-40' : (img.isCover ? 'border-emerald-500' : 'border-gray-200')"
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
          <span
            v-if="img.removed"
            class="absolute top-1.5 left-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-md font-medium"
          >
            {{ t('landlord.editProperty.willBeRemoved') }}
          </span>

          <!-- Actions overlay -->
          <div
            class="absolute inset-0 bg-black/40 transition flex items-center justify-center gap-2"
            :class="img.removed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
          >
            <BaseButton
              v-if="!img.removed && !img.isCover"
              circle
              size="small"
              type="info"
              :title="t('landlord.editProperty.setCover')"
              @click="setCoverExisting(img.id)"
            >
              <BaseIconClient name="star" :size="14" class="text-emerald-600" />
            </BaseButton>
            <BaseButton
              circle
              size="small"
              :type="img.removed ? 'success' : 'danger'"
              :title="img.removed ? t('landlord.editProperty.undoRemove') : t('landlord.editProperty.deletePhoto')"
              @click="toggleRemoveExisting(img.id)"
            >
              <BaseIconClient :name="img.removed ? 'rotate-ccw' : 'trash-2'" :size="14" />
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload new photos -->
    <div>
      <p class="text-sm font-medium text-gray-700 mb-3">{{ t('landlord.editProperty.addPhotos') }}</p>
      <el-form-item prop="photos">
        <div
          class="border-2 border-dashed border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30 rounded-xl flex flex-col items-center justify-center py-8 cursor-pointer transition w-full"
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
      </el-form-item>
    </div>

    <!-- Newly added photos (uploaded together on Save) -->
    <div v-if="form.photoFiles.length" class="mt-4 space-y-2">
      <p class="text-sm font-medium text-gray-700">
        {{ t('landlord.editProperty.newPhotos') }} ({{ form.photoFiles.length }})
      </p>
      <div
        v-for="(file, index) in form.photoFiles"
        :key="form.photoFileIds[index]"
        class="flex items-center gap-3 border rounded-xl px-3 py-2.5"
        :class="form.coverFileId === form.photoFileIds[index] ? 'border-emerald-400 bg-emerald-50/30' : 'border-gray-200'"
      >
        <div class="relative shrink-0">
          <img :src="pendingPreviews[index]" class="w-14 h-14 object-cover rounded-lg" />
          <span
            v-if="form.coverFileId === form.photoFileIds[index]"
            class="absolute -top-1.5 -left-1.5 bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-md font-medium leading-tight"
          >
            {{ t('landlord.editProperty.cover') }}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-700 truncate">{{ file.name }}</p>
          <p class="text-xs text-gray-400">{{ formatFileSize(file.size) }}</p>
        </div>
        <BaseButton
          v-if="form.coverFileId !== form.photoFileIds[index]"
          text
          circle
          size="small"
          type="info"
          :title="t('landlord.editProperty.setCover')"
          @click="setCoverPending(form.photoFileIds[index])"
        >
          <BaseIconClient name="star" :size="14" />
        </BaseButton>
        <BaseButton text circle size="small" type="info" @click="removePending(index)">
          <BaseIconClient name="x" :size="14" class="text-gray-400" />
        </BaseButton>
      </div>
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
import { exceedsFileSize, formatFileSize } from '~/utils/fileSize'

const props = defineProps<{
  propertyId: string
  images: Array<{ id: string; imageKey: string; isCover: boolean }>
  form: any
}>()

const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()

const fileInput = ref<HTMLInputElement | null>(null)
// Keyed by index into form.photoFiles, not a separate id — previews are pure
// display state and get regenerated on mount (see below), so index alignment
// only needs to hold within a single mounted lifetime of this component.
const pendingPreviews = ref<string[]>([])

// form.photoFiles/photoFileIds/removeImageIds/coverImageId/coverFileId live on
// the parent's form object (see useEditProperty.mapPropertyToForm) so staged
// photo edits survive navigating to another step and back — this component
// gets unmounted/remounted by edit-section.vue's v-else-if on every step
// change, so any state kept only in local refs here would be lost.
onMounted(() => {
  props.form.photoFiles.forEach((file: File, index: number) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      pendingPreviews.value[index] = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
})

const existingImages = computed(() => {
  return (props.images ?? []).map((img) => {
    const removed = props.form.removeImageIds.includes(img.id)
    const isCover = !removed && (
      props.form.coverImageId
        ? props.form.coverImageId === img.id
        : (!props.form.coverFileId && img.isCover)
    )
    return { ...img, removed, isCover }
  })
})

const photoUrls = computed(() => [
  ...existingImages.value.filter((img) => !img.removed).map((img) => `${runtimeConfig.public.R2_PUB_URL}/${img.imageKey}`),
  ...pendingPreviews.value,
])

watch(photoUrls, (urls) => {
  props.form.photos = urls
}, { immediate: true })

const hasEnoughPhotos = computed(() => photoUrls.value.length >= 3)

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
    const index = props.form.photoFiles.length
    props.form.photoFiles.push(file)
    props.form.photoFileIds.push(crypto.randomUUID())
    const reader = new FileReader()
    reader.onload = (e) => {
      pendingPreviews.value[index] = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function removePending(index: number) {
  const fileId = props.form.photoFileIds[index]
  props.form.photoFiles.splice(index, 1)
  props.form.photoFileIds.splice(index, 1)
  pendingPreviews.value.splice(index, 1)
  if (props.form.coverFileId === fileId) props.form.coverFileId = null
}

function toggleRemoveExisting(imageId: string) {
  const index = props.form.removeImageIds.indexOf(imageId)
  if (index !== -1) {
    props.form.removeImageIds.splice(index, 1)
    return
  }
  props.form.removeImageIds.push(imageId)
  if (props.form.coverImageId === imageId) props.form.coverImageId = null
}

function setCoverExisting(imageId: string) {
  props.form.coverImageId = imageId
  props.form.coverFileId = null
}

function setCoverPending(fileId: string) {
  props.form.coverFileId = fileId
  props.form.coverImageId = null
}
</script>
