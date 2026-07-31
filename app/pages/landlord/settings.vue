<script lang="ts" setup>
import ProfileAvatar from '~/features/profile/components/profile-avatar.vue'
import ChangePassword from '~/features/profile/components/change-password.vue'
import ContactVisibility from '~/features/profile/components/contact-visibility.vue'
import PhoneManagement from '~/features/profile/components/phone-management.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import BaseEmpty from '~/components/ui/BaseEmpty.vue'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import AdminRoleBadge from '~/features/admin/components/shared/AdminRoleBadge.vue'
import { useProfile } from '~/features/profile/composables/useProfile'

definePageMeta({ middleware: 'landlord', layout: 'landlord' })

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()
const { profile, isPending, isError, updateName, uploadAvatar, deleteAvatar, changePassword, updateContactVisibility, addPhone, deletePhone } = useProfile()

const isEditingName = ref(false)
const editName = ref('')

function startEditName() {
  editName.value = profile.value?.name ?? ''
  isEditingName.value = true
}

function cancelEditName() {
  isEditingName.value = false
}

async function saveName() {
  if (!editName.value.trim()) return
  if (editName.value === profile.value?.name) {
    isEditingName.value = false
    return
  }
  try {
    await updateName.mutateAsync(editName.value)
    success(t('profile.info.updateSuccess'))
    isEditingName.value = false
  } catch (err) {
    notifyError(extract(err))
  }
}
</script>

<template>
  <!-- Loading -->
  <div v-if="isPending" class="space-y-4">
    <BaseSkeleton :rows="1" leading="circle" leading-size="64px" :lines="2" />
    <BaseSkeleton :rows="3" :lines="2" />
  </div>

  <!-- Error -->
  <div v-else-if="isError || !profile" class="py-16">
    <BaseEmpty />
  </div>

  <!-- Content -->
  <div v-else class="space-y-4">

    <!-- Profile header card -->
    <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div class="flex items-center gap-6">
        <ProfileAvatar
          :img-url="profile.imgUrl"
          :name="profile.name"
          :upload-mutation="uploadAvatar"
          :delete-mutation="deleteAvatar"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100">
        <div>
          <p class="text-xs text-gray-400 mb-1">{{ t('profile.info.name') }}</p>
          <div v-if="!isEditingName" class="flex items-center gap-2">
            <p class="text-sm font-medium text-gray-900">{{ profile.name }}</p>
            <BaseButton text size="small" @click="startEditName">
              <BaseIconClient name="pencil" :size="12" class="text-gray-400" />
            </BaseButton>
          </div>
          <div v-else class="flex items-center gap-2">
            <BaseInput v-model="editName" size="small" class="w-48" @keyup.enter="saveName" />
            <BaseButton type="primary" size="small" :loading="updateName.isPending.value" @click="saveName">{{ t('profile.save') }}</BaseButton>
            <BaseButton size="small" @click="cancelEditName">{{ t('profile.cancel') }}</BaseButton>
          </div>
        </div>
        <div>
          <p class="text-xs text-gray-400 mb-1">{{ t('profile.info.email') }}</p>
          <p class="text-sm font-medium text-gray-900">{{ profile.email }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-400 mb-1">{{ t('profile.info.role') }}</p>
          <AdminRoleBadge :role="profile.role" />
        </div>
      </div>
    </div>

    <!-- Two-column grid: Phones + Visibility -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div class="flex items-center gap-2 mb-4">
          <ClientOnly><BaseIconClient name="phone" :size="16" class="text-emerald-600" /></ClientOnly>
          <h3 class="text-sm font-semibold text-gray-900">{{ t('profile.phones.title') }}</h3>
        </div>
        <PhoneManagement :profile="profile" :add-mutation="addPhone" :delete-mutation="deletePhone" />
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div class="flex items-center gap-2 mb-4">
          <ClientOnly><BaseIconClient name="eye" :size="16" class="text-emerald-600" /></ClientOnly>
          <h3 class="text-sm font-semibold text-gray-900">{{ t('profile.visibility.title') }}</h3>
        </div>
        <ContactVisibility :profile="profile" :mutation="updateContactVisibility" />
      </div>
    </div>

    <!-- Security -->
    <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <ChangePassword :mutation="changePassword" />
    </div>
  </div>
</template>
