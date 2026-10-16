import { Art } from "./Art";
import { Empty } from "./Empty";

export function ClassSummary({ reservation }) {
  const item = reservation?.classInfo;

  return item ? (
    <div className="flex items-center gap-[22px]">
      <Art
        item={{
          clsNo: item.clsNo,
          clsName: item.clsName,
          instructorName: item.instructorName,
          clsImgThumb: item.clsImgThumb,
          clsImgOrigin: item.clsImgOrigin,
        }}
        className="w-36 shrink-0 rounded-[7px]"
      />

      <div>
        <h3 className="text-[24px] mb-[6px]">{item.clsName}</h3>
        <p className="m-0 text-[16px] text-[#6B7280]">
          {item.instructorName} 강사
        </p>
      </div>
    </div>
  ) : (
    <Empty>클래스 정보를 찾을 수 없습니다.</Empty>
  );
}