import type { Decorator, Meta, StoryObj } from '@storybook/nextjs';

import Toaster from '@/components/ui/toast/Toaster';
import QueryTestProvider from '@/test/QueryTestProvider';
import { mockTodosApi } from '@/test/todoMocks';
import TodoList from './TodoList';
import TodosHeader from './TodosHeader';

/** page.tsx와 같은 배치에 테스트용 Provider와 Toaster를 붙입니다. */
const withTodosPage: Decorator = (Story) => (
  <QueryTestProvider>
    <div className="min-h-dvh bg-grayscale-100 px-4 pt-8 pb-4 md:p-6">
      <div className="mx-auto flex w-full max-w-180 flex-col gap-6">
        <TodosHeader />
        <section className="min-h-160 rounded-3xl bg-white p-4 md:rounded-4xl md:p-8">
          <Story />
        </section>
      </div>
    </div>
    <Toaster />
  </QueryTestProvider>
);

const meta = {
  title: 'Todos/TodoList',
  component: TodoList,
  parameters: { layout: 'fullscreen' },
  decorators: [withTodosPage],
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

// beforeEach가 돌려준 함수로 스토리를 떠날 때 mock API를 되돌립니다.
export const InfiniteScroll: Story = {
  name: '무한 스크롤 (90개, 40개씩)',
  beforeEach: () => mockTodosApi({ totalCount: 90 }),
};

export const Empty: Story = {
  name: '빈 목록',
  beforeEach: () => mockTodosApi({ totalCount: 0 }),
};

export const Loading: Story = {
  name: '불러오는 중',
  beforeEach: () => mockTodosApi({ totalCount: 90, isPending: true }),
};

export const FirstPageError: Story = {
  name: '첫 요청 실패',
  beforeEach: () => mockTodosApi({ totalCount: 90, failAt: 0 }),
};

export const NextPageError: Story = {
  name: '다음 페이지 실패',
  beforeEach: () => mockTodosApi({ totalCount: 90, failAt: 1 }),
};
