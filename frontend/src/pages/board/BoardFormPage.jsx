import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useStore, initialNotices, initialInquiries, initialProfile } from "../../mocks/data";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Heading } from "../../components/common/Heading";
import { Field } from "../../components/common/Field";
import { Empty } from "../../components/common/Empty";
import { Workspace } from "../../components/common/Workspace";

export default function BoardFormPage({ inquiry = false, edit = false }) {
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
        className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]"
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
        <p className="text-[13px] leading-[1.8] text-[#999]">
          {content.length}/5000
          {inquiry && " · 문의할 대상과 내용을 구체적으로 적어주세요."}
        </p>
        <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
          <ButtonLink secondary to={`${base}/list`}>
            취소
          </ButtonLink>
          <button className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer">{edit ? "수정 저장" : "등록"}</button>
        </div>
      </form>
    </Workspace>
  );
}
