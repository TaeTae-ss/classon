import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

import {
  getReservationListByMember,
  getInstructorReservationList,
  getInstructorReservationListBySchedule,
} from "../../api/reservationApi";

import { usePagination } from "../../hooks/usePagination";

import { Workspace } from "../../components/common/Workspace";
import { Heading } from "../../components/common/Heading";
import { ClassSummary } from "../../components/common/ClassSummary";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Empty } from "../../components/common/Empty";
import Pagination from "../../components/common/Pagination";

const statusLabel = {
  WAIT: "결제대기",
  CONFIRMED: "예약완료",
  COMPLETED: "수강완료",
  CANCEL: "취소",
};

const statusFilters = [
  { value: "전체", label: "전체" },
  { value: "CONFIRMED", label: "예약완료" },
  { value: "COMPLETED", label: "수강완료" },
  { value: "CANCEL", label: "취소" },
];

const getReviewDaysLeft = (completedAt) => {
  if (!completedAt) return null;

  // 수강 완료 날짜만 추출
  const completedDate = completedAt.slice(0, 10);

  // 오늘 날짜
  const today = new Date();
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  // 수강 완료 날짜
  const [year, month, day] = completedDate.split("-").map(Number);

  const completed = new Date(year, month - 1, day);

  // 날짜 차이 계산 (일 단위)
  const diffDays = Math.round(
    (todayDate - completed) / (1000 * 60 * 60 * 24)
  );

  const daysLeft = 7 - diffDays;

  if (daysLeft <= 0 || daysLeft > 7) return null;

  return daysLeft;
};

export default function ReservationListPage({
  instructor = false,
  schedule = false,
  payment = false,
}) {
  const { schNo } = useParams();

  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState("전체");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError("");

        let data;
        if (instructor && schedule) {
          data = await getInstructorReservationListBySchedule(schNo);
        } else if (instructor) {
          data = await getInstructorReservationList();
        } else {
          data = await getReservationListByMember();
          console.log("예약 목록 데이터:", data);
        }

        setReservations(data || []);
      } catch (error) {
        console.error("예약 내역 조회 실패:", error);
        setError("예약 내역을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (!instructor || !schedule || schNo) {
      fetchReservations();
    }
  }, [instructor, schedule, schNo]);

  const list = reservations.filter(
    (r) =>
      r.rsvStatus !== "WAIT" &&
    (!schedule || Number(r.schNo) === Number(schNo)) &&
    (!payment || r.payStatus === "paid") &&
    (filter === "전체" || r.rsvStatus === filter),
  );

  const pagination = usePagination(list);

  return (
    <Workspace kind={instructor ? "instructor" : "member"}>
      <Heading
        title={
          payment
            ? "결제 내역"
            : instructor
              ? "클래스 예약 회원 정보"
              : "예약 내역"
        }
        description="클래스 일정과 진행 상태를 확인하세요."
      />

      <ul className="list-none flex gap-[10px] flex-wrap my-6 p-0">
        {statusFilters.map((status) => (
          <li
            role="button"
            tabIndex={0}
            className={`text-2xl cursor-pointer p-0 text-[#777] hover:text-[#ea6500] focus-visible:outline-2 focus-visible:outline-[#ea6500] focus-visible:outline-offset-[3px] ${
              filter === status.value ? "text-accent font-semibold" : ""
            }`}
            key={status.value}
            onClick={() => setFilter(status.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setFilter(status.value);
              }
            }}
          >
            {status.label}
          </li>
        ))}
      </ul>

      {loading && (
        <p className="text-center py-10 text-[#777]">
          예약 내역을 불러오는 중입니다.
        </p>
      )}

      {!loading && error && (
        <p className="text-center py-10 text-red-500">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        pagination.items.map((r) => (
          <article
            className="flex justify-between items-center gap-6 p-6 bg-white border border-[#e9e4df] rounded-[10px] mb-[17px] max-md:items-start max-md:flex-col max-md:p-[18px]"
            key={r.rsvNo}
            onClick={()=> 
              navigate(
                payment
                        ? `/member/payments/reservation/${r.rsvNo}`
                        : `/member/reservations/${r.rsvNo}`
              )
            }
          >
            <ClassSummary reservation={r} />

            <div>
              <span className="inline-block px-3 py-[3px] rounded-[24px] bg-[#fff0df] text-[#df700e] text-[13px] font-bold">
                {statusLabel[r.rsvStatus] ?? r.rsvStatus}
              </span>

              <p style={{ margin: "8px 0" }}>
                {r.schStartDate} · {r.rsvCount}명
              </p>

              {!instructor &&
                payment === false &&
                r.rsvStatus === "COMPLETED" &&
                getReviewDaysLeft(r.rsvCompletedAt) !== null ? (
                  <ButtonLink
                    to={`/member/reservations/${r.rsvNo}/review`}
                  >
                    후기 작성 D-{getReviewDaysLeft(r.rsvCompletedAt)}
                  </ButtonLink>
                ) : (
                  <ButtonLink
                    secondary
                    to={
                      payment
                        ? `/member/payments/reservation/${r.rsvNo}`
                        : `/member/reservations/${r.rsvNo}`
                    }
                  >
                    상세 보기
                  </ButtonLink>
                )}

              {instructor && (
                <p className="text-[13px] leading-[1.8] text-[#999]">
                  {r.memNickname} · {r.memEmail}
                </p>
              )}
            </div>
          </article>
        ))}

      {!loading && !error && !list.length && (
        <Empty to="/class" label="클래스 탐색">
          해당 내역이 없습니다.
        </Empty>
      )}

      {!loading && !error && <Pagination {...pagination} />}
    </Workspace>
  );
}