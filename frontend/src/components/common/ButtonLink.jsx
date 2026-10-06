import { Link } from "react-router";

export function ButtonLink({ to, children, secondary = false, ...props }) {
  return (
    <Link
      className={`inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg font-bold text-[17px] leading-[1.3] no-underline cursor-pointer transition-[background-color,color,border-color,opacity] duration-150 hover:bg-[#ea6500] hover:text-white hover:border-[#ea6500] hover:opacity-100 ${secondary ? "bg-white text-[#e56b00] border border-[#edddcf]" : "bg-accent text-white border border-accent"}`}
      to={to}
      {...props}
    >
      {children}
    </Link>
  );
}
