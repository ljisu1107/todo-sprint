import axios, { AxiosRequestConfig } from 'axios';
import { ApiError, toApiError } from './errors';
import z from 'zod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.response.use(undefined, (error) =>
  Promise.reject(toApiError(error)),
);

export async function request<T>(
  schema: z.ZodType<T>,
  config: AxiosRequestConfig,
): Promise<T> {
  const response = await api.request(config);
  const parsedResponse = schema.safeParse(response.data);
  if (!parsedResponse.success)
    throw new ApiError('parse', 'Unexpected response shape', {
      cause: parsedResponse.error,
    });
  return parsedResponse.data;
}
