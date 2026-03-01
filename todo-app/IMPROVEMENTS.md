# Todo App Improvement Plan

This document outlines five improvements that can be implemented in any order. Each feature is described so that work stays **isolated** (minimal coupling), while the **architecture** is consistent across features: a small app-level layer for theme and locale, a shared data/composable layer for todos, and components that consume both.

---

## 1. Dark / Light Mode Toggle with System Detection

**Goal:** User can choose dark, light, or “system” (follow OS). Toggle is visible and preference is persisted.

**Architecture & structure:**
- **Where it lives:** App-level concern. Add a `theme` composable or a tiny store (e.g. `src/composables/useTheme.js` or `src/stores/theme.js`) that:
  - Reads initial value from `localStorage` (key e.g. `todo-app-theme`: `'dark' | 'light' | 'system'`).
  - Listens to `window.matchMedia('(prefers-color-scheme: dark)')` when theme is `'system'`.
  - Exposes `theme`, `setTheme(theme)`, and the **resolved** value (`'dark' | 'light'`) for actual styling.
- **Where it’s applied:** Root element (e.g. `<div id="app">` or a wrapper in `App.vue`) gets a data attribute or class such as `data-theme="dark"` or `class="theme-dark"` bound to the resolved theme. Global CSS (e.g. `src/style.css`) uses this for variables:
  - e.g. `[data-theme="dark"] { --bg: #242424; --text: #fff; }` and `[data-theme="light"] { ... }`.
- **UI:** A small theme switcher component (or inline in the header) with three options: Light, Dark, System. It only calls `setTheme`; the composable handles persistence and `prefers-color-scheme`.

**Isolated work:** No dependency on other features. Reuse existing CSS variables/selectors if you already have light/dark in `:root`; migrate to attribute-based theme so the toggle can override.

---

## 2. Kanban-Style Board and Todos

**Goal:** Todos live in columns (e.g. To Do, In Progress, Done). Users can add items and move them between columns (click or drag-and-drop).

**Architecture & structure:**
- **Data model:** Extend a todo item to include a **status** (or column id) instead of only `done`. Example: `{ id, text, status }` with `status in ['todo','in_progress','done']`. Columns are defined in code (or a small config): list of `{ id, labelKey or label }`.
- **State:** Either keep a single list of todos and derive columns by filtering (e.g. `todos.filter(t => t.status === 'todo')`), or use a composable/store that exposes `todos`, `addTodo`, `updateTodoStatus(id, status)`, and optionally `moveTodo(id, fromStatus, toStatus)`. This same layer can be used by a future “list view” if you add view switching.
- **Components:** 
  - `Board.vue`: layout of columns (flex/grid), renders one `Column.vue` per column.
  - `Column.vue`: title + list of `TodoCard.vue` (or reuse a minimal card component). Emits or calls `updateTodoStatus` when an item is moved in (e.g. drop or “Move to…”).
  - Optional: drag-and-drop via native HTML5 DnD or a small library (e.g. VueDraggable) for “drag card to another column”; can be a follow-up step so the first slice is “click to move” only.
- **Routing:** Not required; single view is enough. If you add a “list view” later, the same todo state feeds both list and board.

**Isolated work:** Can be implemented right after (or in parallel with) introducing a minimal composable/store for todos. Theme and i18n are independent; once i18n exists, column titles can use translation keys.

---

## 3. Localization (English, Spanish, French, German)

**Goal:** UI and static text available in English, Spanish, French, and German. User can switch language; preference persists.

**Architecture & structure:**
- **Libraries:** Use Vue I18n (`vue-i18n`) with a message-per-locale structure. No need for lazy loading at first; bundle all four in the app.
- **Where it lives:** 
  - `src/i18n/` or `src/locales/`: one file per locale (e.g. `en.json`, `es.json`, `fr.json`, `de.json`) or one `index.js` that imports and exports `{ en, es, fr, de }`. Messages: keys for app title, buttons (Add, remove, etc.), column names, theme options, and any placeholders.
  - Plugin created in `src/main.js`: `createApp(App).use(i18n).mount('#app')`. Locale source of truth: e.g. `locale` ref in a small composable `useLocale()` that reads/writes `localStorage` (e.g. `todo-app-locale`) and syncs with `i18n.global.locale`.
