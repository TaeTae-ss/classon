
import { Fragment, useEffect, useState } from "react";
import { getAdminReviews, blindReview } from "../../api/reviewApi";
import { usePagination } from "../../hooks/usePagination";
import { Heading } from "../common/Heading";
import Pagination from "../common/Pagination";

export default function AdminReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [expandedReviewNo, setExpandedReviewNo] = useState(null);

  const fetchReviews = async () => {
    try {
      const data = await getAdminReviews();
      setReviews(data);
    } catch (error) {
      console.error("관리자 후기 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleBlind = async (revNo) => {
    if (!window.confirm("이 후기를 블라인드 처리하시겠습니까?")) {
      return;
    }

    try {
      await blindReview(revNo);
      await fetchReviews();
    } catch (error) {
      console.error("후기 블라인드 실패:", error);
      alert("블라인드 처리에 실패했습니다.");
    }
  };

  const filtered = reviews.filter((review) => {
    const query = search.trim().toLowerCase();

    return (
      (review.memNickname || "").toLowerCase().includes(query) ||
      (review.revContent || "").toLowerCase().includes(query)
    );
  });

  const pagination = usePagination(
    filtered.map((review) => ({
      ...review,
      id: review.revNo,
    }))
  );

  if (loading) {
    return <p>후기 목록을 불러오는 중입니다.</p>;
  }

  return (
    <div>
      <Heading
        title="후기 관리"
        description="등록된 후기를 조회하고 관리할 수 있습니다."
      />

      <p className="text-right text-[16px] text-[#374151] mb-2">
        전체 {filtered.length}건
      </p>

      <div className="overflow-x-auto border border-[#eee5db] rounded-[10px] bg-white">
        <table className="w-full border-collapse text-[16px]">
          <thead className="bg-[#faf8f5]">
            <tr>
              {["클래스명", "작성자", "평점", "후기 내용", "상태", "관리"].map(
                (title) => (
                  <th
                    key={title}
                    className="text-left text-[#374151] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]"
                  >
                    {title}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {pagination.items.map((review) => (
              <Fragment key={review.revNo}>
               
                <tr>
                  <td className="py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    {review.clsName || `클래스 ${review.clsNo}`}
                  </td>

                  <td className="py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    {review.memNickname || "작성자"}
                  </td>

                  <td className="py-[18px] px-[17px] border-b border-[#f0ebe6] text-[#eb790b] whitespace-nowrap">
                    ★ {review.revRating}
                  </td>

                  <td className="py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    <p className="max-w-[230px] truncate">
                      {review.revContent}
                    </p>
                  </td>

                  <td className="py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    {review.revStatus === "Y" ? (
                      <span className="inline-block px-3 py-1 rounded-full bg-[#fff0df] text-[#ff7900] whitespace-nowrap">
                        블라인드
                      </span>
                    ) : (
                      <span>정상</span>
                    )}
                  </td>

                  <td className="py-[18px] px-[17px] border-b border-[#f0ebe6]">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() =>
                            setExpandedReviewNo(
                            expandedReviewNo === review.revNo ? null : review.revNo
                            )
                        }
                        className="!bg-transparent !text-[#555] hover:!text-[#eb790b] !border-0 !shadow-none underline underline-offset-4 whitespace-nowrap cursor-pointer"
                        >
                        {expandedReviewNo === review.revNo ? "접기" : "상세보기"}
                      </button>

                      {review.revStatus !== "Y" && (
                        <button
                          type="button"
                          onClick={() => handleBlind(review.revNo)}
                          className="border border-[#eb790b] text-[#eb790b] rounded-md px-3 py-1 hover:bg-[#fff2e5] whitespace-nowrap cursor-pointer"
                        >
                          블라인드
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                {/* 후기 상세보기 */}
                {expandedReviewNo === review.revNo && (
                  <tr>
                    <td
                      colSpan={6}
                      className="bg-[#faf8f5] px-6 py-5 border-b border-[#f0ebe6]"
                    >
                      <div className="space-y-3">
                        <h3 className="font-semibold text-[16px]">
                          후기 상세 내용
                        </h3>

                        <p className="text-[16px] leading-7 whitespace-pre-wrap break-words">
                          {review.revContent}
                        </p>

                        <p className="text-[16px] text-[#374151]">
                          작성자: {review.memNickname || "작성자"}
                          {" · "}
                          평점: ★ {review.revRating}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center py-10 text-[#374151]">
            {reviews.length === 0
              ? "등록된 후기가 없습니다."
              : "검색 결과가 없습니다."}
          </p>
        )}
      </div>

      {/* 검색창 */}
      <form
        className="flex justify-center gap-3 mt-6 mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(keyword);
        }}
      >
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="후기 내용 / 작성자 검색"
          className="border border-[#ebe6e0] rounded-md px-4 py-2 w-full max-w-[300px]"
        />

        <button
          type="submit"
          className="bg-accent text-white rounded-md px-5 py-2 cursor-pointer"
        >
          검색
        </button>
      </form>

      {filtered.length > 0 && <Pagination {...pagination} />}
    </div>
  );
}
