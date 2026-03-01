import { ref, computed, onMounted, onUnmounted } from 'vue'

const STORAGE_KEY = 'todo-app-theme'

const validThemes = ['dark', 'light', 'system']

function getStoredTheme() {
  if (typeof localStorage === 'undefined') return 'system'
  const stored = localStorage.getItem(STORAGE_KEY)
  return validThemes.includes(stored) ? stored : 'system'
}

function getSystemPrefersDark() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useTheme() {
  const theme = ref(getStoredTheme())
  const systemPrefersDark = ref(getSystemPrefersDark())

  const resolvedTheme = computed(() => {
    if (theme.value === 'system') {
      return systemPrefersDark.value ? 'dark' : 'light'
    }
    return theme.value
  })

  function setTheme(value) {
    if (!validThemes.includes(value)) return
    theme.value = value
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, value)
    }
  }

  function syncSystemPreference() {
    systemPrefersDark.value = getSystemPrefersDark()
  }

  let mql
  onMounted(() => {
    syncSystemPreference()
    mql = window.matchMedia('(prefers-color-scheme: dark)')
    mql.addEventListener('change', syncSystemPreference)
  })
  onUnmounted(() => {
    if (mql) mql.removeEventListener('change', syncSystemPreference)
  })

  return { theme, setTheme, resolvedTheme }
}
