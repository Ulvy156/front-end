<script setup lang="ts">
import AdminConfigurationView from '~/features/admin/components/configuration/AdminConfigurationView.vue'
import { useAdminCrud } from '~/features/admin/composables/useAdminCrud'
import type { HouseRuleItem, ConfigFieldDef } from '~/features/admin/types/configuration'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { t } = useI18n()

const { data, isPending, create, update, remove } = useAdminCrud<HouseRuleItem>('house-rules')

const fields = computed<ConfigFieldDef[]>(() => [
  { prop: 'key', label: t('admin.config.fields.key'), placeholder: 'GUESTS' },
  { prop: 'nameEn', label: t('admin.config.fields.nameEn'), placeholder: 'Guests' },
  { prop: 'nameKh', label: t('admin.config.fields.nameKh'), placeholder: 'ភ្ញៀវ' },
  { prop: 'icon', label: t('admin.config.fields.icon'), placeholder: 'guests' },
])
</script>

<template>
  <AdminConfigurationView
    :title="t('admin.nav.houseRules')"
    :items="data"
    :loading="isPending"
    :fields="fields"
    identifier-field="key"
    :create-fn="(p) => create.mutateAsync(p as any)"
    :update-fn="(p) => update.mutateAsync(p as any)"
    :delete-fn="(id) => remove.mutateAsync(id)"
  />
</template>
