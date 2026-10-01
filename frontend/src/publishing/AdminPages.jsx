import { useState } from "react";
import { Link } from "react-router";
import {
  useStore,
  classes,
  initialReviews,
  initialReservations,
  initialInquiries,
  schedules,
  money,
} from "./data";
import { Workspace, Heading, ButtonLink, Empty } from "./ui";
import { Stats } from "./InstructorPages";
const initialMembers = [
  { id: 1, name: "김회원", email: "member@classon.com", role: "USER" },
  { id: 2, name: "이회원", email: "user2@classon.com", role: "USER" },
  { id: 3, name: "홍길동", email: "instructor@classon.com", role: "INS" },
];
export function AdminDashboard() {
  const [members] = useStore("members", initialMembers);
  const [list] = useStore("classes", classes);
  const [inquiries] = useStore("inquiries", initialInquiries);
  const [reservations] = useStore("reservations", initialReservations);
  return (
    <Workspace kind="admin">
      <Heading
        title="관리자 대시보드"
        description="서비스 운영 현황을 한눈에 확인하세요."
      />
      <Stats
        items={[
          ["회원", `${members.length}명`],
          ["클래스", `${list.length}개`],
          [
            "미처리 문의",
            `${inquiries.filter((i) => i.status !== "COMPLETED").length}건`,
          ],
          ["결제", `${reservations.filter((r) => r.paid).length}건`],
        ]}
      />
      <section className="co-panel">
        <h2>서비스 관리</h2>
        <div className="co-menu-cards">
          {[
            ["/admin/members", "회원 관리"],
            ["/admin/classes", "클래스 관리"],
            ["/admin/reviews", "후기 관리"],
            ["/admin/notice/list", "공지사항 관리"],
            ["/admin/inquiry/list", "문의 및 신고 관리"],
            ["/admin/reservations", "예약·결제 현황"],
          ].map(([to, label]) => (
            <Link key={to} to={to}>
              {label} →
            </Link>
          ))}
        </div>
      </section>
    </Workspace>
  );
}
export function AdminManagePage({ kind = "classes" }) {
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
  return (
    <Workspace kind="admin">
      <Heading
        title={title}
        description="등록된 정보를 조회하고 관리할 수 있습니다."
      />
      <form
        className="co-search"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(keyword);
        }}
      >
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
          }
        />
        <button className="co-button">검색</button>
      </form>
      <p className="co-muted">전체 {filtered.length}건</p>
      {detail && (
        <section className="co-panel">
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
            className="co-button co-secondary"
            onClick={() => setDetail(null)}
          >
            닫기
          </button>
        </section>
      )}
      {confirm && (
        <div className="co-notice co-error">
          선택한 예시 데이터를 삭제할까요?
          <div className="co-actions">
            <button
              className="co-button"
              onClick={() => {
                setItems((v) => v.filter((x) => x.id !== confirm));
                setConfirm(null);
                setDetail(null);
              }}
            >
              삭제 확인
            </button>
            <button
              className="co-button co-secondary"
              onClick={() => setConfirm(null)}
            >
              취소
            </button>
          </div>
        </div>
      )}
      <div className="co-table-wrap">
        <table className="co-table">
          <thead>
            <tr>
              <th>번호</th>
              {kind === "members" ? (
                <>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>권한</th>
                </>
              ) : kind === "reviews" ? (
                <>
                  <th>클래스</th>
                  <th>작성자</th>
                  <th>평점</th>
                  <th>후기 내용</th>
                  <th>상태</th>
                </>
              ) : (
                <>
                  <th>클래스명</th>
                  <th>강사</th>
                  <th>카테고리</th>
                  <th>가격</th>
                </>
              )}
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((x) => (
              <tr key={x.id}>
                <td>{x.id}</td>
                {kind === "members" ? (
                  <>
                    <td>{x.name}</td>
                    <td>{x.email}</td>
                    <td>{x.role}</td>
                  </>
                ) : kind === "reviews" ? (
                  <>
                    <td>
                      {classList.find((c) => c.id === x.classId)?.title ||
                        "삭제된 클래스"}
                    </td>
                    <td>{x.author}</td>
                    <td>
                      <span className="co-star">★ {x.rating}</span>
                    </td>
                    <td>{x.content.slice(0, 18)}…</td>
                    <td>
                      <span className="co-badge">
                        {x.blinded ? "블라인드" : "공개"}
                      </span>
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      <Link to={`/class/${x.id}`}>{x.title}</Link>
                    </td>
                    <td>{x.instructor}</td>
                    <td>{x.category}</td>
                    <td>{money(x.price)}</td>
                  </>
                )}
                <td>
                  <button onClick={() => setDetail(x)}>상세</button>
                  {kind === "reviews" ? (
                    <button
                      type="button"
                      className="co-blind-button"
                      disabled={x.blinded}
                      aria-label={`${x.id}번 후기 ${x.blinded ? "블라인드 완료" : "블라인드"}`}
                      onClick={() => blindReview(x.id)}
                    >
                      {x.blinded ? "블라인드 완료" : "블라인드"}
                    </button>
                  ) : (
                    <button onClick={() => setConfirm(x.id)}>삭제</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!filtered.length && <Empty>조회된 정보가 없습니다.</Empty>}
    </Workspace>
  );
}
export function AdminReservationPage() {
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
  return (
    <Workspace kind="admin">
      <Heading
        title="예약·결제 현황"
        description="전체 예약 및 결제 내역을 조회할 수 있습니다."
      />
      <div className="co-tabs">
        <button
          className={tab === "reservation" ? "is-active" : ""}
          onClick={() => setTab("reservation")}
        >
          예약 현황
        </button>
        <button
          className={tab === "payment" ? "is-active" : ""}
          onClick={() => setTab("payment")}
        >
          결제 현황
        </button>
      </div>
      <form
        className="co-search"
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
        <button className="co-button">검색</button>
      </form>
      <div className="co-table-wrap">
        <table className="co-table">
          <thead>
            <tr>
              <th>예약번호</th>
              <th>회원</th>
              <th>클래스</th>
              <th>일정</th>
              <th>{tab === "payment" ? "결제 금액" : "인원"}</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>김회원</td>
                <td>{list.find((c) => c.id === r.classId)?.title}</td>
                <td>{schedules.find((s) => s.id === r.scheduleId)?.date}</td>
                <td>
                  {tab === "payment"
                    ? money(
                        (list.find((c) => c.id === r.classId)?.price || 0) *
                          r.count,
                      )
                    : `${r.count}명`}
                </td>
                <td>{r.status}</td>
                <td>
                  <Link
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
      {!filtered.length && <Empty>내역이 없습니다.</Empty>}
      <div className="co-actions">
        <ButtonLink secondary to="/admin">
          관리자 대시보드
        </ButtonLink>
      </div>
    </Workspace>
  );
}
