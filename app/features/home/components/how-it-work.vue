<template>
    <section>
        <div class="flex flex-col text-center items-center m-auto w-[70%] gap-5">
            <div class="flex items-center gap-2 text-(--nav-active-item) font-bold text-sm uppercase tracking-[0.08em]">
                <span class="w-6 h-0.75 rounded-full bg-(--nav-active-item)"></span>
                {{ $t('home.howItWork.process') }}
            </div>
            <h2>{{ $t('home.howItWork.title') }}</h2>
            <h3 class="text-(--gray) text-base font-medium">{{ $t('home.howItWork.description') }}</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 my-10 ">
            <article v-motion :initial="{ opacity: 0, y: 20 }"
                :visible-once="{ opacity: 1, y: 0, transition: { delay: 0 } }"
                class="process">
                <div class="step-icon-wrap mb-3">
                    <div class="icon-tile icon-tile--primary">
                        <BaseIconClient name="search" size="24" color="white" />
                        <span class="step-number">01</span>
                    </div>
                </div>
                <h4>{{ $t('home.howItWork.card.search.title') }}</h4>
                <span>{{ $t('home.howItWork.card.search.description') }}</span>
            </article>

            <article v-motion :initial="{ opacity: 0, y: 20 }"
                :visible-once="{ opacity: 1, y: 0, transition: { delay: 150 } }"
                class="process">
                <div class="step-icon-wrap mb-3">
                    <div class="icon-tile icon-tile--primary">
                        <BaseIconClient name="mouse-pointer-click" size="24" color="white" />
                        <span class="step-number">02</span>
                    </div>
                </div>
                <h4>{{ $t('home.howItWork.card.pick.title') }}</h4>
                <span>{{ $t('home.howItWork.card.pick.description') }}</span>
            </article>

            <article v-motion :initial="{ opacity: 0, y: 20 }"
                :visible-once="{ opacity: 1, y: 0, transition: { delay: 300 } }"
                class="process">
                <div class="step-icon-wrap mb-3">
                    <div class="icon-tile icon-tile--accent">
                        <BaseIconClient name="message-square" size="24" color="white" />
                        <span class="step-number">03</span>
                    </div>
                </div>
                <h4>{{ $t('home.howItWork.card.connect.title') }}</h4>
                <span>{{ $t('home.howItWork.card.connect.description') }}</span>
            </article>

            <article v-motion :initial="{ opacity: 0, y: 20 }"
                :visible-once="{ opacity: 1, y: 0, transition: { delay: 450 } }"
                class="process">
                <div class="step-icon-wrap mb-3">
                    <div class="icon-tile icon-tile--primary">
                        <BaseIconClient name="key" size="24" color="white" />
                        <span class="step-number">04</span>
                    </div>
                </div>
                <h4>{{ $t('home.howItWork.card.move_in.title') }}</h4>
                <span>{{ $t('home.howItWork.card.move_in.description') }}</span>
            </article>
        </div>
    </section>
</template>

<script lang="ts" setup>
import BaseIconClient from '~/components/ui/BaseIcon.client.vue';

</script>

<style scoped>
.step-icon-wrap {
    position: relative;
    display: inline-flex;
    width: fit-content;
}

.step-number {
    position: absolute;
    bottom: 1px;
    right: 5px;
    font-size: 20px;
    font-weight: 800;
    line-height: 1;
    color: rgba(255, 255, 255, 0.4);
    pointer-events: none;
    transition: color 0.3s ease-in-out;
}

.process:hover .step-number {
    color: rgba(255, 255, 255, 0.65);
}

.process {
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    padding: 24px;
    border: 1px solid var(--color-gray-100);
    transition:
        box-shadow 0.3s ease-in-out,
        background 0.3s ease-in-out,
        transform 0.3s ease-in-out,
        ;
}

@media (min-width: 768px) {
    .process:not(:last-child)::after {
        content: '';
        position: absolute;
        top: 49px;
        left: 100%;
        width: calc(2.5rem - 4px);
        height: 2px;
        background: linear-gradient(to right, var(--nav-active-item), transparent);
        opacity: 0.35;
        z-index: -1;
    }
}

@media (min-width: 768px) and (max-width: 1023.98px) {
    .process:nth-child(2)::after {
        display: none;
    }
}

.process:hover {
    cursor: pointer;
    box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);

    background: var(--nav-active);
    border: 1px solid color-mix(in oklab, var(--color-emerald-200)  40%, transparent);
    color: var(--nav-active-item);
}
</style>
