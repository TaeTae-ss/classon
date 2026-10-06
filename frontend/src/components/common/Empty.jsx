import { ButtonLink } from "./ButtonLink";

export function Empty({ children = "표시할 내역이 없습니다.", to, label }) {
  return (
    <div className="text-center py-[66px] px-6 bg-white border border-dashed border-[#e5ddd4] rounded-[10px]">
      <span aria-hidden="true" className="text-[43px] text-[#d9bfa4]">○</span>
      <p>{children}</p>
      {to && <ButtonLink to={to}>{label}</ButtonLink>}
    </div>
  );
}
