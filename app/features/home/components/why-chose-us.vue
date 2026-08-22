<template>
    <section class="mt-10">
        <div class="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 lg:gap-16 items-start">

            <div class="flex flex-col gap-4 lg:sticky lg:top-24" v-motion :initial="motionInitial"
                :visible-once="motionVisible">
                <div class="flex items-center gap-2 text-(--nav-active-item) font-bold text-sm uppercase tracking-[0.08em]">
                    <span class="w-6 h-0.75 rounded-full bg-(--nav-active-item)"></span>
                    {{ $t('home.choseUs.choseUs') }}
                </div>
                <h2>{{ $t('home.choseUs.title') }}</h2>
                <p class="text-(--gray) text-base font-medium max-w-[34ch]">{{ $t('home.choseUs.description') }}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-10 border-t border-(--border-gray)"
                v-motion :initial="motionInitial" :visible-once="motionVisibleDelayed">

                <div class="flex flex-col gap-2.5 pt-6">
                    <span class="w-12 h-12 rounded-[10px] bg-(--nav-active) flex items-center justify-center shrink-0">
                        <BaseIconClient name="handshake" size="22" color="var(--nav-active-item)" />
                    </span>
                    <h3>{{ $t('home.choseUs.card.contact.title') }}</h3>
                    <p class="text-(--gray) text-[15px]">{{ $t('home.choseUs.card.contact.description') }}</p>
                </div>

                <div class="flex flex-col gap-2.5 pt-6 sm:pl-10 sm:border-l sm:border-(--border-gray)">
                    <span class="w-12 h-12 rounded-[10px] bg-(--nav-active) flex items-center justify-center shrink-0">
                        <BaseIconClient name="search" size="22" color="var(--nav-active-item)" />
                    </span>
                    <h3>{{ $t('home.choseUs.card.search.title') }}</h3>
                    <p class="text-(--gray) text-[15px]">{{ $t('home.choseUs.card.search.description') }}</p>
                </div>

                <div class="flex flex-col gap-2.5 pt-6 sm:pl-10 sm:border-l sm:border-(--border-gray)">
                    <span class="w-12 h-12 rounded-[10px] bg-(--nav-active) flex items-center justify-center shrink-0">
                        <BaseIconClient name="headset" size="22" color="var(--nav-active-item)" />
                    </span>
                    <h3>{{ $t('home.choseUs.card.free.title') }}</h3>
                    <p class="text-(--gray) text-[15px]">{{ $t('home.choseUs.card.free.description') }}</p>
                </div>

            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import BaseIconClient from '~/components/ui/BaseIcon.client.vue';

// Skip the fade/rise for anyone who has asked their OS to reduce motion —
// v-motion writes inline transforms via JS, so a CSS media query can't
// override it once it starts; the only reliable way is to not animate at all.
const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const motionInitial = prefersReducedMotion ? {} : { opacity: 0, y: 8 };
const motionVisible = prefersReducedMotion ? {} : { opacity: 1, y: 0, transition: { duration: 320 } };
const motionVisibleDelayed = prefersReducedMotion ? {} : { opacity: 1, y: 0, transition: { duration: 320, delay: 80 } };
</script>
