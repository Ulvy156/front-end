<template>
  <div class="flex border border-gray-600 rounded-full py-2 px-4">
    <el-dropdown trigger="click" style="width: fit-content;">
      <button class="flex items-center gap-2 rounded-full text-sm transition cursor-pointer">
        <span>{{ locale === 'en' ? '🇬🇧 EN' : '🇰🇭 KM' }}</span>
        <BaseIconClient name="chevron-down" :size="18" />
      </button>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="switchLng('en')">
            🇬🇧 English
          </el-dropdown-item>
          <el-dropdown-item @click="switchLng('km')">
            🇰🇭 Khmer
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>

    </el-dropdown>
    <NuxtLink to="/user/profile" class="backdrop-blur border size-8 flex justify-center items-center rounded-full">
      <BaseIconClient name="user-round" :size="14" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import BaseIconClient from '../ui/BaseIcon.client.vue';

const { locale, setLocale } = useI18n()

type Lang = 'en' | 'km'

function switchLng(lng: Lang) {
  localStorage.setItem('lang', lng);
  setLocale(lng)
}
</script>