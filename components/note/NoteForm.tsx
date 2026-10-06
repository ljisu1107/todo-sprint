'use client';

import type { ReactNode } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import type { JSONContent } from '@tiptap/react';

const schema = z.object({
  title: z.string().trim().min(1).max(30),
  content: z.custom<JSONContent>((value) => value != null),
});

export type NoteFormValues = z.infer<typeof schema>;

interface NoteFormProps {
  /** 페이지 제목 (노트 작성하기 / 노트 수정하기) */
  heading: string;
  /** 제출 버튼 글자 (등록하기 / 수정하기) */
  submitLabel: string;
  /** 수정할 때 채워 넣을 기존 값 */
  defaultValues?: NoteFormValues;
  /** 저장 요청 중이면 버튼 비활성화 */
  isPending: boolean;
  onSubmit: (values: NoteFormValues) => void;
  /** 제목 아래에 들어갈 목표·할 일·태그 정보 */
  meta: ReactNode;
}

export default function NoteForm({
  heading,
  submitLabel,
  defaultValues,
  isPending,
  onSubmit,
  meta,
}: NoteFormProps) {
  const t = useTranslations('Todo');
  const {
    register,
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? { title: '', content: undefined },
  });
  const title = useWatch({ control, name: 'title' });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 지금 NoteWriteForm의 JSX를 그대로 옮기고, 아래만 바꿔요
          - <h2>{t('writeNote', ...)}</h2>   → <h2>{heading}</h2>
          - 버튼의 {t('register')}            → {submitLabel}
          - <dl> 안의 MetaRow 4개            → {meta}
          - {titleLength}                    → {title.length} */}
    </form>
  );
}
