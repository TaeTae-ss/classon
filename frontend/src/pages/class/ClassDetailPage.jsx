import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { initialReviews, money, useStore } from "../../mocks/data";
import { usePagination } from "../../hooks/usePagination";
import { getClassDetail } from "../../api/classApi";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import Pagination from "../../components/common/Pagination";
import BookingForm from "../../components/booking/BookingForm";

export default function ClassDetailPage() {
  const { clsNo } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useStore("favorites", [1, 2]);
  const [reviews] = useStore("reviews", initialReviews);
  const reviewPagination = usePagination(reviews.filter((r) => r.classId === item?.id));

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getClassDetail(clsNo);

        // BookingForm 등 기존 컴포넌트와의 호환을 위해 id/price 별칭을 추가
        setItem({ ...data, id: data.clsNo, price: data.clsPrice });
      } catch (err) {
        console.error("클래스 상세 조회 실패:", err);

        const message =
          err?.response?.data?.data?.message ||
          "클래스 정보를 불러오지 못했습니다.";

        setError(message);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [clsNo]);

  if (loading) {
    return <div className="py-[66px] text-center text-[#85888d]">클래스 정보를 불러오는 중입니다.</div>;
  }

  if (!item)
    return (
      <Empty to="/class" label="클래스 탐색">
        {error || "클래스를 찾을 수 없습니다."}
      </Empty>
    );

  const liked = favorites.includes(item.id);
  const address = [item.clsRoadAddr, item.clsDetailAddr].filter(Boolean).join(" ");

  return (
    <>
      <Heading title="클래스 상세" />
      <div className="grid grid-cols-[minmax(0,7fr)_minmax(0,3fr)] gap-[34px] max-[900px]:gap-[22px] max-md:grid-cols-1 [&>*]:min-w-0">
        <div className="flex flex-col min-w-0">
      <nav className="flex gap-6 border-b border-[#eee] mt-0 mb-6 pb-[14px]">
        <a className="text-[#8b725a]" href="#introduction">클래스 소개</a>
        <a className="text-[#8b725a]" href="#instructor">강사 소개</a>
        <a className="text-[#8b725a]" href="#reviews">수강 후기</a>
      </nav>
          <section id="introduction" className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px] scroll-mt-[120px]">
            <h2>클래스 소개</h2>
            <p>{item.clsDesc}</p>
          </section>
          <section id="instructor" className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px] scroll-mt-[120px]">
            <h2>강사 소개</h2>
            <div className="flex items-center gap-[22px] mb-[29px]">
              <div className="w-[84px] h-[84px] rounded-full bg-[#ffead5] text-[#ee7c1e] grid place-items-center text-[31px]">{item.instructorName?.[0]}</div>
              <div>
                <h3>{item.instructorName}</h3>
                <p>처음 시작하는 분들도 즐겁게 배울 수 있도록 함께합니다.</p>
              </div>
            </div>
          </section>
        <section id="location" className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px] scroll-mt-[120px]">
          <h2>클래스 장소</h2>
          <p>{address}</p>
          <div
            className="overflow-hidden aspect-[400/260]"
            style={{
              background: "#f0eee8",
              display: "grid",
              placeItems: "center",
              aspectRatio: "2",
            }}
          >
            📍 {item.clsRoadAddr?.split(" ").slice(0, 2).join(" ")}
          </div>
          <p className="text-[13px] leading-[1.8] text-[#999]" style={{ marginTop: 12 }}>
            정확한 방문 안내는 예약 정보를 확인해주세요.
          </p>
        </section>
      <section id="reviews" className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px] scroll-mt-[120px]">
        <h2>수강 후기</h2>
        {reviewPagination.items.map((r) => (
            <article className="border-t border-[#eee] py-6" key={r.id}>
              <span className="text-[#eb790b] whitespace-nowrap">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </span>{" "}
              <span className="text-right text-[14px] text-[#85888d]">
                {r.author} · {r.date}
              </span>
              <p style={{ marginTop: 10 }}>
                {r.blinded ? "관리자에의해 블라인드된 후기입니다" : r.content}
              </p>
              <Link
                className="text-[13px] leading-[1.8] text-[#999]"
                to={`/reports/register?type=후기 신고&target=${r.id}`}
              >
                후기 신고
              </Link>
            </article>
          ))}
        <Pagination {...reviewPagination} />
        {!reviews.some((r) => r.classId === item.id) && (
          <p>아직 작성된 후기가 없습니다.</p>
        )}
        <Link
          className="text-[13px] leading-[1.8] text-[#999]"
          to={`/reports/register?type=클래스 신고&target=${item.id}`}
        >
          클래스 신고
        </Link>
      </section>
        </div>
        <div className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px] sticky top-[124px] self-start max-md:static min-[769px]:max-[1024px]:top-[220px]">
          <span className="inline-block px-3 py-[3px] rounded-[24px] bg-[#fff0df] text-[#df700e] text-[13px] font-bold">
            {item.catName}
          </span>
          <h1 style={{ marginTop: 16 }}>{item.clsName}</h1>
          <p>{item.instructorName} 강사</p>
          <p>
            <span className="text-[#eb790b] whitespace-nowrap">
              ★ {item.rating != null ? item.rating.toFixed(1) : "평점 없음"}
            </span>{" "}
            · 후기 {reviews.filter((r) => r.classId === item.id).length}개
          </p>
          <p>
            {money(item.clsPrice)} · 최대 정원 {item.maxCapacity ?? "-"}명
          </p>
          <BookingForm
            key={item.id}
            item={item}
            secondaryAction={
              <button type="button"
              className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
              aria-pressed={liked}
              onClick={() =>
                setFavorites((v) =>
                  liked ? v.filter((id) => id !== item.id) : [...v, item.id],
                )
              }
            >
              {liked ? "♥ 찜 해제" : "♡ 찜하기"}
            </button>
            }
          />
        </div>
      </div>
    </>
  );
}
