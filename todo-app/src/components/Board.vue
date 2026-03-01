<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTodos } from '../composables/useTodos'
import Column from './Column.vue'

const { t } = useI18n()
const { COLUMNS, todosByStatus, removeTodo, updateTodoStatus } = useTodos()

const columnsWithLabels = computed(() =>
  COLUMNS.map((col) => ({ id: col.id, label: t(`columns.${col.id}`) }))
)

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
      v-for="col in columnsWithLabels"
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
