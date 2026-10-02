'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useGSAP } from '@gsap/react';
import {
  animateHero,
  animateFeatures,
  animateSteps,
  animateCommunity,
  animateFinale,
} from './LandingSectionAnimations';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

// false로 바꾸면 섹션이 서로 덮이는 효과만 끕니다.
const ENABLE_SECTION_OVERLAP = true;

export default function LandingSmoothScroll({
  children,
}: {
  children: ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        if (!wrapperRef.current || !contentRef.current) return;

        const smoother = ScrollSmoother.create({
          wrapper: wrapperRef.current,
          content: contentRef.current,
          smooth: 1,
          speed: 0.95,
          smoothTouch: 0.1,
          effects: false,
        });

        const sections = gsap.utils.toArray<HTMLElement>(
          ':scope > section',
          contentRef.current,
        );
        sections.forEach((section, index) => {
          if (section.dataset.landingSection === 'steps') {
            // 3번은 전용 핀을 사용해 중복 고정을 피합니다.
            gsap.set(section, { position: 'relative', zIndex: index + 1 });
            animateSteps(section);
            return;
          }
          if (ENABLE_SECTION_OVERLAP) {
            gsap.set(section, { position: 'relative', zIndex: index + 1 });
            if (index === sections.length - 1) return;

            ScrollTrigger.create({
              trigger: section,
              // 긴 모바일 섹션은 끝까지 읽은 뒤 고정합니다.
              start: () =>
                section.offsetHeight > window.innerHeight
                  ? 'bottom bottom'
                  : 'top top',
              end: () =>
                `+=${Math.min(section.offsetHeight, window.innerHeight)}`,
              pin: true,
              pinSpacing: false,
              invalidateOnRefresh: true,
            });
          }
        });

        // 섹션마다 시작 대상과 타임라인을 독립적으로 설정합니다.
        const hero = contentRef.current.querySelector<HTMLElement>(
          '[data-landing-section="hero"]',
        );
        const features = contentRef.current.querySelector<HTMLElement>(
          '[data-landing-section="features"]',
        );
        const community = contentRef.current.querySelector<HTMLElement>(
          '[data-landing-section="community"]',
        );
        const finale = contentRef.current.querySelector<HTMLElement>(
          '[data-landing-section="finale"]',
        );
        if (hero) animateHero(hero);
        if (features) animateFeatures(features);
        if (community) animateCommunity(community);
        if (finale) animateFinale(finale);

        return () => smoother.kill();
      });
      return () => media.revert();
    },
    { scope: wrapperRef },
  );

  return (
    <div ref={wrapperRef}>
      <main
        ref={contentRef}
        className="overflow-x-clip bg-white text-[#333333]"
      >
        {children}
      </main>
    </div>
  );
}
