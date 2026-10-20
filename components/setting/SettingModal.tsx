'use client';

import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import LanguageSetting from '@/components/setting/LanguageSetting';
import ThemeSetting from '@/components/setting/ThemeSetting';
import Modal from '@/components/ui/Modal';
import ModalHeader from '@/components/ui/ModalHeader';

interface SettingModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function SettingModal({
  isOpen,
  onOpenChange,
}: SettingModalProps) {
  const t = useTranslations('Setting');

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalHeader>{t('title')}</ModalHeader>
      <div className="mt-6 flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-heading">
            {t('language')}
          </h3>
          {/* useSearchParams를 쓰는 컴포넌트는 Suspense 안에 둡니다. */}
          <Suspense>
            <LanguageSetting />
          </Suspense>
        </section>
        <section className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-heading">{t('theme')}</h3>
          <ThemeSetting />
        </section>
      </div>
    </Modal>
  );
}
