<template>
    <div class="flex items-center gap-x-2 bg-(--bg-gray) p-2 rounded-md">
        <BaseIconClient name="map-pin" color="var(--nav-active-item)"/>
        <p>{{ $t("filter.location") }}</p>
    </div>
    <el-autocomplete clearable v-model="keyword" :fetch-suggestions="searchLocations" placeholder="Search location"
        value-key="label" style="width: 100%" @select="onSelect" />


</template>


<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core'
import BaseIconClient from '~/components/ui/BaseIcon.client.vue'

interface Location {
    id: number
    nameEn: string
    nameKh: string
    type: 'district' | 'province'
    label: string
}

const api = useApi()

const keyword = ref('')
const selectedLocation = ref<Location | null>(null)

// debounced fetch (1s)
const fetchLocations = useDebounceFn(
    async (query: string, cb: (r: Location[]) => void) => {

        if (!query || query.length < 2) {
            cb([])
            return
        }

        const res = await api.get('location', {
            params: { q: query },
        })

        cb(
            res.data.map((item: any) => ({
                ...item,
                label: `${item.nameEn} — ${item.nameKh}`,
            }))
        )
    },
    1000 // 1 second
)

// el-autocomplete hook
const searchLocations = (
    query: string,
    cb: (results: Location[]) => void
) => {
    fetchLocations(query, cb)
}

const onSelect = (item: Location) => {
    selectedLocation.value = item
    keyword.value = item.label
}
</script>




<style scoped>
:deep(.el-autocomplete) {
    border: 2px solid #007bff;
    border-radius: 8px;
}
</style>