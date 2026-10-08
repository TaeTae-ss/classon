import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { classes,readStore } from "../../mocks/data";

import { getReservationListByMember } from "../../api/reservationApi";

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

export default function ReservationListPage({
  instructor = false,
  schedule = false,
  payment = false,
}) {
  const { memNo, schNo } = useParams();

  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState("전체");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getReservationListByMember(memNo);

        setReservations(data || []);
      } catch (error) {
        console.error("예약 내역 조회 실패:", error);
        setError("예약 내역을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (memNo) {
      fetchReservations();
    }
  }, [memNo]);

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
          >
            <ClassSummary reservation={r} list={readStore("classes", classes)} />

            <div>
              <span className="inline-block px-3 py-[3px] rounded-[24px] bg-[#fff0df] text-[#df700e] text-[13px] font-bold">
                {statusLabel[r.rsvStatus] ?? r.rsvStatus}
              </span>

              <p style={{ margin: "8px 0" }}>
                {r.schStartDate} · {r.rsvCount}명
              </p>

              <ButtonLink
                secondary
                to={
                  payment
                    ? `/payment/reservation/${r.rsvNo}`
                    : `/reservation/${r.rsvNo}`
                }
              >
                상세 보기
              </ButtonLink>

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