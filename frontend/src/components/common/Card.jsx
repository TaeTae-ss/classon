import { Link } from "react-router";
import { money } from "../../mocks/data";
import { Art } from "./Art";

export function Card({ item, liked = false, onToggleFavorite, select, selected, showFavorite = true, }) {
  const clsNo = item.clsNo;

  return (
    <article className="relative border border-[#ebe6e0] rounded-[11px] bg-white overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_10px_30px_#45312110]">
      <Link to={`/class/${clsNo}`}>
        <Art item={item} />
      </Link>

      {showFavorite && (
        <button
          type="button"
          className="absolute top-[16px] right-[16px]
          w-[42px] h-[42px] rounded-full
          flex items-center justify-center
          bg-transparent border border-transparent
          hover:bg-white/90 hover:border-[#f5c9a6]
          transition-all duration-200 cursor-pointer"
          aria-label={`${item.clsName} ${liked ? "찜 해제" : "찜하기"}`}
          aria-pressed={liked}
          onClick={() => onToggleFavorite?.(clsNo)}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill={liked ? "#f27822" : "none"}
            stroke={liked ? "#f27822" : "#666"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
          </svg>
        </button>
      )}

      <div className="p-[19px] max-md:p-[13px]">
        <span className="text-[16px] text-[#374151]">
          {item.catName} · {item.clsLevel}
        </span>

        <Link to={`/class/${clsNo}`}>
          <h3 className="my-2 mb-3 max-md:text-[16px]">
            {item.clsName}
          </h3>
        </Link>

        <p className="text-[16px] mb-3 flex justify-between max-md:block">
          {item.instructorName} 강사{" "}
          <span className="text-[#eb790b] whitespace-nowrap max-md:block">
            ★ {item.rating ?? "0.0"}
          </span>
        </p>

        <strong>{money(item.clsPrice)}</strong>

        {select && (
          <label className="flex items-center gap-[10px] mt-[14px]">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => select(clsNo)}
            />
            비교 선택
          </label>
        )}
      </div>
    </article>
  );
}