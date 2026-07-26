<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(), {
  placeholder: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'link'],
  ['clean'],
]
</script>

<template>
  <ClientOnly>
    <QuillEditor
      :content="props.modelValue"
      content-type="html"
      theme="snow"
      :toolbar="toolbarOptions"
      :placeholder="props.placeholder"
      class="base-rich-editor"
      @update:content="(html: string) => emit('update:modelValue', html)"
    />
  </ClientOnly>
</template>

<style scoped>
.base-rich-editor :deep(.ql-container) {
  min-height: 320px;
  font-size: 0.95rem;
}

.base-rich-editor :deep(.ql-editor) {
  min-height: 320px;
}
</style>
