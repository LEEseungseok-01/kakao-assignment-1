export default function TodoForm({
  inputValue,
  message,
  onChangeInput,
  onSubmit,
}) {
  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit}>
      <div className="flex gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(event) => onChangeInput(event.target.value)}
          placeholder="오늘 할 일을 입력하세요"
          className="focus-brand min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 outline-none transition"
        />
        <button
          type="submit"
          className="bg-brand hover:bg-brand-dark focus-brand-soft shrink-0 rounded-2xl px-6 py-4 text-base font-semibold text-white shadow-sm transition focus:outline-none"
        >
          추가
        </button>
      </div>

      <p className="min-h-5 text-sm font-medium text-red-500">{message}</p>
    </form>
  );
}
