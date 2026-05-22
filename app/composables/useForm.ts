import type { FormInstance, FormRules, FormItemRule } from 'element-plus'

/**
 * Thin wrapper around Element Plus form validation that removes per-component boilerplate:
 *
 * - Manages formRef and reactive form state
 * - Merges static rules with a server-error validator slot for every field
 *   so setFieldError() shows inline errors without extra computed/watch code
 * - Tracks submission loading state and prevents double-submit
 * - handleSubmit runs validation first, then calls onValid only if it passes
 *
 * Usage:
 *   const { formRef, form, rules, isSubmitting, handleSubmit, setFieldError, reset } =
 *     useForm({ email: '', password: '' }, loginRules)
 *
 *   const submit = handleSubmit(async () => { ... })
 *
 *   // Template: <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="submit">
 */
export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  staticRules?: FormRules,
) {
  const formRef = ref<FormInstance>()
  const form = reactive({ ...initialValues }) as T

  // Per-field server-side error messages (e.g. "email already in use" from a 400 response)
  const fieldErrors = reactive<Record<string, string>>({})

  // Auto-clear a field's server error when the user edits it
  for (const field of Object.keys(initialValues)) {
    watch(
      () => (form as Record<string, unknown>)[field],
      () => { delete fieldErrors[field] },
    )
  }

  // Merged rules: static rules + a server-error validator slot for every field.
  // The server-error slot is always present (passes when empty) so validateField()
  // can surface it without needing to rebuild the rules object.
  const rules = computed<FormRules>(() => {
    const merged: FormRules = {}
    for (const field of Object.keys(initialValues)) {
      const existing = (staticRules?.[field] ?? []) as FormItemRule[]
      merged[field] = [
        ...existing,
        {
          validator: (_rule: unknown, _val: unknown, callback: (err?: Error) => void) => {
            const serverErr = fieldErrors[field]
            if (serverErr) callback(new Error(serverErr))
            else callback()
          },
          trigger: 'change',
        },
      ]
    }
    return merged
  })

  const isSubmitting = ref(false)

  /** Resolves true if validation passes, false otherwise (never throws). */
  const validate = (): Promise<boolean> =>
    formRef.value?.validate().then(() => true).catch(() => false) ?? Promise.resolve(false)

  /**
   * Returns an event handler that:
   * 1. Validates the form
   * 2. Skips onValid if invalid or already submitting
   * 3. Sets isSubmitting = true while onValid runs
   *
   * Assign the result to a variable and bind it to @submit.prevent:
   *   const submit = handleSubmit(async () => { ... })
   */
  const handleSubmit = (onValid: () => void | Promise<void>) =>
    async (event?: Event) => {
      event?.preventDefault()
      if (isSubmitting.value) return
      if (!(await validate())) return
      isSubmitting.value = true
      try {
        await onValid()
      } finally {
        isSubmitting.value = false
      }
    }

  /**
   * Show a server-side error inline on a specific field.
   * Clears automatically when the user edits that field.
   */
  const setFieldError = async (field: string, message: string) => {
    fieldErrors[field] = message
    await nextTick()
    formRef.value?.validateField(field)
  }

  /** Reset field values and clear all validation state. */
  const reset = () => {
    formRef.value?.resetFields()
    Object.keys(fieldErrors).forEach(k => delete fieldErrors[k])
  }

  return {
    formRef,
    form,
    rules,
    isSubmitting,
    validate,
    handleSubmit,
    setFieldError,
    reset,
  }
}
