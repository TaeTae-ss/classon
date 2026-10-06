import { Link, Navigate, useParams, useSearchParams } from "react-router";
import { classes, findClass, initialReservations, useStore } from "../../mocks/data";
import { Art } from "../../components/common/Art";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import BookingForm from "../../components/booking/BookingForm";

export default function ReservationPage({ edit = false }) {
  const { rsvNo, schNo } = useParams();
  const [params] = useSearchParams();
  const [reservations] = useStore("reservations", initialReservations);
  const [list] = useStore("classes", classes);
  const existing = reservations.find((r) => r.id === Number(rsvNo));
  const item = findClass(
    edit ? existing?.classId : Number(params.get("clsNo") || 1),
    list,
  );
  if (!item || (edit && !existing))
    return (
      <Empty to="/reservation/member/1" label="예약 내역">
        예약할 클래스를 찾을 수 없습니다.
      </Empty>
    );
  if (edit && ["취소", "수강완료"].includes(existing.status))
    return (
      <Empty to={`/reservation/${existing.id}`} label="예약 상세">
        현재 상태에서는 예약을 수정할 수 없습니다.
      </Empty>
    );
  if (!edit)
    return (
      <Navigate
        to={`/class/${item.id}${schNo || params.get("schNo") ? `?schNo=${schNo || params.get("schNo")}` : ""}`}
        replace
      />
    );
  return (
    <>
      <Link className="text-[14px] text-[#c47127]!" to={`/reservation/${existing.id}`}>
        ← 돌아가기
      </Link>
      <Heading title="예약 정보 수정" />
      <div className="grid grid-cols-2 gap-[34px] max-[900px]:gap-[22px] max-md:grid-cols-1 [&>*]:min-w-0">
        <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
          <h2>선택 클래스</h2>
          <Art item={item} />
          <h2 style={{ marginTop: 20 }}>{item.title}</h2>
          <p>
            {item.instructor} 강사 · {item.duration}분
          </p>
        </section>
        <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
          <BookingForm key={existing.id} item={item} existing={existing} />
        </section>
      </div>
    </>
  );
}
