<template>
    <section>
        <div class="flex flex-col text-center items-center m-auto w-[70%] gap-5">
            <div class="flex items-center gap-2 text-(--nav-active-item) font-bold text-sm uppercase tracking-[0.08em]">
                <span class="w-6 h-0.75 rounded-full bg-(--nav-active-item)"></span>
                {{ $t('home.choseUs.choseUs') }}
            </div>
            <h2>{{ $t('home.choseUs.title') }}</h2>
            <h5 class="text-(--gray)">{{ $t('home.choseUs.description') }}</h5>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-10">

            <div class="card" v-motion :initial="{ opacity: 0, y: 20 }"
                :visible-once="{ opacity: 1, y: 0, transition: { delay: 0 } }">
                <span class="icon-tile icon-tile--primary">
                    <BaseIconClient name="handshake" size="26" color="white" />
                </span>
                <h4>{{ $t('home.choseUs.card.contact.title') }}</h4>
                <p>{{ $t('home.choseUs.card.contact.description') }}</p>
            </div>

            <div class="card card--featured" v-motion :initial="{ opacity: 0, y: 20 }"
                :visible-once="{ opacity: 1, y: 0, transition: { delay: 150 } }">
                <span class="icon-tile icon-tile--accent">
                    <BaseIconClient name="search" size="26" color="white" />
                </span>
                <h4>{{ $t('home.choseUs.card.search.title') }}</h4>
                <p>{{ $t('home.choseUs.card.search.description') }}</p>
            </div>

            <div class="card" v-motion :initial="{ opacity: 0, y: 20 }"
                :visible-once="{ opacity: 1, y: 0, transition: { delay: 300 } }">
                <span class="icon-tile icon-tile--primary">
                    <BaseIconClient name="headset" size="26" color="white" />
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
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    cursor: pointer;
    background: white;
    border: 1px solid #ECEFED;
    border-radius: 20px;
    padding: 24px;
    box-shadow: var(--shadow-card);
    transition:
        box-shadow 0.3s ease-in-out,
        background 0.3s ease-in-out,
        border 0.3s ease-in-out,
        transform 0.3s ease-in-out;
}

.card:hover {
    background: var(--nav-active);
    box-shadow: var(--shadow-card-hover);
    transform: translateY(-2px);
    border: 1px solid color-mix(in oklab, var(--color-emerald-200)  40%, transparent);
    color: var(--nav-active-item);
}

.card--featured {
    border-left: 3px solid var(--nav-active-item);
}
</style>
