// 팀 공유용 임시 샘플입니다. 페이지 작업 기준 확인 후 이 샘플 폴더는 삭제 가능합니다.
export default function DashboardLayoutSample() {
  return (
    // 페이지 시안에 맞게 최대 너비를 변경해주세요.
    // 아래는 대시보드 기준: 82rem = 1312px. lg 미만에서는 상위 영역의 너비를 사용합니다.
    <div className="lg:mx-auto lg:w-full lg:max-w-328">
      {/* 공통 사이드바와 바깥 여백은 상위 (dashboard)/layout.tsx에서 적용합니다.
          담당 페이지를 같은 (dashboard) 그룹 안에 만들면 공통 레이아웃이 적용됩니다.
          아래 안내용 div를 삭제하고 이 위치에 페이지 콘텐츠를 작성해주세요. */}
      <div className="bg-white-section px-4 py-20 text-center text-lg text-foreground">
        <p>대시보드 타입 레이아웃 샘플입니다.</p>
        <p>담당 페이지의 시안을 확인해 최대 너비를 설정해주세요.</p>
        <p>예: 대시보드 콘텐츠 최대 너비 1312px</p>
      </div>
    </div>
  );
}
