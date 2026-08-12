<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { Role } from '~/types/role'
import dayjs from 'dayjs'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseVerifiedBadge from '~/components/ui/BaseVerifiedBadge.vue'
import BaseImage from '~/components/ui/BaseImage.vue'
import AdminRoleBadge from '~/features/admin/components/shared/AdminRoleBadge.vue'
import UserFormDrawer from '~/features/admin/components/users/UserFormDrawer.vue'
import LandlordPropertiesDrawer from '~/features/admin/components/landlords/LandlordPropertiesDrawer.vue'
import { useAdminLandlords } from '~/features/admin/composables/useAdminUsers'
import { initials } from '~/utils/initials'
import type { AdminUser } from '~/features/admin/types/user'

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()

// ── Filters & pagination ─────────────────────────────────────
const filters = ref({ search: '', page: 1, limit: 20 })
const searchInput = ref('')
let searchTimer: ReturnType<typeof setTimeout>

function onSearchInput(val: string) {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    filters.value = { ...filters.value, search: val, page: 1 }
  }, 300)
}

function onPageChange(page: number) {
  filters.value = { ...filters.value, page }
}

// ── Data ─────────────────────────────────────────────────────
const { data, isPending, createUser, updateUser, lockUser, unlockUser, deleteUser, grantBadge, revokeBadge } = useAdminLandlords(filters)

// ── Form drawer ───────────────────────────────────────────────
const formDrawerOpen = ref(false)
const editTarget = ref<AdminUser | null>(null)

function openCreate() {
  editTarget.value = null
  formDrawerOpen.value = true
}

function openEdit(user: AdminUser) {
  editTarget.value = user
  formDrawerOpen.value = true
}

// ── Properties drawer ─────────────────────────────────────────
const propertiesDrawerOpen = ref(false)
const viewingLandlordId = ref<string | null>(null)

function openProperties(user: AdminUser) {
  viewingLandlordId.value = user.id
  propertiesDrawerOpen.value = true
}

watch(propertiesDrawerOpen, (open) => {
  if (!open) viewingLandlordId.value = null
})

// ── Row actions ──────────────────────────────────────────────
const lockingUserId  = ref<string | null>(null)
const deletingUserId = ref<string | null>(null)

async function handleLockToggle(user: AdminUser) {
  lockingUserId.value = user.id
  try {
    if (user.isLocked) {
      await unlockUser.mutateAsync(user.id)
      success(t('admin.users.unlockSuccess', { name: user.name }))
    } else {
      await lockUser.mutateAsync(user.id)
      success(t('admin.users.lockSuccess', { name: user.name }))
    }
  } catch (err) {
    notifyError(extract(err))
  } finally {
    lockingUserId.value = null
  }
}

const verifyingUserId = ref<string | null>(null)

async function handleBadgeToggle(user: AdminUser) {
  verifyingUserId.value = user.id
  try {
    if (user.hasVerifiedBadge) {
      await revokeBadge.mutateAsync(user.id)
      success(t('admin.landlords.unverifySuccess', { name: user.name }))
    } else {
      await grantBadge.mutateAsync(user.id)
      success(t('admin.landlords.verifySuccess', { name: user.name }))
    }
  } catch (err) {
    notifyError(extract(err))
  } finally {
    verifyingUserId.value = null
  }
}

async function handleDelete(user: AdminUser) {
  try {
    await ElMessageBox.confirm(
      t('admin.users.deleteConfirm', { name: user.name }),
      t('admin.users.deleteTitle'),
      { type: 'warning', confirmButtonText: t('admin.users.deleteConfirmBtn'), cancelButtonText: t('admin.users.form.cancel') },
    )
  } catch { return }

  deletingUserId.value = user.id
  try {
    await deleteUser.mutateAsync(user.id)
    success(t('admin.users.deleteSuccess', { name: user.name }))
  } catch (err) {
    notifyError(extract(err))
  } finally {
    deletingUserId.value = null
  }
}

