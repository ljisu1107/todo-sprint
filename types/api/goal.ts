/** 목표 API(GET /{teamId}/goals) 응답 DTO입니다. 서버 스펙을 그대로 따릅니다. */
export interface GoalDto {
  id: number;
  teamId: string;
  userId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  todoCount: number;
  completedCount: number;
}

export interface GoalPageDto {
  goals: GoalDto[];
  nextCursor: number | null;
  totalCount: number;
}
