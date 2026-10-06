'use client';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/button/Button';
import NoteEditor from '@/components/ui/editor/Editor';
import Image from 'next/image';
import TodoStatusChip from '@/components/todo/TodoStatusChip';
import MetaRow from './MetaRow';
import { JSONContent } from '@tiptap/react';
import { useRouter } from '@/i18n/navigation';
import { useCreateNoteMutation } from '@/queries/notes';
import { toast } from '@/components/ui/toast/Toaster';
import { ApiError } from '@/lib/api/errors';

const schema = z.object({
  title: z.string().min(1).max(30),
  content: z.custom<JSONContent>((value) => value != null),
});

type FormValues = z.infer<typeof schema>;

interface NoteWriteFormProps {
  /** 노트를 연결할 할 일 ID (page.tsx에서 검사를 마친 값) */
  todoId: number;
}

export default function NoteWriteForm({ todoId }: NoteWriteFormProps) {
  const t = useTranslations('Todo');
  const router = useRouter();

  const { mutate: createNote, isPending } = useCreateNoteMutation();
  const {
    register,
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', content: undefined },
  });
  const title = useWatch({ control, name: 'title' });
  const titleLength = title.length;
  const onSubmit = (data: FormValues) => {
    /* useMutation으로 등록 */
    createNote(
      { todoId, title: data.title, content: data.content },
      {
        onSuccess: () => {
          toast.success('노트가 등록되었어요');
          router.push('/notes');
        },
        onError: (error) => {
          toast.error(getCreateNoteErrorMessage(error));
        },
      },
    );
  };

  function getCreateNoteErrorMessage(error: Error) {
    if (error instanceof ApiError) {
      if (error.status === 403)
        return '본인의 할 일에만 노트를 작성할 수 있어요';
      if (error.status === 404) return '할 일을 찾을 수 없어요';
    }
    return '노트를 등록하지 못했어요. 잠시 후 다시 시도해주세요';
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={'mx-auto my-0 max-w-3xl items-center bg-grayscale-100'}>
        <div
          className={'mb-[1.4rem] flex flex-row items-center justify-between'}
        >
          <h2 className={'text-2xl font-semibold'}>
            {t('writeNote', { name: '노트 작성하기' })}
          </h2>
          <Button
            type="submit"
            className="w-auto"
            disabled={!isValid || isPending}
          >
            {t('register')}
          </Button>
        </div>
        <div className={'gap-2.5 rounded-4xl bg-white px-8.5 py-8'}>
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <NoteEditor value={field.value} onChange={field.onChange}>
                <div
                  className={
                    'mt-[1.4rem] flex flex-row flex-nowrap items-center'
                  }
                >
                  <Image
                    src="/icons/note_icon.svg"
                    alt="note"
                    height={40}
                    width={40}
                  />
                  <input
                    {...register('title')}
                    maxLength={30}
                    placeholder={`${t('noteTitlePlaceholder', { name: '노트의 제목을 입력해주세요' })}`}
                    className={
                      'w-full pl-3 text-2xl font-semibold outline-none placeholder:text-[#BBBBBB]'
                    }
                  />
                  <span className={'ml-auto text-xs'}>
                    {titleLength}/<span className={'text-orange-600'}>30</span>
                  </span>
                </div>

                <div>
                  <dl className="mt-7.5 grid grid-cols-2 gap-y-3 text-sm">
                    <MetaRow icon="flag_2" label={t('goal')}>
                      <span className="truncate">목표</span>
                    </MetaRow>
                    <MetaRow icon="calendar_today" label={t('createdAt')}>
                      날짜
                    </MetaRow>
                    <MetaRow icon="check_box" label={t('todo')}>
                      <span className="truncate">할일</span>
                      <TodoStatusChip
                        isTodo={false}
                        className="ml-1 shrink-0"
                      />
                    </MetaRow>
                    <MetaRow icon="tag" label={t('tag')}>
                      태그들
                    </MetaRow>
                  </dl>
                </div>
              </NoteEditor>
            )}
          />
        </div>
      </div>
    </form>
  );
}
