'use client';

import type { ReactNode } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import type { JSONContent } from '@tiptap/react';
import Button from '@/components/ui/button/Button';
import Image from 'next/image';
import EditorPageLayout from '@/components/note/EditorPageLayout';
import NoteEditor from '@/components/ui/editor/Editor';
import EditorTitleInput from './EditorTitleInput';

const TITLE_MAX_LENGTH = 30;

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
      <EditorPageLayout
        heading={heading}
        actions={
          <Button
            type="submit"
            className="w-auto"
            disabled={!isValid || isPending}
          >
            {submitLabel}
          </Button>
        }
      >
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <NoteEditor value={field.value} onChange={field.onChange}>
              <EditorTitleInput
                {...register('title')}
                length={title.length}
                maxLength={TITLE_MAX_LENGTH}
                placeholder={t('noteTitlePlaceholder')}
                aria-label={t('title')}
                icon={
                  <Image
                    src="/icons/note_icon.svg"
                    alt=""
                    width={40}
                    height={40}
                  />
                }
              />
              <dl className="mt-7.5 grid grid-cols-2 gap-y-3 text-sm">
                {meta}
              </dl>
            </NoteEditor>
          )}
        />
      </EditorPageLayout>
    </form>
  );
}
