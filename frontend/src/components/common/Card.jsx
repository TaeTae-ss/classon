import { Link } from "react-router";
import { money, useStore } from "../../mocks/data";
import { Art } from "./Art";

export function Card({ item, select, selected }) {
  const [favorites, setFavorites] = useStore("favorites", [1, 2]);
  const liked = favorites.includes(item.id);
  return (
    <article className="relative border border-[#ebe6e0] rounded-[11px] bg-white overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_10px_30px_#45312110]">
      <Link to={`/class/${item.id}`}>
        <Art item={item} />
      </Link>
      <button
        className={`absolute top-[13px] right-[13px] bg-[#ffffffde] border-0 rounded-full w-[38px] h-[38px] text-[26px] leading-none ${liked ? "text-[#f27822]" : "text-[#666]"}`}
        aria-label={`${item.title} ${liked ? "찜 해제" : "찜하기"}`}
        aria-pressed={liked}
        onClick={() =>
          setFavorites((v) =>
            liked ? v.filter((id) => id !== item.id) : [...v, item.id],
          )
        }
      >
        {liked ? "♥" : "♡"}
      </button>
      <div className="p-[19px] max-md:p-[13px]">
        <span className="text-[14px] text-[#85888d]">
          {item.category} · {item.difficulty}
        </span>
        <Link to={`/class/${item.id}`}>
          <h3 className="my-2 mb-3 max-md:text-[16px]">{item.title}</h3>
        </Link>
        <p className="text-[14px] mb-3 flex justify-between max-md:block">
          {item.instructor} 강사{" "}
          <span className="text-[#eb790b] whitespace-nowrap max-md:block">★ {item.rating}</span>
        </p>
        <strong>{money(item.price)}</strong>
        {select && (
          <label className="flex items-center gap-[10px] mt-[14px]">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => select(item.id)}
            />{" "}
            비교 선택
          </label>
        )}
      </div>
    </article>
  );
}
