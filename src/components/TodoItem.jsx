import { useState } from "react";

export default function TodoItem({
  todo,
  onStartEdit,
  onSaveTodo,
  onCancelEdit,
  onToggleTodo,
  onDeleteTodo,
}) {
  const [editText, setEditText] = useState(todo.text);

  const saveEdit = () => {
    onSaveTodo(todo.id, editText);
  };

  const startEdit = () => {
    setEditText(todo.text);
    onStartEdit(todo.id);
  };

  const cancelEdit = () => {
    setEditText(todo.text);
    onCancelEdit(todo.id);
  };

  const handleEditKeyDown = (event) => {
    if (event.key === "Enter") {
      saveEdit();
    }
  };

  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {todo.isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(event) => setEditText(event.target.value)}
          onKeyDown={handleEditKeyDown}
          className="focus-brand min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition"
          autoFocus
        />
      ) : (
        <span
          className={`min-w-0 flex-1 text-left text-base ${
            todo.isCompleted
              ? "text-slate-400 line-through"
              : "text-slate-800"
          }`}
        >
          {todo.text}
        </span>
      )}

      <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
        {todo.isEditing ? (
          <>
            <button
              type="button"
              onClick={saveEdit}
              className="bg-brand hover:bg-brand-dark focus-brand-soft rounded-xl px-4 py-2 text-sm font-semibold text-white transition focus:outline-none"
            >
              저장
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
            >
              취소
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={startEdit}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-100"
            >
              수정
            </button>
            <button
              type="button"
              onClick={() => onToggleTodo(todo.id)}
              className="bg-brand-soft text-brand hover:bg-brand-soft-strong focus-brand-soft rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none"
            >
              완료
            </button>
            <button
              type="button"
              onClick={() => onDeleteTodo(todo.id)}
              className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
            >
              삭제
            </button>
          </>
        )}
      </div>
    </li>
  );
}
