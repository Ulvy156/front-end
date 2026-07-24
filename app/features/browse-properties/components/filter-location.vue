<template>
  <div>
    <div class="flex items-center gap-x-2 bg-(--bg-gray) p-2 rounded-md mb-4">
      <BaseIconClient name="map-pin" color="var(--nav-active-item)" />
      <p>{{ $t("filter.location") }}</p>
    </div>
    <el-autocomplete
      @clear="clearLocation"
      clearable
      v-model="keyword"
      :fetch-suggestions="searchLocations"
      placeholder="Search location"
      value-key="label"
      style="width: 100%"
      :aria-label="$t('filter.location')"
      @select="selectLocation"
    />
  </div>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import { useLocationAutocomplete } from "../composable/useLocationAutocomplete";

const { keyword, clearLocation, searchLocations, selectLocation } =
  useLocationAutocomplete()
</script>

<style scoped>
:deep(.el-autocomplete) {
  border-color: #007bff;
  border-radius: 8px;
}
</style>
