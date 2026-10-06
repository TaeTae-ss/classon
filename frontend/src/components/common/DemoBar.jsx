import { Link, useLocation } from "react-router";
import { useStore } from "../../mocks/data";

export function DemoBar() {
  const [role, setRole] = useStore("role", "PUBLIC");
  const location = useLocation();
  return (
    <div className="flex items-center flex-wrap gap-[22px] px-4 py-[11px] bg-[#fff6ec] border border-[#ffdfbd] rounded-[7px] text-[13px] text-[#925522]">
      <span>퍼블리싱 미리보기 · 예시 데이터</span>
      <label className="flex items-center gap-[10px] ml-auto max-md:ml-0">
        화면 권한{" "}
        <select
          aria-label="미리보기 권한"
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            window.location.assign(location.pathname + location.search);
          }}
          className="text-[13px] px-[10px] py-[3px]"
        >
          <option value="PUBLIC">비회원</option>
          <option value="USER">회원</option>
          <option value="INS">강사</option>
          <option value="ADMIN">관리자</option>
        </select>
      </label>
      <Link
        className="font-bold"
        to={
          role === "ADMIN"
            ? "/admin"
            : role === "INS"
              ? "/instructor"
              : "/member/mypage"
        }
      >
        내 메뉴 →
      </Link>
    </div>
  );
}
