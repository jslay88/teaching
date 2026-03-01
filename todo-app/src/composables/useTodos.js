import { ref } from 'vue'

const todos = ref([])

/**
 * Composable for todo CRUD and derived state. Single source of truth for list view,
 * Kanban board, and future persistence. Components use this instead of prop drilling.
 *
 * @returns {{ todos: Ref<Todo[]>, addTodo: (text: string) => void, removeTodo: (id: number) => void, updateTodo: (id: number, payload: { text?: string, done?: boolean }) => void, toggleDone: (id: number) => void }}
 */
export function useTodos() {
  function addTodo(text) {
    const trimmed = (text || '').trim()
    if (trimmed) {
      todos.value.push({ id: Date.now(), text: trimmed, done: false })
    }
  }

  function removeTodo(id) {
    todos.value = todos.value.filter((t) => t.id !== id)
  }

  function updateTodo(id, payload) {
    const t = todos.value.find((x) => x.id === id)
    if (t && payload) {
      if (payload.text !== undefined) t.text = payload.text
      if (payload.done !== undefined) t.done = payload.done
    }
  }

  function toggleDone(id) {
    const t = todos.value.find((x) => x.id === id)
    if (t) t.done = !t.done
  }

  return {
    todos,
    addTodo,
    removeTodo,
    updateTodo,
    toggleDone,
  }
}
