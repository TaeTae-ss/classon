import { NavLink } from "react-router";
import { useStore } from "../../mocks/data";

const memberMenu = [
  ["/member/mypage", "내 정보"],
  ["/reservation/member/1", "예약 내역"],
  ["/payment/member/1", "결제 내역"],
  ["/member/favorites", "내가 찜한 클래스"],
  ["/member/reviews", "내가 작성한 후기"],
  ["/inquiry/list", "문의 및 신고 내역"],
];
const instructorMenu = [
  ["/instructor", "강사 대시보드"],
  ["/instructor/classes", "내 클래스 관리"],
  ["/instructor/schedules", "수업 일정 관리"],
  ["/reservation/instructor/1", "예약 회원 정보"],
  ["/instructor/reviews", "클래스 후기"],
  ["/instructor/mypage", "내 정보"],
];
const adminMenu = [
  ["/admin", "관리자 대시보드"],
  ["/admin/members", "회원 관리"],
  ["/admin/classes", "클래스 관리"],
  ["/admin/reviews", "후기 관리"],
  ["/admin/notice/list", "공지사항 관리"],
  ["/admin/inquiry/list", "문의 및 신고 관리"],
  ["/admin/reservations", "예약·결제 현황"],
];
export function Workspace({ kind = "member", children }) {
  const [role] = useStore("role", "PUBLIC");
  const menuKind = kind === "member" && role === "INS" ? "instructor" : kind;
  const groups =
    menuKind === "admin"
      ? [
          { title: "관리", items: adminMenu.slice(0, 4) },
          { title: "서비스 운영", items: adminMenu.slice(4) },
        ]
      : menuKind === "instructor"
        ? [
            {
              title: "강사 관리",
              items: instructorMenu.filter(
                ([to]) => to !== "/instructor/mypage",
              ),
            },
            {
              title: "내 계정",
              items: [
                ["/instructor/mypage", "내 정보"],
                ...memberMenu.filter(([to]) => to !== "/member/mypage"),
              ],
            },
          ]
        : [
            { title: "내 계정", items: memberMenu.slice(0, 1) },
            { title: "클래스 활동", items: memberMenu.slice(1, 5) },
            { title: "고객 지원", items: memberMenu.slice(5) },
          ];
  return (
    <div className="grid grid-cols-[216px_minmax(0,1fr)] gap-9 mt-[34px] max-[900px]:grid-cols-[180px_minmax(0,1fr)] max-[900px]:gap-[22px] max-md:grid-cols-1">
      <aside className="bg-white border border-[#e5e7eb] rounded-xl px-[18px] py-5 max-md:flex max-md:overflow-x-auto max-md:gap-[6px] max-md:border max-md:p-3">
        <h2 className="text-[19px] px-3 mb-[18px] text-[#252b31] max-md:hidden">
          {menuKind === "admin"
            ? "관리자 메뉴"
            : menuKind === "instructor"
              ? "강사 메뉴"
              : "마이페이지"}
        </h2>
        {groups.map((group) => (
          <nav
            className="[&:not(:first-child)]:mt-[18px] [&:not(:first-child)]:pt-[18px] [&:not(:first-child)]:border-t [&:not(:first-child)]:border-[#e5e7eb] max-md:flex max-md:items-center max-md:gap-[6px] max-md:shrink-0 max-md:[&:not(:first-child)]:mt-0 max-md:[&:not(:first-child)]:pt-0 max-md:[&:not(:first-child)]:border-t-0 max-md:[&:not(:first-child)]:border-l max-md:[&:not(:first-child)]:border-[#e5e7eb] max-md:[&:not(:first-child)]:pl-3 max-md:[&:not(:first-child)]:ml-[6px]"
            aria-label={group.title}
            key={group.title}
          >
            <h3 className="mt-0 mb-[10px] px-3 text-[15px] font-semibold text-[#858b93] max-md:m-0 max-md:whitespace-nowrap">
              {group.title}
            </h3>
            {group.items.map(([to, label]) => (
              <NavLink
                end
                key={to}
                to={to}
                className="block rounded-[7px] px-[14px] py-3 mb-1 text-[14px] text-[#555b63] max-md:whitespace-nowrap max-md:mb-0 [&.active]:bg-[#fff0e1] [&.active]:text-[#f4770b] [&.active]:font-bold"
              >
                {label}
              </NavLink>
            ))}
          </nav>
        ))}
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
