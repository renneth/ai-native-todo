import { loadTodos, saveTodos } from "./storage";
import type { Todo } from "./todos";

const EMPTY: Todo[] = [];

let snapshot: Todo[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeTodos(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getTodoSnapshot() {
  return snapshot;
}

export function getServerTodoSnapshot() {
  return EMPTY;
}

export function isTodoStoreHydrated() {
  return hydrated;
}

export function hydrateTodoStore() {
  if (hydrated || typeof window === "undefined") {
    return;
  }

  snapshot = loadTodos();
  hydrated = true;
  emit();
}

export function writeTodos(next: Todo[]) {
  snapshot = next;
  saveTodos(next);
  emit();
}
