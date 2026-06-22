<script setup lang="ts">
import AdminConfigurationView from '~/features/admin/components/configuration/AdminConfigurationView.vue'
import { useAdminCrud } from '~/features/admin/composables/useAdminCrud'
import type { PropertyTypeItem, ConfigFieldDef } from '~/features/admin/types/configuration'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { t } = useI18n()

const { data, isPending, create, update, remove } = useAdminCrud<PropertyTypeItem>('property-types')

const fields = computed<ConfigFieldDef[]>(() => [
  { prop: 'code', label: t('admin.config.fields.code'), placeholder: 'STUDIO' },
  { prop: 'nameEn', label: t('admin.config.fields.nameEn'), placeholder: 'Studio' },
  { prop: 'nameKh', label: t('admin.config.fields.nameKh'), placeholder: 'ស្ទូឌីយ៉ូ' },
  { prop: 'slug', label: t('admin.config.fields.slug'), placeholder: 'studio' },
  { prop: 'icon', label: t('admin.config.fields.icon'), placeholder: 'studio' },
])
</script>

<template>
  <AdminConfigurationView
    :title="t('admin.nav.propertyTypes')"
    :items="data"
    :loading="isPending"
    :fields="fields"
    identifier-field="code"
    :create-fn="(p) => create.mutateAsync(p as any)"
    :update-fn="(p) => update.mutateAsync(p as any)"
    :delete-fn="(id) => remove.mutateAsync(id)"
  />
</template>
