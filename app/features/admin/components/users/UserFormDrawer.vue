<script setup lang="ts">
import { Role } from '~/types/role'
import type { FormRules } from 'element-plus'
import type { AdminUser, CreateUserPayload, UpdateUserPayload } from '../../types/user'
import type { UseMutationReturnType } from '@tanstack/vue-query'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseDrawer from '~/components/ui/BaseDrawer.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'

const props = defineProps<{
  modelValue: boolean
  user: AdminUser | null
  createMutation: UseMutationReturnType<unknown, unknown, CreateUserPayload, unknown>
  updateMutation: UseMutationReturnType<unknown, unknown, UpdateUserPayload, unknown>
  defaultRole?: Role
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const isEditMode = computed(() => !!props.user)

const roleOptions = [
  { label: 'USER', value: Role.USER },
  { label: 'LANDLORD', value: Role.LANDLORD },
  { label: 'ADMIN', value: Role.ADMIN },
]

// ── Create form ──────────────────────────────────────────────
const createRules: FormRules = {
  name: [{ required: true, message: t('admin.users.form.nameRequired'), trigger: 'blur' }],
  email: [
    { required: true, message: t('admin.users.form.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('admin.users.form.emailInvalid'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('admin.users.form.passwordRequired'), trigger: 'blur' },
    {
      validator: (_rule, value: string, callback) => {
        if (!isStrongPassword(value)) callback(new Error(t('auth.passwordWeak')))
        else callback()
      },
      trigger: 'blur',
    },
  ],
  role: [{ required: true, message: t('admin.users.form.roleRequired'), trigger: 'change' }],
}

const {
  formRef: createFormRef,
  form: createForm,
  rules: createFormRules,
  isSubmitting: isCreating,
  handleSubmit: handleCreateSubmit,
  reset: resetCreate,
  setFieldError: setCreateError,
} = useForm({ name: '', email: '', password: '', role: (props.defaultRole ?? Role.USER) as Role }, createRules)

// ── Edit form ────────────────────────────────────────────────
const editRules: FormRules = {
  name: [{ required: true, message: t('admin.users.form.nameRequired'), trigger: 'blur' }],
  role: [{ required: true, message: t('admin.users.form.roleRequired'), trigger: 'change' }],
}

const {
  formRef: editFormRef,
  form: editForm,
  rules: editFormRules,
  isSubmitting: isUpdating,
  handleSubmit: handleEditSubmit,
  setFieldError: setEditError,
  reset: resetEdit,
} = useForm({ name: '', role: Role.USER as Role }, editRules)

// Sync edit form when user prop changes
watch(() => props.user, (user) => {
  if (user) {
    editForm.name = user.name
    editForm.role = user.role
  }
}, { immediate: true })

// Reset forms on close
watch(isOpen, (open) => {
  if (!open) {
    resetCreate()
    resetEdit()
  }
})

// ── Handlers ─────────────────────────────────────────────────
const submitCreate = handleCreateSubmit(async () => {
  try {
    await props.createMutation.mutateAsync({ ...createForm })
    success(t('admin.users.form.createSuccess'))
    isOpen.value = false
  } catch (err) {
    const message = extract(err)
    if (/password/i.test(message)) setCreateError('password', message)
    else if (/email/i.test(message)) setCreateError('email', message)
    else notifyError(message)
  }
})

const submitEdit = handleEditSubmit(async () => {
  if (!props.user) return
  try {
    await props.updateMutation.mutateAsync({ id: props.user.id, ...editForm })
    success(t('admin.users.form.updateSuccess'))
    isOpen.value = false
  } catch (err) {
    const message = extract(err)
    if (/name/i.test(message)) setEditError('name', message)
    else notifyError(message)
  }
})
</script>

<template>
  <BaseDrawer
    v-model="isOpen"
    :title="isEditMode ? $t('admin.users.edit') : $t('admin.users.create')"
    size="420px"
    direction="rtl"
    :destroy-on-close="true"
  >
    <!-- ── Create form ── -->
    <el-form
      v-if="!isEditMode"
      ref="createFormRef"
      :model="createForm"
      :rules="createFormRules"
      label-position="top"
      class="space-y-1"
      @submit.prevent="submitCreate"
    >
      <el-form-item :label="$t('admin.users.form.name')" prop="name">
        <BaseInput v-model="createForm.name" :placeholder="$t('admin.users.form.namePlaceholder')" />
      </el-form-item>

      <el-form-item :label="$t('admin.users.form.email')" prop="email">
        <BaseInput v-model="createForm.email" :placeholder="$t('admin.users.form.emailPlaceholder')" />
      </el-form-item>

      <el-form-item :label="$t('admin.users.form.password')" prop="password">
        <BaseInput
          v-model="createForm.password"
          type="password"
          show-password
          :placeholder="$t('admin.users.form.passwordPlaceholder')"
        />
      </el-form-item>

      <el-form-item :label="$t('admin.users.form.role')" prop="role">
        <BaseSelect v-model="createForm.role" :options="roleOptions" class="w-full" />
      </el-form-item>

      <div class="flex gap-2 pt-4">
        <BaseButton type="primary" :loading="isCreating" native-type="submit" class="flex-1">
          {{ $t('admin.users.form.create') }}
        </BaseButton>
        <BaseButton class="flex-1" @click="isOpen = false">
          {{ $t('admin.users.form.cancel') }}
        </BaseButton>
      </div>
    </el-form>

    <!-- ── Edit form ── -->
    <el-form
      v-else
      ref="editFormRef"
      :model="editForm"
      :rules="editFormRules"
      label-position="top"
      class="space-y-1"
      @submit.prevent="submitEdit"
    >
      <el-form-item :label="$t('admin.users.form.name')" prop="name">
        <BaseInput v-model="editForm.name" :placeholder="$t('admin.users.form.namePlaceholder')" />
      </el-form-item>

      <el-form-item :label="$t('admin.users.form.role')" prop="role">
        <BaseSelect v-model="editForm.role" :options="roleOptions" class="w-full" />
      </el-form-item>

      <div class="flex gap-2 pt-4">
        <BaseButton type="primary" :loading="isUpdating" native-type="submit" class="flex-1">
          {{ $t('admin.users.form.save') }}
        </BaseButton>
        <BaseButton class="flex-1" @click="isOpen = false">
          {{ $t('admin.users.form.cancel') }}
        </BaseButton>
      </div>
    </el-form>
  </BaseDrawer>
</template>
