<template>
    <section class="min-h-dvh flex items-stretch">

        <AuthBrandPanel :title="title" :description="description" :features="features" />

        <!-- Form Panel -->
        <div class="flex-1 flex items-center justify-center
                    bg-linear-to-br from-slate-50 via-emerald-50/40 to-slate-50
                    px-6 py-10 sm:py-12 lg:py-14">
            <slot />
        </div>

    </section>
</template>

<script setup lang="ts">
import AuthBrandPanel from './AuthBrandPanel.vue'

defineProps<{
    title: string
    description: string
    features: { icon: string, text: string }[]
}>()
</script>
