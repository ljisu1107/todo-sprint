'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import SearchInput from '@/components/ui/SearchInput';
import NoteList from '@/components/note/NoteList';
import NoteSortMenu, { type NoteSort } from '@/components/note/NoteSortMenu';

interface NotesViewProps {
  /** 헤더와 목록 사이에 들어갈 내용(목표 배너) */
  children?: ReactNode;
}

export default function NotesView({ children }: NotesViewProps) {
  const t = useTranslations('Todo');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<NoteSort>('latest');

  return (
    <>
      <div className="mb-10 flex flex-row justify-between">
        <h2 className="text-2xl font-semibold">{t('notes')}</h2>
        <div className="flex flex-row items-center gap-2">
          <SearchInput
            aria-label="노트 검색"
            placeholder={t('searchNotes')}
            onSearch={(query) => setSearch(query.trim())}
          />
          <NoteSortMenu value={sort} onChange={setSort} />
        </div>
      </div>

      {children}

      <NoteList search={search || undefined} sort={sort} />
    </>
  );
}
