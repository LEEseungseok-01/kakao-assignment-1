# 📝 과제 2. React로 Todo 앱 만들기

과제 1에서 Vanilla JS로 만든 Todo 앱을 React + Tailwind CSS로 재구현한 과제임.  
컴포넌트 분리, 상태 관리, 스타일링 방식의 차이를 직접 경험하는 것이 목표임.

---

## 🚀 실행 방법

1. 저장소를 클론함

```bash
git clone 저장소 주소
cd kakao-assignment-1
```

2. 패키지를 설치함

```bash
npm install
```

3. 개발 서버를 실행함

```bash
npm run dev
```

4. 브라우저에서 터미널에 표시되는 로컬 주소로 접속함

---

## 📁 프로젝트 구조

```text
kakao-assignment-1/
├── src/
│   ├── components/
│   │   ├── DateNavigator.jsx   # 날짜 이동 네비게이터
│   │   ├── FilterTabs.jsx      # 상태 필터 탭
│   │   ├── TodoForm.jsx        # Todo 입력창
│   │   ├── TodoItem.jsx        # Todo 아이템
│   │   ├── TodoList.jsx        # Todo 목록
│   │   └── WeekCalendar.jsx    # 주간 캘린더
│   ├── App.jsx                 # 루트 컴포넌트, 전체 상태 관리
│   ├── index.css               # Tailwind CSS 및 공통 스타일
│   └── main.jsx                # 앱 진입점
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

---

## ✅ 구현 기능

### 기본 미션

- Todo CRUD 구현 (생성 / 수정 / 완료 처리 / 삭제)
- 상태별 필터링 구현 (전체 / 진행 중 / 완료)
- 일간 뷰 구현 (선택 날짜 기준 Todo 관리)
- 로컬스토리지 연동 구현 (새로고침 후에도 데이터 유지)

### 도전 미션

- 주간 뷰 구현 (이번 주 날짜별 Todo 현황 + 이전 / 다음 주 이동)
- 날짜별 해당 날짜의 Todo 개수 표시
- 오늘 날짜와 선택 날짜 시각적 구분

---

## 🛠️ 활용 스택

- `React 19`
- `Vite 8`
- `Tailwind CSS v4`
- `Web Storage API` (`localStorage`)

---

## 📌 참고사항

- 과제 1과 동일한 Todo 기능을 React 컴포넌트 기반으로 재구현한 버전임
- DOM 직접 조작 대신 `state`, `props`, `map`, `filter` 중심으로 구현함
- Todo 데이터는 `localStorage`에 JSON 문자열 형태로 저장함
- JSON 파싱 실패와 localStorage 저장 실패 상황을 방어함
