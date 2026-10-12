import { useEffect, useState } from "react";
import { getAdminReviews, blindReview } from "../../api/reviewApi";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../common/Pagination";


export default function AdminReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");

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
    <div className="bg-white border border-[#ebe6e0] rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-5">후기 관리</h2>

        <form
            className="flex justify-center gap-3 mb-6"
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
                className="border border-[#ebe6e0] rounded-md px-4 py-2 w-full max-w-[360px]"
            />

            <button
                type="submit"
                className="bg-accent text-white rounded-md px-5 py-2 cursor-pointer"
            >
                검색
            </button>
        </form>

      {filtered.length === 0 ? (
        <p>
            {reviews.length === 0
            ? "등록된 후기가 없습니다."
            : "검색 결과가 없습니다."}
        </p>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#faf8f5] border-b">
              <tr>
                <th className="p-3">클래스명</th>
                <th className="p-3">작성자</th>
                <th className="p-3">평점</th>
                <th className="p-3">후기 내용</th>
                <th className="p-3">상태</th>
                <th className="p-3">관리</th>
              </tr>
            </thead>

            <tbody>
              {pagination.items.map((review) => (
                <tr key={review.revNo} className="border-b">
                  <td className="p-3">
                    {review.clsName || `클래스 ${review.clsNo}`}
                  </td>

                  <td className="p-3">
                    {review.memNickname || "작성자"}
                  </td>

                  <td className="p-3 text-[#eb790b]">
                    ★ {review.revRating}
                  </td>

                  <td className="p-3 max-w-[280px]">
                    {review.revContent}
                  </td>

                  <td className="p-3">
                    {review.revStatus === "Y" ? "블라인드" : "정상"}
                  </td>

                  <td className="p-3">
                    {review.revStatus !== "Y" && (
                      <button
                        type="button"
                        onClick={() => handleBlind(review.revNo)}
                        className="border border-[#eb790b] text-[#eb790b] rounded-md px-3 py-1 hover:bg-[#fff2e5]"
                      >
                        블라인드
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
       {filtered.length > 0 && <Pagination {...pagination} />}
    </div>
    
  );
}