<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocale } from './composables/useLocale'

const { t } = useI18n()
const { locale, setLocale, supportedLocales } = useLocale()

const todos = ref([])
const input = ref('')

const localeLabels = {
  en: () => t('locale.en'),
  es: () => t('locale.es'),
  fr: () => t('locale.fr'),
  de: () => t('locale.de'),
}

function add() {
  const text = input.value.trim()
  if (text) {
    todos.value.push({ id: Date.now(), text, done: false })
    input.value = ''
  }
}

function remove(id) {
  todos.value = todos.value.filter((item) => item.id !== id)
}

function toggle(id) {
  const todo = todos.value.find((x) => x.id === id)
  if (todo) todo.done = !todo.done
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>{{ t('app.title') }}</h1>
      <div class="locale-switcher">
        <label for="locale-select">{{ t('locale.label') }}</label>
        <select
          id="locale-select"
          :value="locale"
          @change="setLocale(($event.target).value)"
          class="locale-select"
        >
          <option
            v-for="loc in supportedLocales"
            :key="loc"
            :value="loc"
          >
            {{ localeLabels[loc]() }}
          </option>
        </select>
      </div>
    </header>
    <form @submit.prevent="add" class="add-form">
      <input v-model="input" :placeholder="t('placeholder')" />
      <button type="submit">{{ t('buttons.add') }}</button>
    </form>
    <ul class="list">
      <li v-for="todo in todos" :key="todo.id" :class="{ done: todo.done }">
        <input type="checkbox" :checked="todo.done" @change="toggle(todo.id)" />
        <span>{{ todo.text }}</span>
        <button
          type="button"
          @click="remove(todo.id)"
          :aria-label="t('buttons.remove')"
        >
          ×
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.app {
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
}
.header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.header h1 {
  margin: 0;
  font-size: 1.5rem;
}
.locale-switcher {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.locale-switcher label {
  font-size: 0.875rem;
}
.locale-select {
  padding: 0.35rem 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #333;
  border-radius: 4px;
  background: inherit;
  color: inherit;
}
.add-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.add-form input {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #333;
}
.list li.done span {
  text-decoration: line-through;
  opacity: 0.7;
}
.list li button {
  margin-left: auto;
  padding: 0.2rem 0.5rem;
  font-size: 1.2rem;
  line-height: 1;
}
</style>
