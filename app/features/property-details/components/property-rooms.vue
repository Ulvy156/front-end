<template>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-(--radius) bg-(--card) border border-gray">
        <div class="card">
            <BaseIconClient color="var(--nav-active-item)" name="bed"/>
            <div>
                <p>{{ $t('property.bedroom') }}</p>
                <b>{{ property.bedroom }}</b>
            </div>
        </div>
        <div class="card">
            <BaseIconClient color="var(--nav-active-item)" name="bath"/>
            <div>
                <p>{{ $t('property.bathroom') }}</p>
                <b>{{ property.bathroom }}</b>
            </div>
        </div>
        <div class="card">
            <BaseIconClient color="var(--nav-active-item)" name="bath"/>
            <div>
                <p>{{ $t('property.size') }}</p>
                <b>{{ property.sizeSqm }} m<sup>2</sup></b>
            </div>
        </div>
        <div class="card">
            <BaseIconClient color="var(--nav-active-item)" name="hospital"/>
            <div>
                <p>{{ $t('property.floor') }}</p>
                <b>{{ property.floor }} / {{ property.totalFloors }}</b>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import BaseIconClient from "~/components/ui/BaseIcon.client.vue";
import type { PropertyDetail } from "../interface/properties-details";

const props = defineProps<{
  property: PropertyDetail;
}>();
</script>


<style scoped>
.card {
    display: flex;
    align-items: center;
    column-gap: 8px;
    padding: 12px;
    background-color: var(--bg-gray);
    border-radius: 10px;
}

.card > div > p {
    color:var(--gray);
}
</style>