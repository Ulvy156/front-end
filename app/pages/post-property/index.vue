<template>
    <section class="flex flex-col gap-y-5 mt-10">
        <div class="flex flex-col justify-center items-center">
            <h2>{{ $t("post_property.title") }}</h2>
            <p class="text-(--gray)">{{ $t("post_property.desc") }}</p>
        </div>
        <postSection/>
    </section>
</template>

<script lang="ts" setup>
import postSection from '~/features/post-property/components/post-section.vue';

</script>

<style>

</style>