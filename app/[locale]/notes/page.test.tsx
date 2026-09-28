import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Page from './page';

describe('NotesPage', () => {
  it('페이지 제목과 목표 정보를 렌더링한다', () => {
    render(<Page />);

    expect(
      screen.getByRole('heading', { level: 2, name: '노트 모아보기' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: '자바스크립트로 웹 서비스 만들기',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: '목표 아이콘' }),
    ).toBeInTheDocument();
  });

  it('노트 검색 입력창을 렌더링한다', () => {
    render(<Page />);

    expect(screen.getByPlaceholderText('노트를 검색해주세요.')).toHaveAttribute(
      'type',
      'search',
    );
  });

  it('노트 목록에 현재 제공된 노트를 렌더링한다', () => {
    render(<Page />);

    const list = screen.getByRole('list');
    const items = within(list).getAllByRole('listitem');

    expect(items).toHaveLength(1);
    expect(within(items[0]).getByText('API 설계 메모')).toBeInTheDocument();
    expect(within(items[0]).getByText('API 문서 작성')).toBeInTheDocument();
    expect(within(items[0]).getByText('TO DO')).toBeInTheDocument();
  });
});
