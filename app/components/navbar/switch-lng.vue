<script setup lang="ts">
const { locale, setLocale } = useI18n()

type Lang = 'en' | 'km'

function switchLng(lng: Lang) {
  localStorage.setItem('lang', lng);
  setLocale(lng)
}
</script>

<template>
  <el-dropdown trigger="click" style="width: fit-content;">
    <button class="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition cursor-pointer">
      <span>{{ locale === 'en' ? '🇬🇧 EN' : '🇰🇭 KM' }}</span>
      <Icon name="mdi:chevron-down" size="18" />
      
      <div class="backdrop-blur border size-8 flex justify-center items-center rounded-full">
        <Icon name="lucide:user-round" size="14" />
      </div>
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
</template>
