<script setup>
import { ref } from 'vue'
import { useTodos } from './composables/useTodos'
import Board from './components/Board.vue'

const { addTodo } = useTodos()
const input = ref('')

function add() {
  addTodo(input.value)
  input.value = ''
}
</script>

<template>
  <div class="app">
    <h1>Todo</h1>
    <form @submit.prevent="add" class="add-form">
      <input v-model="input" placeholder="What to do?" />
      <button type="submit">Add</button>
    </form>
    <Board />
  </div>
</template>

<style scoped>
.app {
  max-width: 1100px;
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
  max-width: 400px;
  padding: 0.5rem;
  font-size: 1rem;
}
</style>
