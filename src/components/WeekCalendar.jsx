const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateFromKey(dateKey) {
  return new Date(`${dateKey}T00:00:00`);
}

function getWeekDates(weekStartDate) {
  const startDate = getDateFromKey(weekStartDate);

  return DAY_LABELS.map((dayLabel, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    return {
      dayLabel,
      dateKey: getDateKey(date),
      dayNumber: date.getDate(),
    };
  });
}

export default function WeekCalendar({
  todos,
  selectedDate,
  todayDate,
  weekStartDate,
  onMoveWeek,
  onSelectDate,
}) {
  const weekDates = getWeekDates(weekStartDate);

  return (
    <section className="rounded-2xl bg-slate-50 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onMoveWeek(-1)}
          className="focus-brand-soft rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-100 focus:outline-none sm:text-sm"
          aria-label="이전 주차"
        >
          이전 주
        </button>

        <p className="text-sm font-semibold text-slate-700">주간 보기</p>

        <button
          type="button"
          onClick={() => onMoveWeek(1)}
          className="focus-brand-soft rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-100 focus:outline-none sm:text-sm"
          aria-label="다음 주차"
        >
          다음 주
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date) => {
          const todoCount = todos.filter(
            (todo) => todo.date === date.dateKey,
          ).length;
          const isSelected = date.dateKey === selectedDate;
          const isToday = date.dateKey === todayDate;
          const buttonClassName = [
            "focus-brand-soft flex min-h-20 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-center text-xs font-semibold transition focus:outline-none",
            isSelected
              ? "bg-brand text-white shadow-lg shadow-slate-200"
              : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-100 hover:bg-slate-100",
            isToday && !isSelected ? "text-brand ring-2 ring-slate-200" : "",
          ].join(" ");

          return (
            <button
              type="button"
              key={date.dateKey}
              onClick={() => onSelectDate(date.dateKey)}
              className={buttonClassName}
              aria-pressed={isSelected}
            >
              <span className={isToday ? "font-bold" : ""}>
                {date.dayLabel}
              </span>
              <span className="text-base leading-none">{date.dayNumber}</span>
              <span
                className={
                  isSelected ? "text-white/75" : "text-[11px] text-slate-400"
                }
              >
                {todoCount}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
