import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useStore, initialInquiries } from "../../mocks/data";
import { getNotice, deleteNotice } from "../../api/noticeApi";
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

  // 문의는 아직 기존 mock 데이터 사용
  const [inquiryItems, setInquiryItems] = useStore(
    "inquiries",
    initialInquiries,
  );

  // 공지사항은 실제 API 데이터 사용
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(!inquiry);
  const [error, setError] = useState("");

  const inquiryItem = inquiryItems.find(
    (x) => x.id === id && (admin || x.memberId === 1),
  );

  const item = inquiry ? inquiryItem : notice;

  const [status, setStatus] = useState(
    inquiryItem?.status || "RECEIVED",
  );
  const [answer, setAnswer] = useState(
    inquiryItem?.answer || "",
  );

  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const base = admin
    ? inquiry
      ? "/admin/inquiry"
      : "/admin/notice"
    : inquiry
      ? "/inquiry"
      : "/notice";

  // 공지사항 상세조회
  useEffect(() => {
    if (inquiry) {
      return;
    }

    const fetchNotice = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getNotice(id);

        setNotice(data);
      } catch (err) {
        console.error("공지사항 상세조회 실패:", err);
        setError("공지사항을 찾을 수 없습니다.");
        setNotice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id, inquiry]);

  // 공지사항 삭제
  const handleDeleteNotice = async () => {
    try {
      setDeleting(true);
      setError("");

      await deleteNotice(id);

      navigate(`${base}/list`);
    } catch (err) {
      console.error("공지사항 삭제 실패:", err);
      setError("공지사항 삭제에 실패했습니다.");
      setConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading && !inquiry) {
    return (
      <p className="text-center py-10 text-[#85888d]">
        공지사항을 불러오는 중입니다.
      </p>
    );
  }

  if (!item) {
    return (
      <Empty to={`${base}/list`} label="목록으로">
        {error || "내용을 찾을 수 없습니다."}
      </Empty>
    );
  }

  // Notice와 Inquiry의 서로 다른 필드명 처리
  const title = inquiry ? item.title : item.notTitle;
  const content = inquiry ? item.content : item.notContent;

  const date = inquiry
    ? item.date
    : item.notCreatedAt
      ? new Date(item.notCreatedAt).toLocaleString("ko-KR")
      : "-";

  const body = (
    <>
      <Heading
        title={inquiry ? "문의 및 신고 상세" : "공지사항 상세"}
      />

      <article className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
        <h2>{title}</h2>

        <p className="text-right text-[14px] text-[#85888d]">
          {date}
          {inquiry &&
            ` · ${item.type} · ${statusNames[item.status]}`}
        </p>

        <div className="min-h-[264px] whitespace-pre-wrap py-[29px] leading-[2]">
          {content}
        </div>

        {inquiry && (
          <section
            style={{
              borderTop: "1px solid #eee",
              paddingTop: 20,
            }}
          >
            <h3>관리자 답변</h3>

            <p style={{ whiteSpace: "pre-wrap" }}>
              {item.answer || "아직 답변이 등록되지 않았습니다."}
            </p>

            {admin && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  setInquiryItems((v) =>
                    v.map((x) =>
                      x.id === id
                        ? {
                            ...x,
                            status,
                            answer,
                            completedAt:
                              status === "COMPLETED"
                                ? "2026-10-01"
                                : null,
                          }
                        : x,
                    ),
                  );

                  setMessage(
                    "처리 상태와 답변을 저장했습니다.",
                  );
                }}
              >
                <Field label="처리 상태">
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value)
                    }
                  >
                    {Object.entries(statusNames).map(
                      ([value, label]) => (
                        <option
                          key={value}
                          value={value}
                        >
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                </Field>

                <Field label="관리자 코멘트">
                  <textarea
                    required={status === "COMPLETED"}
                    value={answer}
                    onChange={(e) =>
                      setAnswer(e.target.value)
                    }
                    placeholder="답변을 입력해주세요."
                  />
                </Field>

                <button className="flex w-fit max-w-full ml-auto justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer">
                  처리 상태 저장
                </button>

                {message && (
                  <p
                    className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#f3f7f2] text-[#477754] text-[16px]"
                    role="status"
                  >
                    {message}
                  </p>
                )}
              </form>
            )}
          </section>
        )}

        {error && (
          <p
            className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#fff0ec] text-[#ac4326] text-[16px]"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
          <ButtonLink secondary to={`${base}/list`}>
            목록으로
          </ButtonLink>

          {admin && !inquiry && (
            <>
              <ButtonLink to={`${base}/modify/${id}`}>
                수정
              </ButtonLink>

              <button
                className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3] cursor-pointer"
                onClick={() => setConfirm(true)}
              >
                삭제
              </button>
            </>
          )}
        </div>

        {confirm && admin && !inquiry && (
          <div className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#fff0ec] text-[#ac4326] text-[16px]">
            이 공지사항을 삭제할까요?

            <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
              <button
                className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-50"
                disabled={deleting}
                onClick={handleDeleteNotice}
              >
                {deleting ? "삭제 중..." : "삭제 확인"}
              </button>

              <button
                className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3] cursor-pointer"
                disabled={deleting}
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