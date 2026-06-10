import TodoItem from "./TodoItem";

export default function TodoList({
  todos,
  onStartEdit,
  onSaveTodo,
  onCancelEdit,
  onToggleTodo,
  onDeleteTodo,
}) {
  // 완료되지 않은 Todo를 먼저 보여주기 위해 원본 배열을 복사해서 정렬한다.
  const sortedTodos = [...todos].sort(
    (firstTodo, secondTodo) =>
      Number(firstTodo.isCompleted) - Number(secondTodo.isCompleted),
  );

  if (sortedTodos.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
        아직 등록된 할 일이 없습니다.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {sortedTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onStartEdit={onStartEdit}
          onSaveTodo={onSaveTodo}
          onCancelEdit={onCancelEdit}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  );
}
