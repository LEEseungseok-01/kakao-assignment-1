const todoForm = document.querySelector("#todoForm");
const todoInput = document.querySelector("#todoInput");
const todoList = document.querySelector("#todoList");
const message = document.querySelector("#message");
const filterTabs = document.querySelector("#filterTabs");
const filterButtons = document.querySelectorAll(".filter-button");
const currentDate = document.querySelector("#currentDate");
const prevWeekButton = document.querySelector("#prevWeekButton");
const nextWeekButton = document.querySelector("#nextWeekButton");
const todayButton = document.querySelector("#todayButton");
const weekDays = document.querySelector("#weekDays");
const progressPanel = document.querySelector(".progress-panel");
const progressPercent = document.querySelector("#progressPercent");
const progressFill = document.querySelector("#progressFill");
const progressText = document.querySelector("#progressText");

const STORAGE_KEY = "todoAppTodos";

let todos = [];
let currentFilter = "all";
let selectedDate = getDateKey(new Date());
let nextTodoId = Date.now();

// 현재 todos 배열을 기준으로 화면의 목록을 다시 그린다.
function renderTodos() {
  todoList.innerHTML = "";
  renderSelectedDate();
  renderWeekDays();
  updateDailyProgress();
  updateFilterCounts();

  const dailyTodos = todos.filter((todo) => todo.date === selectedDate);

  // 완료되지 않은 Todo를 위에, 완료된 Todo를 아래에 표시한다.
  const sortedTodos = [...dailyTodos].sort((a, b) => {
    return Number(a.isCompleted) - Number(b.isCompleted);
  });

  const filteredTodos = sortedTodos.filter((todo) => {
    if (currentFilter === "active") {
      return !todo.isCompleted;
    }

    if (currentFilter === "completed") {
      return todo.isCompleted;
    }

    return true;
  });

  filteredTodos.forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.className = "todo-item";

    if (todo.isCompleted) {
      todoItem.classList.add("is-completed");
    }

    let todoContent;

    if (todo.isEditing) {
      const editInput = document.createElement("input");
      editInput.className = "edit-input";
      editInput.value = todo.text;
      
      editInput.addEventListener("keydown", (event)=>{
        if(event.key === "Enter"){
          saveEditTodo(todo.id, editInput.value);
        }
      });
      
      todoContent = editInput;
    } else {
      const todoText = document.createElement("span");
      todoText.className = "todo-text";
      todoText.textContent = todo.text;

      todoContent = todoText;
    }

    const actionBox = document.createElement("div");
    actionBox.className = "todo-actions";

    if (todo.isEditing) {
      const saveButton = createActionButton("저장", () => saveEditTodo(todo.id, todoContent.value));
      const cancelButton = createActionButton("취소", () => cancelEditTodo(todo.id));
      cancelButton.classList.add("cancel-button");

      actionBox.append(saveButton, cancelButton);
    } else {
      const editButton = createActionButton("수정", () => startEditTodo(todo.id));
      const completeButton = createActionButton("완료", () => toggleTodo(todo.id));
      const deleteButton = createActionButton("삭제", () => deleteTodo(todo.id));
      deleteButton.classList.add("delete-button");

      actionBox.append(editButton, completeButton, deleteButton);
    }

    todoItem.append(todoContent, actionBox);
    todoList.append(todoItem);
  });
}

// Date 객체를 YYYY-MM-DD 형태의 날짜 키로 변환한다.
function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// 빠르게 Todo를 연속 생성해도 중복되지 않는 id를 만든다.
function createTodoId() {
  nextTodoId += 1;
  return nextTodoId;
}

// todos 배열을 문자열로 바꿔 로컬스토리지에 저장한다.
function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    showMessage("저장 공간이 부족해 Todo를 저장하지 못했습니다.");
  }
}

