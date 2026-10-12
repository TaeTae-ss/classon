import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  useStore,
  initialInquiries,
  initialProfile,
} from "../../mocks/data";

import {
  getNotice,
  registerNotice,
  modifyNotice,
} from "../../api/noticeApi";

import { ButtonLink } from "../../components/common/ButtonLink";
import { Heading } from "../../components/common/Heading";
import { Field } from "../../components/common/Field";
import { Empty } from "../../components/common/Empty";
import { Workspace } from "../../components/common/Workspace";

export default function BoardFormPage({
  inquiry = false,
  edit = false,
}) {
  const { notNo } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // 문의는 아직 기존 mock/localStorage 사용
  const [inquiryItems, setInquiryItems] = useStore(
    "inquiries",
    initialInquiries,
  );

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState(
    params.get("type") || "문의",
  );

  const [loading, setLoading] = useState(
    !inquiry && edit,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const base = inquiry
    ? "/inquiry"
    : "/admin/notice";

  // 공지사항 수정 화면 진입 시 실제 DB 데이터 조회
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
        console.error(
          "공지사항 조회 실패:",
          err,
        );

        setError(
          "공지사항을 찾을 수 없습니다.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [inquiry, edit, notNo]);

  // 문의 등록은 기존 방식 유지
  const handleInquirySubmit = () => {
    const id = Date.now();

    const record = {
      id,
      title: title.trim(),
      content: content.trim(),
      date: new Date().toLocaleDateString(
        "ko-KR",
      ),
      type,
      memberId: initialProfile.id,
      status: "RECEIVED",
      answer: "",
      target: params.get("target"),
    };

    setInquiryItems((items) => [
      ...items,
      record,
    ]);

    navigate(`${base}/read/${id}`);
  };

  // 공지사항 등록/수정
  const handleNoticeSubmit = async () => {
    try {
      setSaving(true);
      setError("");

      const requestData = {
        notTitle: title.trim(),
        notContent: content.trim(),
      };

      if (edit) {
        await modifyNotice(
          notNo,
          requestData,
        );

        navigate(
          `/admin/notice/read/${notNo}`,
        );

        return;
      }

      const result =
        await registerNotice(requestData);

      const createdNotNo = result?.notNo;

      if (!createdNotNo) {
        throw new Error(
          "생성된 공지사항 번호가 없습니다.",
        );
      }

      navigate(
        `/admin/notice/read/${createdNotNo}`,
      );
    } catch (err) {
      console.error(
        edit
          ? "공지사항 수정 실패:"
          : "공지사항 등록 실패:",
        err,
      );

      if (err.response?.status === 401) {
        setError(
          "로그인이 필요합니다.",
        );
      } else if (
        err.response?.status === 403
      ) {
        setError(
          "관리자 권한이 필요합니다.",
        );
      } else {
        setError(
          edit
            ? "공지사항 수정에 실패했습니다."
            : "공지사항 등록에 실패했습니다.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !content.trim()
    ) {
      return;
    }

    if (inquiry) {
      handleInquirySubmit();
      return;
    }

    await handleNoticeSubmit();
  };

  if (loading) {
    return (
      <Workspace kind="admin">
        <p className="text-center py-10 text-[#85888d]">
          공지사항을 불러오는 중입니다.
        </p>
      </Workspace>
    );
  }

  if (!inquiry && edit && error) {
    return (
      <Workspace kind="admin">
        <Empty
          to={`${base}/list`}
          label="목록으로"
        >
          {error}
        </Empty>
      </Workspace>
    );
  }

  return (
    <Workspace
      kind={
        inquiry ? "member" : "admin"
      }
    >
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
        className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]"
        onSubmit={handleSubmit}
      >
        <Field
          label="제목"
          required
          maxLength={200}
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="제목을 입력해주세요."
        />

        {inquiry && (
          <Field label="유형">
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
            >
              {[
                "문의",
                "클래스 신고",
                "후기 신고",
              ].map((value) => (
                <option
                  key={value}
                  value={value}
                >
                  {value}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="내용">
          <textarea
            required
            maxLength={5000}
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            placeholder={
              inquiry
                ? "문의 또는 신고 내용을 입력해주세요."
                : "공지사항 내용을 입력해주세요."
            }
          />
        </Field>

        <p className="text-[13px] leading-[1.8] text-[#999]">
          {content.length}/5000
          {inquiry &&
            " · 문의할 대상과 내용을 구체적으로 적어주세요."}
        </p>

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
            취소
          </ButtonLink>

          <button
            disabled={saving}
            className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-50"
          >
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