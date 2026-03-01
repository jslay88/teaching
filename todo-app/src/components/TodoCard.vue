<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['remove', 'move'])

function remove() {
  emit('remove', props.todo.id)
}

function onMove(e) {
  const status = e.target.value
  if (status && status !== props.todo.status) emit('move', { id: props.todo.id, status })
}

function onDragStart(e) {
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('application/json', JSON.stringify({ id: props.todo.id }))
  e.dataTransfer.setData('text/plain', String(props.todo.id))
  e.target.classList.add('todo-card--dragging')
}

function onDragEnd(e) {
  e.target.classList.remove('todo-card--dragging')
}
</script>

<template>
  <article
    class="todo-card"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <p class="todo-card__text">{{ todo.text }}</p>
    <div class="todo-card__actions">
      <select
        class="todo-card__select"
        :value="todo.status"
        @change="onMove"
      >
        <option value="todo">{{ t('columns.todo') }}</option>
        <option value="in_progress">{{ t('columns.in_progress') }}</option>
        <option value="done">{{ t('columns.done') }}</option>
      </select>
      <button
        type="button"
        class="todo-card__remove"
        :aria-label="t('buttons.remove')"
        @click="remove"
      >
        ×
      </button>
    </div>
  </article>
</template>

<style scoped>
.todo-card {
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  cursor: grab;
}

.todo-card:active {
  cursor: grabbing;
}

.todo-card__text {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  line-height: 1.4;
}

.todo-card__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.todo-card__select {
  padding: 0.25rem 0.5rem;
  font-size: 0.85rem;
  border-radius: 4px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--text);
}

.todo-card__remove {
  margin-left: auto;
  padding: 0.2rem 0.5rem;
  font-size: 1.2rem;
  line-height: 1;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}

.todo-card__remove:hover {
  color: #f66;
}

.todo-card--dragging {
  opacity: 0.5;
}
</style>
