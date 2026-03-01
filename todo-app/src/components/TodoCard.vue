<script setup>
defineProps({
  todo: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['remove', 'move'])

function remove() {
  emit('remove', todo.id)
}

function onMove(e) {
  const status = e.target.value
  if (status && status !== todo.status) emit('move', { id: todo.id, status })
}
</script>

<template>
  <article class="todo-card">
    <p class="todo-card__text">{{ todo.text }}</p>
    <div class="todo-card__actions">
      <select
        class="todo-card__select"
        :value="todo.status"
        @change="onMove"
      >
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button
        type="button"
        class="todo-card__remove"
        aria-label="Remove"
        @click="remove"
      >
        ×
      </button>
    </div>
  </article>
</template>

<style scoped>
.todo-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
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
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  color: inherit;
}

.todo-card__remove {
  margin-left: auto;
  padding: 0.2rem 0.5rem;
  font-size: 1.2rem;
  line-height: 1;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
}

.todo-card__remove:hover {
  color: #f66;
}
</style>
