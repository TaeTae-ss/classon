import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import { Field } from "../../components/common/Field";
import { ButtonLink } from "../../components/common/ButtonLink";
import { postReview } from "../../api/reviewApi";
import { getReservation } from "../../api/reservationApi";

export default function ReviewAddPage() {
  const { rsvNo } = useParams();
  const navigate = useNavigate();

  // 실제 예약 정보
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  // 후기 입력값
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  // 실제 예약 상세 조회
  useEffect(() => {
    getReservation(Number(rsvNo))
      .then((data) => {
        setReservation(data);
      })
      .catch((error) => {
        console.error("예약 조회 실패:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [rsvNo]);

  // 예약 조회 중
  if (loading) {
    return <div>예약 정보를 불러오는 중입니다.</div>;
  }

  // 예약 정보가 없는 경우
  if (!reservation) {
    return (
      <Empty to="/reservation/member/1" label="예약 내역">
        예약 정보를 찾을 수 없습니다.
      </Empty>
    );
  }

  // 수강 완료된 예약만 후기 작성 가능
  if (reservation.rsvStatus !== "COMPLETED") {
    return (
      <Empty to="/reservation/member/1" label="예약 내역">
        수강 완료한 클래스만 후기를 작성할 수 있습니다.
      </Empty>
    );
  }

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

            navigate("/member/reviews");
          } catch (error) {
            console.error("후기 등록 실패:", error);
          }
        }}
      >
        {/* ClassSummary는 예약 담당자 수정 후 다시 연결 */}

        <h3 style={{ marginTop: 25 }}>
          이번 클래스는 어떠셨나요?
        </h3>

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

        <span className="text-right text-[14px] text-[#85888d]">
          {content.length}/1000
        </span>

        <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
          <ButtonLink secondary to="/reservation/member/1">
            취소
          </ButtonLink>

          <button
            type="submit"
            className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
          >
            등록
          </button>
        </div>
      </form>
    </div>
  );
}