
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { getNotice, deleteNotice } from "../../api/noticeApi";

import {
  getInquiry,
  getAdminInquiry,
  modifyInquiryStatus,
  modifyInquiryComment,
} from "../../api/inquiryApi";

import { ButtonLink } from "../../components/common/ButtonLink";
import { Heading } from "../../components/common/Heading";
import { Field } from "../../components/common/Field";
import { Empty } from "../../components/common/Empty";
import { Workspace } from "../../components/common/Workspace";

// DB에 저장되는 상태값과 화면 표시값
const statusNames = {
  RECEIVED: "접수",
  PROCESSING: "처리 중",
  COMPLETED: "처리 완료",
  접수: "접수",
  처리중: "처리 중",
  완료: "처리 완료",
};

export default function BoardReadPage({
  inquiry = false,
  admin = false,
}) {
  const params = useParams();

  const id = Number(
    params.notNo ??
      params.inqNo ??
      params.repNo ??
      params.id
  );

  const navigate = useNavigate();

  // 공지사항 데이터
  const [notice, setNotice] = useState(null);

  // 회원/관리자 문의 상세 데이터
  const [inquiryDetail, setInquiryDetail] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 관리자 문의 처리 상태 및 답변
  const [status, setStatus] = useState("접수");
  const [answer, setAnswer] = useState("");

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // 공지사항 삭제 관련
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const base = admin
    ? inquiry
      ? "/admin/inquiry"
      : "/admin/notice"
    : inquiry
      ? "/inquiry"
      : "/notice";

  // 실제 API 데이터 사용
  const item = inquiry ? inquiryDetail : notice;

  // 공지사항 상세 조회
  useEffect(() => {
    if (inquiry) return;

    const fetchNotice = async () => {
      try {
        setLoading(true);
        setError("");
        setNotice(null);

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

  // 회원 문의 상세 조회
  useEffect(() => {
    if (!inquiry || admin) return;

    const fetchInquiry = async () => {
      try {
        setLoading(true);
        setError("");
        setInquiryDetail(null);

        const data = await getInquiry(id);

        setInquiryDetail(data);
      } catch (err) {
        console.error("회원 문의 상세조회 실패:", err);
        setError("문의 내용을 불러오지 못했습니다.");
        setInquiryDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiry();
  }, [id, inquiry, admin]);

  // 관리자 문의 상세 조회
  useEffect(() => {
    if (!inquiry || !admin) return;

    const fetchAdminInquiry = async () => {
      try {
        setLoading(true);
        setError("");
        setInquiryDetail(null);

        const data = await getAdminInquiry(id);

        setInquiryDetail(data);

        // DB 상태값 사용
        setStatus(data.inqStatus || "접수");
        setAnswer(data.admComment || "");
      } catch (err) {
        console.error("관리자 문의 상세조회 실패:", err);
        setError("관리자 문의 내용을 불러오지 못했습니다.");
        setInquiryDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminInquiry();
  }, [id, inquiry, admin]);

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

  // 관리자 문의 상태 및 답변 저장
  const handleSaveInquiry = async (e) => {
    e.preventDefault();

    if (!inquiry || !admin) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      // 1. 처리 상태 변경
      await modifyInquiryStatus(id, status);

      // 2. 관리자 답변 등록/수정
      await modifyInquiryComment(id, answer);

      // 3. 저장 후 실제 DB 데이터 재조회
      const updated = await getAdminInquiry(id);

      setInquiryDetail(updated);
      setStatus(updated.inqStatus || "접수");
      setAnswer(updated.admComment || "");

      setMessage("처리 상태와 답변을 저장했습니다.");
    } catch (err) {
      console.error("관리자 문의 저장 실패:", err);
      setError(
        "처리 상태 또는 관리자 답변 저장에 실패했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  // 로딩 화면
  if (loading) {
    return (
      <p className="text-center py-10 text-[#85888d]">
        {inquiry
          ? "문의 내용을 불러오는 중입니다."
          : "공지사항을 불러오는 중입니다."}
      </p>
    );
  }

  // 데이터가 없는 경우
  if (!item) {
    return (
      <Empty to={`${base}/list`} label="목록으로">
        {error || "내용을 찾을 수 없습니다."}
      </Empty>
    );
  }

  // 공지사항/문의 필드명 구분
  const title = inquiry
    ? item.inqTitle
    : item.notTitle;

  const content = inquiry
    ? item.inqContent
    : item.notContent;

  const createdAt = inquiry
    ? item.inqCreatedAt
    : item.notCreatedAt;

  const date = createdAt
    ? new Date(createdAt).toLocaleString("ko-KR")
    : "-";

  const inquiryStatus = inquiry
    ? statusNames[item.inqStatus] ||
      item.inqStatus ||
      "-"
    : "";

  const body = (
    <>
      <Heading
        title={inquiry ? "문의 상세" : "공지사항 상세"}
      />

      <article className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
        <h2>{title}</h2>

        <p className="text-right text-[14px] text-[#85888d]">
          {date}
          {inquiry && ` · ${inquiryStatus}`}
        </p>

        <div className="min-h-[264px] whitespace-pre-wrap py-[29px] leading-[2]">
          {content}
        </div>

        {/* 문의 관리자 답변 */}
        {inquiry && (
          <section
            style={{
              borderTop: "1px solid #eee",
              paddingTop: 20,
            }}
          >
            <h3>관리자 답변</h3>

            <p style={{ whiteSpace: "pre-wrap" }}>
              {item.admComment ||
                "아직 답변이 등록되지 않았습니다."}
            </p>

            {/* 관리자만 상태 및 답변 수정 가능 */}
            {admin && (
              <form onSubmit={handleSaveInquiry}>
                <Field label="처리 상태">
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value)
                    }
                  >
                    <option value="접수">접수</option>
                    <option value="처리중">처리 중</option>
                    <option value="완료">처리 완료</option>
                  </select>
                </Field>

                <Field label="관리자 코멘트">
                  <textarea
                    required={status === "완료"}
                    value={answer}
                    onChange={(e) =>
                      setAnswer(e.target.value)
                    }
                    placeholder="답변을 입력해주세요."
                  />
                </Field>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-fit max-w-full ml-auto justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-50"
                >
                  {saving
                    ? "저장 중..."
                    : "처리 상태 저장"}
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

        {/* 오류 메시지 */}
        {error && (
          <p
            className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#fff0ec] text-[#ac4326] text-[16px]"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
          <ButtonLink
            secondary
            to={`${base}/list`}
          >
            목록으로
          </ButtonLink>

          {/* 관리자 공지사항 수정 및 삭제 */}
          {admin && !inquiry && (
            <>
              <ButtonLink
                to={`${base}/modify/${id}`}
              >
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

        {/* 공지사항 삭제 확인 */}
        {confirm && admin && !inquiry && (
          <div className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#fff0ec] text-[#ac4326] text-[16px]">
            이 공지사항을 삭제할까요?

            <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
              <button
                className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-50"
                disabled={deleting}
                onClick={handleDeleteNotice}
              >
                {deleting
                  ? "삭제 중..."
                  : "삭제 확인"}
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
