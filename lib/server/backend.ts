import 'server-only';
import axios, { type AxiosResponse } from 'axios';
import { NextResponse } from 'next/server';
import z from 'zod';

const BACKEND_API_URL = process.env.BACKEND_API_URL;
if (!BACKEND_API_URL) throw new Error('BACKEND_API_URL is not set');

// 클라이언트(10s)보다 길다. 기다리는 클라이언트가 없을 때를 위한 상한선
const BACKEND_TIMEOUT = 15_000;

export const backend = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: BACKEND_TIMEOUT,
  validateStatus: () => true, // 4xx/5xx도 reject하지 않고 그대로 전달하기 위함
  responseType: 'text',
  transformResponse: [(data) => data], // 원본 body 유지
});

export function bearer(token: string | undefined): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isOk(res: AxiosResponse<string>) {
  return res.status >= 200 && res.status < 300;
}

// BE 응답을 NextResponse로 그대로 클라이언트에 전달
export function passthrough(res: AxiosResponse<string>) {
  return new NextResponse(res.data || null, {
    status: res.status,
    headers: {
      'Content-Type': String(res.headers['content-type'] ?? 'application/json'),
    },
  });
}

export function parseOk<T>(schema: z.ZodType<T>, res: AxiosResponse<string>) {
  return schema.parse(JSON.parse(res.data));
}
