'use client';

import { useState, type SubmitEvent } from 'react';

const SEARCH_MAX_LENGTH = 200;

interface PostSearchFormProps {
  onSearch: (search: string) => void;
}

const PostSearchForm = ({ onSearch }: PostSearchFormProps) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(keyword.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex w-62 items-center gap-2 rounded-full border border-subtle bg-white-section px-5 py-3 md:w-108"
    >
      <input
        type="search"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        maxLength={SEARCH_MAX_LENGTH}
        aria-label="게시글 검색"
        placeholder="궁금한 내용을 검색해주세요"
        className="min-w-0 flex-1 text-base text-foreground outline-none placeholder:text-muted"
      />
      <button type="submit" aria-label="검색" className="cursor-pointer">
        <span
          aria-hidden
          className="material-symbols-rounded text-xl leading-none text-muted"
        >
          search
        </span>
      </button>
    </form>
  );
};

export default PostSearchForm;
