import { useEffect, useState } from "react";
import DateNavigator from "./components/DateNavigator";
import FilterTabs from "./components/FilterTabs";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import WeekCalendar from "./components/WeekCalendar";

const STORAGE_KEY = "todoAppTodos";

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateFromKey(dateKey) {
  return new Date(`${dateKey}T00:00:00`);
}

function getWeekStartDate(dateKey) {
  const date = getDateFromKey(dateKey);
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + mondayOffset);

  return getDateKey(date);
}

const TODAY_DATE_KEY = getDateKey(new Date());

function loadSavedTodos() {
  const savedTodos = localStorage.getItem(STORAGE_KEY);

  if (!savedTodos) {
    return [];
  }

  try {
    const parsedTodos = JSON.parse(savedTodos);
    return Array.isArray(parsedTodos) ? parsedTodos : [];
  } catch {
    return [];
  }
}

function App() {
  const [todos, setTodos] = useState(() => loadSavedTodos());
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(TODAY_DATE_KEY);
  const [weekStartDate, setWeekStartDate] = useState(() =>
    getWeekStartDate(TODAY_DATE_KEY),
  );

  // todos 상태가 바뀔 때마다 로컬스토리지에 자동 저장한다.
  useEffect(() => {
    let messageTimer;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      messageTimer = window.setTimeout(() => {
        setMessage("Todo를 저장하지 못했습니다.");
      }, 0);
    }

    return () => {
      if (messageTimer) {
        window.clearTimeout(messageTimer);
      }
    };
  }, [todos]);

  const dailyTodos = todos.filter((todo) => todo.date === selectedDate);

  // 선택된 날짜의 Todo 중 현재 필터에 맞는 Todo만 TodoList에 전달한다.
  const filteredTodos = dailyTodos.filter((todo) => {
    if (currentFilter === "active") {
      return !todo.isCompleted;
    }

    if (currentFilter === "completed") {
      return todo.isCompleted;
    }

    return true;
  });

  const filterCounts = {
    all: dailyTodos.length,
    active: dailyTodos.filter((todo) => !todo.isCompleted).length,
    completed: dailyTodos.filter((todo) => todo.isCompleted).length,
  };

  // 일간 뷰와 주간 뷰가 같은 날짜를 바라보도록 선택 날짜와 주차를 함께 갱신한다.
  const changeSelectedDate = (dateKey) => {
    setSelectedDate(dateKey);
    setWeekStartDate(getWeekStartDate(dateKey));
    setMessage("");
  };

  // 이전/다음 버튼을 누르면 선택 날짜를 하루 단위로 이동한다.
  const moveSelectedDate = (dayAmount) => {
    const nextDate = getDateFromKey(selectedDate);
    nextDate.setDate(nextDate.getDate() + dayAmount);
    changeSelectedDate(getDateKey(nextDate));
  };

  // 선택 날짜를 오늘 날짜로 되돌린다.
  const moveToday = () => {
    changeSelectedDate(TODAY_DATE_KEY);
  };

  // 이전/다음 주차 버튼을 누르면 선택 날짜도 같은 요일 기준으로 7일 이동한다.
  const moveWeek = (weekAmount) => {
    const nextSelectedDate = getDateFromKey(selectedDate);
    nextSelectedDate.setDate(nextSelectedDate.getDate() + weekAmount * 7);
    changeSelectedDate(getDateKey(nextSelectedDate));
  };

  // 입력값을 검사한 뒤 새 Todo 객체를 상태 배열에 추가한다.
  const addTodo = (event) => {
    event.preventDefault();

    const trimmedText = inputValue.trim();

    if (!trimmedText) {
      setMessage("할 일을 입력해주세요!");
      return;
    }

    const newTodoId = Date.now() + todos.length;
    const newTodo = {
      id: newTodoId,
      text: trimmedText,
      isCompleted: false,
      isEditing: false,
      date: selectedDate,
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
    setMessage("");
  };

  // 선택한 Todo만 수정 모드로 전환한다.
  const startEditTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: true } : todo,
      ),
    );
    setMessage("");
  };

  // 수정 입력값이 비어 있지 않을 때 Todo 내용을 저장한다.
  const saveTodo = (id, nextText) => {
    const trimmedText = nextText.trim();

    if (!trimmedText) {
      setMessage("할 일을 입력해주세요!");
      return;
    }

    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, text: trimmedText, isEditing: false }
          : todo,
      ),
    );
    setMessage("");
  };

  // 수정 내용을 저장하지 않고 일반 보기 상태로 되돌린다.
  const cancelEditTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: false } : todo,
      ),
    );
    setMessage("");
  };

  // 완료 상태를 반대로 바꿔 취소선과 정렬 상태를 갱신한다.
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo,
      ),
    );
    setMessage("");
  };

  // 선택한 Todo를 배열에서 제거한다.
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950">
      <section className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-3xl bg-white px-6 py-8 shadow-2xl shadow-slate-200/80 ring-1 ring-black/5 sm:px-8">
        <header className="text-center">
          <p className="text-brand text-xs font-semibold uppercase tracking-widest">
            React Todo
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
            Todo List
          </h1>
        </header>

        <DateNavigator
          selectedDate={selectedDate}
          isToday={selectedDate === TODAY_DATE_KEY}
          onMoveDate={moveSelectedDate}
          onMoveToday={moveToday}
        />

        <WeekCalendar
          todos={todos}
          selectedDate={selectedDate}
          todayDate={TODAY_DATE_KEY}
          weekStartDate={weekStartDate}
          onMoveWeek={moveWeek}
          onSelectDate={changeSelectedDate}
        />

        <TodoForm
          inputValue={inputValue}
          message={message}
          onChangeInput={setInputValue}
          onSubmit={addTodo}
        />

        <FilterTabs
          currentFilter={currentFilter}
          filterCounts={filterCounts}
          onChangeFilter={setCurrentFilter}
        />

        <TodoList
          todos={filteredTodos}
          onStartEdit={startEditTodo}
          onSaveTodo={saveTodo}
          onCancelEdit={cancelEditTodo}
          onToggleTodo={toggleTodo}
          onDeleteTodo={deleteTodo}
        />
      </section>
    </main>
  );
}

export default App;
