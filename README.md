- **TodoItem 제목을 button으로** — `li` 클릭으로는 키보드 접근이 불가능했습니다.
  대신 동작 범위가 조금 좁아집니다. 기존에는 행의 빈 여백도 눌렸는데
  이제 제목 영역에서만 열립니다.
- **Todo 타입 nullable 3개** — Swagger 응답 스키마 기준 `goalId`, `dueDate`, `goal`.
  현재 이 필드를 읽는 코드가 없어 당장 타입 에러는 없고, 이후 화면에서 null 처리가 강제됩니다.
- **`tablet: 744px` 추가** — 시안에 744 태블릿 화면이 있고 그 안의 모달 13개가
  전부 데스크톱 크기로 가운데 정렬돼 있습니다. Tailwind 기본 `md`(768px)로는
  744에서 바텀시트가 나옵니다.
- **`srTitle`을 union으로** — `hasHeader={false}`인데 `srTitle`을 빼면 빈 접근성
  제목이 생겨서 타입으로 막았습니다. union은 interface로 표현할 수 없어
  공통 부분만 interface, 분기만 type으로 뒀습니다.
