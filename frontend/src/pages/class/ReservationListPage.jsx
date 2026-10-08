import { useState } from "react";
import { useParams } from "react-router";
import { classes, getSchedules, initialReservations, readStore, useStore } from "../../mocks/data";
import { usePagination } from "../../hooks/usePagination";
import { Workspace } from "../../components/common/Workspace";
import { Heading } from "../../components/common/Heading";
import { ClassSummary } from "../../components/common/ClassSummary";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Empty } from "../../components/common/Empty";
import Pagination from "../../components/common/Pagination";

export default function ReservationListPage({
  instructor = false,
  schedule = false,
  payment = false,
}) {
  const schedules = getSchedules();
  const [reservations] = useStore("reservations", initialReservations);
  const { schNo } = useParams();
  const [filter, setFilter] = useState("전체");
  const list = reservations.filter(
    (r) =>
      (!schedule || r.scheduleId === Number(schNo)) &&
      (!payment || r.paid) &&
      (filter === "전체" || r.status === filter),
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
        {["전체", "결제대기", "예약완료", "수강완료", "취소"].map((v) => (
          <li role="button" tabIndex={0}
            className={`text-2xl cursor-pointer p-0 text-[#777] hover:text-[#ea6500] focus-visible:outline-2 focus-visible:outline-[#ea6500] focus-visible:outline-offset-[3px] ${filter === v ? "text-accent font-semibold" : ""}`}
            key={v}
            onClick={() => setFilter(v)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setFilter(v);
              }
            }}
          >
            {v}
          </li>
        ))}
      </ul>
      {pagination.items.map((r) => (
        <article className="flex justify-between items-center gap-6 p-6 bg-white border border-[#e9e4df] rounded-[10px] mb-[17px] max-md:items-start max-md:flex-col max-md:p-[18px]" key={r.id}>
          <ClassSummary reservation={r} list={readStore("classes", classes)} />
          <div>
            <span className="inline-block px-3 py-[3px] rounded-[24px] bg-[#fff0df] text-[#df700e] text-[13px] font-bold">{r.status}</span>
            <p style={{ margin: "8px 0" }}>
              {schedules.find((s) => s.id === r.scheduleId)?.date} · {r.count}명
            </p>
           <ButtonLink
              secondary
              to={
                payment
                  ? `/payment/reservation/${r.id}`
                  : `/reservation/${r.id}`
              }
            >
              상세 보기
            </ButtonLink>
            {instructor && (
              <p className="text-[13px] leading-[1.8] text-[#999]">김회원 · member@classon.com</p>
            )}
          </div>
        </article>
      ))}
      {!list.length && (
        <Empty to="/class" label="클래스 탐색">
          해당 내역이 없습니다.
        </Empty>
      )}
      <Pagination {...pagination} />
    </Workspace>
  );
}
