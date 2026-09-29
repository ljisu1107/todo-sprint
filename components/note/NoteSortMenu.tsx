'use client';

import { DropdownMenu } from 'radix-ui';
import { useTranslations } from 'next-intl';
import type { GetNotesParams } from '@/lib/api/notes';

export type NoteSort = NonNullable<GetNotesParams['sort']>;

interface NoteSortMenuProps {
  value: NoteSort;
  onChange: (sort: NoteSort) => void;
}

export default function NoteSortMenu({ value, onChange }: NoteSortMenuProps) {
  const t = useTranslations('Todo');

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label="정렬"
        className="flex h-10 w-16 items-center justify-center rounded-full"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          filter_list
        </span>
        {t(value)}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="rounded-xl bg-white p-1 shadow-md"
        >
          <DropdownMenu.RadioGroup
            value={value}
            onValueChange={(nextValue) => onChange(nextValue as NoteSort)}
          >
            <DropdownMenu.RadioItem
              value="latest"
              className="cursor-pointer rounded-lg px-4 py-2 text-sm outline-none data-highlighted:bg-grayscale-100 data-[state=checked]:font-semibold"
            >
              {t('latest')}
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem
              value="oldest"
              className="cursor-pointer rounded-lg px-4 py-2 text-sm outline-none data-highlighted:bg-grayscale-100 data-[state=checked]:font-semibold"
            >
              {t('oldest')}
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
