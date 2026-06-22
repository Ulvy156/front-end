<script lang="ts" setup>
import type { UseMutationReturnType } from '@tanstack/vue-query'
import { ElMessageBox } from 'element-plus'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import { initials as getInitials } from '~/utils/initials'

const props = defineProps<{
  imgUrl: string | null
  name: string
  uploadMutation: UseMutationReturnType<unknown, unknown, File, unknown>
  deleteMutation: UseMutationReturnType<unknown, unknown, void, unknown>
}>()

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()

const fileInput = ref<HTMLInputElement>()

const isUploading = computed(() => props.uploadMutation.isPending.value)
const isDeleting = computed(() => props.deleteMutation.isPending.value)

const userInitials = computed(() => getInitials(props.name))

function triggerUpload() {
  fileInput.value?.click()
}

async function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (file.size > 1024 * 1024) {
    notifyError(t('profile.avatar.tooLarge'))
    return
  }

  if (!file.type.startsWith('image/')) {
    notifyError(t('profile.avatar.invalidType'))
    return
  }

  try {
    await props.uploadMutation.mutateAsync(file)
    success(t('profile.avatar.uploadSuccess'))
  } catch (err) {
    notifyError(extract(err))
  } finally {
    if (fileInput.value) fileInput.value.value = ''
  }
}

async function handleDelete() {
  try {
    await ElMessageBox.confirm(
      t('profile.avatar.deleteConfirm'),
      t('profile.avatar.deleteTitle'),
      { type: 'warning', confirmButtonText: t('profile.avatar.deleteBtn'), cancelButtonText: t('profile.cancel') },
    )
  } catch { return }

  try {
    await props.deleteMutation.mutateAsync()
    success(t('profile.avatar.deleteSuccess'))
  } catch (err) {
    notifyError(extract(err))
  }
}
</script>

<template>
  <div class="flex items-center gap-5">
    <div class="relative">
      <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-500 overflow-hidden ring-2 ring-gray-200">
        <img v-if="imgUrl" :src="imgUrl" class="w-full h-full object-cover" :alt="name" />
        <span v-else>{{ userInitials }}</span>
      </div>
      <div v-if="isUploading || isDeleting" class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
        <BaseIcon name="loader-2" :size="20" class="text-white animate-spin" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <el-button size="small" @click="triggerUpload" :disabled="isUploading">
        <BaseIcon name="upload" :size="14" class="mr-1.5" />
        {{ $t('profile.avatar.upload') }}
      </el-button>
      <el-button v-if="imgUrl" size="small" type="danger" plain @click="handleDelete" :disabled="isDeleting">
        <BaseIcon name="trash-2" :size="14" class="mr-1.5" />
        {{ $t('profile.avatar.remove') }}
      </el-button>
      <p class="text-xs text-gray-400">{{ $t('profile.avatar.hint') }}</p>
    </div>

    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
  </div>
</template>
