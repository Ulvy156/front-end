<script lang="ts" setup>
import type { UseMutationReturnType } from '@tanstack/vue-query'
import type { FormRules } from 'element-plus'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'
import type { NewPhone, UserProfile } from '../types/profile'

const MAX_PHONES = 3

const props = defineProps<{
  profile: UserProfile
  addMutation: UseMutationReturnType<NewPhone, unknown, string, unknown>
  deleteMutation: UseMutationReturnType<number, unknown, number, unknown>
}>()

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()

const phones = computed(() =>
  props.profile.phones.filter(p => p.type === 'PHONE'),
)

const telegramEntries = computed(() =>
  props.profile.phones.filter(p => p.type === 'TELEGRAM'),
)

const isLimitReached = computed(() => phones.value.length >= MAX_PHONES)

const isAdding = ref(false)
const deletingId = ref<number | null>(null)

const phoneRules: FormRules = {
  phoneNumber: [
    { required: true, message: () => t('profile.phones.required'), trigger: 'blur' },
    { pattern: /^0\d{7,9}$/, message: () => t('profile.phones.invalidFormat'), trigger: 'blur' },
  ],
}

const {
  formRef,
  form,
  rules,
  isSubmitting,
  handleSubmit,
  setFieldError,
  reset,
} = useForm({ phoneNumber: '' }, phoneRules)

function startAdding() {
  reset()
  form.phoneNumber = ''
  isAdding.value = true
}

function cancelAdding() {
  isAdding.value = false
  reset()
}

const submitPhone = handleSubmit(async () => {
  try {
    await props.addMutation.mutateAsync(form.phoneNumber)
    success(t('profile.phones.addSuccess'))
    isAdding.value = false
    reset()
  } catch (err) {
    setFieldError('phoneNumber', extract(err))
  }
})

async function removePhone(id: number) {
  deletingId.value = id
  try {
    await props.deleteMutation.mutateAsync(id)
    success(t('profile.phones.deleteSuccess'))
  } catch (err) {
    notifyError(extract(err))
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Phone list -->
    <div>
      <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {{ $t('profile.phones.phoneNumbers') }}
      </label>
      <p v-if="phones.length === 0 && !isAdding" class="mt-1 text-sm text-gray-400">
        {{ $t('profile.phones.noPhones') }}
      </p>
      <div class="mt-2 space-y-2">
        <div
          v-for="phone in phones"
          :key="phone.id"
          class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
        >
          <div class="flex items-center gap-x-3">
            <BaseIconClient name="phone" :size="16" class="text-gray-500" />
            <span class="text-sm text-gray-900">{{ phone.phoneNumber }}</span>
          </div>
          <el-button
            text
            size="small"
            :loading="deletingId === phone.id"
            @click="removePhone(phone.id)"
          >
            <BaseIconClient v-if="deletingId !== phone.id" name="trash-2" :size="16" class="text-red-500" />
          </el-button>
        </div>
      </div>
    </div>

    <!-- Add phone form -->
    <el-form
      v-if="isAdding"
      ref="formRef"
      :model="form"
      :rules="rules"
      @submit.prevent="submitPhone"
    >
      <el-form-item prop="phoneNumber" class="mb-0!">
        <div class="flex items-center gap-2 w-full">
          <el-input
            v-model="form.phoneNumber"
            :placeholder="$t('profile.phones.placeholder')"
            size="default"
            class="max-w-xs"
          />
          <el-button type="primary" size="small" :loading="isSubmitting" native-type="submit">
            {{ $t('profile.save') }}
          </el-button>
          <el-button size="small" @click="cancelAdding">
            {{ $t('profile.cancel') }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>

    <el-button
      v-if="!isAdding"
      size="small"
      :disabled="isLimitReached"
      @click="startAdding"
    >
      <BaseIconClient name="plus" :size="14" class="mr-1" />
      {{ $t('profile.phones.add') }}
    </el-button>
    <p v-if="isLimitReached && !isAdding" class="text-xs text-gray-400">
      {{ $t('profile.phones.limitReached', { max: MAX_PHONES }) }}
    </p>

    <!-- Telegram (read-only) -->
    <div v-if="telegramEntries.length > 0">
      <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {{ $t('profile.phones.telegram') }}
      </label>
      <div class="mt-2 space-y-2">
        <div
          v-for="tg in telegramEntries"
          :key="tg.id"
          class="flex items-center gap-x-3 bg-gray-50 rounded-lg px-4 py-3"
        >
          <BaseIconClient name="message-square-text" :size="16" class="text-gray-500" />
          <span class="text-sm text-gray-900">{{ tg.phoneNumber }}</span>
          <span class="text-xs text-gray-400 ml-auto">{{ $t('profile.phones.managedByTelegram') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
