import { useState } from "react";
import { Link } from "react-router";
import { useStore, classes, initialReservations, schedules, money } from "../../mocks/data";
import { usePagination } from "../../hooks/usePagination";
import { Workspace } from "../../components/common/Workspace";
import { Heading } from "../../components/common/Heading";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Empty } from "../../components/common/Empty";
import Pagination from "../../components/common/Pagination";
export default function AdminReservationPage() {
  const [reservations] = useStore("reservations", initialReservations);
  const [list] = useStore("classes", classes);
  const [tab, setTab] = useState("reservation");
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("전체");
  const filtered = reservations.filter(
    (r) =>
      (tab !== "payment" || r.paid) &&
      (status === "전체" || r.status === status) &&
      `${r.id} 김회원 ${list.find((c) => c.id === r.classId)?.title}`.includes(
        search,
      ),
  );
  const pagination = usePagination(filtered);
  return (
    <Workspace kind="admin">
      <Heading
        title="예약·결제 현황"
        description="전체 예약 및 결제 내역을 조회할 수 있습니다."
      />
      <ul className="list-none flex gap-[10px] flex-wrap my-6 p-0">
        <li role="button" tabIndex={0}
          className={`text-2xl cursor-pointer p-0 text-[#777] hover:text-[#ea6500] focus-visible:outline-2 focus-visible:outline-[#ea6500] focus-visible:outline-offset-[3px] ${tab === "reservation" ? "text-accent font-semibold" : ""}`}
          onClick={() => setTab("reservation")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setTab("reservation");
              }
            }}
        >
          예약 현황
        </li>
        <li role="button" tabIndex={0}
          className={`text-2xl cursor-pointer p-0 text-[#777] hover:text-[#ea6500] focus-visible:outline-2 focus-visible:outline-[#ea6500] focus-visible:outline-offset-[3px] ${tab === "payment" ? "text-accent font-semibold" : ""}`}
          onClick={() => setTab("payment")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setTab("payment");
              }
            }}
        >
          결제 현황
        </li>
      </ul>
      <div className="overflow-x-auto border border-[#eee5db] rounded-[10px] bg-white">
        <table className="w-full border-collapse text-[14px] whitespace-nowrap [&_tr:last-child>td]:border-b-0">
          <thead>
            <tr>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">예약번호</th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">회원</th>
              <th className="text-left text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">클래스</th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">일정</th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">{tab === "payment" ? "결제 금액" : "인원"}</th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">상태</th>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">관리</th>
            </tr>
          </thead>
          <tbody>
            {pagination.items.map((r) => (
              <tr key={r.id}>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">{r.id}</td>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">김회원</td>
                <td className="text-left py-[18px] px-[17px] border-b border-[#f0ebe6]">{list.find((c) => c.id === r.classId)?.title}</td>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">{schedules.find((s) => s.id === r.scheduleId)?.date}</td>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                  {tab === "payment"
                    ? money(
                        (list.find((c) => c.id === r.classId)?.price || 0) *
                          r.count,
                      )
                    : `${r.count}명`}
                </td>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">{r.status}</td>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                  <Link
                    className="text-[#d97215]"
                    to={
                      tab === "payment"
                        ? `/payment/${r.id}/status`
                        : `/reservation/${r.id}/status`
                    }
                  >
                    상태 변경
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        className="flex justify-center gap-3 mb-6 [zoom:0.9]"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(keyword);
        }}
      >
        <input
          aria-label="예약 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="회원 / 클래스 / 예약번호 검색"
        />
        <select
          value={status}
          aria-label="예약 상태"
          onChange={(e) => setStatus(e.target.value)}
        >
          {["전체", "결제대기", "예약완료", "수강완료", "취소"].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <button className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3]">검색</button>
      </form>
      {!filtered.length && <Empty>내역이 없습니다.</Empty>}
      <div className="flex gap-3 items-center flex-wrap mt-[29px]">
        <ButtonLink secondary to="/admin">
          관리자 대시보드
        </ButtonLink>
      </div>
      <Pagination {...pagination} />
    </Workspace>
  );
}
