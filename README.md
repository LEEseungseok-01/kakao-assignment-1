# 과제 1. Vanilla JS로 Todo 앱 만들기

HTML, CSS, Vanilla JS만 사용해 구현한 Todo 웹 앱
기본 CRUD 기능을 중심으로 날짜별 Todo 관리, 주간 보기, 상태 필터링, 로컬스토리지 저장 구현 및 성취율 표시 기능까지 확장함.

---

## 실행 방법
git clone '저장소 주소'
cd todo-vanilla
VS Code에서 index.html 파일 OPEN
Live Server 확장을 실행 (index.html 우클릭 → Open with Live Server)
---

## 프로젝트 구조

```text
kakao-assignment-1/
├── index.html   # 앱 화면 구조
├── style.css    # UI 스타일
└── app.js       # Todo 기능 구현
```

---

## 활용 스택

- `HTML`
- `CSS`
- `Vanilla JavaScript`
- `Web Storage API` (`localStorage`)

---

## 구현 기능

### 기본 미션

- Todo CRUD (생성 / 수정 / 완료 처리 / 삭제)
- 상태별 필터링 (전체 / 진행 중 / 완료)
- 일간 뷰 (날짜별 Todo 관리)
- 로컬스토리지 연동 (새로고침 후에도 데이터 유지)


---

### 도전 미션

- 주간 View (이번 주 날짜별 Todo 현황)

---

### 직접 추가한 기능

- 날짜별 성취율 Progress Bar
  - 선택된 날짜의 전체 Todo 대비 완료 Todo 비율을 계산합니다.
  - 할 일이 없는 날짜는 `0%` 회색 empty 상태로 표시합니다.
  - Todo가 추가되고 완료될수록 진행률이 퍼센트와 bar 너비로 반영됩니다.

- 날짜별 Todo 개수 표시
  - 주간 View의 각 날짜 아래에 해당 날짜의 Todo 개수를 표시합니다.
  - 상태 필터 탭에도 선택된 날짜 기준 개수를 표시합니다.

- 빠른 연속 생성 id 중복 방지
  - `Date.now()`만 사용할 때 발생할 수 있는 id 중복 가능성을 줄였습니다.
  - 내부 증가값을 사용해 Todo id를 안정적으로 생성합니다.

- 저장 데이터 방어 처리
  - 로컬스토리지에 잘못된 JSON이 저장되어 있어도 앱이 중단되지 않도록 처리했습니다.
  - 배열이 아닌 데이터가 저장된 경우 빈 배열로 안전하게 복원합니다.

- 자동 테스트 점검
  - 가짜 DOM과 localStorage 환경에서 178개 자동 시나리오를 실행했습니다.
  - Todo CRUD, 필터링, 날짜 이동, 주간 View, 성취율, 저장/복원, 예외 상황을 점검했습니다.
  - 최종 결과: `178 passed / 0 failed`

---

## 주요 점검 포인트

- 캐싱
  - `localStorage`를 사용해 Todo 데이터를 브라우저에 저장합니다.

- 가드레일
  - 빈 Todo 생성과 빈 수정 저장을 방지합니다.
  - 손상된 저장 데이터와 저장 실패 상황을 방어합니다.

- 후처리
  - 완료 Todo 하단 정렬, 상태 필터링, 날짜 필터링, 성취율 계산을 렌더링 전에 처리합니다.

- 폴백
  - 저장 데이터 복원 실패 시 빈 배열로 시작해 앱이 멈추지 않도록 처리합니다.

---

## 참고사항

- 본 프로젝트는 과제 조건에 맞춰 `HTML`, `CSS`, `Vanilla JS`만 사용했습니다.
- 별도의 라이브러리나 프레임워크는 사용하지 않았습니다.
- `package.json` 없이도 실행할 수 있도록 구성했습니다. (npm run dev X)