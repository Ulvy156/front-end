<template>
  <div class="overflow-x-auto">
  <el-table :data="compareStore.propertyCardItem" style="width: 100%">
    <el-table-column :label="$t('property.compare.table.price')" width="160">
      <template #default="scope">
        ${{ formatView(scope.row.monthly_price) }}
      </template>
    </el-table-column>

    <!-- deposite -->
    <el-table-column :label="$t('property.compare.table.deposite')" width="100">
      <template #default="scope">${{ formatView(scope.row.deposit) }}</template>
    </el-table-column>
    <!-- size -->
    <el-table-column :label="$t('property.compare.table.size')">
      <template #default="scope">
        <span>{{ scope.row.sizeSqm }} m<sup>2</sup></span>
      </template>
    </el-table-column>
    <!-- bathroom -->
    <el-table-column :label="$t('property.compare.table.bathroom')" width="100">
      <template #default="scope">
        {{ scope.row.bathroom }}
      </template>
    </el-table-column>
    <!-- bedroom -->
    <el-table-column :label="$t('property.compare.table.bedroom')" width="100">
      <template #default="scope">
        {{ scope.row.bathroom }} 
      </template>
    </el-table-column>
    <!-- location -->
    <el-table-column :label="$t('property.compare.table.location')" width="160">
      <template #default="scope">
        <div class="flex items-center gap-x-2 text-gray-500 mt-2">
          <!-- <BaseIconClient name="map-pinned" :size="15" /> -->
          <span>
            {{ scope.row.district.province[langKey] }} -
            {{ scope.row.district[langKey] }}
          </span>
        </div>
      </template>
    </el-table-column>
    <!-- type -->
    <el-table-column :label="$t('property.compare.table.type')">
      <template #default="scope">
        <span
          class="flex w-fit items-center gap-x-2 text-(--nav-active-item) bg-(--nav-active) p-1 px-2 rounded-full"
        >
          <BaseIconClient :name="scope.row.propertyType.icon" size="12" />
          {{ scope.row.propertyType[langKey] }}
        </span>
      </template>
    </el-table-column>
    <!-- available -->
    <el-table-column :label="$t('property.compare.table.available')" width="160">
      <template #default="scope">
        <span
          v-if="scope.row.availableFrom"
          class="flex w-fit items-center gap-x-2 text-(--nav-active-item) bg-(--nav-active) p-2 rounded-full"
        >
          <BaseIconClient
            color="var(--nav-active-item)"
            name="check"
            :size="16"
          />
          <span>{{ formatDateLong(scope.row.availableFrom) }}</span>
        </span>
        <BaseIconClient
          v-else
          color="var(--nav-active-item)"
          name="x"
          :size="16"
        />
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script lang="ts" setup>
import { formatView } from "#imports";
import { useLangKey } from "#imports";
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import { formatDateLong } from "#imports";

const compareStore = useCompareProperty();
const langKey = useLangKey();
</script>

<style></style>
