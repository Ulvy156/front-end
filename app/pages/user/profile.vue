<script lang="ts" setup>
import ProfileAvatar from '~/features/profile/components/profile-avatar.vue'
import ProfileInfo from '~/features/profile/components/profile-info.vue'
import ChangePassword from '~/features/profile/components/change-password.vue'
import ContactVisibility from '~/features/profile/components/contact-visibility.vue'
import PhoneManagement from '~/features/profile/components/phone-management.vue'
import DeleteAccount from '~/features/profile/components/delete-account.vue'
import { useProfile } from '~/features/profile/composables/useProfile'
import { Role } from '~/types/role'

definePageMeta({
  layout: 'default',
  middleware: ['auth', () => {
    const { role } = useRole()
    if (role.value === Role.ADMIN) return navigateTo('/admin/settings', { replace: true })
    if (role.value === Role.LANDLORD) return navigateTo('/landlord/settings', { replace: true })
  }],
})

const { t } = useI18n()
const { extract } = useErrorMsg()
const { profile, isPending, isError, error, updateName, uploadAvatar, deleteAvatar, changePassword, updateContactVisibility, addPhone, deletePhone, requestDeletion, cancelDeletion } = useProfile()

useSeoMeta({
  title: `${t('profile.title')} | RokPteah`,
  robots: 'noindex',
})
</script>

<template>
  <section class="py-8 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-8">{{ $t('profile.title') }}</h1>

    <!-- Loading -->
    <div v-if="isPending" class="space-y-6">
      <div class="h-20 rounded-xl bg-gray-100 animate-pulse" />
      <div class="h-48 rounded-xl bg-gray-100 animate-pulse" />
    </div>

    <!-- Error -->
    <div v-else-if="isError || !profile" class="text-center py-16">
      <p class="text-gray-500">{{ extract(error) }}</p>
    </div>

    <!-- Content -->
    <div v-else class="space-y-6">
      <!-- Avatar card -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <h2 class="text-sm font-semibold text-gray-900 mb-4">{{ $t('profile.avatar.title') }}</h2>
        <ProfileAvatar
          :img-url="profile.imgUrl"
          :name="profile.name"
          :upload-mutation="uploadAvatar"
          :delete-mutation="deleteAvatar"
        />
      </div>

      <!-- Info card -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <h2 class="text-sm font-semibold text-gray-900 mb-4">{{ $t('profile.info.title') }}</h2>
        <ProfileInfo :profile="profile" :update-mutation="updateName" />
      </div>

      <!-- Phone management card (landlord/admin only) -->
      <div v-can="'landlord'" class="bg-white rounded-xl border border-gray-200 p-6">
        <h2 class="text-sm font-semibold text-gray-900 mb-4">{{ $t('profile.phones.title') }}</h2>
        <PhoneManagement :profile="profile" :add-mutation="addPhone" :delete-mutation="deletePhone" />
      </div>

      <!-- Contact visibility card -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <h2 class="text-sm font-semibold text-gray-900 mb-4">{{ $t('profile.visibility.title') }}</h2>
        <ContactVisibility :profile="profile" :mutation="updateContactVisibility" />
      </div>

      <!-- Security card -->
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <ChangePassword :mutation="changePassword" />
      </div>

      <!-- Danger zone -->
      <div class="bg-white rounded-xl border border-red-200 p-6">
        <DeleteAccount :profile="profile" :request-mutation="requestDeletion" :cancel-mutation="cancelDeletion" />
      </div>
    </div>
  </section>
</template>
