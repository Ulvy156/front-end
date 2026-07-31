<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.client.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import ConfigFormDrawer from './ConfigFormDrawer.vue'
import type { ConfigItemBase, ConfigFieldDef } from '../../types/configuration'

const props = defineProps<{
  title: string
  items: ConfigItemBase[] | undefined
  loading: boolean
  fields: ConfigFieldDef[]
  identifierField?: string
  createFn: (payload: Record<string, unknown>) => Promise<unknown>
  updateFn: (payload: Record<string, unknown>) => Promise<unknown>
  deleteFn: (id: number) => Promise<unknown>
}>()

const { t } = useI18n()
const { extract } = useErrorMsg()
const { success, error: notifyError } = useNotify()
const langKey = useLangKey()

const drawerOpen = ref(false)
const editItem = ref<Record<string, unknown> | null>(null)
const deletingId = ref<number | null>(null)

const idField = computed(() => props.identifierField ?? 'code')

function openCreate() {
  editItem.value = null
  drawerOpen.value = true
}

function openEdit(item: ConfigItemBase) {
  editItem.value = { ...item } as Record<string, unknown>
  drawerOpen.value = true
}

async function handleDelete(item: ConfigItemBase) {
  try {
    await ElMessageBox.confirm(
      t('admin.config.deleteConfirm', { name: item[langKey.value] }),
      t('admin.config.deleteTitle'),
      { type: 'warning', confirmButtonText: t('admin.config.delete'), cancelButtonText: t('admin.config.cancel') },
    )
  } catch { return }

  deletingId.value = item.id
  try {
    await props.deleteFn(item.id)
    success(t('admin.config.deleteSuccess'))
  } catch (err) { notifyError(extract(err)) }
  finally { deletingId.value = null }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <p class="text-sm text-gray-400">
        {{ t('admin.config.totalCount', { n: items?.length ?? 0 }) }}
      </p>
      <BaseButton type="primary" @click="openCreate">
        <BaseIcon name="plus" :size="15" class="mr-1" />
        {{ $t('admin.config.create') }}
      </BaseButton>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="bg-white rounded-xl border border-gray-200 p-5">
      <BaseSkeleton :rows="6" :lines="1" />
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <el-table :data="items ?? []" row-key="id">

        <el-table-column :label="$t('admin.config.columns.icon')" width="70" align="center">
          <template #default="{ row }">
            <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
              <BaseIcon :name="row.icon" :size="16" class="text-gray-500" />
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.config.columns.nameEn')">
          <template #default="{ row }">
            <span class="text-sm font-medium text-gray-900">{{ row.nameEn }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.config.columns.nameKh')" >
          <template #default="{ row }">
            <span class="text-sm text-gray-700">{{ row.nameKh }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.config.columns.identifier')" >
          <template #default="{ row }">
            <code class="text-xs bg-gray-50 px-2 py-0.5 rounded text-gray-600">{{ row[idField] }}</code>
          </template>
        </el-table-column>

        <el-table-column :label="$t('admin.users.columns.actions')" align="right">
          <template #default="{ row }">
            <div class="flex items-center justify-end gap-0.5">
              <el-tooltip :content="$t('admin.config.edit')" placement="top">
                <BaseButton text size="small" class="text-gray-500!" @click="openEdit(row)">
                  <BaseIcon name="pencil" :size="15" />
                </BaseButton>
              </el-tooltip>
              <el-tooltip :content="$t('admin.config.delete')" placement="top">
                <BaseButton text size="small" class="text-red-500!" :loading="deletingId === row.id" @click="handleDelete(row)">
                  <BaseIcon name="trash-2" :size="15" />
                </BaseButton>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Form Drawer -->
    <ConfigFormDrawer
      v-model="drawerOpen"
      :edit-item="editItem"
      :fields="fields"
      :create-fn="createFn"
      :update-fn="updateFn"
    />
  </div>
</template>
