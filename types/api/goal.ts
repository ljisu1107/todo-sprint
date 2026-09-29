export interface Goal {
  id: number;
  teamId: string;
  userId: number;
  title: string;
  todoCount: number;
  completedCount: number;
  createdAt: string;
  updatedAt: string;
}

/** 목표 목록 조회 응답입니다. */
export interface GoalsResponse {
  goals: Goal[];
  /** 다음 조회에 전달할 값입니다. null이면 마지막 목록입니다. */
  nextCursor: number | null;
  totalCount: number;
}
