/** 인증 API(/api/auth/*) 요청·응답 DTO입니다. 브라우저와 BFF가 주고받는 형태이며, 토큰은 BFF가 쿠키로 관리하므로 포함하지 않습니다. */

// ── 요청 ──
export interface SignupBodyDto {
  email: string;
  name: string;
  password: string;
}

export interface LoginBodyDto {
  email: string;
  password: string;
}

// ── 응답 ──
export interface AuthUserDto {
  id: number;
  email: string;
  name: string;
  image: string | null;
}

// login·signup 응답. refresh·logout은 204라 DTO가 없습니다.
export interface AuthResponseDto {
  user: AuthUserDto;
}
