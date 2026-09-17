export type Todo = {
  id: number;
  title: string;
  done: boolean;
  noteIds: number[];
  linkUrl: string | null;
  isFavorite: boolean;
};
