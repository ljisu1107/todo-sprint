import { useFormatter, useTranslations } from 'next-intl';

import { getFirstDay, type MonthKey } from '../_lib/calendarDates';

const MONTH_BUTTON_CLASS_NAME =
  'flex rounded-sm text-subtle hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600';

interface CalendarHeaderProps {
  month: MonthKey;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const CalendarHeader = ({
  month,
  onPreviousMonth,
  onNextMonth,
}: CalendarHeaderProps) => {
  const t = useTranslations('Todo');
  const format = useFormatter();

  return (
    <header className="flex items-center justify-center gap-4 border-b border-subtle px-4 py-5 lg:justify-start lg:px-8">
      <button
        type="button"
        aria-label={t('previousMonth')}
        onClick={onPreviousMonth}
        className={MONTH_BUTTON_CLASS_NAME}
      >
        <span
          aria-hidden
          className="material-symbols-rounded text-2xl leading-none"
        >
          keyboard_double_arrow_left
        </span>
      </button>
      <h2 aria-live="polite" className="text-lg font-bold text-foreground">
        {format.dateTime(getFirstDay(month), {
          year: 'numeric',
          month: 'long',
          timeZone: 'UTC',
        })}
      </h2>
      <button
        type="button"
        aria-label={t('nextMonth')}
        onClick={onNextMonth}
        className={MONTH_BUTTON_CLASS_NAME}
      >
        <span
          aria-hidden
          className="material-symbols-rounded text-2xl leading-none"
        >
          keyboard_double_arrow_right
        </span>
      </button>
    </header>
  );
};

export default CalendarHeader;
