import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { classes, initialProfile, initialReservations, initialReviews, readStore, useStore } from "../../mocks/data";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import { ClassSummary } from "../../components/common/ClassSummary";
import { Field } from "../../components/common/Field";
import { ButtonLink } from "../../components/common/ButtonLink";
import { postReview } from "../../api/reviewApi";

export default function ReviewAddPage() {
  const { rsvNo } = useParams();
  const navigate = useNavigate();
  const [reservations] = useStore("reservations", initialReservations);
  const r = reservations.find((x) => x.id === Number(rsvNo));
  const [reviews, setReviews] = useStore("reviews", initialReviews);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  if (!r || r.status !== "수강완료")
    return (
      <Empty to="/reservation/member/1" label="예약 내역">
        수강 완료한 클래스만 후기를 작성할 수 있습니다.
      </Empty>
    );
  if (reviews.some((x) => x.reservationId === r.id && x.memberId === 1))
    return (
      <Empty to="/member/reviews" label="내 후기 보기">
        이미 작성한 후기가 있습니다.
      </Empty>
    );
  return (
    <div className="max-w-[648px] mx-auto my-[46px]">
      <Heading title="후기 작성" />
      <form
        className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]"
        onSubmit={async (e) => {
          e.preventDefault();

          if (!content.trim()) return;

          try {
            await postReview({
              rsvNo: Number(rsvNo),
              revRating: rating,
              revContent: content.trim(),
            });

            navigate(`/class/${r.classId}#reviews`);
          } catch (error) {
            console.error("후기 등록 실패:", error);
          }
        }}
      >
        <ClassSummary reservation={r} list={readStore("classes", classes)} />
        <h3 style={{ marginTop: 25 }}>이번 클래스는 어떠셨나요?</h3>
        <div className="flex gap-[11px] my-[18px]">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              className="border-0 bg-transparent text-[41px] text-[#ffa047] p-0"
              key={n}
              aria-label={`${n}점`}
              aria-pressed={rating === n}
              onClick={() => setRating(n)}
            >
              {n <= rating ? "★" : "☆"}
            </button>
          ))}
        </div>
        <Field label="후기 내용">
          <textarea
            required
            maxLength={1000}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="클래스에서 느낀 경험을 들려주세요."
          />
        </Field>
        <span className="text-right text-[14px] text-[#85888d]">{content.length}/1000</span>
        <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
          <ButtonLink secondary to="/reservation/member/1">
            취소
          </ButtonLink>
          <button className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed">등록</button>
        </div>
      </form>
    </div>
  );
}
