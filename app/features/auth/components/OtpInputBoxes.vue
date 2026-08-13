<template>
    <div class="space-y-2">
        <div class="flex items-center justify-center gap-x-1 sm:gap-x-2">
            <input
                v-for="(_, i) in 6" :key="i"
                :ref="(el) => { if (el) inputs[i] = el as HTMLInputElement }"
                type="text" inputmode="numeric" maxlength="1"
                :value="digits[i]"
                @input="handleInput(i, $event as InputEvent)"
                @keydown="handleKeydown(i, $event as KeyboardEvent)"
                @paste.prevent="handlePaste($event as ClipboardEvent)"
                :class="error ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'"
                class="w-8 h-11 sm:w-11 sm:h-14 rounded-xl border-2 text-center text-base sm:text-xl font-bold
                       text-slate-900 bg-white outline-none transition-colors duration-150" />
        </div>
        <p v-if="error" class="text-xs text-red-500 text-center">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: string
    error?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const digits = reactive(['', '', '', '', '', ''])
const inputs: HTMLInputElement[] = []

watch(() => props.modelValue, (val) => {
    if (val === digits.join('')) return
    const chars = val.split('')
    for (let i = 0; i < 6; i++) digits[i] = chars[i] ?? ''
})

const emitValue = () => emit('update:modelValue', digits.join(''))

const handleInput = (index: number, event: InputEvent) => {
    const val = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(-1)
    digits[index] = val
    emitValue()
    if (val && index < 5) inputs[index + 1]?.focus()
}

const handleKeydown = (index: number, event: KeyboardEvent) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
        digits[index - 1] = ''
        emitValue()
        inputs[index - 1]?.focus()
    }
}

const handlePaste = (event: ClipboardEvent) => {
    const pasted = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, 6)
    pasted.split('').forEach((char, i) => { digits[i] = char })
    emitValue()
    nextTick(() => inputs[Math.min(pasted.length, 5)]?.focus())
}

const reset = () => {
    digits.fill('')
    emitValue()
    nextTick(() => inputs[0]?.focus())
}

defineExpose({ reset })
</script>
