<template>
    <el-tooltip :content :placement>
        <slot></slot>
    </el-tooltip>
</template>

<script lang="ts" setup>
type placementType = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';
const props = withDefaults(
    defineProps<{
        placement?: placementType,
        content: string
    }>(), {
        placement: 'top',
        content: ''
    }
)

</script>