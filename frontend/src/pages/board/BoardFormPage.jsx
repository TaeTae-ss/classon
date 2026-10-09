
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import {
  getNotice,
  registerNotice,
  modifyNotice,
} from "../../api/noticeApi";

import { registerInquiry } from "../../api/inquiryApi";

import { ButtonLink } from "../../components/common/ButtonLink";
import { Heading } from "../../components/common/Heading";
import { Field } from "../../components/common/Field";
import { Empty } from "../../components/common/Empty";
import { Workspace } from "../../components/common/Workspace";

import {
  inquiryTypes,
  normalizeInquiryType,
} from "../../util/inquiryUtil";

export default function BoardFormPage({
  inquiry = false,
  edit = false,
}) {
  const { notNo } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // 공지사항 / 문의 공통 입력값
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 문의 유형 (현재 백엔드에는 유형 저장 컬럼이 없음)
  const [type, setType] = useState(
    normalizeInquiryType(params.get("type"))
  );

  // 로딩 및 저장 상태
  const [loading, setLoading] = useState(!inquiry && edit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 화면별 기본 경로
  const base = inquiry ? "/inquiry" : "/admin/notice";

  // 공지사항 수정 시 기존 데이터 조회
  useEffect(() => {
    if (inquiry || !edit || !notNo) {
      return;
    }

    const fetchNotice = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getNotice(notNo);

        setTitle(data?.notTitle ?? "");
        setContent(data?.notContent ?? "");

      } catch (err) {
        console.error("공지사항 조회 실패:", err);

        setError("공지사항을 찾을 수 없습니다.");

      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [inquiry, edit, notNo]);

  // 회원 문의 등록 (실제 DB 저장)
  const handleInquirySubmit = async () => {
    try {
      setSaving(true);
      setError("");

      const requestData = {
        inqTitle: title.trim(),
        inqContent: content.trim(),
      };

      // Spring Boot POST /api/inquiry
      const result = await registerInquiry(requestData);

      // 서버에서 생성한 문의 번호
      const createdInqNo = result?.inqNo;

      if (createdInqNo == null) {
        throw new Error("생성된 문의 번호가 없습니다.");
      }

      // 등록 성공 후 문의 상세 페이지로 이동
      navigate(`/inquiry/read/${createdInqNo}`);

    } catch (err) {
      console.error("문의 등록 실패:", err);

      if (err.response?.status === 401) {
        setError("로그인이 필요합니다.");

      } else if (err.response?.status === 403) {
        setError("문의 등록 권한이 없습니다.");

      } else if (err.response?.status === 400) {
        setError("제목과 내용을 확인해주세요.");

      } else {
        setError("문의 등록에 실패했습니다.");
      }

    } finally {
      setSaving(false);
    }
  };

  // 공지사항 등록 / 수정 (기존 API 유지)
  const handleNoticeSubmit = async () => {
    try {
      setSaving(true);
      setError("");

      const requestData = {
        notTitle: title.trim(),
        notContent: content.trim(),
      };

      // 공지사항 수정
      if (edit) {
        await modifyNotice(notNo, requestData);

        navigate(`/admin/notice/read/${notNo}`);
        return;
      }

      // 공지사항 등록
      const result = await registerNotice(requestData);

      const createdNotNo = result?.notNo;

      if (createdNotNo == null) {
        throw new Error("생성된 공지사항 번호가 없습니다.");
      }

      navigate(`/admin/notice/read/${createdNotNo}`);

    } catch (err) {
      console.error(
        edit ? "공지사항 수정 실패:" : "공지사항 등록 실패:",
        err
      );

      if (err.response?.status === 401) {
        setError("로그인이 필요합니다.");

      } else if (err.response?.status === 403) {
        setError("관리자 권한이 필요합니다.");

      } else {
        setError(
          edit
            ? "공지사항 수정에 실패했습니다."
            : "공지사항 등록에 실패했습니다."
        );
      }

    } finally {
      setSaving(false);
    }
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 중복 등록 방지
    if (saving) {
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해주세요.");
      return;
    }

    if (inquiry) {
      await handleInquirySubmit();
      return;
    }

    await handleNoticeSubmit();
  };

  // 공지사항 수정 로딩 화면
  if (loading) {
    return (
      <Workspace kind="admin">
        <p>공지사항을 불러오는 중입니다.</p>
      </Workspace>
    );
  }

  // 공지사항 수정 대상이 없는 경우
  if (!inquiry && edit && error) {
    return (
      <Workspace kind="admin">
        <Empty to={`${base}/list`} label="목록으로">
          {error}
        </Empty>
      </Workspace>
    );
  }

  return (
    <Workspace kind={inquiry ? "member" : "admin"}>
      <Heading
        title={
          inquiry
            ? "문의 작성"
            : edit
              ? "공지사항 수정"
              : "공지사항 등록"
        }
      />

      <form onSubmit={handleSubmit}>
        {/* 제목 */}
        <Field
          label="제목"
          required
          maxLength={inquiry ? 100 : 200}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요."
        />

        {/* 문의 유형 */}
        {inquiry && (
          <Field label="유형">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {inquiryTypes.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </Field>
        )}

        {/* 내용 */}
        <Field label="내용">
          <textarea
            required
            maxLength={inquiry ? 255 : 5000}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              inquiry
                ? "문의 내용을 입력해주세요."
                : "공지사항 내용을 입력해주세요."
            }
          />
        </Field>

        {/* 글자 수 */}
        <p>
          {content.length}/{inquiry ? 255 : 5000}
          {inquiry &&
            " · 문의할 대상과 내용을 구체적으로 적어주세요."}
        </p>

        {/* 오류 메시지 */}
        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        {/* 버튼 */}
        <div>
          <ButtonLink secondary to={`${base}/list`}>
            취소
          </ButtonLink>

          <button type="submit" disabled={saving}>
            {saving
              ? edit
                ? "수정 중..."
                : "등록 중..."
              : edit
                ? "수정 저장"
                : "등록"}
          </button>
        </div>
      </form>
    </Workspace>
  );
}
