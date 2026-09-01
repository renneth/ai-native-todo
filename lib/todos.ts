export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

export type TodoFilter = "all" | "active" | "completed";

export function createTodo(
  title: string,
  now = Date.now(),
  id = crypto.randomUUID(),
): Todo {
  return {
    id,
    title: title.trim(),
    completed: false,
    createdAt: now,
  };
}

export function addTodo(todos: Todo[], title: string, now?: number): Todo[] {
  const trimmed = title.trim();
  if (!trimmed) {
    return todos;
  }

  return [createTodo(trimmed, now), ...todos];
}

export function toggleTodo(todos: Todo[], id: string): Todo[] {
  return todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo,
  );
}

export function updateTodo(todos: Todo[], id: string, title: string): Todo[] {
  const trimmed = title.trim();
  if (!trimmed) {
    return deleteTodo(todos, id);
  }

  return todos.map((todo) =>
    todo.id === id ? { ...todo, title: trimmed } : todo,
  );
}

export function deleteTodo(todos: Todo[], id: string): Todo[] {
  return todos.filter((todo) => todo.id !== id);
}

export function clearCompleted(todos: Todo[]): Todo[] {
  return todos.filter((todo) => !todo.completed);
}

export function filterTodos(todos: Todo[], filter: TodoFilter): Todo[] {
  switch (filter) {
    case "active":
      return todos.filter((todo) => !todo.completed);
    case "completed":
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
}

export function remainingCount(todos: Todo[]): number {
  return todos.filter((todo) => !todo.completed).length;
}
