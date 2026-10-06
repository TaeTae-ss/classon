import { useState } from "react";
import { useSearchParams } from "react-router";
import { classes, useStore } from "../../mocks/data";
import { usePagination } from "../../hooks/usePagination";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import { Card } from "../../components/common/Card";
import Pagination from "../../components/common/Pagination";

export default function ClassListPage() {
  const [params] = useSearchParams();
  const [category, setCategory] = useState(params.get("category") || "전체");
  const [list] = useStore("classes", classes);
  const filtered = list.filter(
    (c) => category === "전체" || c.category === category,
  );
  const pagination = usePagination(filtered, 9);
  return (
    <>
      <Heading
        title="클래스 탐색"
        description="새로운 취미, 새로운 배움. 당신에게 맞는 클래스를 찾아보세요."
      />
      <div className="flex items-center justify-between flex-wrap gap-3 my-6">
        <ul className="list-none flex gap-[10px] flex-wrap p-0 m-0">
          {["전체", "개발", "디자인", "취미", "기타"].map((c) => (
            <li role="button" tabIndex={0}
              key={c}
              className={`text-2xl cursor-pointer p-0 text-[#777] hover:text-[#ea6500] focus-visible:outline-2 focus-visible:outline-[#ea6500] focus-visible:outline-offset-[3px] ${c === category ? "text-accent font-semibold" : ""}`}
              onClick={() => setCategory(c)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setCategory(c);
                }
              }}
            >
              {c}
            </li>
          ))}
        </ul>
        <p className="text-right text-[14px] text-[#85888d] ml-auto">총 {filtered.length}개의 클래스</p>
      </div>
      {filtered.length ? (
        <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-2 max-md:gap-3 max-[420px]:grid-cols-1">
          {pagination.items.map((c) => (
            <Card key={c.id} item={c} />
          ))}
        </div>
      ) : (
        <Empty>
          해당 카테고리에 클래스가 없습니다. 다른 카테고리를 선택해주세요.
        </Empty>
      )}
      <Pagination {...pagination} />
    </>
  );
}
