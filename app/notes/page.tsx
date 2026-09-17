import NoteItem from '@/app/notes/components/NoteItem';
import { NoteProps } from '@/types/note';
export default function Page() {
  const notes: NoteProps[] = [
    {
      title: '체계적인 폴더 구조 세팅하기',
      status: 'TO DO',
      content: '자바스크립트 기초 챕터5 듣기',
      date: '2020.04.29',
    },
  ];

  return (
    <div>
      <div className={'flex flex-row justify-between'}>
        <h2 className={'text-2xl'}>노트 모아보기</h2>
        <div className={'flex flex-row justify-between'}>
          <label htmlFor="noteSearch">
            <input
              type="search"
              name="noteSearch"
              id="noteSearch"
              placeholder={'노트를 검색해주세요.'}
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
          'flex w-full flex-row flex-nowrap rounded-2xl bg-amber-100 p-10'
        }
      >
        <h3 className={'text-2xl'}>자바스크립트로 웹 서비스 만들기</h3>
      </div>

      <div className={'grid grid-cols-2 overflow-x-hidden'}>
        <NoteItem noteProps={notes[0]} />
      </div>
    </div>
  );
}
