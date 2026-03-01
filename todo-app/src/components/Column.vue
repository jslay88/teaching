<script setup>
import TodoCard from './TodoCard.vue'

const props = defineProps({
  column: {
    type: Object,
    required: true,
  },
  todos: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['remove', 'move'])

function onRemove(id) {
  emit('remove', id)
}

function onMove({ id, status }) {
  emit('move', { id, status })
}
</script>

<template>
  <section class="column">
    <h2 class="column__title">{{ column.label }}</h2>
    <div class="column__cards">
      <TodoCard
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @remove="onRemove"
        @move="onMove"
      />
    </div>
  </section>
</template>

<style scoped>
.column {
  flex: 1;
  min-width: 200px;
  max-width: 320px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.column__title {
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.column__cards {
  min-height: 80px;
}
</style>
