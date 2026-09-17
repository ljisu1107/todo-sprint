import SocialLoginButton from '@/components/ui/button/SocialLoginButton';
import IconButton from '@/components/ui/button/IconButton';
import ActionButton from '@/components/ui/button/ActionButton';
import Button from '@/components/ui/button/Button';
export default function ComponentSamplesPage() {
  return (
    <main
      lang="ko"
      className="min-h-dvh bg-[#f2f2f2] px-4 py-10 text-[#262626] sm:px-8"
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold">공통 버튼 가이드</h1>
          <p className="text-sm/6 text-[#535353]">
            필요한 버튼 아래의 코드를 복사해 사용하세요. 마우스를 올리면 실제
            hover 색상이 표시되고, Tab 키로 포커스를 확인할 수 있습니다.
          </p>
          <pre className="overflow-x-auto rounded-lg bg-white p-4 text-sm">
            <code>{"import Button from '@/components/ui/button/Button';"}</code>
          </pre>
        </header>
        <section
          aria-labelledby="primary-title"
          className="rounded-2xl border border-[#ddd] bg-white p-5 sm:p-8"
        >
          <h2 id="primary-title" className="mb-6 text-xl font-semibold">
            주황 채움 · primary
          </h2>
          <div className="grid gap-8 lg:grid-cols-3">
            <article className="min-w-0 space-y-4">
              <h3 className="font-semibold">Small</h3>
              <Button variant="primary" size="sm">
                버튼
              </Button>
              <p className="text-sm text-[#535353]">
                높이 40px · 글자 14px · 너비 100% <br />
                모바일: 변동 없음
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {'<Button variant="primary" size="sm">버튼</Button>'}
                </code>
              </pre>
              <h4 className="pt-2 text-sm font-semibold">Small · 비활성</h4>
              <Button variant="primary" size="sm" disabled>
                버튼
              </Button>
              <p className="text-sm text-[#535353]">
                disabled를 추가하면 클릭과 hover 반응이 비활성화됩니다.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {'<Button variant="primary" size="sm" disabled>버튼</Button>'}
                </code>
              </pre>
            </article>
            <article className="min-w-0 space-y-4">
              <h3 className="font-semibold">Default</h3>
              <Button variant="primary" size="md">
                버튼
              </Button>
              <p className="text-sm text-[#535353]">
                높이 48px · 글자 16px · 너비 100% <br />
                모바일: 높이 40px · 글자 14px
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {'<Button variant="primary" size="md">버튼</Button>'}
                </code>
              </pre>
              <h4 className="pt-2 text-sm font-semibold">Default · 비활성</h4>
              <Button variant="primary" size="md" disabled>
                버튼
              </Button>
              <p className="text-sm text-[#535353]">
                disabled를 추가하면 클릭과 hover 반응이 비활성화됩니다.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {'<Button variant="primary" size="md" disabled>버튼</Button>'}
                </code>
              </pre>
            </article>
            <article className="min-w-0 space-y-4">
              <h3 className="font-semibold">Large</h3>
              <Button variant="primary" size="lg">
                버튼
              </Button>
              <p className="text-sm text-[#535353]">
                높이 56px · 글자 18px · 너비 100% <br />
                모바일: 높이 48px · 글자 16px
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {'<Button variant="primary" size="lg">버튼</Button>'}
                </code>
              </pre>
              <h4 className="pt-2 text-sm font-semibold">Large · 비활성</h4>
              <Button variant="primary" size="lg" disabled>
                버튼
              </Button>
              <p className="text-sm text-[#535353]">
                disabled를 추가하면 클릭과 hover 반응이 비활성화됩니다.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {'<Button variant="primary" size="lg" disabled>버튼</Button>'}
                </code>
              </pre>
            </article>
          </div>
        </section>
        <section
          aria-labelledby="outline-title"
          className="rounded-2xl border border-[#ddd] bg-white p-5 sm:p-8"
        >
          <h2 id="outline-title" className="mb-6 text-xl font-semibold">
            주황 테두리 · outline
          </h2>
          <div className="grid gap-8 lg:grid-cols-3">
            <article className="min-w-0 space-y-4">
              <h3 className="font-semibold">Small</h3>
              <Button variant="outline" size="sm">
                버튼
              </Button>
              <p className="text-sm text-[#535353]">
                높이 40px · 글자 14px · 너비 100%
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {'<Button variant="outline" size="sm">버튼</Button>'}
                </code>
              </pre>
              <h4 className="pt-2 text-sm font-semibold">Small · 비활성</h4>
              <Button variant="outline" size="sm" disabled>
                버튼
              </Button>
              <p className="text-sm text-[#535353]">
                disabled를 추가하면 클릭과 hover 반응이 비활성화됩니다.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {'<Button variant="outline" size="sm" disabled>버튼</Button>'}
                </code>
              </pre>
            </article>
            <article className="min-w-0 space-y-4">
              <h3 className="font-semibold">Default</h3>
              <Button variant="outline" size="md">
                버튼
              </Button>
              <p className="text-sm text-[#535353]">
                높이 48px · 글자 16px · 너비 100%
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {'<Button variant="outline" size="md">버튼</Button>'}
                </code>
              </pre>
              <h4 className="pt-2 text-sm font-semibold">Default · 비활성</h4>
              <Button variant="outline" size="md" disabled>
                버튼
              </Button>
              <p className="text-sm text-[#535353]">
                disabled를 추가하면 클릭과 hover 반응이 비활성화됩니다.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {'<Button variant="outline" size="md" disabled>버튼</Button>'}
                </code>
              </pre>
            </article>
            <article className="min-w-0 space-y-4">
              <h3 className="font-semibold">Large</h3>
              <Button variant="outline" size="lg">
                버튼
              </Button>
              <p className="text-sm text-[#535353]">
                높이 56px · 글자 18px · 너비 100%
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {'<Button variant="outline" size="lg">버튼</Button>'}
                </code>
              </pre>
              <h4 className="pt-2 text-sm font-semibold">Large · 비활성</h4>
              <Button variant="outline" size="lg" disabled>
                버튼
              </Button>
              <p className="text-sm text-[#535353]">
                disabled를 추가하면 클릭과 hover 반응이 비활성화됩니다.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {'<Button variant="outline" size="lg" disabled>버튼</Button>'}
                </code>
              </pre>
            </article>
          </div>
        </section>
        <section
          aria-labelledby="neutral-title"
          className="rounded-2xl border border-[#ddd] bg-white p-5 sm:p-8"
        >
          <h2 id="neutral-title" className="mb-6 text-xl font-semibold">
            회색 테두리 · neutral
          </h2>
          <div className="grid gap-8 lg:grid-cols-3">
            <article className="min-w-0 space-y-4">
              <h3 className="font-semibold">Small</h3>
              <Button variant="neutral" size="sm">
                버튼
              </Button>
              <p className="text-sm text-[#535353]">
                높이 40px · 글자 14px · 너비 100%
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {'<Button variant="neutral" size="sm">버튼</Button>'}
                </code>
              </pre>
              <h4 className="pt-2 text-sm font-semibold">Small · 비활성</h4>
              <Button variant="neutral" size="sm" disabled>
                버튼
              </Button>
              <p className="text-sm text-[#535353]">
                disabled를 추가하면 클릭과 hover 반응이 비활성화됩니다.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {'<Button variant="neutral" size="sm" disabled>버튼</Button>'}
                </code>
              </pre>
            </article>
            <article className="min-w-0 space-y-4">
              <h3 className="font-semibold">Default</h3>
              <Button variant="neutral" size="md">
                버튼
              </Button>
              <p className="text-sm text-[#535353]">
                높이 48px · 글자 16px · 너비 100%
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {'<Button variant="neutral" size="md">버튼</Button>'}
                </code>
              </pre>
              <h4 className="pt-2 text-sm font-semibold">Default · 비활성</h4>
              <Button variant="neutral" size="md" disabled>
                버튼
              </Button>
              <p className="text-sm text-[#535353]">
                disabled를 추가하면 클릭과 hover 반응이 비활성화됩니다.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {'<Button variant="neutral" size="md" disabled>버튼</Button>'}
                </code>
              </pre>
            </article>
            <article className="min-w-0 space-y-4">
              <h3 className="font-semibold">Large</h3>
              <Button variant="neutral" size="lg">
                버튼
              </Button>
              <p className="text-sm text-[#535353]">
                높이 56px · 글자 18px · 너비 100%
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {'<Button variant="neutral" size="lg">버튼</Button>'}
                </code>
              </pre>
              <h4 className="pt-2 text-sm font-semibold">Large · 비활성</h4>
              <Button variant="neutral" size="lg" disabled>
                버튼
              </Button>
              <p className="text-sm text-[#535353]">
                disabled를 추가하면 클릭과 hover 반응이 비활성화됩니다.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {'<Button variant="neutral" size="lg" disabled>버튼</Button>'}
                </code>
              </pre>
            </article>
          </div>
        </section>
        <article className="space-y-4 rounded-2xl border border-[#ddd] bg-white p-5 sm:p-8">
          <h2 className="text-xl font-semibold">기본 버튼</h2>
          <Button>로그인</Button>
          <p className="text-sm text-[#535353]">
            옵션을 생략하면 primary, md, type=&quot;button&quot;이 적용됩니다.
          </p>
          <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
            <code>{'<Button>로그인</Button>'}</code>
          </pre>
        </article>
        <article className="space-y-4 rounded-2xl border border-[#ddd] bg-white p-5 sm:p-8">
          <h2 className="text-xl font-semibold">내용에 맞는 너비</h2>
          <Button variant="outline" className="w-auto">
            취소
          </Button>
          <p className="text-sm text-[#535353]">
            className=&quot;w-auto&quot;를 추가하면 내용에 맞는 너비가 됩니다.
          </p>
          <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
            <code>
              {'<Button variant="outline" className="w-auto">취소</Button>'}
            </code>
          </pre>
        </article>
        <article className="space-y-4 rounded-2xl border border-[#ddd] bg-white p-5 sm:p-8">
          <h2 className="text-xl font-semibold">폼 제출 버튼</h2>
          <Button type="submit">저장</Button>
          <p className="text-sm text-[#535353]">
            실제 사용 시 form 안에 배치합니다. 이 샘플은 form 밖에 있어 제출
            동작은 하지 않습니다.
          </p>
          <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
            <code>{'<Button type="submit">저장</Button>'}</code>
          </pre>
        </article>
        <section aria-labelledby="icon-buttons-title" className="space-y-6">
          <h2 id="icon-buttons-title" className="text-2xl font-bold">
            아이콘 버튼
          </h2>
          <p className="text-sm text-[#535353]">
            아래 코드를 복사해 사용하세요. 실제 동작은 사용하는 페이지에서
            onClick으로 연결합니다.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="min-w-0 space-y-4 rounded-2xl border border-[#ddd] bg-white p-6">
              <h3 className="text-lg font-semibold">구글 로그인</h3>
              <SocialLoginButton provider="google" />
              <p className="text-sm text-[#535353]">56 × 56px · 흰 배경</p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {
                    'import SocialLoginButton from \'@/components/ui/button/SocialLoginButton\';\n\n<SocialLoginButton provider="google" />'
                  }
                </code>
              </pre>
            </article>
            <article className="min-w-0 space-y-4 rounded-2xl border border-[#ddd] bg-white p-6">
              <h3 className="text-lg font-semibold">카카오 로그인</h3>
              <SocialLoginButton provider="kakao" />
              <p className="text-sm text-[#535353]">56 × 56px · 노란 배경</p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {
                    'import SocialLoginButton from \'@/components/ui/button/SocialLoginButton\';\n\n<SocialLoginButton provider="kakao" />'
                  }
                </code>
              </pre>
            </article>
            <article className="min-w-0 space-y-4 rounded-2xl border border-[#ddd] bg-white p-6">
              <h3 className="text-lg font-semibold">아래 화살표</h3>
              <IconButton icon="chevron-down" aria-label="메뉴 펼치기" />
              <p className="text-sm text-[#535353]">24 × 24px</p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {
                    'import IconButton from \'@/components/ui/button/IconButton\';\n\n<IconButton icon="chevron-down" aria-label="메뉴 펼치기" />'
                  }
                </code>
              </pre>
            </article>
            <article className="min-w-0 space-y-4 rounded-2xl border border-[#ddd] bg-white p-6">
              <h3 className="text-lg font-semibold">위 화살표</h3>
              <IconButton icon="chevron-up" aria-label="메뉴 접기" />
              <p className="text-sm text-[#535353]">24 × 24px</p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {
                    'import IconButton from \'@/components/ui/button/IconButton\';\n\n<IconButton icon="chevron-up" aria-label="메뉴 접기" />'
                  }
                </code>
              </pre>
            </article>
            <article className="min-w-0 space-y-4 rounded-2xl border border-[#ddd] bg-white p-6">
              <h3 className="text-lg font-semibold">알림</h3>
              <IconButton icon="bell" aria-label="알림 열기" />
              <p className="text-sm text-[#535353]">64 × 64px</p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {
                    'import IconButton from \'@/components/ui/button/IconButton\';\n\n<IconButton icon="bell" aria-label="알림 열기" />'
                  }
                </code>
              </pre>
            </article>
            <article className="min-w-0 space-y-4 rounded-2xl border border-[#ddd] bg-white p-6">
              <h3 className="text-lg font-semibold">새 알림 있음</h3>
              <IconButton icon="bell" hasNotification aria-label="알림 열기" />
              <p className="text-sm text-[#535353]">64 × 64px · 새 알림 표시</p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {
                    'import IconButton from \'@/components/ui/button/IconButton\';\n\n<IconButton icon="bell" hasNotification aria-label="알림 열기" />'
                  }
                </code>
              </pre>
            </article>
            <article className="min-w-0 space-y-4 rounded-2xl border border-[#ddd] bg-white p-6">
              <h3 className="text-lg font-semibold">작은 닫기</h3>
              <IconButton icon="close" size="sm" aria-label="닫기" />
              <p className="text-sm text-[#535353]">13 × 13px</p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {
                    'import IconButton from \'@/components/ui/button/IconButton\';\n\n<IconButton icon="close" size="sm" aria-label="닫기" />'
                  }
                </code>
              </pre>
            </article>
            <article className="min-w-0 space-y-4 rounded-2xl border border-[#ddd] bg-white p-6">
              <h3 className="text-lg font-semibold">기본 닫기</h3>
              <IconButton icon="close" aria-label="닫기" />
              <p className="text-sm text-[#535353]">24 × 24px</p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {
                    'import IconButton from \'@/components/ui/button/IconButton\';\n\n<IconButton icon="close" aria-label="닫기" />'
                  }
                </code>
              </pre>
            </article>
            <article className="min-w-0 space-y-4 rounded-2xl border border-[#ddd] bg-white p-6">
              <h3 className="text-lg font-semibold">새 목표</h3>
              <ActionButton variant="goal" />
              <p className="text-sm text-[#535353]">
                140 × 140px · 마우스를 올리면 배경색이 변경됩니다.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {
                    'import ActionButton from \'@/components/ui/button/ActionButton\';\n\n<ActionButton variant="goal" />'
                  }
                </code>
              </pre>
            </article>
            <article className="min-w-0 space-y-4 rounded-2xl border border-[#ddd] bg-white p-6">
              <h3 className="text-lg font-semibold">새 할일</h3>
              <ActionButton variant="task" />
              <p className="text-sm text-[#535353]">
                140 × 140px · 마우스를 올리면 테두리와 글자·아이콘 색상이
                변경됩니다.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-[#f2f2f2] p-3 text-xs/6">
                <code>
                  {
                    'import ActionButton from \'@/components/ui/button/ActionButton\';\n\n<ActionButton variant="task" />'
                  }
                </code>
              </pre>
            </article>
          </div>
        </section>
        <p className="text-xs text-[#737373]">
          폰트는 프로젝트의 전역 설정을 상속합니다.
        </p>
      </div>
    </main>
  );
}
