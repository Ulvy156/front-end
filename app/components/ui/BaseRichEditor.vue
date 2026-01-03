<template>
  <ClientOnly>
    <QuillEditor v-model="content" />
  </ClientOnly>
</template>

<script setup>
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const content = ref('')
</script>
