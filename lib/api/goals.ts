import type { GoalPageDto } from '@/types/api/goal';
import { request } from './client-fetcher';

export type GetGoalsParams = {
  cursor?: number;
  limit?: number;
};

export const getGoals = (params: GetGoalsParams, signal?: AbortSignal) =>
  request<GoalPageDto>({ url: '/goals', params, signal });
