import NoteList from '@/components/note/NoteList';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
export default function Page() {
  const t = useTranslations('Todo');
  return (
    <div className={'bg-grayscale-100'}>
      <div className={'mb-10 flex flex-row justify-between'}>
        <h2 className={'text-2xl font-semibold'}>{t('notes')}</h2>
        <div className={'flex flex-row justify-between'}>
          <label htmlFor="noteSearch">
            <input
              type="search"
              name="noteSearch"
              id="noteSearch"
              placeholder={t('searchNotes')}
            />
            <span className="material-symbols-outlined">search</span>
          </label>

          <div>
            <span className="material-symbols-outlined">filter_list</span>
          </div>
        </div>
      </div>

      <div
        className={
          'mb-2.5 flex w-full flex-row flex-nowrap items-center rounded-[1.75rem] bg-orange-100 p-10'
        }
      >
        <Image
          src="../icons/img_goal.svg"
          width={40}
          height={40}
          alt="목표 아이콘"
          className="mr-6"
        />
        <h3 className={'text-2xl font-semibold'}>
          자바스크립트로 웹 서비스 만들기
        </h3>
      </div>

      <NoteList />
    </div>
  );
}
