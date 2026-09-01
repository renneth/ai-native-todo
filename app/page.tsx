import { TodoApp } from "./components/todo-app";

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-100 px-4 py-16 font-sans dark:bg-black">
      <TodoApp />
    </div>
  );
}
