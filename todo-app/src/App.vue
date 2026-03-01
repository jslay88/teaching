<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTodos } from './composables/useTodos.js'
import { useTheme } from './composables/useTheme.js'

const { resolvedTheme, setTheme } = useTheme()

watch(resolvedTheme, (value) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', value)
  }
}, { immediate: true })

const STORAGE_KEY = 'todo-app-todos'

const { todos, addTodo, removeTodo, toggleDone } = useTodos()
const input = ref('')

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || '[]'
    const parsed = JSON.parse(raw)
    todos.value = Array.isArray(parsed) ? parsed : []
  } catch {
    todos.value = []
  }
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
  } catch {
    // ignore quota or other storage errors
  }
}

onMounted(loadFromStorage)
watch(todos, saveToStorage, { deep: true })

function add() {
  const text = input.value.trim()
  if (text) {
    addTodo(text)
    input.value = ''
  }
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
          :class="{ active: resolvedTheme === 'light' }"
          @click="setTheme('light')"
          title="Light"
        >
          Light
        </button>
        <button
          type="button"
          class="theme-btn"
          :class="{ active: resolvedTheme === 'dark' }"
          @click="setTheme('dark')"
          title="Dark"
        >
          Dark
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
          <input type="checkbox" :checked="todo.done" @change="toggleDone(todo.id)" />
          <span>{{ todo.text }}</span>
          <button type="button" @click="removeTodo(todo.id)">×</button>
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
