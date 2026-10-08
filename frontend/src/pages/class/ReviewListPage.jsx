import { useEffect, useState } from "react";
import { usePagination } from "../../hooks/usePagination";
import { Workspace } from "../../components/common/Workspace";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import Pagination from "../../components/common/Pagination";
import InstructorReview from "../../components/review/InstructorReview";
import { getMemberReviews, deleteReview } from "../../api/reviewApi";

export default function ReviewListPage({ instructor = false }) {
  const [reviews, setReviews] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (instructor) {
      setLoading(false);
      return;
    }

    getMemberReviews()
      .then((data) => {
        setReviews(data);
      })
      .catch((error) => {
        console.error("내 후기 조회 실패:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [instructor]);

  const handleDelete = async (revNo) => {
  try {
    await deleteReview(revNo);

    setReviews((prev) =>
      prev.filter((review) => review.revNo !== revNo)
    );

    setSelected(null);
  } catch (error) {
    console.error("후기 삭제 실패:", error);
    alert("후기 삭제에 실패했습니다.");
  }
};

  const shown = reviews;
  const pagination = usePagination(shown);

  if (loading) {
  return <div>후기 목록을 불러오는 중입니다.</div>;
  }

  if (instructor) {
  return (
    <Workspace kind="instructor">
      <Heading title="클래스 후기" />
      <InstructorReview />
    </Workspace>
  );
}

  return (
    <Workspace kind={instructor ? "instructor" : "member"}>
      <Heading title={instructor ? "클래스 후기" : "내가 작성한 후기"} />
      {pagination.items.map((r) => (
        <section
          key={r.revNo}
          className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]"
        >
          <h3>클래스 번호: {r.clsNo}</h3>

          <span className="text-[#eb790b] whitespace-nowrap">
            {"★".repeat(r.revRating)}
            {"☆".repeat(5 - r.revRating)}
          </span>

          <p style={{ marginTop: 12 }}>
            {r.revStatus === "Y"
              ? "관리자에 의해 블라인드된 후기입니다."
              : r.revContent}
          </p>

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#ebe6e0]">
            <span className="text-[14px] text-[#85888d]">
              {r.revCreatedAt?.replace("T", " ").slice(0, 16)}
            </span>

            {!instructor && (
              <button
                className="border border-[#edddcf] rounded-md px-3 py-1 text-[#dc6f15] hover:bg-brand hover:text-white cursor-pointer"
                onClick={() => setSelected(r.revNo)}
              >
                삭제
              </button>
            )}
          </div>
        {selected === r.revNo && (
          <div className="mt-3 p-4 bg-[#faf8f5] rounded-lg">
            <p className="text-[15px] font-semibold text-[#333333]">
              정말 이 후기를 삭제하시겠습니까?
            </p>

            <div className="flex justify-end gap-2 mt-3">
              <button
                className="px-4 py-2 rounded-md border border-[#edddcf] bg-white text-[#dc6f15] hover:bg-[#fff2e5] hover:text-[#dc6f15] cursor-pointer"
                onClick={() => setSelected(null)}
              >
                취소
              </button>

              <button
                className="px-4 py-2 rounded-md bg-accent text-white hover:bg-[#e56b00] hover:text-white cursor-pointer"
                onClick={() => handleDelete(r.revNo)}
              >
                삭제 확인
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
