import { classes, money } from "../../mocks/data";
import { Art } from "./Art";
import { Empty } from "./Empty";

export function ClassSummary({ reservation, list = classes }) {
  const item = list.find((c) => c.id === reservation.classId);
  return item ? (
    <div className="flex items-center gap-[22px]">
      <Art item={item} className="w-36 shrink-0 rounded-[7px]" />
      <div>
        <span className="text-[14px] text-[#85888d]">
          {item.category} · {item.instructor} 강사
        </span>
        <h3 className="mb-[6px]">{item.title}</h3>
        <p className="m-0 text-[14px]">{money(item.price)} / 1인</p>
      </div>
    </div>
  ) : (
    <Empty>삭제된 클래스입니다.</Empty>
  );
}
