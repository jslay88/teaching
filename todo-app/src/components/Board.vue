<script setup>
import { useTodos } from '../composables/useTodos'
import Column from './Column.vue'

const { COLUMNS, todosByStatus, removeTodo, updateTodoStatus } = useTodos()

function onRemove(id) {
  removeTodo(id)
}

function onMove({ id, status }) {
  updateTodoStatus(id, status)
}
</script>

<template>
  <div class="board">
    <Column
      v-for="col in COLUMNS"
      :key="col.id"
      :column="col"
      :todos="todosByStatus(col.id).value"
      @remove="onRemove"
      @move="onMove"
    />
  </div>
</template>

<style scoped>
.board {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}
</style>
