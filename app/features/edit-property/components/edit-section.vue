<template>
  <section class="w-full px-4 mt-6 md:w-[80%] md:px-0 md:mt-10 m-auto">
    <!-- Loading -->
    <div v-if="isPending" class="space-y-4">
      <BaseSkeleton :rows="1" leading="square" leading-size="300px" :lines="3" />
      <BaseSkeleton :rows="4" :lines="2" />
    </div>

    <!-- Error -->
    <div v-else-if="isError || !property" class="py-20">
      <BaseEmpty />
      <div class="flex justify-center mt-4">
        <BaseButton @click="router.push('/landlord/properties')">
          {{ t('landlord.propertyDetail.backToProperties') }}
        </BaseButton>
      </div>
    </div>

    <!-- Locked by admin -->
    <div v-else-if="property.isLocked" class="py-20">
      <BaseEmpty :description="t('landlord.propertyDetail.lockedByAdminHint')" />
      <div class="flex justify-center mt-4">
        <BaseButton @click="router.push(`/landlord/properties/${propertyId}`)">
          {{ t('landlord.propertyDetail.backToProperty') }}
        </BaseButton>
      </div>
    </div>

    <!-- Populating form -->
    <div v-else-if="!initialized" class="space-y-4">
      <BaseSkeleton :rows="1" leading="square" leading-size="300px" :lines="3" />
    </div>

    <!-- Edit form -->
    <template v-else>
      <el-steps :active="active" finish-status="success" class="edit-property-steps">
        <el-step :title="t('post_property.steps.one')" />
        <el-step :title="t('post_property.steps.two')" />
        <el-step :title="t('post_property.steps.three')" />
        <el-step :title="t('post_property.steps.four')" />
        <el-step :title="t('post_property.steps.five')" />
        <el-step :title="t('landlord.editProperty.photos')" />
      </el-steps>

      <div class="mt-6 md:mt-8">
        <editPropertyType v-if="active === 0" :form="form" />
        <editBasicInfo v-else-if="active === 1" :form="form" :form-errors="formErrors" />
        <editLocation v-else-if="active === 2" :form="form" :form-errors="formErrors" />
        <editPrice v-else-if="active === 3" :form="form" :form-errors="formErrors" />
        <editAmenities v-else-if="active === 4" :form="form" :form-errors="formErrors" :property-rules="property?.rules" />
        <editPhotos
          v-else
          :property-id="propertyId"
          :images="property.images"
          @refresh="refetchProperty"
        />
      </div>

      <div class="mt-6 flex justify-between">
        <stepsNavigation
          :current-step="active + 1"
          :total-steps="TOTAL_STEPS"
          :loading="loading"
          :show-draft-controls="false"
          :submit-label="t('landlord.editProperty.saveChanges')"
          :submitting-label="t('landlord.editProperty.saving')"
          submit-icon="check"
          @back="prev"
          @next="next"
          @submit="handleSave"
        />
      </div>
    </template>
  </section>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseEmpty from '~/components/ui/BaseEmpty.vue'
import BaseSkeleton from '~/components/ui/BaseSkeleton.vue'
import stepsNavigation from '~/features/post-property/components/steps-navigation.vue'
import editPropertyType from './steps/edit-property-type.vue'
import editBasicInfo from './steps/edit-basic-info.vue'
import editLocation from './steps/edit-location.vue'
import editPrice from './steps/edit-price.vue'
import editAmenities from './steps/edit-amenities.vue'
import editPhotos from './edit-photos.vue'
import { useEditProperty } from '../composables/useEditProperty'
import { useQueryClient } from '@tanstack/vue-query'
import { createPropertyFormErrors } from '~/utils/propertyFormDefaults'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const notify = useNotify()
const { extract } = useErrorMsg()
const queryClient = useQueryClient()

const propertyId = computed(() => route.params.id as string)

const { property, isPending, isError, mapPropertyToForm, submitUpdate } = useEditProperty(propertyId)

const form = ref<any>(null)
const formErrors = reactive(createPropertyFormErrors())
const active = ref(0)
const loading = ref(false)
const initialized = ref(false)

const TOTAL_STEPS = 6

watch(property, (p) => {
  if (p && !initialized.value) {
    form.value = reactive(mapPropertyToForm(p))
    initialized.value = true
  }
}, { immediate: true })

function refetchProperty() {
  queryClient.invalidateQueries({ queryKey: ['edit-property', propertyId.value] })
}

function next() {
  if (active.value >= TOTAL_STEPS - 1) return
  active.value++
}

function prev() {
  if (active.value > 0) {
    active.value--
  } else {
    router.push(`/landlord/properties/${propertyId.value}`)
  }
}

async function handleSave() {
  loading.value = true
  try {
    await submitUpdate(form.value)
    notify.success(t('landlord.editProperty.updateSuccess'))
    router.push(`/landlord/properties/${propertyId.value}`)
  } catch (err) {
    notify.error(extract(err))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@media (max-width: 640px) {
  .edit-property-steps :deep(.el-step__title) {
    display: none;
  }
  .edit-property-steps :deep(.el-step__description) {
    display: none;
  }
}
</style>
