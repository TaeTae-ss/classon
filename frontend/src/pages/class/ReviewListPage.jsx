import { useState } from "react";
import { classes, findClass, initialReviews, useStore } from "../../mocks/data";
import { usePagination } from "../../hooks/usePagination";
import { Workspace } from "../../components/common/Workspace";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import Pagination from "../../components/common/Pagination";

export default function ReviewListPage({ instructor = false }) {
  const [reviews, setReviews] = useStore("reviews", initialReviews);
  const [list] = useStore("classes", classes);
  const [selected, setSelected] = useState(null);
  const shown = instructor ? reviews : reviews.filter((r) => r.memberId === 1);
  const pagination = usePagination(shown);
  return (
    <Workspace kind={instructor ? "instructor" : "member"}>
      <Heading title={instructor ? "클래스 후기" : "내가 작성한 후기"} />
      {pagination.items.map((r) => (
        <section key={r.id} className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
          <h3>{findClass(r.classId, list)?.title}</h3>
          <span className="text-[#eb790b] whitespace-nowrap">
            {"★".repeat(r.rating)}
            {"☆".repeat(5 - r.rating)}
          </span>
          <p style={{ marginTop: 12 }}>
            {r.blinded ? "관리자에의해 블라인드된 후기입니다" : r.content}
          </p>
          <span className="text-right text-[14px] text-[#85888d]">
            {r.author} · {r.date}
          </span>
          {!instructor && (
            <button
              className="bg-transparent border-0 text-[#dc6f15] p-[7px]"
              onClick={() => setSelected(r.id)}
            >
              삭제
            </button>
          )}
          {selected === r.id && (
            <div className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#fff0ec] text-[#ac4326] text-[16px]">
              후기를 삭제할까요?
              <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
                <button
                  className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                  onClick={() => {
                    setReviews((v) => v.filter((x) => x.id !== r.id));
                    setSelected(null);
                  }}
                >
                  삭제 확인
                </button>
                <button
                  className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                  onClick={() => setSelected(null)}
                >
                  돌아가기
                </button>
              </div>
            </div>
          )}
        </section>
      ))}
      {!shown.length && <Empty>작성된 후기가 없습니다.</Empty>}
      <Pagination {...pagination} />
    </Workspace>
  );
}
