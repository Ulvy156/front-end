<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import type { UseMutationReturnType } from '@tanstack/vue-query'
import dayjs from 'dayjs'
import AdminRoleBadge from '~/features/admin/components/shared/AdminRoleBadge.vue'
import type { UserProfile } from '../types/profile'

const props = defineProps<{
  profile: UserProfile
  updateMutation: UseMutationReturnType<unknown, unknown, string, unknown>
}>()

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()

const isEditing = ref(false)

const nameRules: FormRules = {
  name: [{ required: true, message: () => t('profile.info.nameRequired'), trigger: 'blur' }],
}

const {
  formRef,
  form,
  rules,
  isSubmitting,
  handleSubmit,
  setFieldError,
  reset,
} = useForm({ name: props.profile.name }, nameRules)

watch(() => props.profile.name, (name) => {
  if (!isEditing.value) form.name = name
})

function startEdit() {
  form.name = props.profile.name
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
  reset()
  form.name = props.profile.name
}

const submitName = handleSubmit(async () => {
  if (form.name === props.profile.name) {
    isEditing.value = false
    return
  }
  try {
    await props.updateMutation.mutateAsync(form.name)
    success(t('profile.info.updateSuccess'))
    isEditing.value = false
  } catch (err) {
    setFieldError('name', extract(err))
  }
})
</script>

<template>
  <div class="space-y-4">
    <!-- Name -->
    <div>
      <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ $t('profile.info.name') }}</label>
      <div v-if="!isEditing" class="mt-1 flex items-center gap-2">
        <p class="text-sm text-gray-900">{{ profile.name }}</p>
        <el-button text size="small" @click="startEdit">
          <span class="text-xs text-blue-600">{{ $t('profile.info.edit') }}</span>
        </el-button>
      </div>
      <el-form v-else ref="formRef" :model="form" :rules="rules" class="mt-1" @submit.prevent="submitName">
        <el-form-item prop="name" class="mb-0!">
          <div class="flex items-center gap-2 w-full">
            <el-input v-model="form.name" size="default" class="max-w-xs" />
            <el-button type="primary" size="small" :loading="isSubmitting" native-type="submit">
              {{ $t('profile.save') }}
            </el-button>
            <el-button size="small" @click="cancelEdit">
              {{ $t('profile.cancel') }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- Email -->
    <div>
      <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ $t('profile.info.email') }}</label>
      <p class="mt-1 text-sm text-gray-900">{{ profile.email }}</p>
    </div>

    <!-- Role -->
    <div>
      <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ $t('profile.info.role') }}</label>
      <div class="mt-1">
        <AdminRoleBadge :role="profile.role" />
      </div>
    </div>

    <!-- Joined -->
    <div>
      <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ $t('profile.info.joined') }}</label>
      <p class="mt-1 text-sm text-gray-900">{{ dayjs(profile.createdAt).format('MMMM D, YYYY') }}</p>
    </div>

  </div>
</template>
