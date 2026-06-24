<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import { useAdminReports } from '../../composables/useAdminReports'
import type { AdminReport, AdminReportsFilter } from '../../types/report'

dayjs.extend(relativeTime)

const { t } = useI18n()
const langKey = useLangKey()
const notify = useNotify()
const { extract } = useErrorMsg()

const filter = ref<AdminReportsFilter>({ page: 1, limit: 10 })
const { data, isPending, reportTypes, remove } = useAdminReports(filter)

const typeFilter = ref<number | null>(null)

function onTypeFilter(id: number) {
  typeFilter.value = typeFilter.value === id ? null : id
  filter.value = { ...filter.value, page: 1, reportTypeId: typeFilter.value ?? undefined }
}

function onPageChange(page: number) {
  filter.value = { ...filter.value, page }
}

const deletingId = ref<number | null>(null)

async function handleDelete(report: AdminReport) {
  deletingId.value = report.id
  try {
    await remove.mutateAsync(report.id)
    notify.success(t('admin.reports.deleteSuccess'))
  } catch (err) {
    notify.error(extract(err))
  } finally {
    deletingId.value = null
  }
}

const typeBadgeClass: Record<string, string> = {
  'alert-triangle': 'bg-red-50 text-red-600',
  'ban': 'bg-orange-50 text-orange-600',
  'copy': 'bg-blue-50 text-blue-600',
  'info': 'bg-gray-100 text-gray-500',
}

function badgeClass(icon: string) {
  return typeBadgeClass[icon] || 'bg-gray-100 text-gray-500'
}

const expandedId = ref<number | null>(null)
function toggleExpand(id: number) {
  expandedId.value = expandedId.value === id ? null : id
}
</script>

<template>
  <div>
    <p class="text-sm text-gray-400 mb-4">
      {{ t('admin.reports.totalCount', { n: data?.meta?.total ?? 0 }) }}
    </p>

    <!-- Type filter cards -->
    <div v-if="reportTypes?.length" class="flex flex-wrap gap-3 mb-4">
      <button
        v-for="rt in reportTypes"
        :key="rt.id"
        class="flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors cursor-pointer"
        :class="typeFilter === rt.id ? 'border-gray-400 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'"
        @click="onTypeFilter(rt.id)"
      >
        <div class="w-7 h-7 rounded-lg flex items-center justify-center" :class="badgeClass(rt.icon)">
          <BaseIcon :name="rt.icon" :size="14" />
        </div>
        <span class="text-sm text-gray-700">{{ rt[langKey] }}</span>
      </button>
    </div>

    <!-- Skeleton -->
    <div v-if="isPending" class="bg-white rounded-xl border border-gray-200 p-5">
      <BaseSkeleton :rows="6" :lines="2" />
    </div>

    <!-- Empty -->
    <div v-else-if="!data?.items?.length" class="bg-white rounded-xl border border-gray-200 p-10 text-center">
      <BaseIcon name="inbox" :size="32" class="text-gray-300 mx-auto mb-2" />
      <p class="text-sm text-gray-400">{{ t('admin.reports.empty') }}</p>
    </div>

    <!-- Reports list -->
    <div v-else class="space-y-3">
      <div
        v-for="item in data.items"
        :key="item.id"
        class="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors cursor-pointer"
        @click="toggleExpand(item.id)"
      >
        <div class="flex items-start gap-3">
          <!-- Type badge -->
          <span
            class="text-xs px-2 py-1 rounded-full font-medium shrink-0 flex items-center gap-1"
            :class="badgeClass(item.reportType.icon)"
          >
            <BaseIcon :name="item.reportType.icon" :size="12" />
            {{ item.reportType[langKey] }}
          </span>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p
              class="text-sm text-gray-700"
              :class="expandedId === item.id ? '' : 'line-clamp-2'"
            >
              {{ item.description }}
            </p>
            <div class="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
              <span class="flex items-center gap-1">
                <BaseIcon name="user" :size="12" />
                {{ item.user.name }}
              </span>
              <span>{{ item.user.email }}</span>
              <span class="flex items-center gap-1">
                <BaseIcon name="building" :size="12" />
                <span class="max-w-40 truncate">{{ item.property.title }}</span>
              </span>
              <span class="ml-auto">{{ dayjs(item.createdAt).fromNow() }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 shrink-0" @click.stop>
            <el-popconfirm
              :title="t('admin.reports.confirmDelete')"
              :confirm-button-text="t('admin.reports.delete')"
              :cancel-button-text="t('property.reportDialog.cancel')"
              @confirm="handleDelete(item)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  size="small"
                  :icon="''"
                  :loading="deletingId === item.id"
                  circle
                >
                  <BaseIcon name="trash-2" :size="14" />
                </el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="data?.meta && data.meta.totalPages > 1" class="flex justify-center mt-6">
      <el-pagination
        :current-page="data.meta.page"
        :page-size="data.meta.limit"
        :total="data.meta.total"
        layout="prev, pager, next"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>
