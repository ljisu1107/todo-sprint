import TodoList from './_components/TodoList';
import TodosHeader from './_components/TodosHeader';

export default function TodosPage() {
  return (
    <div className="mx-auto flex w-full max-w-180 flex-col gap-6">
      <TodosHeader />
      <section className="min-h-160 rounded-3xl bg-white p-4 md:rounded-4xl md:p-8">
        <TodoList />
      </section>
    </div>
  );
}
