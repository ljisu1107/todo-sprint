import type { Post } from '@/lib/api/posts';

const MINUTE = 60 * 1000;

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * MINUTE).toISOString();

const sampleImage = (seed: string) => `https://picsum.photos/seed/${seed}/240`;

const SAMPLES = [
  {
    title: '집중 잘 되는 환경 세팅 꿀팁 공유!',
    content:
      '책상 위를 비우고 타이머를 25분에 맞춰두니 집중이 훨씬 잘 되더라고요. 여러분만의 집중 루틴이 있다면 댓글로 알려주세요!',
    image: sampleImage('desk'),
  },
  {
    title: '하루 루틴 기록, 커피 한 잔과 함께 ☕',
    content: '아침마다 할 일을 세 개만 적어두는 습관을 들이고 있어요.',
    image: sampleImage('coffee'),
  },
  {
    title: '작은 메모 하나가 큰 변화를 만든다',
    content:
      '떠오르는 생각을 바로 적어두니 잊어버리는 일이 줄었어요. 노트 기능을 적극 활용하는 중입니다.',
    image: null,
  },
  {
    title: '디지털 정리의 날: 불필요한 할 일 정리하기',
    content:
      '오래된 할 일들을 정리하면서 마음까지 가벼워졌어요.\n완료된 항목을 지우는 것만으로도 뿌듯하네요. 여러분은 주기적으로 투두를 정리하시나요? 저는 매주 일요일 저녁에 한 번씩 정리하고 있어요.',
    image: sampleImage('laptop'),
  },
  {
    title:
      '제목이 아주 길어지는 경우에는 어떻게 보이는지 확인하기 위한 게시글입니다. 한 줄을 넘어가면 모바일에서 말줄임 처리됩니다',
    content: '짧은 본문',
    image: null,
  },
];

export const createMockPosts = (count: number): Post[] =>
  Array.from({ length: count }, (_, index) => {
    const sample = SAMPLES[index % SAMPLES.length];
    return {
      id: index + 1,
      teamId: 'team',
      userId: 1,
      ...sample,
      viewCount: 350 - index * 17,
      createdAt: minutesAgo(index * index * 90 + 3),
      updatedAt: minutesAgo(index * index * 90 + 3),
      writer: { id: 1, name: '체다치즈', image: null },
      commentCount: 28 - index,
    };
  });