// 로컬스토리지에 저장된 문자열을 다시 배열로 바꿔 todos에 복원한다.
function loadTodos() {
  const savedTodos = localStorage.getItem(STORAGE_KEY);

  if (!savedTodos) {
    return;
  }

  try {
    const parsedTodos = JSON.parse(savedTodos);
    todos = Array.isArray(parsedTodos) ? parsedTodos : [];
    syncNextTodoId();
  } catch (error) {
    todos = [];
  }
}

// 저장된 Todo id 중 가장 큰 값 이후부터 새 id를 만들도록 기준값을 맞춘다.
function syncNextTodoId() {
  const maxTodoId = todos.reduce((maxId, todo) => {
    if (typeof todo.id !== "number") {
      return maxId;
    }

    return Math.max(maxId, todo.id);
  }, Date.now());

  nextTodoId = maxTodoId;
}

// 날짜 키를 Date 객체로 바꿔 날짜 이동 계산에 사용한다.
function getDateFromKey(dateKey) {
  return new Date(`${dateKey}T00:00:00`);
}

// 선택된 날짜를 사용자가 읽기 좋은 형식으로 화면에 표시한다.
function renderSelectedDate() {
  const date = getDateFromKey(selectedDate);
  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);

  currentDate.textContent = formattedDate;
  updateTodayButtonState();
}

// 선택된 날짜가 포함된 주의 월요일 날짜를 구한다.
function getWeekStartDate(dateKey) {
  const date = getDateFromKey(dateKey);
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + mondayOffset);
  return date;
}

// 선택된 날짜의 주간 날짜 버튼을 그린다.
function renderWeekDays() {
  weekDays.innerHTML = "";

  const weekStartDate = getWeekStartDate(selectedDate);
  const todayKey = getDateKey(new Date());
  const dayNames = ["월", "화", "수", "목", "금", "토", "일"];

  dayNames.forEach((dayName, index) => {
    const date = new Date(weekStartDate);
    date.setDate(weekStartDate.getDate() + index);

    const dateKey = getDateKey(date);
    const todoCount = todos.filter((todo) => todo.date === dateKey).length;
    const dayButton = document.createElement("button");
    dayButton.type = "button";
    dayButton.className = "week-day-button";
    dayButton.dataset.date = dateKey;

    if (dateKey === selectedDate) {
      dayButton.classList.add("is-selected");
    }

    if (dateKey === todayKey) {
      dayButton.classList.add("is-today");
    }

    dayButton.innerHTML = `
      <span class="week-day-name">${dayName}</span>
      <span class="week-day-number">${date.getDate()}</span>
      <span class="week-day-count">${todoCount}개</span>
    `;

    weekDays.append(dayButton);
  });
}

// 선택한 날짜로 이동한 뒤 목록을 다시 그린다.
function changeSelectedDate(dateKey) {
  selectedDate = dateKey;
  renderTodos();
}

// 이전 또는 다음 주차로 이동한 뒤 목록을 다시 그린다.
function moveSelectedWeek(weekAmount) {
  const date = getDateFromKey(selectedDate);
  date.setDate(date.getDate() + weekAmount * 7);
  selectedDate = getDateKey(date);

  renderTodos();
}

// 선택된 날짜를 오늘 날짜로 되돌린다.
function moveToday() {
  selectedDate = getDateKey(new Date());
  renderTodos();
}

// 선택된 날짜가 오늘이면 오늘 버튼을 비활성화한다.
function updateTodayButtonState() {
  todayButton.disabled = selectedDate === getDateKey(new Date());
}

//TODO 상태 개수 -> 탭에 표시
function updateFilterCounts() {
  const dailyTodos = todos.filter((todo) => todo.date === selectedDate);
  const allCount = dailyTodos.length;
  const activeCount = dailyTodos.filter((todo) => !todo.isCompleted).length;
  const completedCount = dailyTodos.filter((todo) => todo.isCompleted).length;

  filterButtons.forEach((button) => {
    if (button.dataset.filter === "all") {
      button.textContent = `전체 [${allCount}]`;
    }

    if (button.dataset.filter === "active") {
      button.textContent = `진행 중 [${activeCount}]`;
    }

    if (button.dataset.filter === "completed") {
      button.textContent = `완료 [${completedCount}]`;
    }
  });
}

