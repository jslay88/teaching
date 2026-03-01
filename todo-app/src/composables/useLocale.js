import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { LOCALE_STORAGE_KEY } from '../i18n'

const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'de']

export function useLocale() {
  const { locale } = useI18n()

  const currentLocale = computed({
    get: () => locale.value,
    set: (value) => {
      if (!SUPPORTED_LOCALES.includes(value)) return
      locale.value = value
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, value)
      } catch (_) {}
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = value
      }
    },
  })

  function setLocale(newLocale) {
    currentLocale.value = newLocale
  }

  return {
    locale: currentLocale,
    setLocale,
    supportedLocales: SUPPORTED_LOCALES,
  }
}
