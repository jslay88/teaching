import { ref, computed, onMounted, onUnmounted } from 'vue'

const STORAGE_KEY = 'todo-app-theme'

const STORED_THEMES = ['dark', 'light']

function getStoredTheme() {
  if (typeof localStorage === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  return STORED_THEMES.includes(stored) ? stored : null
}

function getSystemPrefersDark() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useTheme() {
  const storedTheme = ref(getStoredTheme())
  const systemPrefersDark = ref(getSystemPrefersDark())

  const resolvedTheme = computed(() => {
    if (storedTheme.value !== null) return storedTheme.value
    return systemPrefersDark.value ? 'dark' : 'light'
  })

  function setTheme(value) {
    if (!STORED_THEMES.includes(value)) return
    storedTheme.value = value
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

  return { setTheme, resolvedTheme }
}
