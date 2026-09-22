import NoteItem from '@/components/note/NoteItem';
import { NoteProps } from '@/types/note';
import Image from 'next/image';
export default function Page() {
  const notesData: NoteProps = {
    notes: [
      {
        id: 7,
        teamId: 'team-abc',
        userId: 1,
        todoId: 12,
        title: 'API 설계 메모',
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'RESTful 원칙에 따라 설계할 것',
                },
              ],
            },
          ],
        },
        linkUrl: 'https://docs.example.com',
        createdAt: '2026-02-16T09:00:00.000Z',
        updatedAt: '2026-02-16T09:00:00.000Z',
        todo: {
          id: 12,
          title: 'API 문서 작성',
          done: false,
        },
      },
    ],
    nextCursor: 6,
    totalCount: 15,
  };
  return (
    <div className={'bg-grayscale-100'}>
      <div className={'mb-10 flex flex-row justify-between'}>
        <h2 className={'text-2xl font-semibold'}>노트 모아보기</h2>
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

      {!!notesData?.notes && notesData?.notes.length > 0 ? (
        <ul
          className={
            'grid grid-cols-1 gap-2.5 gap-x-5 overflow-x-hidden lg:grid-cols-2'
          }
        >
          {notesData?.notes.map((note, index) => (
            <li key={`note-${note.id}`}>
              <NoteItem noteProps={note} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={'flex size-full flex-col items-center justify-center'}>
          <Image
            src="/images/no_note.svg"
            width={130}
            height={140}
            alt="노트 아이콘"
          />
          <p>아직 등록된 노트가 없어요</p>
        </div>
      )}
    </div>
  );
}
