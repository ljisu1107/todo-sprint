import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 각 함수의 duration(초), start(시작 위치), 마지막 숫자(등장 시점)를 개별 수정합니다.
// 트리거는 움직이지 않는 콘텐츠 래퍼로 지정해 등장 모션이 시작 위치에 영향을 주지 않습니다.

/** sec01 */
export function animateHero(section: HTMLElement) {
  const text = section.querySelector('[data-enter="text"]')!;
  const button = section.querySelector('[data-enter="button"]')!;
  const image = section.querySelector('[data-enter="image"]')!;
  gsap.set([text, button], { autoAlpha: 0, y: -44 });
  gsap.set(image, { autoAlpha: 0, y: 32 });

  return gsap
    .timeline({ defaults: { duration: 0.8, ease: 'power2.out' } })
    .to(text, { autoAlpha: 1, y: 0, duration: 1 }, 0.4)
    .to(button, { autoAlpha: 1, y: 0 }, '<0.3')
    .to(image, { autoAlpha: 1, y: 0 }, '<0.4');
}

/** sec02 */
export function animateFeatures(section: HTMLElement) {
  const text = section.querySelector('[data-enter="text"]')!;
  const image = section.querySelector('[data-enter="image"]')!;
  const media = gsap.matchMedia();
  media.add(
    { stacked: '(max-width: 63.999rem)', columns: '(min-width: 64rem)' },
    (context) => {
      // [모바일·태블릿] 64rem 미만: 텍스트 아래에 이미지가 놓이는 세로 배치입니다.
      if (context.conditions?.stacked) {
        // 이미지 래퍼는 움직이지 않고 내부 이미지에만 모션을 적용합니다.
        const picture = image.querySelector('img')!;
        gsap.set([text, picture], { autoAlpha: 0, y: 30 });
        let textFinished = false;
        let imageEntered = false;
        const pictureTween = gsap.to(picture, {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          delay: 0.1, // 텍스트 완료 + 이미지 화면 진입 후 기다리는 시간
          ease: 'power2.out',
          paused: true,
        });
        const revealPicture = () => {
          if (textFinished && imageEntered) pictureTween.play();
        };
        gsap.to(text, {
          autoAlpha: 1,
          y: 0,
          duration: 1, // 텍스트가 나타나는 데 걸리는 시간
          delay: 0.3, // 스크롤 시작 조건 충족 후 텍스트가 시작되기까지의 대기
          ease: 'power2.out',
          onComplete: () => {
            textFinished = true;
            revealPicture();
          },
          scrollTrigger: {
            trigger: section.querySelector('[data-reveal-trigger]'),
            start: 'top 75%',
            once: true,
          },
        });
        ScrollTrigger.create({
          trigger: image,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            imageEntered = true;
            revealPicture();
          },
        });
        return; // 모바일·태블릿에서는 아래 PC용 타임라인을 실행하지 않습니다.
      }
      // [PC] 64rem 이상: 텍스트 왼쪽 / 이미지 오른쪽의 가로 배치입니다.
      gsap.set([text, image], { autoAlpha: 0, y: 20 });
      gsap
        .timeline({
          defaults: { duration: 0.85, ease: 'power2.out' },
          scrollTrigger: {
            trigger: section.querySelector('[data-reveal-trigger]'),
            start: 'top 75%',
            once: true,
          },
        })
        .to(text, { autoAlpha: 1, y: 0, duration: 1 }, 0.3)
        .to(image, { autoAlpha: 1, y: 0 }, '<0.4');
    },
  );
  return media;
}

/** sec04 */
export function animateCommunity(section: HTMLElement) {
  const text = section.querySelector('[data-enter="text"]')!;
  const image = section.querySelector('[data-enter="image"]')!;
  gsap.set([text, image], { autoAlpha: 0, y: 32 });

  return gsap
    .timeline({
      defaults: { duration: 0.7, ease: 'power2.out' },
      scrollTrigger: {
        trigger: section.querySelector('[data-reveal-trigger]'),
        start: 'top 75%',
        once: true,
      },
    })
    .to(image, { autoAlpha: 1, y: 0, duration: 1 }, 0.2)
    .to(text, { autoAlpha: 1, y: 0 }, '<0.3');
}

/** sec05 */
export function animateFinale(section: HTMLElement) {
  const texts = section.querySelectorAll('[data-enter="text"]');
  const button = section.querySelector('[data-enter="button"]')!;
  const ornaments = section.querySelectorAll('[data-enter="image"]');
  gsap.set([...texts, button], { autoAlpha: 0, y: 16 });
  gsap.set(ornaments, { autoAlpha: 0 });

  return gsap
    .timeline({
      defaults: { duration: 0.8, ease: 'power2.out' },
      scrollTrigger: {
        trigger: section.querySelector('[data-reveal-trigger]'),
        start: 'top 75%',
        once: true,
      },
    })
    .to(texts, { autoAlpha: 1, y: 0, duration: 1 }, 0.3)
    .to(button, { autoAlpha: 1, y: 0 }, '<0.2')
    .to(ornaments, { autoAlpha: 1, stagger: 0.1 }, '+=0.1');
}

