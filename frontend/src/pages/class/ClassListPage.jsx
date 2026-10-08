import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getClassList } from "../../api/classApi";
import { getCategories } from "../../api/categoryApi";
import { money } from "../../mocks/data";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import Pagination from "../../components/common/Pagination";

const IMAGE_BASE = "http://localhost:8080";

export default function ClassListPage() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getClassList({
          categoryId: categoryId ?? undefined,
          page,
          size: 9,
        });

        setList(data.dtoList);
        setTotalPage(data.totalPage);
        setTotalCount(data.totalCount);
      } catch (err) {
        console.error("클래스 목록 조회 실패:", err);
        setError("클래스 목록을 불러오지 못했습니다.");
        setList([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [categoryId, page]);

  const selectCategory = (catNo) => {
    setCategoryId(catNo);
    setPage(1);
  };

  return (
    <>
      <Heading
        title="클래스 탐색"
        description="새로운 취미, 새로운 배움. 당신에게 맞는 클래스를 찾아보세요."
      />
      <div className="flex items-center justify-between flex-wrap gap-3 my-6">
        <ul className="list-none flex gap-[10px] flex-wrap p-0 m-0">
          <li
            role="button"
            tabIndex={0}
            className={`text-2xl cursor-pointer p-0 text-[#777] hover:text-[#ea6500] focus-visible:outline-2 focus-visible:outline-[#ea6500] focus-visible:outline-offset-[3px] ${categoryId === null ? "text-accent font-semibold" : ""}`}
            onClick={() => selectCategory(null)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectCategory(null);
              }
            }}
          >
            전체
          </li>
          {categories.map((c) => (
            <li
              role="button"
              tabIndex={0}
              key={c.catNo}
              className={`text-2xl cursor-pointer p-0 text-[#777] hover:text-[#ea6500] focus-visible:outline-2 focus-visible:outline-[#ea6500] focus-visible:outline-offset-[3px] ${categoryId === c.catNo ? "text-accent font-semibold" : ""}`}
              onClick={() => selectCategory(c.catNo)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  selectCategory(c.catNo);
                }
              }}
            >
              {c.catName}
            </li>
          ))}
        </ul>
        <p className="text-right text-[14px] text-[#85888d] ml-auto">총 {totalCount}개의 클래스</p>
      </div>
      {loading ? (
        <div className="py-[66px] text-center text-[#85888d]">클래스 목록을 불러오는 중입니다.</div>
      ) : list.length ? (
        <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-2 max-md:gap-3 max-[420px]:grid-cols-1">
          {list.map((c) => (
            <Link
              key={c.clsNo}
              to={`/class/${c.clsNo}`}
              className="block border border-[#ebe6e0] rounded-[11px] bg-white overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_10px_30px_#45312110]"
            >
              <div className="overflow-hidden aspect-[400/260] bg-[#f0eee8]">
                {c.clsImgThumb && (
                  <img
                    src={`${IMAGE_BASE}${c.clsImgThumb}`}
                    alt={c.clsName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-[19px] max-md:p-[13px]">
                <span className="text-[14px] text-[#85888d]">
                  {c.catName} · {c.clsLevel}
                </span>
                <h3 className="my-2 mb-3 max-md:text-[16px]">{c.clsName}</h3>
                <p className="text-[14px] mb-3 flex justify-between max-md:block">
                  {c.instructorName} 강사{" "}
                  <span className="text-[#eb790b] whitespace-nowrap max-md:block">
                    ★ {c.rating != null ? c.rating.toFixed(1) : "-"}
                  </span>
                </p>
                <strong>{money(c.clsPrice)}</strong>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Empty>{error || "해당 카테고리에 클래스가 없습니다. 다른 카테고리를 선택해주세요."}</Empty>
      )}
      <Pagination page={page} pages={totalPage || 1} onChange={setPage} />
    </>
  );
}
