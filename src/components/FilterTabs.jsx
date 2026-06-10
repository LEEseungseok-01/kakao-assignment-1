const FILTER_TABS = [
  { id: "all", label: "전체" },
  { id: "active", label: "진행 중" },
  { id: "completed", label: "완료" },
];

export default function FilterTabs({ currentFilter, filterCounts, onChangeFilter }) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
      {FILTER_TABS.map((filter) => {
        const isSelected = currentFilter === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChangeFilter(filter.id)}
            className={`focus-brand-soft rounded-xl px-3 py-3 text-sm font-semibold transition focus:outline-none ${
              isSelected
                ? "bg-brand text-white shadow-sm"
                : "text-slate-500 hover:bg-white hover:text-slate-700"
            }`}
          >
            {filter.label} [{filterCounts[filter.id]}]
          </button>
        );
      })}
    </div>
  );
}
