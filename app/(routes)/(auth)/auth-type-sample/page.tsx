// 팀 공유용 임시 샘플입니다. 페이지 작업 기준 확인 후 이 샘플 폴더는 삭제 가능합니다.
export default function AuthTypeSample() {
  return (
    // 인증 페이지의 공통 너비와 중앙 배치는 상위 (auth)/layout.tsx에서 적용합니다.
    // 현재 너비는 clamp(12.5rem, 88.27vw, 25rem)으로, 최소 200px·최대 400px입니다.
    // 담당 인증 페이지는 같은 (auth) 그룹 안에 작성하고 공통 너비를 중복 지정하지 마세요.
    <div className="w-full">
      {/* 아래 안내용 div를 삭제하고 로그인·회원가입 등 인증 페이지 콘텐츠를 작성해주세요.
          페이지 시안에 별도의 너비 기준이 있다면 공통 레이아웃 담당자와 먼저 확인해주세요. */}
      <div className="bg-white-section px-4 py-20 text-center text-base text-foreground">
        <p>인증 타입 레이아웃 샘플입니다.</p>
        <p>콘텐츠 너비와 중앙 배치는 공통 레이아웃에서 적용합니다.</p>
        <p>
          이 영역부터 담당 페이지의 콘텐츠를 작성해주세요. <br />
          <br />
        </p>
        <p>PC, 태블릿 width: 400px </p>
        <p>모바일 width: 331px </p>
      </div>
    </div>
  );
}
