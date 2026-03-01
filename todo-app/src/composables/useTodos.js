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
    const t = todos.value.find((x) => x.id === id)
    if (!t) return
    if (payload.text !== undefined) t.text = payload.text
    if (payload.status !== undefined) t.status = payload.status
  }

  function updateTodoStatus(id, status) {
    updateTodo(id, { status })
  }

  function toggleDone(id) {
    const t = todos.value.find((x) => x.id === id)
    if (!t) return
    t.status = t.status === STATUS.DONE ? STATUS.TODO : STATUS.DONE
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
