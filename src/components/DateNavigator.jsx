function getDateFromKey(dateKey) {
  return new Date(`${dateKey}T00:00:00`);
}

function formatSelectedDate(dateKey) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(getDateFromKey(dateKey));
}

export default function DateNavigator({
  selectedDate,
  isToday,
  onMoveDate,
  onMoveToday,
}) {
  return (
    <section className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
      <button
        type="button"
        onClick={() => onMoveDate(-1)}
        className="focus-brand-soft rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-100 focus:outline-none"
        aria-label="이전 날짜"
      >
        이전
      </button>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
        <time
          dateTime={selectedDate}
          className="text-center text-sm font-semibold text-slate-800 sm:text-base"
        >
          {formatSelectedDate(selectedDate)}
        </time>

        <button
          type="button"
          onClick={onMoveToday}
          disabled={isToday}
          className="focus-brand-soft rounded-full bg-yellow-100 px-4 py-1.5 text-xs font-semibold text-yellow-800 shadow-sm ring-1 ring-yellow-200 transition hover:bg-yellow-200 hover:text-yellow-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:ring-slate-200 disabled:hover:bg-slate-100"
        >
          오늘
        </button>
      </div>

      <button
        type="button"
        onClick={() => onMoveDate(1)}
        className="focus-brand-soft rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-100 focus:outline-none"
        aria-label="다음 날짜"
      >
        다음
      </button>
    </section>
  );
}
