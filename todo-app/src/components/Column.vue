<script setup>
import { ref } from 'vue'
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

const dragOver = ref(false)

function onRemove(id) {
  emit('remove', id)
}

function onMove({ id, status }) {
  emit('move', { id, status })
}

function onDragOver(e) {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
  dragOver.value = true
}

function onDragLeave() {
  dragOver.value = false
}

function onDrop(e) {
  e.preventDefault()
  dragOver.value = false
  const raw = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('application/json')
  let id
  try {
    const parsed = JSON.parse(raw)
    id = typeof parsed === 'object' && parsed != null && 'id' in parsed ? parsed.id : raw
  } catch {
    id = raw
  }
  id = typeof id === 'number' ? id : Number(id)
  if (Number.isNaN(id)) return
  const status = props.column.id
  emit('move', { id, status })
}
</script>

<template>
  <section class="column">
    <h2 class="column__title">{{ column.label }}</h2>
    <div
      class="column__cards"
      :class="{ 'column__cards--drag-over': dragOver }"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
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
  background: var(--input-bg);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid var(--border);
}

.column__title {
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
}

.column__cards {
  min-height: 80px;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.column__cards--drag-over {
  background: var(--input-border);
  outline: 2px dashed var(--text-muted);
  outline-offset: -2px;
}
</style>