// 선택된 날짜의 완료 비율을 계산해 진행바에 반영한다.
function updateDailyProgress() {
  const dailyTodos = todos.filter((todo) => todo.date === selectedDate);
  const completedCount = dailyTodos.filter((todo) => todo.isCompleted).length;
  const totalCount = dailyTodos.length;
  const progressRate = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  progressPanel.classList.toggle("is-empty", totalCount === 0);
  progressPercent.textContent = `${progressRate}%`;
  progressFill.style.width = `${progressRate}%`;

  if (totalCount === 0) {
    progressText.textContent = "선택한 날짜에 할 일이 없습니다.";
    return;
  }

  progressText.textContent = `${totalCount}개 중 ${completedCount}개 완료`;
}


// 선택된 필터값을 바꾸고 탭의 활성 스타일을 갱신한다.
function changeFilter(filter) {
  currentFilter = filter;

  filterButtons.forEach((button) => {
    const isSelected = button.dataset.filter === currentFilter;
    button.classList.toggle("is-active", isSelected);
  });

  renderTodos();
}

// 버튼 생성 로직을 함수로 분리해 반복되는 DOM 코드를 줄인다.
function createActionButton(text, clickHandler) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "action-button";
  button.textContent = text;
  button.addEventListener("click", clickHandler);

  return button;
}

// 입력값을 검사한 뒤 새 Todo 객체를 만들어 배열에 추가한다.
function addTodo(text) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    showMessage("할 일을 입력해주세요!");
    return;
  }

  const newTodo = {
    id: createTodoId(),
    text: trimmedText,
    date: selectedDate,
    isCompleted: false,
    isEditing: false,
  };

  todos.push(newTodo);
  todoInput.value = "";
  showMessage("");
  saveTodos();
  renderTodos();
}

function startEditTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id !== id) return todo;

    return {
      ...todo,
      isEditing: true,
    };
  });

  renderTodos();
}

// 수정 입력값을 검사한 뒤 Todo 내용을 저장한다.
function saveEditTodo(id, text) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    showMessage("할 일을 입력해주세요!");
    return;
  }

  todos = todos.map((todo) => {
    if (todo.id !== id) return todo;

    return {
      ...todo,
      text: trimmedText,
      isEditing: false,
    };
  });

  showMessage("");
  saveTodos();
  renderTodos();
}

// 수정 중이던 Todo를 저장하지 않고 일반 보기 상태로 되돌린다.
function cancelEditTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id !== id) return todo;

    return {
      ...todo,
      isEditing: false,
    };
  });

  showMessage("");
  renderTodos();
}

// 완료 상태를 반대로 바꿔 취소선 표시 여부를 제어한다.
function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id !== id) {
      return todo;
    }

    return {
      ...todo,
      isCompleted: !todo.isCompleted,
    };
  });

  showMessage("");
  saveTodos();
  renderTodos();
}

// 선택한 Todo를 배열에서 제거한다.
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  showMessage("");
  saveTodos();
  renderTodos();
}

function showMessage(text) {
  message.textContent = text;
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo(todoInput.value);
});

filterTabs.addEventListener("click", (event) => {
  const clickedButton = event.target.closest(".filter-button");

  if (!clickedButton) {
    return;
  }

  changeFilter(clickedButton.dataset.filter);
});

weekDays.addEventListener("click", (event) => {
  const clickedButton = event.target.closest(".week-day-button");

  if (!clickedButton) {
    return;
  }

  changeSelectedDate(clickedButton.dataset.date);
});

prevWeekButton.addEventListener("click", () => {
  moveSelectedWeek(-1);
});

nextWeekButton.addEventListener("click", () => {
  moveSelectedWeek(1);
});

todayButton.addEventListener("click", () => {
  moveToday();
});

loadTodos();
renderTodos();
