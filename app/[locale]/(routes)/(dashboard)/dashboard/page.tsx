'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import ProgressChart from '@/components/dashboard/ProgressChart';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import TodoItem, { type TodoItemData } from '@/components/todo/TodoItem';
import SearchInput from '@/components/ui/SearchInput';
import type { Goal } from '@/types/api/goal';
import { getGoalTodos, getRecentTodos, getTodoProgress } from '@/lib/api/todos';
import { getGoals } from '@/lib/api/goals';

// 목표 ID와 완료 여부별로 목록·커서·조회 상태를 따로 보관합니다.
type GoalTodosState = {
  todos: TodoItemData[];
  keyword?: string;
  error: boolean;
  nextCursor: number | null;
  isLoadingMore?: boolean;
  loadMoreError?: boolean;
};

export default function Dashboard() {
  const [recentTodos, setRecentTodos] = useState<TodoItemData[]>([]);
  // API에서 받아온 목표 목록을 저장합니다.
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoadingGoals, setIsLoadingGoals] = useState(true);
  const [goalsError, setGoalsError] = useState(false);
  const [todosByGoal, setTodosByGoal] = useState<
    Record<string, GoalTodosState>
  >({});

  // 같은 목표의 중복 요청을 막고, 페이지를 떠날 때 추가 조회도 취소합니다.
  const goalRequests = useRef(new Map<string, AbortController>());

  // 처음에는 로딩을 표시하고, 요청이 끝나면 false로 변경합니다.
  const [isLoadingRecentTodos, setIsLoadingRecentTodos] = useState(true);
  // 조회에 실패하면 true로 변경해 오류 안내를 표시합니다.
  const [recentTodosError, setRecentTodosError] = useState(false);

  // 전체 할 일의 완료 진행률(0~100)입니다. null은 진행률 데이터가 아직 없는 상태를 뜻합니다.
  const [progress, setProgress] = useState<number | null>(null);
  // 최근 할 일이 1개 이상이면 목록을, 없으면 빈 상태 안내를 표시합니다. 로딩·오류 안내가 우선합니다.
  const hasRecentTodos = recentTodos.length > 0;

  // 진행률 조회 실패 여부와 로딩 상태는 최근 할 일 목록과 별도로 관리합니다.
  const [progressError, setProgressError] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  // 진행률 데이터가 있는지 확인합니다. 0%도 유효한 값이므로 null인 경우만 데이터가 없다고 판단합니다.
  const hasProgress = progress !== null;
  // 원형 차트와 퍼센트 텍스트에 표시할 값입니다. 진행률 데이터가 없으면 0%로 표시합니다.
  const displayProgress = hasProgress ? progress : 0;

  // 처음에는 목표를 최대 2개 조회하고, 응답의 goals 배열을 화면 상태에 저장합니다.
  useEffect(() => {
    const controller = new AbortController();

    getGoals(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setGoals(data.goals);
      })
      .catch(() => {
        if (!controller.signal.aborted) setGoalsError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingGoals(false);
      });

    return () => controller.abort();
  }, []);

  // 첫 조회와 검색은 같은 함수를 사용합니다. 같은 영역의 이전 요청은 취소합니다.
  const loadGoalFirstPage = useCallback((goalId: number, keyword?: string) => {
    [false, true].forEach((done) => {
      const key = `${goalId}-${done}`;
      goalRequests.current.get(key)?.abort();
      const controller = new AbortController();
      goalRequests.current.set(key, controller);
      getGoalTodos(goalId, controller.signal, undefined, done, keyword)
        .then((data) => {
          if (controller.signal.aborted) return;
          setTodosByGoal((previous) => ({
            ...previous,
            [key]: {
              todos: data.todos,
              keyword,
              error: false,
              nextCursor: data.nextCursor,
            },
          }));
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setTodosByGoal((previous) => ({
            ...previous,
            [key]: { todos: [], keyword, error: true, nextCursor: null },
          }));
        })
        .finally(() => {
          if (goalRequests.current.get(key) === controller)
            goalRequests.current.delete(key);
        });
    });
  }, []);

  // 목표 목록을 받은 뒤 TO DO와 DONE을 각각 조회합니다.
  useEffect(() => {
    const requests = goalRequests.current;
    goals.forEach((goal) => loadGoalFirstPage(goal.id));
    return () => {
      requests.forEach((request) => request.abort());
      requests.clear();
    };
  }, [goals, loadGoalFirstPage]);

  const searchGoalTodos = (goalId: number, query: string) => {
    // 이 목표의 목록과 커서만 비우면 양쪽에 로딩 안내가 표시됩니다.
    setTodosByGoal((previous) => {
      const next = { ...previous };
      delete next[`${goalId}-false`];
      delete next[`${goalId}-true`];
      return next;
    });
    loadGoalFirstPage(goalId, query.trim() || undefined);
  };

  // 마지막으로 받은 nextCursor부터 다음 10개를 조회해 기존 목록에 이어 붙입니다.
  const loadMoreGoalTodos = async (goalId: number, done: boolean) => {
    const key = `${goalId}-${done}`;
    const current = todosByGoal[key];
    if (
      !current ||
      current.nextCursor === null ||
      goalRequests.current.has(key)
    )
      return;

    const controller = new AbortController();
    goalRequests.current.set(key, controller);
    setTodosByGoal((previous) => ({
      ...previous,
      [key]: {
        ...previous[key],
        isLoadingMore: true,
        loadMoreError: false,
      },
    }));

    try {
      const data = await getGoalTodos(
        goalId,
        controller.signal,
        current.nextCursor,
        done,
        current.keyword,
      );
      if (controller.signal.aborted) return;
      setTodosByGoal((previous) => {
        const existing = previous[key];
        const existingIds = new Set(existing.todos.map((todo) => todo.id));
        return {
          ...previous,
          [key]: {
            ...existing,
            // 조회 사이에 같은 항목이 다시 오더라도 중복으로 표시하지 않습니다.
            todos: [
              ...existing.todos,
              ...data.todos.filter((todo) => !existingIds.has(todo.id)),
            ],
            nextCursor: data.nextCursor,
            isLoadingMore: false,
          },
        };
      });
    } catch {
      if (controller.signal.aborted) return;
      // 추가 조회에 실패해도 이미 표시한 목록과 다음 커서는 유지합니다.
      setTodosByGoal((previous) => ({
        ...previous,
        [key]: {
          ...previous[key],
          isLoadingMore: false,
          loadMoreError: true,
        },
      }));
    } finally {
      if (goalRequests.current.get(key) === controller) {
        goalRequests.current.delete(key);
      }
    }
  };

  // 대시보드가 화면에 나타나면 최근 등록한 할 일을 조회합니다.
  useEffect(() => {
    const controller = new AbortController();

    getRecentTodos(controller.signal)
      .then((todos) => {
        // 성공: 받은 목록을 저장하면 TodoItem 또는 빈 목록 안내가 표시됩니다.
        if (!controller.signal.aborted) setRecentTodos(todos);
      })
      .catch(() => {
        // 실패: 요청 취소를 제외한 조회 오류는 동일한 안내로 처리합니다.
        if (!controller.signal.aborted) setRecentTodosError(true);
      })
      .finally(() => {
        // 성공·실패와 관계없이 요청이 끝나면 로딩을 종료합니다.
        if (!controller.signal.aborted) setIsLoadingRecentTodos(false);
      });

    // 페이지를 벗어날 때 요청을 취소하고, 이전 요청이 화면 상태를 바꾸지 않게 합니다.
    return () => controller.abort();
  }, []);

  // 전체·완료 할 일 수로 계산한 진행률을 차트와 퍼센트 텍스트에 전달합니다.
  useEffect(() => {
    const controller = new AbortController();

    getTodoProgress(controller.signal)
      .then((percentage) => {
        if (!controller.signal.aborted) setProgress(percentage);
      })
      .catch(() => {
        if (!controller.signal.aborted) setProgressError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingProgress(false);
      });

    return () => controller.abort();
  }, []);

  const updateRecentTodo = (
    id: number,
    changes: Partial<Pick<TodoItemData, 'done' | 'isFavorite'>>,
  ) => {
    setRecentTodos((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, ...changes } : todo)),
    );
  };

  return (
    // 이곳에 꼭 해당 컨텐츠 영역의 width를 추가해주세요
    <div className="lg:mx-auto lg:w-full lg:max-w-328">
      {/* 컨텐츠 마크업은 여기서 부터 */}
      <div>
        <h1 className="mb-7.5 text-xl font-semibold text-heading max-md:hidden lg:mb-8.5 lg:text-2xl">
          체다치즈님의 대시보드
        </h1>
      </div>

      <div className="md:flex md:flex-wrap md:gap-3 lg:gap-6">
        <div className="min-w-0 md:flex-1 lg:flex-[1_1_28rem]">
          <div className="mb-2.5 flex flex-wrap px-2">
            <h2 className="mr-auto inline-flex items-center text-base font-medium text-heading md:text-lg">
              <span className="mr-2 inline-flex size-8 items-center justify-center rounded-lg bg-[#ffd0aa]">
                <Image
                  src="/icons/icon_memo.svg"
                  width={16}
                  height={21}
                  alt=""
                />
              </span>
              최근 등록한 할일
            </h2>
            <Link
              href="/"
              className="ml-auto flex items-center text-sm font-semibold text-orange-600"
            >
              모두 보기
              <span>
                <svg
                  className="size-5"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M7.5 15L12.5 10L7.5 5"
                    stroke="#FF8442"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </div>
          <div className="aspect-[343/186] w-full rounded-[1.75rem] bg-orange-500 px-4.5 py-4 shadow-[0_0.625rem_2.5rem_0_#FF9E594D] md:aspect-auto md:h-[11.625rem] lg:h-64 lg:rounded-[2.5rem] lg:px-8 lg:py-7.5">
            {isLoadingRecentTodos ? (
              <DashboardLoading message="할 일을 불러오는 중입니다." />
            ) : recentTodosError ? (
              <div
                role="alert"
                className="flex h-full items-center justify-center text-base font-semibold text-white"
              >
                <p>할 일을 불러오지 못했어요</p>
              </div>
            ) : hasRecentTodos ? (
              <div className="h-full w-full max-md:flex max-md:flex-col max-md:justify-center">
                <ul className="flex h-full flex-col justify-between max-md:max-h-[14rem]">
                  {recentTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      size="small"
                      style="white"
                      showKebab={false}
                      showCreateNote={false}
                      onToggleDone={(id, done) =>
                        updateRecentTodo(id, { done })
                      }
                      onToggleFavorite={(id, isFavorite) =>
                        updateRecentTodo(id, { isFavorite })
                      }
                      // 아래 동작은 상세·노트·링크 기능 연동 시 해당 페이지 로직으로 교체합니다.
                      onOpenDetail={() => undefined}
                      onCopyLink={() => undefined}
                      onViewNote={() => undefined}
                      onCreateNote={() => undefined}
                    />
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-base font-semibold text-white">
                <p>최근에 등록한 할 일이 없어요</p>
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0 max-md:mt-10 md:flex-1 lg:flex-[1_1_28rem]">
          <div className="mb-2.5 flex flex-wrap px-2">
            <h2 className="mr-auto inline-flex items-center text-base font-medium text-heading md:text-lg">
              <span className="mr-2 inline-flex size-8 items-center justify-center rounded-lg bg-blue-100">
                <Image
                  src="/icons/icon_chart.svg"
                  width={16}
                  height={21}
                  alt=""
                />
              </span>{' '}
              내 진행 상황
            </h2>{' '}
          </div>

          <div className="relative isolate aspect-[343/186] w-full overflow-hidden rounded-[1.75rem] bg-blue-200 shadow-[0_0.625rem_2.5rem_0_#00D4BE3D] before:pointer-events-none before:absolute before:top-[55%] before:right-0 before:z-0 before:block before:aspect-[218/154] before:w-[44%] before:bg-[url('/images/dashboard/bg-chart.svg')] before:bg-cover before:opacity-45 before:content-[''] md:aspect-auto md:h-[11.625rem] md:before:top-[41%] md:before:right-[0] lg:h-64 lg:rounded-[2.5rem] lg:before:top-[6.2rem] lg:before:w-[13.875rem]">
            {/* 장식용 문어 일러스트는 ::before 배경 레이어로 처리합니다. */}

            {isLoadingProgress ? (
              <DashboardLoading message="진행률을 불러 오는 중입니다" />
            ) : progressError ? (
              <div
                role="alert"
                className="relative z-10 flex h-full items-center justify-center text-base font-semibold text-white"
              >
                <p>진행 상황을 불러오지 못했어요</p>
              </div>
            ) : (
              <div className="absolute top-1/2 left-0 z-10 flex w-full -translate-y-1/2 items-center gap-5 px-6 lg:gap-8 lg:px-10">
                <ProgressChart
                  progress={displayProgress}
                  className="aspect-square w-[31.2%] shrink-0 lg:size-40 lg:w-40"
                />

                <div className="min-w-0 text-white">
                  <p className="text-sm font-semibold lg:text-xl">
                    체다치즈님의 진행도는
                  </p>
                  <p className="flex items-baseline">
                    <span className="text-display-lg leading-none font-bold lg:text-display-xl">
                      {displayProgress}
                    </span>
                    <span className="ml-1 text-xl leading-none font-medium lg:text-3xl">
                      %
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {(isLoadingGoals || goalsError || goals.length > 0) && (
        <div className="mt-10 lg:mt-8.5">
          <h2 className="mr-auto inline-flex items-center text-base font-medium text-heading md:text-lg">
            <span className="mr-2 size-10">
              <Image src="/icons/icon_goal.svg" width={40} height={40} alt="" />
            </span>
            목표별 할일
          </h2>
          {isLoadingGoals ? (
            <p role="status" className="mt-4 text-center text-muted">
              목표를 불러오는 중입니다.
              {/* <DashboardLoading message=" 목표를 불러오는 중입니다." /> */}
            </p>
          ) : goalsError ? (
            <p role="alert" className="mt-4 text-center text-muted">
              목표를 불러오지 못했어요
            </p>
          ) : (
            <div className="mt-2.5">
              <ul className="space-y-6">
                {goals.map((goal) => {
                  // 아직 조회 결과가 없는 목표는 로딩 안내를 표시합니다.
                  const pendingState = todosByGoal[`${goal.id}-false`];
                  const completedState = todosByGoal[`${goal.id}-true`];
                  const pendingTodos = pendingState?.todos ?? [];
                  const completedTodos = completedState?.todos ?? [];
                  const goalProgress =
                    goal.todoCount === 0
                      ? 0
                      : Math.round(
                          (goal.completedCount / goal.todoCount) * 100,
                        );

                  return (
                    <li key={goal.id}>
                      <div className="rounded-[1.75rem] bg-white-section p-4 md:p-6 lg:rounded-[2.5rem] lg:p-8">
                        <div className="min-w-0">
                          {/* S: 목표 아이템 헤더 */}
                          <div className="relative flex flex-wrap items-center gap-3 min-[1204px]:grid min-[1204px]:grid-cols-2 min-[1204px]:gap-8 md:flex-nowrap">
                            <div className="w-[calc(100%-3.25rem)] min-w-0 min-[1204px]:flex min-[1204px]:items-center min-[1204px]:gap-4 md:w-auto md:flex-1">
                              <h3 className="text-base font-semibold text-foreground min-[1204px]:min-w-0 min-[1204px]:basis-2/5">
                                {goal.title}
                              </h3>

                              <div className="relative mt-2 pr-9 min-[1204px]:mt-0 min-[1204px]:min-w-0 min-[1204px]:flex-1">
                                {/* 프로그래스바 */}
                                <p
                                  className="relative h-2 w-full overflow-hidden rounded-full bg-grayscale-200"
                                  aria-label={`목표 진행률 ${goalProgress}%`}
                                >
                                  <span
                                    className="absolute top-0 left-0 h-full rounded-full bg-orange-500 transition-[width] duration-300 ease-out"
                                    style={{ width: `${goalProgress}%` }}
                                  />
                                </p>
                                <span className="absolute top-1/2 right-0 -translate-y-1/2 text-xs font-semibold text-orange-600">
                                  {goalProgress}%
                                </span>
                              </div>
                            </div>

                            <div className="flex w-full items-center gap-3 min-[1204px]:min-w-0 min-[1204px]:justify-end md:w-auto md:shrink-0">
                              <SearchInput
                                size="sm"
                                onSearch={(query) =>
                                  searchGoalTodos(goal.id, query)
                                }
                                onKeyDown={(event) => {
                                  // 한글 조합을 확정하는 Enter는 검색으로 처리하지 않습니다.
                                  if (event.nativeEvent.isComposing)
                                    event.preventDefault();
                                }}
                                aria-label={`${goal.title} 할 일 검색`}
                                placeholder="할 일을 검색해주세요"
                                className="md:w-52.5 xl:w-60"
                              />
                              <button
                                type="button"
                                aria-label="할 일 추가"
                                className="absolute top-0 right-0 inline-flex size-10 shrink-0 items-center justify-center gap-1 rounded-full border border-solid border-orange-500 bg-transparent text-sm leading-none font-semibold text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 md:static md:w-auto md:px-4"
                              >
                                <span
                                  aria-hidden="true"
                                  className="inline-flex size-5 shrink-0 items-center justify-center"
                                >
                                  <Image
                                    src="/icons/icon_plus_orange.svg"
                                    width={20}
                                    height={20}
                                    alt=""
                                  />
                                </span>
                                <span className="hidden md:inline">
                                  할 일 추가
                                </span>
                              </button>
                            </div>
                          </div>
                          {/* E: 목표 아이템 헤더 */}

                          <div className="mt-2.5 grid gap-4 lg:mt-6 lg:grid-cols-2 lg:gap-8">
                            <div className="min-h-34 rounded-2xl bg-[#fff6df] p-4 lg:min-h-48 lg:p-6">
                              <p className="text-xs font-semibold text-orange-600">
                                TO DO
                              </p>
                              {!pendingState ? (
                                <p
                                  role="status"
                                  className="mt-4 text-center text-xs text-muted"
                                >
                                  할 일을 불러오는 중입니다.
                                </p>
                              ) : pendingState.error ? (
                                <p
                                  role="alert"
                                  className="mt-4 text-center text-xs text-muted"
                                >
                                  할 일을 불러오지 못했어요
                                </p>
                              ) : pendingTodos.length > 0 ? (
                                <ul className="mt-3">
                                  {pendingTodos.map((todo) => (
                                    <TodoItem
                                      key={todo.id}
                                      todo={todo}
                                      size="small"
                                      style="todo"
                                      showKebab={false}
                                      showCreateNote={false}
                                      // 조회만 연결한 상태입니다. 버튼 동작은 담당자 작업 후 연결합니다.
                                      onToggleDone={() => undefined}
                                      onToggleFavorite={() => undefined}
                                      onOpenDetail={() => undefined}
                                      onCopyLink={() => undefined}
                                      onViewNote={() => undefined}
                                      onCreateNote={() => undefined}
                                    />
                                  ))}
                                </ul>
                              ) : (
                                <p className="mt-4 text-center text-xs text-muted">
                                  {pendingState.keyword
                                    ? '검색 결과가 없습니다.'
                                    : '등록된 할 일이 없어요'}
                                </p>
                              )}
                              {pendingState &&
                                !pendingState.error &&
                                pendingState.nextCursor !== null && (
                                  <div className="mt-4 text-center">
                                    {pendingState.loadMoreError && (
                                      <p
                                        role="alert"
                                        className="mb-2 text-sm text-muted"
                                      >
                                        추가 할 일을 불러오지 못했어요. 다시
                                        눌러주세요.
                                      </p>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        loadMoreGoalTodos(goal.id, false)
                                      }
                                      disabled={pendingState.isLoadingMore}
                                      aria-label={`${goal.title} TO DO 더보기`}
                                      aria-busy={pendingState.isLoadingMore}
                                      className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg px-4 text-sm font-medium text-orange-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:cursor-wait disabled:opacity-60"
                                    >
                                      {pendingState.isLoadingMore
                                        ? '불러오는 중입니다.'
                                        : '더보기'}
                                      <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-hidden="true"
                                        className="size-6 shrink-0"
                                      >
                                        <path
                                          d="M17.293 9.29289C17.6835 8.90237 18.3165 8.90237 18.707 9.29289C19.0975 9.68342 19.0975 10.3164 18.707 10.707L12.707 16.707C12.3165 17.0975 11.6835 17.0975 11.293 16.707L5.29295 10.707C4.90243 10.3164 4.90243 9.68342 5.29295 9.29289C5.68348 8.90237 6.31649 8.90237 6.70702 9.29289L12 14.5859L17.293 9.29289Z"
                                          fill="currentColor"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                )}
                            </div>
                            <div className="flex min-h-20 flex-col p-4 lg:min-h-48 lg:p-6">
                              <p className="text-xs font-semibold text-muted">
                                DONE
                              </p>
                              {!completedState ? (
                                <p
                                  role="status"
                                  className="mt-4 text-center text-xs text-muted"
                                >
                                  할 일을 불러오는 중입니다.
                                </p>
                              ) : completedState.error ? (
                                <p
                                  role="alert"
                                  className="mt-4 text-center text-xs text-muted"
                                >
                                  할 일을 불러오지 못했어요
                                </p>
                              ) : completedTodos.length > 0 ? (
                                <ul className="mt-3">
                                  {completedTodos.map((todo) => (
                                    <TodoItem
                                      key={todo.id}
                                      todo={todo}
                                      size="small"
                                      style="todo"
                                      showKebab={false}
                                      showCreateNote={false}
                                      // 조회만 연결한 상태입니다. 버튼 동작은 담당자 작업 후 연결합니다.
                                      onToggleDone={() => undefined}
                                      onToggleFavorite={() => undefined}
                                      onOpenDetail={() => undefined}
                                      onCopyLink={() => undefined}
                                      onViewNote={() => undefined}
                                      onCreateNote={() => undefined}
                                    />
                                  ))}
                                </ul>
                              ) : (
                                <p className="mt-4 text-center text-xs text-muted">
                                  {completedState.keyword
                                    ? '검색 결과가 없습니다.'
                                    : '완료한 할 일이 없어요'}
                                </p>
                              )}
                              {completedState &&
                                !completedState.error &&
                                completedState.nextCursor !== null && (
                                  <div className="mt-4 text-center">
                                    {completedState.loadMoreError && (
                                      <p
                                        role="alert"
                                        className="mb-2 text-sm text-muted"
                                      >
                                        추가 할 일을 불러오지 못했어요. 다시
                                        눌러주세요.
                                      </p>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        loadMoreGoalTodos(goal.id, true)
                                      }
                                      disabled={completedState.isLoadingMore}
                                      aria-label={`${goal.title} DONE 더보기`}
                                      aria-busy={completedState.isLoadingMore}
                                      className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg px-4 text-sm font-medium text-orange-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:cursor-wait disabled:opacity-60"
                                    >
                                      {completedState.isLoadingMore
                                        ? '불러오는 중입니다.'
                                        : '더보기'}
                                      <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-hidden="true"
                                        className="size-6 shrink-0"
                                      >
                                        <path
                                          d="M17.293 9.29289C17.6835 8.90237 18.3165 8.90237 18.707 9.29289C19.0975 9.68342 19.0975 10.3164 18.707 10.707L12.707 16.707C12.3165 17.0975 11.6835 17.0975 11.293 16.707L5.29295 10.707C4.90243 10.3164 4.90243 9.68342 5.29295 9.29289C5.68348 8.90237 6.31649 8.90237 6.70702 9.29289L12 14.5859L17.293 9.29289Z"
                                          fill="currentColor"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
      {/* 개발 참고용: 버튼에 사용할 아이콘을 확인하는 임시 영역입니다. */}
    </div>
  );
}
