<template>
    <section>
        <div class="flex flex-col text-center items-center m-auto w-[70%] gap-5">
            <div class="flex items-center gap-x-5 text-(--nav-active-item) p-5 py-4 bg-(--nav-active) rounded-full">
                <span class="flex items-center bg-(--nav-active) p-2 rounded-full">
                    <BaseIconClient name="check" />
                </span>
                <p>{{ $t('home.howItWork.process') }}</p>
            </div>
            <h2>{{ $t('home.howItWork.title') }}</h2>
            <h5 class="text-(--gray)">{{ $t('home.howItWork.description') }}</h5>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 my-10 ">
            <article v-motion :initial="{ opacity: 0, y: 20 }" :visible-once="{ opacity: 1, y: 0 }"
                class="process">
                <el-badge :value="1" class="mb-3" :offset="[1, 5]">
                    <div class="card-icon bg-[#3b82f6] ">
                        <BaseIconClient name="search" size="28" />
                    </div>
                </el-badge>
                <h4>Search</h4>
                <span>Browse verified listings with smart filters</span>
            </article>

            <article v-motion :initial="{ opacity: 0, y: 20 }" :visible-once="{ opacity: 1, y: 0 }"
                class="process">
                <el-badge :value="2" class="mb-3" :offset="[1, 5]">
                    <div class="card-icon bg-[#a855f7] ">
                        <BaseIconClient name="mouse-pointer-click" size="28" />
                    </div>
                </el-badge>
                <h4>Pick</h4>
                <span>Compare rooms and save your favorites</span>
            </article>

            <article v-motion :initial="{ opacity: 0, y: 20 }" :visible-once="{ opacity: 1, y: 0 }"
                class="process">
                <el-badge :value="3" class="mb-3" :offset="[1, 5]">
                    <div class="card-icon bg-[#f59e0b]">
                        <BaseIconClient name="message-square" size="28" />
                    </div>
                </el-badge>
                <h4>Connect</h4>
                <span>Message landlords directly, schedule visits</span>
            </article>

            <article v-motion :initial="{ opacity: 0, y: 20 }" :visible-once="{ opacity: 1, y: 0 }"
                class="process">
                <el-badge :value="4" class="mb-3" :offset="[1, 5]">
                    <div class="card-icon bg-[#14b8a6] ">
                        <BaseIconClient name="key" size="28" />
                    </div>
                </el-badge>
                <h4>Search</h4>
                <span>Sign the lease and enjoy your new home</span>
            </article>
        </div>
    </section>
</template>

<script lang="ts" setup>
import BaseIconClient from '~/components/ui/BaseIcon.client.vue';

</script>

<style scoped>
.card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    color: white;
    border-radius: 15px;
    width: 50px;
    height: 50px;
}

.el-badge {
    transition: transform 0.3s ease-in-out;
}

.process:hover  .el-badge {
    transform: rotate(8deg) translateY(-3px) scale(1.1);
}

.process {
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