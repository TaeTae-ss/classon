import Pagination from "./Pagination";
import { usePagination } from "./usePagination";
import { useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import {
  classes,
  getSchedules,
  findClass,
  money,
  useStore,
  readStore,
  initialProfile,
  initialReservations,
  initialReviews,
} from "./data";
import {
  Art,
  ButtonLink,
  Heading,
  Empty,
  Field,
  Card,
  Workspace,
  ClassSummary,
} from "./ui";

import BookingForm from "./BookingForm";

export function MainPage() {
  return (
    <>
      <section className="co-hero">
        <div className="co-hero-copy">
          <span className="co-eyebrow">MAKE YOUR DAY, CLASS:ON</span>
          <h1>
            지금, 더 특별한 하루를
            <br />
            특별하게 만들어보세요
          </h1>
          <p>
            작은 호기심이 새로운 취미가 되는 곳.
            <br />
            당신의 일상에 즐거움을 더해보세요.
          </p>
          <ButtonLink to="/class">클래스 둘러보기 →</ButtonLink>
        </div>
        <Art item={classes[0]} hero />
      </section>
      <section>
        <div className="co-section-link">
          <h2>지금 인기 있는 클래스</h2>
          <Link to="/class">전체 보기 →</Link>
        </div>
        <div className="co-grid co-grid-four">
          {classes.slice(0, 4).map((c) => (
            <Card key={c.id} item={c} />
          ))}
        </div>
      </section>
    </>
  );
}
export function ClassListPage() {
  const [params] = useSearchParams();
  const [category, setCategory] = useState(params.get("category") || "전체");
  const [list] = useStore("classes", classes);
  const filtered = list.filter(
    (c) => category === "전체" || c.category === category,
  );
  const pagination = usePagination(filtered, 9);
  return (
    <>
      <Heading
        title="클래스 탐색"
        description="새로운 취미, 새로운 배움. 당신에게 맞는 클래스를 찾아보세요."
      />
      <div className="co-class-list-toolbar">
        <ul className="co-tabs">
          {["전체", "개발", "디자인", "취미", "기타"].map((c) => (
            <li role="button" tabIndex={0}
              key={c}
              className={c === category ? "is-active" : ""}
              onClick={() => setCategory(c)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setCategory(c);
                }
              }}
            >
              {c}
            </li>
          ))}
        </ul>
        <p className="co-muted">총 {filtered.length}개의 클래스</p>
      </div>
      {filtered.length ? (
        <div className="co-grid">
          {pagination.items.map((c) => (
            <Card key={c.id} item={c} />
          ))}
        </div>
      ) : (
        <Empty>
          해당 카테고리에 클래스가 없습니다. 다른 카테고리를 선택해주세요.
        </Empty>
      )}
      <Pagination {...pagination} />
    </>
  );
}
export function ClassDetailPage() {
  const { clsNo } = useParams();
  const [list] = useStore("classes", classes);
  const item = findClass(clsNo, list);
  const [favorites, setFavorites] = useStore("favorites", [1, 2]);
  const [reviews] = useStore("reviews", initialReviews);
  const reviewPagination = usePagination(reviews.filter((r) => r.classId === item?.id));
  if (!item)
    return (
      <Empty to="/class" label="클래스 탐색">
        클래스를 찾을 수 없습니다.
      </Empty>
    );
  const liked = favorites.includes(item.id);
  return (
    <>
      <Heading title="클래스 상세" />
      <div className="co-split co-class-detail-layout">
        <div className="co-class-detail-content">
        <div className="co-gallery">
          <Art item={item} />
        </div>
      <nav className="co-content-tabs">
        <a href="#introduction">클래스 소개</a>
        <a href="#instructor">강사 소개</a>
        <a href="#reviews">수강 후기</a>
      </nav>
          <section id="introduction" className="co-panel">
            <h2>클래스 소개</h2>
            <p>{item.description}</p>
            <h3>이런 분께 추천해요</h3>
            <p>새로운 경험을 시작하고 싶은 분, 나만의 시간을 즐기고 싶은 분.</p>
            <h3>준비물 안내</h3>
            <p>
              수업에 필요한 기본 재료와 도구는 제공됩니다. 편안한 복장으로
              참여해주세요.
            </p>
          </section>
          <section id="instructor" className="co-panel">
            <h2>강사 소개</h2>
            <div className="co-profile">
              <div className="co-avatar">{item.instructor[0]}</div>
              <div>
                <h3>{item.instructor} 강사</h3>
                <p>처음 시작하는 분들도 즐겁게 배울 수 있도록 함께합니다.</p>
              </div>
            </div>
          </section>
        <section id="location" className="co-panel">
          <h2>클래스 장소</h2>
          <p>{item.location}</p>
          <div
            className="co-art"
            style={{
              background: "#f0eee8",
              display: "grid",
              placeItems: "center",
              aspectRatio: "2",
            }}
          >
            📍 {item.location.split(" ").slice(0, 2).join(" ")}
          </div>
          <p className="co-tiny" style={{ marginTop: 12 }}>
            정확한 방문 안내는 예약 정보를 확인해주세요.
          </p>
        </section>
      <section id="reviews" className="co-panel">
        <h2>수강 후기</h2>
        {reviewPagination.items.map((r) => (
            <article className="co-review" key={r.id}>
              <span className="co-star">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </span>{" "}
              <span className="co-muted">
                {r.author} · {r.date}
              </span>
              <p style={{ marginTop: 10 }}>
                {r.blinded ? "관리자에의해 블라인드된 후기입니다" : r.content}
              </p>
              <Link
                className="co-tiny"
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
          className="co-tiny"
          to={`/reports/register?type=클래스 신고&target=${item.id}`}
        >
          클래스 신고
        </Link>
      </section>
        </div>
        <div className="co-panel">
          <span className="co-badge">
            {item.category} · {item.difficulty}
          </span>
          <h1 style={{ marginTop: 16 }}>{item.title}</h1>
          <p>{item.instructor} 강사</p>
          <p>
            <span className="co-star">★ {item.rating}</span> · 후기{" "}
            {reviews.filter((r) => r.classId === item.id).length}개
          </p>
          <p>
            {item.duration}분 · 최대 정원 {item.capacity}명
          </p>
          <BookingForm
            key={item.id}
            item={item}
            secondaryAction={
              <button type="button"
              className="co-button co-secondary"
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
export function FavoritePage() {
  const [favorites] = useStore("favorites", [1, 2]);
  const [list] = useStore("classes", classes);
  const [selected, setSelected] = useState([]);
  const pagination = usePagination(list.filter((c) => favorites.includes(c.id)));
  return (
    <Workspace>
      <Heading
        title="내가 찜한 클래스"
        description="마음에 드는 클래스를 모아두고 비교해보세요."
        action={
          <ButtonLink
            to={`/favorites/compare?ids=${selected.join(",")}`}
            secondary
          >
            선택 비교 ({selected.length}/2)
          </ButtonLink>
        }
      />
      {selected.length !== 2 && (
        <p className="co-muted">비교할 클래스를 2개 선택해주세요.</p>
      )}
      {favorites.length ? (
        <div className="co-grid">
          {pagination.items.map((c) => (
              <Card
                key={c.id}
                item={c}
                selected={selected.includes(c.id)}
                select={(id) =>
                  setSelected((v) =>
                    v.includes(id)
                      ? v.filter((x) => x !== id)
                      : v.length < 2
                        ? [...v, id]
                        : v,
                  )
                }
              />
            ))}
        </div>
      ) : (
        <Empty to="/class" label="클래스 찾아보기">
          찜한 클래스가 없습니다.
        </Empty>
      )}
      <Pagination {...pagination} />
    </Workspace>
  );
}
export function FavoriteComparePage() {
  const [params] = useSearchParams();
  const [favorites] = useStore("favorites", [1, 2]);
  const [list] = useStore("classes", classes);
  const ids = (params.get("ids") || "")
    .split(",")
    .map(Number)
    .filter((id) => favorites.includes(id));
  if (ids.length !== 2)
    return (
      <Workspace>
        <Heading title="클래스 비교" />
        <Empty to="/member/favorites" label="찜 목록에서 선택">
          찜 목록에서 클래스 2개를 선택해주세요.
        </Empty>
      </Workspace>
    );
  return (
    <Workspace>
      <Heading
        title="클래스 비교"
        description="두 클래스를 한눈에 비교해보세요."
      />
      <div className="co-compare">
        {ids.map((id) => {
          const c = findClass(id, list);
          return c ? (
            <section className="co-panel" key={id}>
              <Art item={c} />
              <h2 style={{ marginTop: 20 }}>{c.title}</h2>
              <dl className="co-details">
                {[
                  ["강사", c.instructor],
                  ["카테고리", c.category],
                  ["난이도", c.difficulty],
                  ["수강료", money(c.price)],
                  ["수업 시간", `${c.duration}분`],
                  ["최대 정원", `${c.capacity}명`],
                  ["평점", `★ ${c.rating}`],
                  ["장소", c.location],
                ].map(([k, v]) => (
                  <FragmentRow key={k} label={k} value={v} />
                ))}
              </dl>
              <div className="co-actions">
                <ButtonLink secondary to={`/class/${id}`}>
                  더 알아보기
                </ButtonLink>
                <ButtonLink to={`/reservation?clsNo=${id}`}>
                  예약하기
                </ButtonLink>
              </div>
            </section>
          ) : null;
        })}
      </div>
    </Workspace>
  );
}
function FragmentRow({ label, value }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}
export function ReservationPage({ edit = false }) {
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
      <Link className="co-back" to={`/reservation/${existing.id}`}>
        ← 돌아가기
      </Link>
      <Heading title="예약 정보 수정" />
      <div className="co-split">
        <section className="co-panel">
          <h2>선택 클래스</h2>
          <Art item={item} />
          <h2 style={{ marginTop: 20 }}>{item.title}</h2>
          <p>
            {item.instructor} 강사 · {item.duration}분
          </p>
        </section>
        <section className="co-panel">
          <BookingForm key={existing.id} item={item} existing={existing} />
        </section>
      </div>
    </>
  );
}
export function ReservationListPage({
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
      <ul className="co-tabs">
        {["전체", "결제대기", "예약완료", "수강완료", "취소"].map((v) => (
          <li role="button" tabIndex={0}
            className={filter === v ? "is-active" : ""}
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
        <article className="co-reservation" key={r.id}>
          <ClassSummary reservation={r} list={readStore("classes", classes)} />
          <div>
            <span className="co-badge">{r.status}</span>
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
              <p className="co-tiny">김회원 · member@classon.com</p>
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
export function ReservationDetailPage({ cancel = false, status = false }) {
  const schedules = getSchedules();
  const { rsvNo } = useParams();
  const navigate = useNavigate();
  const [reservations, setReservations] = useStore(
    "reservations",
    initialReservations,
  );
  const [list] = useStore("classes", classes);
  const r = reservations.find((x) => x.id === Number(rsvNo));
  const [reason, setReason] = useState("");
  const [newStatus, setNewStatus] = useState(r?.status || "예약완료");
  if (!r)
    return (
      <Empty to="/reservation/member/1" label="예약 내역">
        예약 정보를 찾을 수 없습니다.
      </Empty>
    );
  const item = findClass(r.classId, list);
  const s = schedules.find((x) => x.id === r.scheduleId);
  const update = () => {
    setReservations((v) =>
      v.map((x) =>
        x.id === r.id
          ? { ...x, status: cancel ? "취소" : newStatus, cancelReason: reason }
          : x,
      ),
    );
    navigate(`/reservation/${r.id}`);
  };
  return (
    <div className="co-narrow">
      <Heading
        title={
          cancel
            ? "예약을 취소할까요?"
            : status
              ? "예약 상태 변경"
              : "예약 상세"
        }
      />
      <section className="co-panel">
        <ClassSummary reservation={r} list={list} />
        <dl className="co-details">
          {[
            ["예약 번호", r.id],
            ["수업 일정", `${s?.date} ${s?.time}`],
            ["예약 인원", `${r.count}명`],
            ["예약 상태", r.status],
            ["결제 금액", money((item?.price || 0) * r.count)],
          ].map(([k, v]) => (
            <FragmentRow key={k} label={k} value={v} />
          ))}
        </dl>
        {cancel ? (
          <>
            <p>예약을 취소하면 예시 데이터의 상태가 변경됩니다.</p>
            <Field label="취소 사유">
              <textarea
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="취소 사유를 입력해주세요."
              />
            </Field>
            <div className="co-price">
              <span>예상 환불 금액</span>
              <strong>
                {money(r.paid ? (item?.price || 0) * r.count : 0)}
              </strong>
            </div>
            <p className="co-tiny">
              미리보기에서는 실제 결제 취소 및 환불이 발생하지 않습니다.
            </p>
            <div className="co-actions">
              <button
                className="co-button"
                disabled={
                  !reason.trim() ||
                  r.status === "취소" ||
                  r.status === "수강완료"
                }
                onClick={update}
              >
                취소하기
              </button>
              <ButtonLink secondary to={`/reservation/${r.id}`}>
                돌아가기
              </ButtonLink>
            </div>
          </>
        ) : status ? (
          <>
            <Field label="예약 상태">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {["결제대기", "예약완료", "수강완료", "취소"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </Field>
            <button className="co-button" onClick={update}>
              상태 저장
            </button>
          </>
        ) : (
          <div className="co-actions">
            {!["취소", "수강완료"].includes(r.status) && (
              <>
                <ButtonLink secondary to={`/reservation/${r.id}/edit`}>
                  예약 수정
                </ButtonLink>
                <ButtonLink secondary to={`/reservation/${r.id}/cancel`}>
                  예약 취소
                </ButtonLink>
              </>
            )}
            {r.status === "수강완료" && (
              <ButtonLink to={`/reservation/${r.id}/review`}>
                후기 작성
              </ButtonLink>
            )}
            {r.status === "결제대기" && (
              <ButtonLink to={`/payment/${r.id}`}>결제 진행</ButtonLink>
            )}
            {r.paid && (
              <ButtonLink secondary to={`/payment/reservation/${r.id}`}>
                결제 정보
              </ButtonLink>
            )}
          </div>
        )}
      </section>
      <ButtonLink secondary to="/reservation/member/1">
        예약 내역 보기
      </ButtonLink>
    </div>
  );
}
export function PaymentPage() {
  const { rsvNo } = useParams();
  const navigate = useNavigate();
  const [reservations, setReservations] = useStore(
    "reservations",
    initialReservations,
  );
  const r = reservations.find((x) => x.id === Number(rsvNo));
  const [list] = useStore("classes", classes);
  const [method, setMethod] = useState("신용카드");
  const [agree, setAgree] = useState(false);
  if (!r)
    return (
      <Empty to="/reservation/member/1" label="예약 내역">
        예약 정보를 찾을 수 없습니다.
      </Empty>
    );
  if (r.status !== "결제대기")
    return (
      <Empty to={`/reservation/${r.id}`} label="예약 확인">
        현재 상태에서는 결제를 진행할 수 없습니다.
      </Empty>
    );
  const c = findClass(r.classId, list);
  return (
    <div className="co-narrow">
      <Heading title="결제하기" />
      <form
        className="co-panel"
        onSubmit={(e) => {
          e.preventDefault();
          if (!agree) return;
          setReservations((v) =>
            v.map((x) =>
              x.id === r.id
                ? {
                    ...x,
                    status: "예약완료",
                    paid: true,
                    method,
                    paymentId: r.id,
                  }
                : x,
            ),
          );
          navigate(`/payment/${r.id}/success`);
        }}
      >
        <h2>클래스 정보</h2>
        <ClassSummary reservation={r} list={list} />
        <h2 style={{ marginTop: 28 }}>결제 수단</h2>
        {["신용카드", "간편결제", "계좌이체"].map((v) => (
          <label className="co-check" key={v}>
            <input
              type="radio"
              name="method"
              value={v}
              checked={method === v}
              onChange={() => setMethod(v)}
            />
            {v}
          </label>
        ))}
        <h2 style={{ marginTop: 28 }}>이용약관 동의</h2>
        <label className="co-check">
          <input
            type="checkbox"
            required
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />{" "}
          약관 및 주문 내용을 확인하고 동의합니다.
        </label>
        <div className="co-price">
          <span>총 금액 · {r.count}명</span>
          <strong>{money((c?.price || 0) * r.count)}</strong>
        </div>
        <p className="co-tiny">
          화면 확인을 위한 예시 결제입니다. 실제 금액은 청구되지 않습니다.
        </p>
        <button className="co-button co-full" disabled={!agree}>
          결제 화면 완료
        </button>
      </form>
    </div>
  );
}
export function PaymentDetailPage({ complete = false, status = false }) {
  const schedules = getSchedules();
  const { payNo, rsvNo } = useParams();
  const [reservations, setReservations] = useStore(
    "reservations",
    initialReservations,
  );
  const r = reservations.find((x) => x.id === Number(payNo || rsvNo));
  const [list] = useStore("classes", classes);
  const [message, setMessage] = useState("");
  const [paid, setPaid] = useState(r?.paid ? "완료" : "대기");
  if (!r || (!r.paid && !status))
    return (
      <Empty to="/payment/member/1" label="결제 내역">
        결제 정보를 찾을 수 없습니다.
      </Empty>
    );
  const c = findClass(r.classId, list);
  return (
    <div className="co-narrow">
      <section className={`co-panel ${complete ? "co-complete" : ""}`}>
        {complete && <div className="co-complete-icon">✓</div>}
        <Heading
          title={
            complete
              ? "결제가 완료되었어요!"
              : status
                ? "결제 상태 변경"
                : "결제 상세"
          }
          description={
            complete ? "예시 예약이 정상적으로 완료되었습니다." : undefined
          }
        />
        <dl className="co-details" style={{ textAlign: "left" }}>
          {[
            ["예약 번호", r.id],
            ["클래스명", c?.title || "삭제된 클래스"],
            ["클래스 일정", schedules.find((s) => s.id === r.scheduleId)?.date],
            ["예약 인원", `${r.count}명`],
            ["결제 금액", money((c?.price || 0) * r.count)],
            ["결제 수단", r.method || "-"],
            [
              "결제 상태",
              r.status === "취소" ? "취소" : r.paid ? "완료" : "대기",
            ],
          ].map(([k, v]) => (
            <FragmentRow key={k} label={k} value={v} />
          ))}
        </dl>
        {status && (
          <>
            <Field label="결제 상태">
              <select value={paid} onChange={(e) => setPaid(e.target.value)}>
                <option>대기</option>
                <option>완료</option>
                <option>취소</option>
              </select>
            </Field>
            <button
              className="co-button"
              onClick={() => {
                setReservations((v) =>
                  v.map((x) =>
                    x.id === r.id
                      ? {
                          ...x,
                          paid: paid === "완료",
                          status:
                            paid === "취소"
                              ? "취소"
                              : paid === "완료"
                                ? "예약완료"
                                : "결제대기",
                        }
                      : x,
                  ),
                );
                setMessage("예시 결제 상태를 저장했습니다.");
              }}
            >
              상태 저장
            </button>
            {message && (
              <p className="co-notice" role="status">
                {message}
              </p>
            )}
          </>
        )}
        <div className="co-actions">
          <ButtonLink secondary to="/reservation/member/1">
            예약 내역 보기
          </ButtonLink>
          <ButtonLink to={`/class/${r.classId}`}>클래스 상세로 이동</ButtonLink>
        </div>
      </section>
    </div>
  );
}
export function ReviewAddPage() {
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
    <div className="co-narrow">
      <Heading title="후기 작성" />
      <form
        className="co-panel"
        onSubmit={(e) => {
          e.preventDefault();
          if (!content.trim()) return;
          setReviews((v) => [
            ...v,
            {
              id: Date.now(),
              classId: r.classId,
              reservationId: r.id,
              memberId: 1,
              author: readStore("profile", initialProfile).nickname,
              rating,
              content: content.trim(),
              date: "2026-10-01",
            },
          ]);
          navigate(`/class/${r.classId}#reviews`);
        }}
      >
        <ClassSummary reservation={r} list={readStore("classes", classes)} />
        <h3 style={{ marginTop: 25 }}>이번 클래스는 어떠셨나요?</h3>
        <div className="co-stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
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
        <span className="co-muted">{content.length}/1000</span>
        <div className="co-actions">
          <ButtonLink secondary to="/reservation/member/1">
            취소
          </ButtonLink>
          <button className="co-button">등록</button>
        </div>
      </form>
    </div>
  );
}
export function ReviewListPage({ instructor = false }) {
  const [reviews, setReviews] = useStore("reviews", initialReviews);
  const [list] = useStore("classes", classes);
  const [selected, setSelected] = useState(null);
  const shown = instructor ? reviews : reviews.filter((r) => r.memberId === 1);
  const pagination = usePagination(shown);
  return (
    <Workspace kind={instructor ? "instructor" : "member"}>
      <Heading title={instructor ? "클래스 후기" : "내가 작성한 후기"} />
      {pagination.items.map((r) => (
        <section key={r.id} className="co-panel">
          <h3>{findClass(r.classId, list)?.title}</h3>
          <span className="co-star">
            {"★".repeat(r.rating)}
            {"☆".repeat(5 - r.rating)}
          </span>
          <p style={{ marginTop: 12 }}>
            {r.blinded ? "관리자에의해 블라인드된 후기입니다" : r.content}
          </p>
          <span className="co-muted">
            {r.author} · {r.date}
          </span>
          {!instructor && (
            <button
              className="co-text-button"
              onClick={() => setSelected(r.id)}
            >
              삭제
            </button>
          )}
          {selected === r.id && (
            <div className="co-notice co-error">
              후기를 삭제할까요?
              <div className="co-actions">
                <button
                  className="co-button"
                  onClick={() => {
                    setReviews((v) => v.filter((x) => x.id !== r.id));
                    setSelected(null);
                  }}
                >
                  삭제 확인
                </button>
                <button
                  className="co-button co-secondary"
                  onClick={() => setSelected(null)}
                >
                  돌아가기
                </button>
              </div>
            </div>
          )}
        </section>
      ))}
      {!shown.length && <Empty>작성된 후기가 없습니다.</Empty>}
      <Pagination {...pagination} />
    </Workspace>
  );
}
