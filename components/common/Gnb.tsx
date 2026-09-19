'use client';

import Link from 'next/link';
import Image from 'next/image';
import ActionButton from '@/components/ui/button/ActionButton';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

export default function Gnb() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [goalSelection, setGoalSelection] = useState({
    pathname,
    selected: true,
  });
  // 페이지가 바뀌면 제목 클릭 상태를 초기화하고 현재 경로를 기준으로 표시합니다.
  if (goalSelection.pathname !== pathname) {
    setGoalSelection({ pathname, selected: false });
  }
  const goalActive =
    goalSelection.pathname === pathname && goalSelection.selected;
  const clearGoalSelection = () =>
    setGoalSelection({ pathname, selected: false });
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 닫기 버튼과 딤에서 공통으로 사용합니다.
  function closeMenu() {
    toggleRef.current?.focus({ preventScroll: true });
    setIsOpen(false);
  }

  // 닫힌 메뉴는 애니메이션 중에도 클릭·Tab·스크린리더 접근을 막습니다.
  // PC는 true일 때 접힘, 모바일·태블릿은 false일 때 닫힘입니다.
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const breakpoint =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--breakpoint-lg')
        .trim() || '64rem';
    const desktop = window.matchMedia(`(min-width: ${breakpoint})`);
    function updateMenuAccess() {
      if (!menu) return;
      const hidden = desktop.matches ? isOpen : !isOpen;
      toggleRef.current?.setAttribute('aria-expanded', String(!hidden));
      if (hidden && menu.contains(document.activeElement)) {
        toggleRef.current?.focus({ preventScroll: true });
      }
      menu.inert = hidden;
    }
    updateMenuAccess();
    desktop.addEventListener('change', updateMenuAccess);
    return () => desktop.removeEventListener('change', updateMenuAccess);
  }, [isOpen]);

  return (
    <aside
      data-open={isOpen}
      className="group/gnb peer/gnb sticky top-0 z-50 w-full bg-white-section text-foreground after:pointer-events-none after:fixed after:inset-0 after:z-10 after:hidden after:bg-black/40 after:opacity-0 after:transition-opacity after:duration-400 after:ease-out after:content-[''] motion-reduce:transition-none motion-reduce:after:transition-none md:fixed md:left-0 md:flex md:h-dvh md:w-15 md:flex-col md:overflow-hidden md:rounded-r-[40px] md:transition-[width] md:duration-400 md:ease-out md:after:block md:data-[open=true]:w-90.5 md:data-[open=true]:after:pointer-events-auto md:data-[open=true]:after:opacity-100 lg:w-90.5 lg:rounded-r-[48px] lg:after:hidden lg:data-[open=true]:w-24"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeMenu();
      }}
    >
      {/* 기본 헤더: 모바일의 닫힌 상단 바 / 태블릿·PC의 로고와 토글 버튼 */}
      <header className="relative z-20 flex h-16 w-full shrink-0 items-center justify-between bg-white-section px-4 md:block md:h-auto md:group-data-[open=false]/gnb:px-0 md:group-data-[open=false]/gnb:pt-14 md:group-data-[open=true]/gnb:pt-21 lg:group-data-[open=false]/gnb:px-4 lg:group-data-[open=false]/gnb:pt-21 lg:group-data-[open=true]/gnb:px-0 lg:group-data-[open=true]/gnb:pt-14">
        <Link
          href="/dashboard"
          className="hidden font-semibold whitespace-nowrap md:inline md:group-data-[open=false]/gnb:mx-auto md:group-data-[open=false]/gnb:block md:group-data-[open=false]/gnb:w-fit lg:group-data-[open=false]/gnb:mx-0 lg:group-data-[open=false]/gnb:block lg:group-data-[open=false]/gnb:w-auto lg:group-data-[open=true]/gnb:mx-auto lg:group-data-[open=true]/gnb:block lg:group-data-[open=true]/gnb:w-fit"
          aria-label="대시보드"
        >
          <Image
            src="/icons/gnb/logo.svg"
            alt=""
            width={284}
            height={80}
            className="hidden h-auto w-74.5 max-w-none md:group-data-[open=true]/gnb:block lg:group-data-[open=false]/gnb:block lg:group-data-[open=true]/gnb:hidden"
          />
          {/* 원본 80px 중 본체 48px → 전체 10/3rem이면 본체는 2rem(32px) */}
          <Image
            src="/icons/gnb/symbol.svg"
            alt=""
            width={80}
            height={80}
            className="hidden size-[calc(10rem/3)] max-w-none md:group-data-[open=false]/gnb:block lg:group-data-[open=false]/gnb:hidden lg:group-data-[open=true]/gnb:block"
          />
        </Link>
        <button
          type="button"
          ref={toggleRef}
          className="flex size-8 shrink-0 items-center justify-center md:absolute md:top-4 md:right-4 lg:group-data-[open=true]/gnb:right-auto lg:group-data-[open=true]/gnb:left-1/2 lg:group-data-[open=true]/gnb:-translate-x-1/2"
          aria-label="메뉴 열기·닫기"
          aria-controls="gnb-menu"
          onClick={() => {
            if (isOpen) closeMenu();
            else setIsOpen(true);
          }}
        >
          <span
            className="flex size-6 items-center justify-center md:hidden"
            aria-hidden="true"
          >
            <Image
              src="/icons/gnb/menu.svg"
              alt=""
              width={14}
              height={10}
              className="h-2.5 w-3.5"
            />
          </span>
          <Image
            src="/icons/gnb/chevrons-right.svg"
            alt=""
            width={18}
            height={15}
            className="hidden h-3.75 w-4.5 md:block"
          />
        </button>
      </header>

      {/* 모바일: 기존 헤더까지 덮으며 위에서 내려오는 메뉴 */}
      <div
        ref={menuRef}
        id="gnb-menu"
        className="absolute top-[-100dvh] left-0 z-30 flex h-dvh min-h-0 w-full flex-col gap-6 overflow-hidden bg-white-section pt-4 pb-14 transition-[top,visibility] duration-300 ease-out group-data-[open=false]/gnb:pointer-events-none group-data-[open=false]/gnb:invisible group-data-[open=true]/gnb:top-0 motion-reduce:transition-none md:relative md:top-auto md:h-auto md:flex-1 md:pb-9 md:group-data-[open=false]/gnb:pointer-events-auto md:group-data-[open=false]/gnb:visible md:group-data-[open=true]/gnb:top-auto"
      >
        <div className="flex min-h-0 w-full flex-1 flex-col motion-reduce:transition-none md:px-8 md:transition-[opacity,visibility] md:duration-400 md:ease-out md:group-data-[open=false]/gnb:pointer-events-none md:group-data-[open=false]/gnb:invisible md:group-data-[open=false]/gnb:opacity-0 md:max-lg:group-data-[open=false]/gnb:duration-150 lg:group-data-[open=false]/gnb:pointer-events-auto lg:group-data-[open=false]/gnb:visible lg:group-data-[open=false]/gnb:opacity-100 lg:group-data-[open=true]/gnb:pointer-events-none lg:group-data-[open=true]/gnb:invisible lg:group-data-[open=true]/gnb:opacity-0 lg:group-data-[open=true]/gnb:duration-150">
          {/* 모바일에서 메뉴를 펼쳤을 때 표시하는 로고·닫기 버튼 */}
          <div className="shrink-0 pt-10 md:hidden">
            <Link href="/dashboard" className="block w-83.75 max-w-full">
              <Image
                src="/icons/gnb/logo.svg"
                alt="Slid to-do 대시보드"
                width={284}
                height={80}
                className="h-auto w-full"
              />
            </Link>
            <button
              type="button"
              className="absolute top-4 right-4 flex size-8 items-center justify-center"
              aria-label="메뉴 닫기"
              onClick={closeMenu}
            >
              <span
                className="flex size-6 items-center justify-center"
                aria-hidden="true"
              >
                <Image
                  src="/icons/gnb/close.svg"
                  alt=""
                  width={14}
                  height={14}
                  className="size-3.5"
                />
              </span>
            </button>
          </div>

          <div className="min-h-0 flex-1 scrollbar-thin overflow-x-hidden overflow-y-auto overscroll-contain px-5 md:px-0">
            <nav aria-label="주 메뉴">
              <ul className="space-y-3">
                <li>
                  <SideMenuLink
                    href="/dashboard"
                    title="대시보드"
                    icon="dashboard"
                    suppressActive={goalActive}
                    onNavigate={clearGoalSelection}
                  />
                </li>
                <li>
                  <SideMenuSlect
                    title="목표"
                    defaultOpen
                    icon={<SideMenuIcon name="flag" active={goalActive} />}
                    active={goalActive}
                    onSelect={() =>
                      setGoalSelection({ pathname, selected: true })
                    }
                  >
                    {/* 임시 목표 목록입니다. 실제 목표 데이터와 주소로 교체합니다.
                        개발 연동: 아래 Link의 data-active를 선택한 목표 여부에 연결해주세요.
                        예: data-active={selectedGoalId === goal.id}
                        true이면 글자색 #DC5203, false이면 기본 색상을 표시합니다.
                        data-active는 li가 아닌 Link에 지정하며, 선택한 항목만 true로 유지해주세요.
                        현재는 스타일 확인용으로 첫 번째 항목만 true로 하드코딩했습니다.
                    */}
                    <li>
                      <Link
                        href="#"
                        data-active="true"
                        className="block rounded-sm py-2 focus-visible:outline-2 focus-visible:outline-orange-500 data-[active=false]:hover:text-orange-500 data-[active=true]:text-orange-700"
                      >
                        자바스크립트로 웹 서비스 만들기
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="#"
                        data-active="false"
                        className="block rounded-sm py-2 focus-visible:outline-2 focus-visible:outline-orange-500 data-[active=false]:hover:text-orange-500 data-[active=true]:text-orange-700"
                      >
                        자바스크립트로 웹 서비스 만들기
                      </Link>
                    </li>
                  </SideMenuSlect>
                </li>
                <li>
                  <SideMenuLink
                    href="#"
                    title="캘린더"
                    icon="calendar"
                    suppressActive={goalActive}
                    onNavigate={clearGoalSelection}
                  />
                </li>
                <li>
                  <SideMenuLink
                    href="#"
                    title="소통 게시판"
                    icon="message"
                    suppressActive={goalActive}
                    onNavigate={clearGoalSelection}
                  />
                </li>
                <li>
                  <SideMenuLink
                    href="#"
                    title="찜한 할 일"
                    icon="star"
                    suppressActive={goalActive}
                    onNavigate={clearGoalSelection}
                  />
                </li>
              </ul>
            </nav>
            <div className="mt-6">
              <ul>
                <li>
                  <Link
                    href="#"
                    className="flex min-h-14 w-full items-center gap-2 rounded-2xl p-4 font-normal text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grayscale-500 md:text-lg"
                  >
                    <SideMenuIcon name="setting" />
                    <span>설정</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex min-h-14 w-full items-center gap-2 rounded-2xl p-4 font-normal text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grayscale-500 md:text-lg"
                  >
                    <SideMenuIcon name="logout" />
                    <span>로그아웃</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <ul className="grid grid-cols-2 gap-2">
                <li className="flex min-w-0 justify-center">
                  <ActionButton variant="goal" />
                </li>
                <li className="flex min-w-0 justify-center">
                  <ActionButton variant="task" />
                </li>
              </ul>
            </div>

            <div>
              <ul>
                <li>
                  <button type="button">체다치즈</button>
                </li>
                <li>
                  <button type="button">종</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// TODO(개발 연동): 임시 href="#"를 각 메뉴의 실제 페이지 경로로 교체해주세요.