- **Usage in components:** `$t('key')` or `useI18n().t('key')`. For Kanban, column labels use keys like `columns.todo`, `columns.in_progress`, `columns.done`.
- **UI:** Locale switcher (dropdown or buttons) in header or settings; calls the composable’s “set locale” and persists. No dependency on theme or board logic.

**Isolated work:** Can be added before or after Kanban. If you add it after, replace hardcoded strings in `App.vue` and in any new components (Board, Column, theme switcher) with `$t(...)`. No change to todo data model.

---

## 4. Local Persistence for Todos and Preferences

**Goal:** Todos and user preferences (theme, locale) survive refresh. All client-side (localStorage or similar).

**Architecture & structure:**
- **Scope:** Persist: (1) list of todos (and their fields: id, text, status for Kanban), (2) theme preference, (3) locale preference. Same keys as in sections 1 and 3 (e.g. `todo-app-theme`, `todo-app-locale`, `todo-app-todos`).
- **Where it lives:** 
  - **Preferences:** Theme and locale composables/stores already read/write localStorage; no new module needed, just ensure they’re used from the start for theme and i18n.
  - **Todos:** Centralize in the same place as todo state (composable or store). On init: `todos = JSON.parse(localStorage.getItem('todo-app-todos') || '[]')`. On every change (add, remove, update status): `localStorage.setItem('todo-app-todos', JSON.stringify(todos))`. Use a watcher or explicit save calls after mutations; keep the persistence layer thin (one read on load, one write per mutation).
- **Shape:** Persisted todos should match the in-memory model (e.g. `{ id, text, status }`). If you add fields later (e.g. due date), include them in the JSON; old saved data can be migrated once on load if needed.

**Isolated work:** Theme and locale persistence are part of their own features. The only new “feature” here is persisting **todos** and ensuring the todo composable/store loads and saves. Can be done before or after Kanban; if after, persist the extended model with `status`.

---

## 5. Composable-Based State Layer (Shared Data and Logic)

**Goal:** Single place for todo CRUD and derived state so that the list view, Kanban board, and persistence all use the same source of truth. Keeps components thin and makes future features (filters, search) easy.

**Architecture & structure:**
- **Composable:** `src/composables/useTodos.js` (or `useTodoStore.js`):
  - State: `todos` (ref array).
  - Actions: `addTodo(text)`, `removeTodo(id)`, `updateTodo(id, payload)` (e.g. `{ text }` or `{ status }`), and optionally `toggleDone(id)` for backward compatibility with the current list.
  - Optional: `loadFromStorage()` / `saveToStorage()` called from the composable (or a separate `useTodoPersistence` that wraps this and syncs to localStorage). Either way, the composable is the only place that mutates `todos`.
- **Usage:** In `App.vue` (list view) and in `Board.vue` or column components: `const { todos, addTodo, removeTodo, updateTodo } = useTodos()`. No prop drilling of the full list; only pass what’s needed to children (e.g. column id for filtering) or use the composable in each component.
- **No Pinia required:** A composable with refs and functions is enough. If the app grows (e.g. multiple boards, user accounts), you can replace this with Pinia later and keep the same interface (add/remove/update).

**Isolated work:** This is the best **first** improvement to implement: refactor current `App.vue` to use `useTodos()` and keep the same UI. Then add persistence inside or beside the composable. After that, Kanban and list view both consume `useTodos()`; theme and i18n stay separate.

---

## Suggested Order and Coherence

- **Phase A (foundation):** (5) Composable state layer → (4) Persist todos (and wire theme/locale persistence when you add 1 and 3).
- **Phase B (UX):** (1) Theme toggle with system detection, (3) Localization — in any order; both are app shell only.
- **Phase C (product):** (2) Kanban board — uses composable and, if present, i18n for column names.

Features stay isolated (each can be merged and tested on its own) while sharing: root-level theme attribute, i18n instance, one todo composable, and localStorage keys for preferences and todos.
