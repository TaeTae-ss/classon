import { useEffect, useState } from "react";
import { Link } from "react-router";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../common/Pagination";
import { getClassReviews, getAverageRating } from "../../api/reviewApi";

export default function ClassReview({ clsNo }) {
  const [reviews, setReviews] = useState([]);
  const [sort, setSort] = useState("latest");

  // 평균 평점
  const [averageRating, setAverageRating] = useState(null);

  // 클래스 후기 목록 조회
  useEffect(() => {
    if (!clsNo) {
      setReviews([]);
      return;
    }

    getClassReviews(clsNo, sort)
      .then((data) => {
        setReviews(data);
      })
      .catch((error) => {
        console.error("클래스 후기 조회 실패:", error);
        setReviews([]);
      });
  }, [clsNo, sort]);

  // 클래스 평균 평점 조회
  useEffect(() => {
    if (!clsNo) {
      setAverageRating(null);
      return;
    }

    setAverageRating(null);

    getAverageRating(clsNo)
      .then((data) => {
        setAverageRating(data);
      })
      .catch((error) => {
        console.error("평균 평점 조회 실패:", error);
        setAverageRating(null);
      });
  }, [clsNo]);

  const reviewPagination = usePagination(
    reviews.map((review) => ({
      ...review,
      id: review.revNo,
    }))
  );

  return (
    <section
      id="reviews"
      className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px] scroll-mt-[120px]"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">수강 후기</h2>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-[#ebe6e0] rounded-md px-3 py-2 bg-white"
        >
          <option value="latest">최신순</option>
          <option value="ratingDesc">평점 높은순</option>
          <option value="ratingAsc">평점 낮은순</option>
        </select>
      </div>

      {/* 평균 평점 */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[#eb790b] text-xl">
          ★
        </span>

        <span className="text-xl font-semibold text-[#172033]">
          {averageRating !== null
            ? Number(averageRating).toFixed(1)
            : "-"}
        </span>

        <span className="text-sm text-[#85888d]">
          평균 평점
        </span>
      </div>

      {/* 후기 목록 */}
      {reviewPagination.items.map((r) => (
        <article
          className="border-t border-[#eee] py-6"
          key={r.revNo}
        >
          <span className="text-[#eb790b] whitespace-nowrap">
            {"★".repeat(r.revRating)}
            {"☆".repeat(5 - r.revRating)}
          </span>

          <span className="ml-3 text-[14px] text-[#85888d]">
            {r.revCreatedAt?.replace("T", " ").slice(0, 16)}
          </span>

          <p style={{ marginTop: 10 }}>
            {r.revStatus === "Y"
              ? "관리자에 의해 블라인드된 후기입니다."
              : r.revContent}
          </p>

          <Link
            className="text-[13px] leading-[1.8] text-[#999]"
            to={`/reports/register?type=후기 신고&target=${r.revNo}`}
          >
            후기 신고
          </Link>
        </article>
      ))}

      {reviews.length === 0 && (
        <p>아직 작성된 후기가 없습니다.</p>
      )}

      <Pagination {...reviewPagination} />
    </section>
  );
}