// 활성 표시는 클릭한 메뉴가 아니라 현재 pathname과 href의 일치 여부로 결정됩니다.
// # 클릭 시 pathname은 그대로이고 onNavigate가 목표의 임시 선택 상태를 해제하므로,
// /dashboard에서는 소통 게시판 등을 눌러도 대시보드가 활성화될 수 있습니다.
// 실제 경로 연결 후 직접 접속·새로고침·뒤로 가기·하위 페이지에서 활성 표시를 확인해주세요.
// 팝업처럼 경로가 바뀌지 않는 메뉴는 선택 상태를 별도로 연결해야 합니다.
// 임시 주소 /는 활성 판정에서 제외하며, #은 pathname과 일치하지 않습니다.
function SideMenuLink({
  href,
  title,
  icon,
  suppressActive,
  onNavigate,
}: {
  href: string;
  title: string;
  icon: SideMenuIconName;
  suppressActive: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const active =
    !suppressActive &&
    href !== '/' &&
    (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      onNavigate={onNavigate}
      data-active={active}
      aria-current={active ? 'page' : undefined}
      className="group/menu-item flex min-h-14 w-full items-center gap-2 rounded-[20px] p-4 font-semibold text-foreground hover:text-orange-menu-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grayscale-500 data-[active=true]:bg-orange-menu-background data-[active=true]:font-bold data-[active=true]:text-orange-menu-active md:text-lg"
    >
      <SideMenuIcon name={icon} active={active} />
      <span>{title}</span>
    </Link>
  );
}

// SVG를 마스크로 사용해 원본 모양을 유지하면서 상태별 색상을 적용합니다.
type SideMenuIconName =
  'dashboard' | 'flag' | 'calendar' | 'message' | 'star' | 'setting' | 'logout';

function SideMenuIcon({
  name,
  active = false,
}: {
  name: SideMenuIconName;
  active?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      data-active={active}
      className="size-6 shrink-0 bg-grayscale-300 group-hover/menu-item:bg-orange-menu-active data-[active=true]:bg-orange-menu-active"
      style={{
        maskImage: `url(/icons/gnb/icon_${name}.svg)`,
        maskSize: 'contain',
        maskPosition: 'center',
        maskRepeat: 'no-repeat',
      }}
    />
  );
}

// ── 재사용 가능한 사이드 메뉴 아코디언 ──
// 각 사용 위치마다 상태와 ID가 독립적입니다. 추후 타입과 함수를 별도 파일로 옮길 수 있습니다.
type SideMenuSlectProps = {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  active?: boolean;
  onSelect?: () => void;
  children: ReactNode;
};

function SideMenuSlect({
  title,
  icon,
  defaultOpen = false,
  active = false,
  onSelect,
  children,
}: SideMenuSlectProps) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="group/side-menu-slect" data-open={isExpanded}>
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        data-active={active}
        onClick={() => {
          setIsExpanded((previous) => !previous);
          onSelect?.();
        }}
        className="group/menu-item flex min-h-14 w-full items-center gap-2 rounded-[20px] p-4 text-left font-semibold text-foreground hover:text-orange-menu-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grayscale-500 data-[active=true]:bg-orange-menu-background data-[active=true]:font-bold data-[active=true]:text-orange-menu-active md:text-lg"
      >
        {icon && (
          <span className="flex shrink-0 items-center" aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{title}</span>
        <span
          aria-hidden="true"
          data-active={active}
          className="ml-auto size-6 shrink-0 rotate-180 bg-grayscale-400 transition-transform duration-300 group-data-[open=true]/side-menu-slect:rotate-0 data-[active=true]:bg-orange-700 motion-reduce:transition-none"
          style={{
            maskImage: 'url(/icons/gnb/icon_arrow_up.svg)',
            maskSize: 'contain',
            maskPosition: 'center',
            maskRepeat: 'no-repeat',
          }}
        />
      </button>

      {/* 높이 애니메이션 영역. 닫는 즉시 내부 키보드·스크린리더 접근도 차단합니다. */}
      <div
        id={panelId}
        inert={!isExpanded}
        aria-hidden={!isExpanded}
        className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-data-[open=true]/side-menu-slect:grid-rows-[1fr] motion-reduce:transition-none"
      >
        <div className="min-h-0 overflow-hidden">
          {/* 항목이 적으면 내용 높이만 사용하고, 300px을 넘으면 내부 스크롤합니다. */}
          <div className="scrollbar-thin md:max-h-26 md:overflow-y-auto md:overscroll-contain">
            <ul className="px-4 py-2 text-sm">{children}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}
