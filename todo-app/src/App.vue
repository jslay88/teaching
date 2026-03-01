<script setup>
import { ref, watch } from 'vue'
import { useTheme } from './composables/useTheme.js'

const { resolvedTheme, theme, setTheme } = useTheme()

watch(resolvedTheme, (value) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', value)
  }
}, { immediate: true })

const todos = ref([])
const input = ref('')

function add() {
  const text = input.value.trim()
  if (text) {
    todos.value.push({ id: Date.now(), text, done: false })
    input.value = ''
  }
}

function remove(id) {
  todos.value = todos.value.filter((t) => t.id !== id)
}

function toggle(id) {
  const t = todos.value.find((x) => x.id === id)
  if (t) t.done = !t.done
}
</script>

<template>
  <div class="app-root" :data-theme="resolvedTheme">
    <header class="app-header">
      <h1>Todo</h1>
      <div class="theme-switcher" role="group" aria-label="Theme">
        <button
          type="button"
          class="theme-btn"
          :class="{ active: theme === 'light' }"
          @click="setTheme('light')"
          title="Light"
        >
          Light
        </button>
        <button
          type="button"
          class="theme-btn"
          :class="{ active: theme === 'dark' }"
          @click="setTheme('dark')"
          title="Dark"
        >
          Dark
        </button>
        <button
          type="button"
          class="theme-btn"
          :class="{ active: theme === 'system' }"
          @click="setTheme('system')"
          title="System"
        >
          System
        </button>
      </div>
    </header>
    <div class="app">
      <form @submit.prevent="add" class="add-form">
        <input v-model="input" placeholder="What to do?" />
        <button type="submit">Add</button>
      </form>
      <ul class="list">
        <li v-for="todo in todos" :key="todo.id" :class="{ done: todo.done }">
          <input type="checkbox" :checked="todo.done" @change="toggle(todo.id)" />
          <span>{{ todo.text }}</span>
          <button type="button" @click="remove(todo.id)">×</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.app-root {
  min-height: 100vh;
  color: var(--text);
  background-color: var(--bg);
}
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border);
}
.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
}
.theme-switcher {
  display: flex;
  gap: 0.25rem;
}
.theme-btn {
  padding: 0.35rem 0.65rem;
  font-size: 0.875rem;
  border: 1px solid var(--input-border);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--text);
  cursor: pointer;
}
.theme-btn:hover {
  opacity: 0.9;
}
.theme-btn.active {
  border-color: var(--text);
  font-weight: 600;
}
.app {
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
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
  border: 1px solid var(--input-border);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--text);
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
  border-bottom: 1px solid var(--border);
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
  border: 1px solid var(--input-border);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--text);
  cursor: pointer;
}
.list li button:hover {
  opacity: 0.9;
}
</style>
