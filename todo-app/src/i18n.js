import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import de from './locales/de.json'

const LOCALE_STORAGE_KEY = 'todo-app-locale'

function getInitialLocale() {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (saved && ['en', 'es', 'fr', 'de'].includes(saved)) return saved
  } catch (_) {}
  return 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: { en, es, fr, de },
})

export { LOCALE_STORAGE_KEY }
