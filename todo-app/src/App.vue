<script setup>
import { ref } from 'vue'
import { useTodos } from './composables/useTodos.js'

const { todos, addTodo, removeTodo, toggleDone } = useTodos()
const input = ref('')

function add() {
  const text = input.value.trim()
  if (text) {
    addTodo(text)
    input.value = ''
  }
}
</script>

<template>
  <div class="app">
    <h1>Todo</h1>
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
</template>

<style scoped>
.app {
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
}
h1 {
  margin: 0 0 1rem;
  font-size: 1.5rem;
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
