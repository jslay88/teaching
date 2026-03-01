import { ref, computed } from 'vue'

const STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
}

export const COLUMNS = [
  { id: STATUS.TODO, label: 'To Do' },
  { id: STATUS.IN_PROGRESS, label: 'In Progress' },
  { id: STATUS.DONE, label: 'Done' },
]

const todos = ref([])

/**
 * Composable for todo CRUD and derived state. Single source of truth for list view,
 * Kanban board, and persistence. Uses status (todo|in_progress|done); done = status === 'done'.
 */
export function useTodos() {
  const todosByStatus = (status) =>
    computed(() => todos.value.filter((t) => t.status === status))

  function addTodo(text) {
    const trimmed = (text || '').trim()
    if (!trimmed) return
    todos.value.push({
      id: Date.now(),
      text: trimmed,
      status: STATUS.TODO,
    })
  }

  function removeTodo(id) {
    todos.value = todos.value.filter((t) => t.id !== id)
  }

  function updateTodo(id, payload) {
    const index = todos.value.findIndex((x) => x.id === id)
    if (index === -1) return
    const t = todos.value[index]
    const updated = {
      ...t,
      ...(payload.text !== undefined && { text: payload.text }),
      ...(payload.status !== undefined && { status: payload.status }),
      ...(payload.done !== undefined && { status: payload.done ? STATUS.DONE : STATUS.TODO }),
    }
    todos.value = todos.value.slice(0, index).concat(updated, todos.value.slice(index + 1))
  }

  function updateTodoStatus(id, status) {
    updateTodo(id, { status })
  }

  function toggleDone(id) {
    const t = todos.value.find((x) => x.id === id)
    if (!t) return
    updateTodo(id, { status: t.status === STATUS.DONE ? STATUS.TODO : STATUS.DONE })
  }

  return {
    todos,
    COLUMNS,
    STATUS,
    todosByStatus,
    addTodo,
    removeTodo,
    updateTodo,
    updateTodoStatus,
    toggleDone,
  }
}
