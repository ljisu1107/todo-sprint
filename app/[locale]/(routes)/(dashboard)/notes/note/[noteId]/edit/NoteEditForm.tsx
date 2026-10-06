'use client';

import type { JSONContent } from '@tiptap/react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useNoteQuery, useUpdateNoteMutation } from '@/queries/notes';
import { toast } from '@/components/ui/toast/Toaster';
import NoteForm from '@/components/note/NoteForm';

interface NoteEditFormProps {
  noteId: number;
}

export default function NoteEditForm({ noteId }: NoteEditFormProps) {
  const t = useTranslations('Todo');
  const router = useRouter();
  const { data: note, isPending: isLoading, isError } = useNoteQuery(noteId);
  const { mutate: updateNote, isPending } = useUpdateNoteMutation(noteId);

  // ⚠️ 노트를 다 불러온 "뒤에" 폼을 그려야 에디터에 기존 내용이 들어가요
  if (isLoading) return <p>불러오는 중…</p>;
  if (isError) return <p>노트를 불러오지 못했어요.</p>;

  const handleSubmit = (values: NoteFormValues) => {
    updateNote(values, {
      onSuccess: () => {
        toast.success('노트가 수정되었어요');
        router.push('/notes');
      },
      onError: () => toast.error('노트를 수정하지 못했어요'),
    });
  };

  return (
    <NoteForm
      heading="노트 수정하기"
      submitLabel={t('edit')}
      defaultValues={{
        title: note.title,
        content: note.content as JSONContent,
      }}
      isPending={isPending}
      onSubmit={handleSubmit}
      meta={''}
    />
  );
}
