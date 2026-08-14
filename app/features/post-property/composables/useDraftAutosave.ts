import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const DRAFT_KEY = 'post-property-draft'
// File objects can't survive JSON.stringify/localStorage, and base64 photo
// data URLs are large enough to blow the quota — draft recovery covers the
// text/selection fields only, not the photo picker.
const EXCLUDED_KEYS = ['photos', 'photoFiles']

export function useDraftAutosave(form: Record<string, any>) {
  const { t } = useI18n()

  const saving = ref(false)
  const savedAgo = ref(0)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let tickInterval: ReturnType<typeof setInterval> | null = null

  function persist() {
    const snapshot: Record<string, any> = {}
    for (const key in form) {
      if (!EXCLUDED_KEYS.includes(key)) snapshot[key] = form[key]
    }
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot))
    } catch {
      // best-effort only — storage unavailable or full shouldn't break the form
    }
  }

  function markSaving() {
    saving.value = true
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      persist()
      saving.value = false
      savedAgo.value = 0
    }, 500)
  }

  function saveNow() {
    if (debounceTimer) clearTimeout(debounceTimer)
    saving.value = true
    debounceTimer = setTimeout(() => {
      persist()
      saving.value = false
      savedAgo.value = 0
    }, 300)
  }

  function restoreDraft() {
    if (typeof window === 'undefined') return
    const alreadyStarted = !!form.propertyTitle?.trim() || !!form.propertyType
    if (alreadyStarted) return
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) return
      Object.assign(form, JSON.parse(raw))
    } catch {
      // corrupt draft — ignore and start fresh
    }
  }

  function clearDraft() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(DRAFT_KEY)
    savedAgo.value = 0
  }

  onMounted(() => {
    restoreDraft()
    watch(form, markSaving, { deep: true })
    tickInterval = setInterval(() => { savedAgo.value++ }, 60000)
  })

  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
    if (tickInterval) clearInterval(tickInterval)
  })

  const savedText = computed(() => {
    if (saving.value) return t('post_property.step_progress.saving')
    if (savedAgo.value === 0) return t('post_property.step_progress.saved_just_now')
    return t('post_property.step_progress.saved_min_ago', { n: savedAgo.value })
  })

  const savedFresh = computed(() => !saving.value && savedAgo.value < 5)

  return { saving, savedAgo, savedText, savedFresh, saveNow, clearDraft }
}
