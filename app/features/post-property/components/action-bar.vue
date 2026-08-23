<template>
  <div
    class="w-full mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-3.5 sm:p-4"
  >
    <div class="flex flex-wrap gap-2.5 justify-between">
      <!-- Secondary group: Back + Save as Draft -->
      <div
        class="flex gap-2.5 flex-1 basis-full min-[560px]:flex-none min-[560px]:basis-auto min-w-0"
      >
        <BaseButton
          type="info"
          plain
          :disabled="isFirstStep"
          :class="outlineClass"
          @click="emit('back')"
        >
          <BaseIconClient name="arrow-left" :size="18" />
          <span class="truncate min-w-0">{{ $t("post_property.back") }}</span>
        </BaseButton>

        <BaseButton
          :disabled="isLastStep"
          :class="primaryClass"
          @click="emit('next')"
        >
          <BaseIconClient v-if="!isLastStep" name="arrow-right" :size="18" />
          <span class="truncate min-w-0">{{
            $t("post_property.continue")
          }}</span>
        </BaseButton>
      </div>

      <!-- Primary group: Continue + Publish Listing (both always present) -->
      <div
        class="flex gap-2.5 flex-1 basis-full min-[560px]:flex-none min-[560px]:basis-auto min-w-0"
      >
        <BaseButton
          type="info"
          plain
          :loading="savingDraft"
          :disabled="savingDraft"
          :class="outlineClass"
          @click="emit('save')"
        >
          <!-- <BaseIconClient v-if="!savingDraft" name="save" :size="18" /> -->
          <span class="truncate min-w-0">{{ $t("post_property.draft") }}</span>
        </BaseButton>

        <BaseButton
          :loading="loading"
          :disabled="!isLastStep"
          :class="primaryClass"
          @click="emit('submit')"
        >
          <BaseIconClient
            v-if="!loading && isLastStep"
            name="upload"
            :size="18"
          />
          <span class="truncate min-w-0">{{
            loading ? t("post_property.publishing") : t("post_property.publish")
          }}</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import BaseButton from "~/components/ui/BaseButton.vue";

const { t } = useI18n();

const props = defineProps<{
  currentStep: number;
  totalSteps: number;
  loading?: boolean;
  savingDraft?: boolean;
}>();

const emit = defineEmits<{
  (e: "back"): void;
  (e: "next"): void;
  (e: "save"): void;
  (e: "submit"): void;
}>();

const isFirstStep = computed(() => props.currentStep === 1);
const isLastStep = computed(() => props.currentStep === props.totalSteps);

// Structural/sizing overrides only — colors come from BaseButton's own
// `type` styling (Element Plus theme, driven by the app's --el-color-*
// vars) so this stays in sync with the rest of the app's palette.
const SIZE =
  "rounded-full! flex-1! min-w-0! min-h-[50px]! px-4! gap-2.5! font-semibold! justify-center!";
const outlineClass = `${SIZE} border-gray-200!`;
const primaryClass = `${SIZE} shadow-md! shadow-emerald-600/25! hover:shadow-lg! hover:shadow-emerald-600/35! transition-shadow!`;
</script>
