<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import BaseImage from '~/components/ui/BaseImage.vue'
import AdminRoleBadge from '~/features/admin/components/shared/AdminRoleBadge.vue'
import { useAdminDeletionRequests } from '~/features/admin/composables/useAdminDeletionRequests'
import { initials } from '~/utils/initials'
import { Role } from '~/types/role'
import type { DeletionRequestItem } from '~/features/admin/types/user'

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()

// ── Filters & pagination ─────────────────────────────────────
const filters = ref({ search: '', role: '' as Role | '', page: 1, limit: 20 })
const searchInput = ref('')
let searchTimer: ReturnType<typeof setTimeout>

function onSearchInput(val: string) {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    filters.value = { ...filters.value, search: val, page: 1 }
  }, 300)
}

const roleFilter = ref<'all' | Role>('all')
const roleOptions = computed(() => [
  { label: t('admin.deletionRequests.roleFilterAll'), value: 'all' },
  { label: Role.USER, value: Role.USER },
  { label: Role.LANDLORD, value: Role.LANDLORD },
  { label: Role.ADMIN, value: Role.ADMIN },
])
watch(roleFilter, (val) => {
  filters.value = { ...filters.value, role: val === 'all' ? '' : val, page: 1 }
})

function onPageChange(page: number) {
  filters.value = { ...filters.value, page }
}

// ── Data ─────────────────────────────────────────────────────
const { data, isPending, approveDeletion } = useAdminDeletionRequests(filters)

// ── Row actions ──────────────────────────────────────────────
const approvingId = ref<string | null>(null)

async function handleApprove(row: DeletionRequestItem) {
  try {
    await ElMessageBox.confirm(
      t('admin.deletionRequests.approveConfirm', { name: row.name }),
      t('admin.deletionRequests.approveTitle'),
      { type: 'warning', confirmButtonText: t('admin.deletionRequests.approveConfirmBtn'), cancelButtonText: t('admin.users.form.cancel') },
    )
  } catch { return }

  approvingId.value = row.id
  try {
    await approveDeletion.mutateAsync(row.id)
    success(t('admin.deletionRequests.approveSuccess'))
  } catch (err) {
    const status = (err as { response?: { status?: number } })?.response?.status
    // 404/409 means someone else already acted on this row (approved it, or
    // the user cancelled) — the mutation already refetches, so just explain.
    if (status === 404 || status === 409 || status === 400) {
      notifyError(t('admin.deletionRequests.approveConflict'))
    } else {
      notifyError(extract(err))
    }
  } finally {
    approvingId.value = null
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <p class="text-sm text-gray-400">
        {{ $t('admin.deletionRequests.totalCount', { n: data?.meta.total ?? 0 }) }}
      </p>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-4">
      <BaseInput
        v-model="searchInput"
        :placeholder="$t('admin.deletionRequests.searchPlaceholder')"
        clearable
        icon="search"
        class="max-w-72"
        @input="onSearchInput"
        @clear="onSearchInput('')"
      />
      <BaseSelect v-model="roleFilter" :options="roleOptions" class="w-40" />
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <el-table v-loading="isPending" :data="data?.items ?? []" row-key="id">
        <el-table-column :label="$t('admin.deletionRequests.columns.name')" min-width="220">
          <template #default="{ row }">
            <div class="flex items-center gap-3 py-1">
              <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0 overflow-hidden">
                <BaseImage v-if="row.imgUrl" :src="row.imgUrl" fit="cover" class="w-full h-full" :alt="row.name" />
                <span v-else>{{ initials(row.name) }}</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ row.name }}</p>
                <p class="text-xs text-gray-400 truncate">{{ row.email }}</p>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.deletionRequests.columns.role')" width="110">
          <template #default="{ row }">
            <AdminRoleBadge :role="row.role" />
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.deletionRequests.columns.requestedAt')" width="140">
          <template #default="{ row }">
            <span class="text-xs text-gray-500">{{ dayjs(row.deletionRequestedAt).format('MMM D, YYYY') }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.deletionRequests.columns.scheduledFor')" width="160">
          <template #default="{ row }">
            <span class="text-xs text-gray-500">{{ dayjs(row.deletionScheduledFor).format('MMM D, YYYY') }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.deletionRequests.columns.actions')" width="140" align="right">
          <template #default="{ row }">
            <div class="flex items-center justify-end">
              <el-tooltip :content="$t('admin.deletionRequests.approveAction')" placement="top">
                <BaseButton text size="small" class="text-red-500!" :loading="approvingId === row.id" @click="handleApprove(row)">
                  <BaseIcon name="trash-2" :size="15" class="mr-1" />
                  {{ $t('admin.deletionRequests.approveAction') }}
                </BaseButton>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <template #empty>
          <p class="text-sm text-gray-400 py-8">{{ $t('admin.deletionRequests.empty') }}</p>
        </template>
      </el-table>

      <div v-if="data && data.meta.totalPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <p class="text-xs text-gray-400">
          {{ $t('admin.deletionRequests.showing', {
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
  </div>
</template>
