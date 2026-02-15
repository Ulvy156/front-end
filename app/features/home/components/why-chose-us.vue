<template>
    <section>
        <div class="flex flex-col text-center items-center m-auto w-[70%] gap-5">
            <div class="flex items-center gap-x-5 text-(--nav-active-item) p-5 py-4 bg-(--nav-active) rounded-full">
                <span class="flex items-center bg-(--nav-active)  px-2 py-1 rounded-md">
                    <BaseIconClient name="sparkles" />
                </span>
                <p>{{ $t('home.choseUs.choseUs') }}</p>
            </div>
            <h2>{{ $t('home.choseUs.title') }}</h2>
            <h5 class="text-(--gray)">{{ $t('home.choseUs.description') }}</h5>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-10">

            <div class="card shadow-md">
                <span style="background-image: var(--gradient-amber);" 
                class="flex items-center flex-col size-14 justify-center text-white rounded-full">
                    <BaseIconClient name="handshake" size="30"/>
                </span>
                <h4>{{ $t('home.choseUs.card.contact.title') }}</h4>
                <p>{{ $t('home.choseUs.card.contact.description') }}</p>
            </div>

            <div class="card shadow-md">
                <span
                class="flex items-center flex-col size-14 justify-center text-white rounded-full bg-blue-500">
                    <BaseIconClient name="search" size="30"/>
                </span>
                <h4>{{ $t('home.choseUs.card.search.title') }}</h4>
                <p>{{ $t('home.choseUs.card.search.description') }}</p>
            </div>

            <div class="card shadow-md">
                <span style="background-image: var(--gradient-amber);" 
                class="flex items-center flex-col size-14 justify-center text-white rounded-full ">
                    <BaseIconClient name="headset" size="30"/>
                </span>
                <h4>{{ $t('home.choseUs.card.free.title') }}</h4>
                <p>{{ $t('home.choseUs.card.free.description') }}</p>
            </div>

        </div>
    </section>
</template>

<script lang="ts" setup>
import BaseIconClient from '~/components/ui/BaseIcon.client.vue';

</script>

<style scoped>
.card {
    display: grid;
    cursor: pointer;
    background: white;
    border-radius: var(--radius) /* 0.25rem = 4px */;
    padding: calc(var(--spacing) * 7) /* 1.75rem = 28px */;
    border-color: color-mix(in oklab, var(--color-emerald-200)  40%, transparent);
    aspect-ratio: 10/5;
    transition: 
        background 0.5s ease,
        transform 0.5s ease,
        border 0.5s ease,
    ;
}

.card:hover {
    background: var(--nav-active);
    transform: translateY(-2px);
    border: 1px solid color-mix(in oklab, var(--color-emerald-200)  40%, transparent);
    color: var(--nav-active-item);
}
</style>