/** sec03 */
export function animateSteps(section: HTMLElement) {
  const heading = section.querySelector('[data-steps-heading]')!;
  const headingTexts = heading.querySelectorAll('p, h2');
  gsap.set(headingTexts, { autoAlpha: 0, y: 40 });
  gsap.to(headingTexts, {
    autoAlpha: 1,
    y: 0,
    duration: 0.85,
    delay: 0.3,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: heading,
      start: 'top 75%',
      once: true,
    },
  });

  const cards = Array.from(section.querySelectorAll<HTMLElement>('ol > li'));
  const media = gsap.matchMedia();
  media.add(
    {
      mobile: '(max-width: 46.499rem)',
      tablet: '(min-width: 46.5rem) and (max-width: 63.999rem)',
      desktop: '(min-width: 64rem)',
      tallEnough: '(min-height: 650px)',
    },
    (context) => {
      if (!context.conditions?.tallEnough) return;
      const mobile = context.conditions.mobile;
      section.setAttribute('data-steps-pinned', '');
      // 글자 확대 등으로 콘텐츠가 화면보다 커지면 자연 스크롤을 유지합니다.
      if (section.scrollHeight > window.innerHeight + 1) {
        section.removeAttribute('data-steps-pinned');
        return;
      }
      if (context.conditions?.desktop) {
        const deck = section.querySelector('ol')!;
        // PC에서만 목록 전체를 미리 표시하고, 카드의 위치는 스크롤로 제어합니다.
        // 서로 다른 요소/속성을 사용해 등장 모션과 펼침 모션이 충돌하지 않습니다.
        gsap.set(deck, { autoAlpha: 0 });
        gsap.set(cards, { zIndex: (index) => cards.length - index });
        gsap.to(deck, {
          autoAlpha: 1,
          duration: 0.6,
          delay: 0.7,
          scrollTrigger: { trigger: heading, start: 'top 75%', once: true },
        });
        const unfold = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${window.innerHeight * 2.2}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        unfold.fromTo(
          cards,
          {
            // 원래 그리드 자리를 유지하고 중앙으로 이동하므로 섹션 높이는 같습니다.
            // 리사이즈 시 원래 배치를 기준으로 다시 계산합니다.
            x: (index) =>
              deck.clientWidth / 2 -
              cards[index].offsetLeft -
              cards[index].offsetWidth / 2 +
              (index - 1) * 24,
            rotation: (index) => (index - 1) * 6,
            scale: 0.94,
            y: 0,
          },
          { x: 0, rotation: 0, scale: 1, duration: 1.6, ease: 'power2.inOut' },
          0.2,
        );
        // 다 펼쳐진 뒤 읽을 수 있는 구간을 남깁니다.
        unfold.to({}, { duration: 0.8 });
        return () => section.removeAttribute('data-steps-pinned');
      }

      gsap.set(cards, { autoAlpha: 0, y: 36 });
      if (mobile) {
        gsap.set(cards[0], { autoAlpha: 1, y: 0 });
      } else {
        // 첫 카드만 제목 진입에 맞춰 미리 등장시킵니다.
        // 핀 타임라인과 대상을 분리해 같은 카드의 모션이 충돌하지 않게 합니다.
        gsap.to(cards[0], {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          delay: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 75%',
            once: true,
          },
        });
      }

      const timeline = gsap.timeline({
        defaults: { duration: 0.6, ease: 'power2.out' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * 2.3}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
      if (mobile) {
        timeline
          .to(cards[0], { autoAlpha: 0, y: -24 }, 1)
          .to(cards[1], { autoAlpha: 1, y: 0 }, 1.3)
          // 2번 등장 완료(1.9)부터 3.0까지 전환 없이 유지합니다.
          .to(cards[1], { autoAlpha: 0, y: -24 }, 3)
          .to(cards[2], { autoAlpha: 1, y: 0 }, 3.3);
      } else {
        // 2·3번의 기존 등장 위치(1.4, 2.65)와 전체 스크롤 길이는 유지합니다.
        timeline.to(cards.slice(1), { autoAlpha: 1, y: 0, stagger: 1.25 }, 1.4);
      }
      // 마지막 카드도 읽을 수 있는 스크롤 구간을 남깁니다.
      // scrub 타임라인의 숫자는 실제 대기 시간이 아니라 스크롤 구간 비율입니다.
      timeline.to({}, { duration: 1 });
      return () => section.removeAttribute('data-steps-pinned');
    },
  );
  return media;
}
