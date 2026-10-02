import Pagination from "./Pagination";
import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import {
  useStore,
  initialNotices,
  initialInquiries,
  initialProfile,
} from "./data";
import { ButtonLink, Heading, Field, Empty, Workspace } from "./ui";

const statusNames = {
  RECEIVED: "접수",
  PROCESSING: "처리 중",
  COMPLETED: "처리 완료",
};
export function BoardListPage({ inquiry = false, admin = false }) {
  const [items] = useStore(
    inquiry ? "inquiries" : "notices",
    inquiry ? initialInquiries : initialNotices,
  );
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const base = admin
    ? inquiry
      ? "/admin/inquiry"
      : "/admin/notice"
    : inquiry
      ? "/inquiry"
      : "/notice";
  const filtered = items
    .filter(
      (item) =>
        (!inquiry || admin || item.memberId === 1) &&
        (status === "ALL" || item.status === status) &&
        `${item.title} ${item.content}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .sort((a, b) => b.id - a.id);
  const body = (
    <>
      <Heading
        title={
          inquiry
            ? admin
              ? "문의 및 신고 관리"
              : "내 문의 및 신고"
            : admin
              ? "공지사항 관리"
              : "공지사항"
        }
        description={
          inquiry
            ? "접수한 문의와 처리 상태를 확인하세요."
            : "CLASS:ON의 새로운 소식과 이용 안내를 확인하세요."
        }
        action={
          (admin && !inquiry) || (!admin && inquiry) ? (
            <ButtonLink to={`${base}/register`}>
              {inquiry ? "문의 작성" : "공지 등록"}
            </ButtonLink>
          ) : null
        }
      />
      <p className="co-muted">전체 {filtered.length}건</p>
      <div className="co-table-wrap">
        <table className="co-table">
          <thead>
            <tr>
              <th>번호</th>
              {inquiry && admin && <th>작성자</th>}
              <th className="co-table-title">제목</th>
              <th>{inquiry ? "접수일" : "작성일"}</th>
              {inquiry && <th>처리 상태</th>}
              {admin && !inquiry && <th>관리</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.slice((page - 1) * 8, page * 8).map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                {inquiry && admin && <td>회원 {item.memberId}</td>}
                <td className="co-table-title">
                  <Link to={`${base}/read/${item.id}`}>{item.title}</Link>
                </td>
                <td>{item.date}</td>
                {inquiry && (
                  <td>
                    <span className="co-badge">{statusNames[item.status]}</span>
                  </td>
                )}
                {admin && !inquiry && (
                  <td>
                    <Link to={`${base}/modify/${item.id}`}>수정</Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        className="co-search"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(keyword);
          setPage(1);
        }}
      >
        {inquiry && (
          <select
            aria-label="처리 상태"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">전체 상태</option>
            {Object.entries(statusNames).map(([v, label]) => (
              <option value={v} key={v}>
                {label}
              </option>
            ))}
          </select>
        )}
        <input
          aria-label="제목 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="제목 또는 내용 검색"
        />
        <button className="co-button">검색</button>
      </form>
      {!filtered.length && <Empty>검색 결과가 없습니다.</Empty>}
      <Pagination page={page} pages={Math.max(1, Math.ceil(filtered.length / 8))} onChange={setPage} />
    </>
  );
  return admin ? (
    <Workspace kind="admin">{body}</Workspace>
  ) : inquiry ? (
    <Workspace>{body}</Workspace>
  ) : (
    body
  );
}
export function BoardReadPage({ inquiry = false, admin = false }) {
  const params = useParams();
  const id = Number(params.notNo || params.inqNo || params.repNo);
  const [items, setItems] = useStore(
    inquiry ? "inquiries" : "notices",
    inquiry ? initialInquiries : initialNotices,
  );
  const item = items.find(
    (x) => x.id === id && (!inquiry || admin || x.memberId === 1),
  );
  const [status, setStatus] = useState(item?.status || "RECEIVED");
  const [answer, setAnswer] = useState(item?.answer || "");
  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();
  const base = admin
    ? inquiry
      ? "/admin/inquiry"
      : "/admin/notice"
    : inquiry
      ? "/inquiry"
      : "/notice";
  if (!item)
    return (
      <Empty to={`${base}/list`} label="목록으로">
        내용을 찾을 수 없습니다.
      </Empty>
    );
  const body = (
    <>
      <Heading title={inquiry ? "문의 및 신고 상세" : "공지사항 상세"} />
      <article className="co-panel">
        <h2>{item.title}</h2>
        <p className="co-muted">
          {item.date}
          {inquiry && ` · ${item.type} · ${statusNames[item.status]}`}
        </p>
        <div className="co-reader">{item.content}</div>
        {inquiry && (
          <section style={{ borderTop: "1px solid #eee", paddingTop: 20 }}>
            <h3>관리자 답변</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>
              {item.answer || "아직 답변이 등록되지 않았습니다."}
            </p>
            {admin && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setItems((v) =>
                    v.map((x) =>
                      x.id === id
                        ? {
                            ...x,
                            status,
                            answer,
                            completedAt:
                              status === "COMPLETED" ? "2026-10-01" : null,
                          }
                        : x,
                    ),
                  );
                  setMessage("처리 상태와 답변을 저장했습니다.");
                }}
              >
                <Field label="처리 상태">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {Object.entries(statusNames).map(([v, label]) => (
                      <option key={v} value={v}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="관리자 코멘트">
                  <textarea
                    required={status === "COMPLETED"}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="답변을 입력해주세요."
                  />
                </Field>
                <button className="co-button">처리 상태 저장</button>
                {message && (
                  <p className="co-notice" role="status">
                    {message}
                  </p>
                )}
              </form>
            )}
          </section>
        )}
        <div className="co-actions">
          <ButtonLink secondary to={`${base}/list`}>
            목록으로
          </ButtonLink>
          {admin && !inquiry && (
            <>
              <ButtonLink to={`${base}/modify/${id}`}>수정</ButtonLink>
              <button
                className="co-button co-secondary"
                onClick={() => setConfirm(true)}
              >
                삭제
              </button>
            </>
          )}
        </div>
        {confirm && (
          <div className="co-notice co-error">
            이 공지사항을 삭제할까요?
            <div className="co-actions">
              <button
                className="co-button"
                onClick={() => {
                  setItems((v) => v.filter((x) => x.id !== id));
                  navigate(`${base}/list`);
                }}
              >
                삭제 확인
              </button>
              <button
                className="co-button co-secondary"
                onClick={() => setConfirm(false)}
              >
                취소
              </button>
            </div>
          </div>
        )}
      </article>
    </>
  );
  return admin ? (
    <Workspace kind="admin">{body}</Workspace>
  ) : inquiry ? (
    <Workspace>{body}</Workspace>
  ) : (
    body
  );
}
export function BoardFormPage({ inquiry = false, edit = false }) {
  const { notNo } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [items, setItems] = useStore(
    inquiry ? "inquiries" : "notices",
    inquiry ? initialInquiries : initialNotices,
  );
  const item = items.find((x) => x.id === Number(notNo));
  const [title, setTitle] = useState(edit ? item?.title || "" : "");
  const [content, setContent] = useState(edit ? item?.content || "" : "");
  const [type, setType] = useState(params.get("type") || "문의");
  const base = inquiry ? "/inquiry" : "/admin/notice";
  if (edit && !item)
    return (
      <Empty to={`${base}/list`} label="목록으로">
        공지사항을 찾을 수 없습니다.
      </Empty>
    );
  return (
    <Workspace kind={inquiry ? "member" : "admin"}>
      <Heading
        title={
          inquiry
            ? "문의 및 신고 작성"
            : edit
              ? "공지사항 수정"
              : "공지사항 등록"
        }
      />
      <form
        className="co-panel"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim() || !content.trim()) return;
          const id = edit ? item.id : Date.now();
          const record = {
            id,
            title: title.trim(),
            content: content.trim(),
            date: "2026-10-01",
            ...(inquiry
              ? {
                  type,
                  memberId: initialProfile.id,
                  status: "RECEIVED",
                  answer: "",
                  target: params.get("target"),
                }
              : {}),
          };
          setItems((v) =>
            edit ? v.map((x) => (x.id === id ? record : x)) : [...v, record],
          );
          navigate(`${base}/read/${id}`);
        }}
      >
        <Field
          label="제목"
          required
          maxLength={100}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요."
        />
        {inquiry && (
          <Field label="유형">
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {["문의", "클래스 신고", "후기 신고"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </Field>
        )}
        <Field label="내용">
          <textarea
            required
            maxLength={5000}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              inquiry
                ? "문의 또는 신고 내용을 입력해주세요."
                : "공지사항 내용을 입력해주세요."
            }
          />
        </Field>
        <p className="co-tiny">
          {content.length}/5000
          {inquiry && " · 문의할 대상과 내용을 구체적으로 적어주세요."}
        </p>
        <div className="co-actions">
          <ButtonLink secondary to={`${base}/list`}>
            취소
          </ButtonLink>
          <button className="co-button">{edit ? "수정 저장" : "등록"}</button>
        </div>
      </form>
    </Workspace>
  );
}
