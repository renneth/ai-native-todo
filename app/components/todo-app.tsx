"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  getServerTodoSnapshot,
  getTodoSnapshot,
  hydrateTodoStore,
  isTodoStoreHydrated,
  subscribeTodos,
  writeTodos,
} from "@/lib/todo-store";
import {
  addTodo,
  clearCompleted,
  deleteTodo,
  filterTodos,
  remainingCount,
  toggleTodo,
  updateTodo,
  type Todo,
  type TodoFilter,
} from "@/lib/todos";

const FILTERS: { id: TodoFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
];

export function TodoApp() {
  const todos = useSyncExternalStore(
    subscribeTodos,
    getTodoSnapshot,
    getServerTodoSnapshot,
  );
  const ready = useSyncExternalStore(
    subscribeTodos,
    isTodoStoreHydrated,
    () => false,
  );
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

  useEffect(() => {
    hydrateTodoStore();
  }, []);

  const visible = useMemo(() => filterTodos(todos, filter), [filter, todos]);
  const remaining = remainingCount(todos);
  const completedCount = todos.length - remaining;

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = String(new FormData(event.currentTarget).get("title") ?? "");
    writeTodos(addTodo(todos, title));
    event.currentTarget.reset();
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditDraft(todo.title);
  }

  function commitEdit(title: string) {
    if (!editingId) {
      return;
    }

    writeTodos(updateTodo(todos, editingId, title));
    setEditingId(null);
    setEditDraft("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft("");
  }

  function handleEditKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitEdit(event.currentTarget.value);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelEdit();
    }
  }

  return (
    <div className="w-full max-w-xl">
      <header className="mb-8">
        <p className="text-sm font-medium tracking-[0.18em] text-zinc-500 uppercase">
          AI-native sandbox
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Todo
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Add, complete, and edit tasks. They stay in this browser only.
        </p>
      </header>

      <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <form
          onSubmit={handleAdd}
          className="flex gap-2 border-b border-zinc-200 p-4 dark:border-zinc-800"
        >
          <label htmlFor="new-todo" className="sr-only">
            New todo
          </label>
          <input
            id="new-todo"
            name="title"
            placeholder="What needs doing?"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-600"
          />
          <button
            type="submit"
            className="rounded-xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Add
          </button>
        </form>

        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {!ready ? (
            <li className="px-4 py-8 text-center text-sm text-zinc-500">
              Loading…
            </li>
          ) : visible.length === 0 ? (
            <li className="px-4 py-10 text-center text-sm text-zinc-500">
              {todos.length === 0
                ? "Your list is empty. Add a first task above."
                : filter === "active"
                  ? "Nothing left to do."
                  : "No completed tasks yet."}
            </li>
          ) : (
            visible.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                <input
                  id={`todo-${item.id}`}
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => writeTodos(toggleTodo(todos, item.id))}
                  className="size-4 shrink-0 rounded border-zinc-300 accent-zinc-950 dark:accent-zinc-100"
                />
                {editingId === item.id ? (
                  <input
                    aria-label="Edit todo"
                    value={editDraft}
                    onChange={(event) => setEditDraft(event.target.value)}
                    onBlur={(event) => commitEdit(event.currentTarget.value)}
                    onKeyDown={handleEditKey}
                    autoFocus
                    className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-2 py-1 text-base outline-none dark:border-zinc-700 dark:bg-zinc-900"
                  />
                ) : (
                  <label
                    htmlFor={`todo-${item.id}`}
                    className={`min-w-0 flex-1 text-base ${
                      item.completed
                        ? "text-zinc-400 line-through"
                        : "text-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    {item.title}
                  </label>
                )}
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="rounded-lg px-2 py-1 text-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${item.title}`}
                  onClick={() => writeTodos(deleteTodo(todos, item.id))}
                  className="rounded-lg px-2 py-1 text-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>

        <footer className="flex flex-col gap-3 border-t border-zinc-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
          <p className="text-sm text-zinc-500">
            {remaining} {remaining === 1 ? "item" : "items"} left
          </p>
          <div className="flex gap-1" role="group" aria-label="Filter todos">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
                className={`rounded-lg px-3 py-1 text-sm ${
                  filter === item.id
                    ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={completedCount === 0}
            onClick={() => writeTodos(clearCompleted(todos))}
            className="text-left text-sm text-zinc-500 hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:text-zinc-200"
          >
            Clear completed
          </button>
        </footer>
      </section>
    </div>
  );
}