</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <p class="text-sm text-gray-400">
        {{ $t('admin.landlords.totalCount', { n: data?.meta.total ?? 0 }) }}
      </p>
      <BaseButton type="primary" @click="openCreate">
        <BaseIcon name="user-plus" :size="14" class="mr-1.5" />
        {{ $t('admin.landlords.create') }}
      </BaseButton>
    </div>

    <!-- Search -->
    <div class="mb-4">
      <BaseInput
        v-model="searchInput"
        :placeholder="$t('admin.users.searchPlaceholder')"
        clearable
        icon="search"
        class="max-w-72"
        @input="onSearchInput"
        @clear="onSearchInput('')"
      />
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <el-table
        v-loading="isPending"
        :data="data?.items ?? []"
        row-key="id"
        :row-class-name="({ row }) => row.isLocked ? 'opacity-60' : ''"
      >
        <el-table-column :label="$t('admin.users.columns.name')" min-width="350">
          <template #default="{ row }">
            <div class="flex items-center gap-3 py-1">
              <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0 overflow-hidden">
                <BaseImage v-if="row.imgUrl" :src="row.imgUrl" fit="cover" class="w-full h-full" :alt="row.name" />
                <span v-else>{{ initials(row.name) }}</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate flex items-center gap-1">
                  <span class="truncate">{{ row.name }}</span>
                  <BaseVerifiedBadge v-if="row.hasVerifiedBadge" :size="14" />
                </p>
                <p class="text-xs text-gray-400 truncate">{{ row.email }}</p>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.users.columns.role')" width="200">
          <template #default="{ row }">
            <AdminRoleBadge :role="row.role" />
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.users.columns.status')" width="200">
          <template #default="{ row }">
            <span v-if="row.isLocked" class="text-xs px-2 py-0.5 rounded-full font-medium bg-red-50 text-red-600">
              {{ $t('admin.users.locked') }}
            </span>
            <span v-else-if="!row.isVerified" class="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-600">
              {{ $t('admin.users.unverified') }}
            </span>
            <span v-else class="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700">
              {{ $t('admin.users.active') }}
            </span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.users.columns.joined')" width="200">
          <template #default="{ row }">
            <span class="text-xs text-gray-500">{{ dayjs(row.createdAt).format('MMM D, YYYY') }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.users.columns.actions')" width="250" align="left">
          <template #default="{ row }">
            <div class="flex items-center justify-end gap-0.5">
              <el-tooltip :content="$t('admin.landlords.viewProperties')" placement="top">
                <BaseButton text size="small" class="text-blue-500!" @click="openProperties(row)">
                  <BaseIcon color="gray" name="scan-search" :size="15" />
                </BaseButton>
              </el-tooltip>
              <el-tooltip :content="row.hasVerifiedBadge ? $t('admin.landlords.unverify') : $t('admin.landlords.verify')" placement="top">
                <BaseButton text size="small" class="text-emerald-600!" :loading="verifyingUserId === row.id" @click="handleBadgeToggle(row)">
                  <BaseIcon :name="row.hasVerifiedBadge ? 'shield-off' : 'shield-check'" :size="15" />
                </BaseButton>
              </el-tooltip>
              <el-tooltip :content="row.isLocked ? $t('admin.users.unlock') : $t('admin.users.lock')" placement="top">
                <BaseButton text size="small" :loading="lockingUserId === row.id" @click="handleLockToggle(row)">
                  <BaseIcon :name="row.isLocked ? 'lock-open' : 'lock'" :size="15" />
                </BaseButton>
              </el-tooltip>
              <el-tooltip :content="$t('admin.users.editAction')" placement="top">
                <BaseButton text size="small" @click="openEdit(row)">
                  <BaseIcon name="pencil" :size="15" />
                </BaseButton>
              </el-tooltip>
              <el-tooltip :content="$t('admin.users.deleteAction')" placement="top">
                <BaseButton text size="small" class="text-red-500!" :loading="deletingUserId === row.id" @click="handleDelete(row)">
                  <BaseIcon name="trash-2" :size="15" />
                </BaseButton>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="data && data.meta.totalPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <p class="text-xs text-gray-400">
          {{ $t('admin.users.showing', {
            from: (data.meta.page - 1) * data.meta.limit + 1,
            to: Math.min(data.meta.page * data.meta.limit, data.meta.total),
            total: data.meta.total,
          }) }}
        </p>
        <el-pagination
          :current-page="data.meta.page"
          :page-size="data.meta.limit"
          :total="data.meta.total"
          layout="prev, pager, next"
          @current-change="onPageChange"
        />
      </div>
    </div>

    <UserFormDrawer
      v-model="formDrawerOpen"
      :user="editTarget"
      :default-role="Role.LANDLORD"
      :create-mutation="createUser"
      :update-mutation="updateUser"
    />

    <LandlordPropertiesDrawer
      v-model="propertiesDrawerOpen"
      :landlord-id="viewingLandlordId"
    />
  </div>
</template>
