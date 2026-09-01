import { describe, expect, it } from "vitest";
import {
  addTodo,
  clearCompleted,
  createTodo,
  deleteTodo,
  filterTodos,
  remainingCount,
  toggleTodo,
  updateTodo,
  type Todo,
} from "./todos";

function todo(partial: Partial<Todo> & Pick<Todo, "id" | "title">): Todo {
  return {
    completed: false,
    createdAt: 1,
    ...partial,
  };
}

describe("createTodo", () => {
  it("trims the title and starts incomplete", () => {
    const created = createTodo("  Buy milk  ", 42, "todo-1");

    expect(created).toEqual({
      id: "todo-1",
      title: "Buy milk",
      completed: false,
      createdAt: 42,
    });
  });
});

describe("addTodo", () => {
  it("prepends a new todo", () => {
    const existing = [todo({ id: "a", title: "Existing" })];
    const next = addTodo(existing, "New item", 99);

    expect(next).toHaveLength(2);
    expect(next[0]?.title).toBe("New item");
    expect(next[0]?.createdAt).toBe(99);
    expect(next[1]?.id).toBe("a");
  });

  it("ignores blank titles", () => {
    const existing = [todo({ id: "a", title: "Existing" })];

    expect(addTodo(existing, "   ")).toBe(existing);
  });
});

describe("toggleTodo", () => {
  it("flips completed for the matching id only", () => {
    const todos = [
      todo({ id: "a", title: "One" }),
      todo({ id: "b", title: "Two", completed: true }),
    ];

    const next = toggleTodo(todos, "a");

    expect(next[0]?.completed).toBe(true);
    expect(next[1]?.completed).toBe(true);
  });
});

describe("updateTodo", () => {
  it("updates the title", () => {
    const todos = [todo({ id: "a", title: "Old" })];

    expect(updateTodo(todos, "a", "  New  ")[0]?.title).toBe("New");
  });

  it("deletes the todo when the new title is blank", () => {
    const todos = [todo({ id: "a", title: "Gone" })];

    expect(updateTodo(todos, "a", "   ")).toEqual([]);
  });
});

describe("deleteTodo and clearCompleted", () => {
  it("removes a single todo", () => {
    const todos = [
      todo({ id: "a", title: "Keep" }),
      todo({ id: "b", title: "Drop" }),
    ];

    expect(deleteTodo(todos, "b")).toEqual([todos[0]]);
  });

  it("clears only completed todos", () => {
    const todos = [
      todo({ id: "a", title: "Active" }),
      todo({ id: "b", title: "Done", completed: true }),
    ];

    expect(clearCompleted(todos)).toEqual([todos[0]]);
  });
});

describe("filterTodos and remainingCount", () => {
  const todos = [
    todo({ id: "a", title: "Active" }),
    todo({ id: "b", title: "Done", completed: true }),
  ];

  it("filters by status", () => {
    expect(filterTodos(todos, "all")).toHaveLength(2);
    expect(filterTodos(todos, "active")).toEqual([todos[0]]);
    expect(filterTodos(todos, "completed")).toEqual([todos[1]]);
  });

  it("counts remaining active items", () => {
    expect(remainingCount(todos)).toBe(1);
  });
});
