import { useState } from "react";
import { Link } from "react-router";
import { useStore, classes, initialReviews, money } from "../../mocks/data";
import { usePagination } from "../../hooks/usePagination";
import { Workspace } from "../../components/common/Workspace";
import { Heading } from "../../components/common/Heading";
import { Empty } from "../../components/common/Empty";
import Pagination from "../../components/common/Pagination";
const initialMembers = [
  { id: 1, name: "김회원", email: "member@classon.com", role: "USER" },
  { id: 2, name: "이회원", email: "user2@classon.com", role: "USER" },
  { id: 3, name: "홍길동", email: "instructor@classon.com", role: "INS" },
];
export default function AdminManagePage({ kind = "classes" }) {
  const key =
    kind === "members" ? "members" : kind === "reviews" ? "reviews" : "classes";
  const [items, setItems] = useStore(
    key,
    kind === "members"
      ? initialMembers
      : kind === "reviews"
        ? initialReviews
        : classes,
  );
  const [classList] = useStore("classes", classes);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [detail, setDetail] = useState(null);
  const title =
    kind === "members"
      ? "회원 관리"
      : kind === "reviews"
        ? "후기 관리"
        : "클래스 관리";
  const blindReview = (id) => {
    const current = items.find((review) => review.id === id);
    if (!current || current.blinded) return;
    const at = new Date().toISOString();
    const updated = {
      ...current,
      blinded: true,
      blindedAt: at,
      moderationHistory: [
        ...(current.moderationHistory || []),
        { action: "BLIND", actor: "ADMIN", at },
      ],
    };
    setItems((reviews) =>
      reviews.map((review) => (review.id === id ? updated : review)),
    );
    setDetail((previous) => (previous?.id === id ? updated : previous));
  };
  const filtered = items.filter((x) =>
    JSON.stringify(x).toLowerCase().includes(search.toLowerCase()),
  );
  const pagination = usePagination(filtered);
  return (
    <Workspace kind="admin">
      <Heading
        title={title}
        description="등록된 정보를 조회하고 관리할 수 있습니다."/>
      <p className="text-right text-[14px] text-[#85888d]">전체 {filtered.length}건</p>
      {detail && (
        <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
          <h2>상세 정보</h2>
          {Object.entries(detail)
            .filter(([k]) => !["art", "color"].includes(k))
            .map(([k, v]) => (
              <p key={k}>
                <strong>
                  {{
                    id: "번호",
                    name: "이름",
                    email: "이메일",
                    role: "권한",
                    title: "클래스명",
                    instructor: "강사",
                    category: "카테고리",
                    price: "수강료",
                    capacity: "정원",
                    duration: "수업 시간",
                    difficulty: "난이도",
                    location: "장소",
                    description: "설명",
                    author: "작성자",
                    content: "후기 내용",
                    rating: "평점",
                    date: "작성일",
                    classId: "클래스 번호",
                    memberId: "회원 번호",
                    reservationId: "예약 번호",
                    blinded: "공개 상태",
                    blindedAt: "블라인드 처리 일시",
                    moderationHistory: "처리 이력",
                  }[k] || k}
                </strong>
                :{" "}
                {k === "blinded"
                  ? v
                    ? "블라인드"
                    : "공개"
                  : k === "moderationHistory"
                    ? v
                        .map(
                          (entry) =>
                            `블라인드 · ${new Date(entry.at).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`,
                        )
                        .join(" / ")
                    : k === "blindedAt"
                      ? new Date(v).toLocaleString("ko-KR", {
                          timeZone: "Asia/Seoul",
                        })
                      : String(v)}
              </p>
            ))}
          <button
            className="flex w-fit max-w-full ml-auto justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3]"
            onClick={() => setDetail(null)}>
            닫기
          </button>
        </section>
      )}
      {confirm && (
        <div className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#fff0ec] text-[#ac4326] text-[16px]">
          선택한 예시 데이터를 삭제할까요?
          <div className="flex gap-3 items-center flex-wrap mt-[29px]">
            <button
              className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3]"
              onClick={() => {
                setItems((v) => v.filter((x) => x.id !== confirm));
                setConfirm(null);
                setDetail(null);}}>
              삭제 확인
            </button>
            <button
              className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3]"
              onClick={() => setConfirm(null)}>
              취소
            </button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto border border-[#eee5db] rounded-[10px] bg-white">
        <table className="w-full border-collapse text-[14px] whitespace-nowrap [&_tr:last-child>td]:border-b-0">
          <thead>
            <tr>
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">번호</th>
              {kind === "members" ? (
                <>
                  <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">이름</th>
                  <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">이메일</th>
                  <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">권한</th>
                </>
              ) : kind === "reviews" ? (
                <>
                  <th className="text-left text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">클래스</th>
                  <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">작성자</th>
                  <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">평점</th>
                  <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">후기 내용</th>
                  <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">상태</th>
                </>
              ) : (
                <>
                  <th className="text-left text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">클래스명</th>
                  <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">강사</th>
                  <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">카테고리</th>
                  <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">가격</th>
                </>
              )}
              <th className="text-center text-[#777] bg-[#faf8f5] font-semibold py-[18px] px-[17px] border-b border-[#f0ebe6]">관리</th>
            </tr>
          </thead>
          <tbody>
            {pagination.items.map((x) => (
              <tr key={x.id}>
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">{x.id}</td>
                {kind === "members" ? (
                  <>
                    <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">{x.name}</td>
                    <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">{x.email}</td>
                    <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">{x.role}</td>
                  </>
                ) : kind === "reviews" ? (
                  <>
                    <td className="text-left py-[18px] px-[17px] border-b border-[#f0ebe6]">
                      {classList.find((c) => c.id === x.classId)?.title ||
                        "삭제된 클래스"}
                    </td>
                    <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">{x.author}</td>
                    <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                      <span className="text-[#eb790b] whitespace-nowrap">★ {x.rating}</span>
                    </td>
                    <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                      {x.content ? `${x.content.slice(0, 18)}${x.content.length > 18 ? "…" : ""}` : "-"}</td>
                    <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                      <span className="inline-block px-3 py-[3px] rounded-[24px] bg-[#fff0df] text-[#df700e] text-[13px] font-bold">
                        {x.blinded ? "블라인드" : "공개"}
                      </span>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="text-left py-[18px] px-[17px] border-b border-[#f0ebe6]">
                      <Link className="text-[#d97215]" to={`/class/${x.id}`}>{x.title}</Link>
                    </td>
                    <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">{x.instructor}</td>
                    <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">{x.category}</td>
                    <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">{money(x.price)}</td>
                  </>
                )}
                <td className="text-center py-[18px] px-[17px] border-b border-[#f0ebe6]">
                  <button className="border-0 bg-transparent text-[#e47719] px-2 py-[3px]" onClick={() => setDetail(x)}>상세</button>
                  {kind === "reviews" ? (
                    <button
                      type="button"
                      className="px-[14px] py-[9px] border border-[#f07813] rounded-[7px] bg-[#fff2e5] text-[#ba5706] font-semibold disabled:border-[#ddd] disabled:bg-[#f4f4f4] disabled:text-[#777] disabled:opacity-100"
                      disabled={x.blinded}
                      aria-label={`${x.id}번 후기 ${x.blinded ? "블라인드 완료" : "블라인드"}`}
                      onClick={() => blindReview(x.id)}>
                      {x.blinded ? "블라인드 완료" : "블라인드"}
                    </button>
                  ) : (
                    <button className="border-0 bg-transparent text-[#e47719] px-2 py-[3px]" onClick={() => setConfirm(x.id)}>삭제</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        className="flex justify-center gap-3 mt-6 mb-6 [zoom:0.9]"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(keyword);
        }}>
        <input
          aria-label={`${title} 검색`}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={
            kind === "members"
              ? "회원명 / 이메일 검색"
              : kind === "reviews"
                ? "후기 내용 / 작성자 검색"
                : "클래스명 / 강사 / 카테고리 검색"
          }/>
        <button className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3]">검색</button>
      </form>
      {!filtered.length && <Empty>조회된 정보가 없습니다.</Empty>}
      <Pagination {...pagination} />
    </Workspace>
  );
}
