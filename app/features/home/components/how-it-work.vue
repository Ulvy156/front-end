<template>
    <section>
        <div class="flex flex-col gap-4 mb-10" v-motion :initial="motionInitial" :visible-once="motionVisible">
            <div class="flex items-center gap-2 text-(--nav-active-item) font-bold text-sm uppercase tracking-[0.08em]">
                <span class="w-6 h-0.75 rounded-full bg-(--nav-active-item)"></span>
                {{ $t('home.howItWork.process') }}
            </div>
            <h2>{{ $t('home.howItWork.title') }}</h2>
        </div>

        <ol class="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10 border-t border-(--border-gray)"
            v-motion :initial="motionInitial" :visible-once="motionVisibleDelayed">
            <li class="step step--active flex flex-col gap-2.5 pt-6">
                <span class="text-(--nav-active-item) text-[13px] font-semibold tabular-nums">01</span>
                <h3>{{ $t('home.howItWork.card.search.title') }}</h3>
                <p class="text-(--gray) text-[15px]">{{ $t('home.howItWork.card.search.description') }}</p>
            </li>
            <li class="step flex flex-col gap-2.5 pt-6 lg:pl-10 lg:border-l lg:border-(--border-gray)">
                <span class="text-(--gray) text-[13px] font-semibold tabular-nums">02</span>
                <h3>{{ $t('home.howItWork.card.shortlist.title') }}</h3>
                <p class="text-(--gray) text-[15px]">{{ $t('home.howItWork.card.shortlist.description') }}</p>
            </li>
            <li class="step flex flex-col gap-2.5 pt-6 lg:pl-10 lg:border-l lg:border-(--border-gray)">
                <span class="text-(--gray) text-[13px] font-semibold tabular-nums">03</span>
                <h3>{{ $t('home.howItWork.card.connect.title') }}</h3>
                <p class="text-(--gray) text-[15px]">{{ $t('home.howItWork.card.connect.description') }}</p>
            </li>
            <li class="step flex flex-col gap-2.5 pt-6 lg:pl-10 lg:border-l lg:border-(--border-gray)">
                <span class="text-(--gray) text-[13px] font-semibold tabular-nums">04</span>
                <h3>{{ $t('home.howItWork.card.move_in.title') }}</h3>
                <p class="text-(--gray) text-[15px]">{{ $t('home.howItWork.card.move_in.description') }}</p>
            </li>
        </ol>

        <div class="flex flex-col sm:flex-row sm:items-center gap-4 mt-8">
            <NuxtLink to="/properties" class="cta-btn inline-flex items-center justify-center gap-2.5 bg-(--nav-active-item) text-white text-[15px] font-semibold px-6 py-3.5 rounded-md">
                {{ $t('home.howItWork.cta.button') }}
                <BaseIconClient name="arrow-right" size="16" color="white" />
            </NuxtLink>
            <span class="text-(--gray) text-[15px]">{{ $t('home.howItWork.cta.helper') }}</span>
        </div>
    </section>
</template>

<script lang="ts" setup>
import BaseIconClient from '~/components/ui/BaseIcon.client.vue';

const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const motionInitial = prefersReducedMotion ? {} : { opacity: 0, y: 8 };
const motionVisible = prefersReducedMotion ? {} : { opacity: 1, y: 0, transition: { duration: 320 } };
const motionVisibleDelayed = prefersReducedMotion ? {} : { opacity: 1, y: 0, transition: { duration: 320, delay: 80 } };
</script>

<style scoped>
.step {
    border-top: 2px solid color-mix(in oklab, var(--nav-active-item) 30%, transparent);
}

.step--active {
    border-top: 2px solid var(--nav-active-item);
}

.cta-btn {
    transition: background 0.2s ease-in-out;
}

.cta-btn:hover {
    background: color-mix(in oklab, var(--nav-active-item), black 12%);
}

.cta-btn:focus-visible {
    outline: 2px solid var(--nav-active-item);
    outline-offset: 2px;
}
</style>
