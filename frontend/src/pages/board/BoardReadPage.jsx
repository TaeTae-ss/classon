import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useStore, initialNotices, initialInquiries } from "../../mocks/data";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Heading } from "../../components/common/Heading";
import { Field } from "../../components/common/Field";
import { Empty } from "../../components/common/Empty";
import { Workspace } from "../../components/common/Workspace";

const statusNames = {
  RECEIVED: "접수",
  PROCESSING: "처리 중",
  COMPLETED: "처리 완료",
};
export default function BoardReadPage({ inquiry = false, admin = false }) {
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
      <article className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
        <h2>{item.title}</h2>
        <p className="text-right text-[14px] text-[#85888d]">
          {item.date}
          {inquiry && ` · ${item.type} · ${statusNames[item.status]}`}
        </p>
        <div className="min-h-[264px] whitespace-pre-wrap py-[29px] leading-[2]">{item.content}</div>
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
                <button className="flex w-fit max-w-full ml-auto justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer">처리 상태 저장</button>
                {message && (
                  <p className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#f3f7f2] text-[#477754] text-[16px]" role="status">
                    {message}
                  </p>
                )}
              </form>
            )}
          </section>
        )}
        <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
          <ButtonLink secondary to={`${base}/list`}>
            목록으로
          </ButtonLink>
          {admin && !inquiry && (
            <>
              <ButtonLink to={`${base}/modify/${id}`}>수정</ButtonLink>
              <button
                className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3] cursor-pointer"
                onClick={() => setConfirm(true)}
              >
                삭제
              </button>
            </>
          )}
        </div>
        {confirm && (
          <div className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#fff0ec] text-[#ac4326] text-[16px]">
            이 공지사항을 삭제할까요?
            <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
              <button
                className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer"
                onClick={() => {
                  setItems((v) => v.filter((x) => x.id !== id));
                  navigate(`${base}/list`);
                }}
              >
                삭제 확인
              </button>
              <button
                className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3] cursor-pointer"
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
