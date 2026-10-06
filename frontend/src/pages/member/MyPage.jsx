import { useState } from "react";
import { useNavigate } from "react-router";
import { initialProfile, useStore } from "../../mocks/data";
import { ButtonLink } from "../../components/common/ButtonLink";
import { Heading } from "../../components/common/Heading";
import { Field } from "../../components/common/Field";
import { Workspace } from "../../components/common/Workspace";

export default function MyPage({ instructor = false, edit = false }) {
  const navigate = useNavigate();
  const [role] = useStore("role", "PUBLIC");
  const isInstructor = instructor || role === "INS";
  const [profile, setProfile] = useStore("profile", initialProfile);
  const [form, setForm] = useState(profile);
  const [message, setMessage] = useState("");
  const [request, setRequest] = useStore("instructorRequest", null);
  const [applying, setApplying] = useState(false);
  const [bio, setBio] = useState("");
  const [files, setFiles] = useState([]);
  const base = isInstructor ? "/instructor/mypage" : "/member/mypage";
  return (
    <Workspace kind={isInstructor ? "instructor" : "member"}>
      <Heading
        title={
          edit
            ? "내 정보 수정"
            : isInstructor
              ? "강사 마이페이지"
              : "마이페이지"
        }
        description="내 정보를 확인하고 클래스 활동을 관리하세요."
      />
      <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
        <div className="flex items-center gap-[22px] mb-[29px]">
          <div className="w-[84px] h-[84px] rounded-full bg-[#ffead5] text-[#ee7c1e] grid place-items-center text-[31px]">
            {profile.nickname[0]}
          </div>
          <div>
            <h3>{profile.nickname}</h3>
            <p>
              {isInstructor ? "강사" : "회원"} · {profile.email}
            </p>
          </div>
        </div>
        {edit ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setProfile(form);
              navigate(base);
            }}
          >
            <div className="grid grid-cols-2 gap-x-[19px] gap-y-0 max-md:grid-cols-1">
              {[
                ["email", "이메일 (변경 불가)", "email"],
                ["nickname", "닉네임", "text"],
                ["phone", "전화번호", "tel"],
                ["birth", "생년월일", "date"],
                ["address", "주소", "text"],
                ["detail", "상세 주소", "text"],
              ].map(([key, label, type]) => (
                <Field
                  key={key}
                  label={label}
                  type={type}
                  required
                  disabled={key === "email"}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              ))}
            </div>
            <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
              <button className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed">
                수정 저장
              </button>
              <ButtonLink secondary to={base}>
                취소
              </ButtonLink>
            </div>
          </form>
        ) : (
          <>
            <dl className="grid grid-cols-[150px_1fr] gap-[17px] my-[26px] max-md:grid-cols-[120px_1fr] max-[420px]:grid-cols-[100px_minmax(0,1fr)]">
              {[
                ["이메일", profile.email],
                ["전화번호", profile.phone],
                ["생년월일", profile.birth],
                ["주소", `${profile.address} ${profile.detail}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "contents" }}>
                  <dt className="text-[#888]">{k}</dt>
                  <dd className="m-0 font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <ButtonLink to={`${base}/edit`}>내 정보 수정</ButtonLink>
          </>
        )}
      </section>
      {!isInstructor && !edit && (
        <section className="bg-white border border-[#ebe6e0] rounded-xl p-[31px] mb-[26px] max-md:p-[23px]">
          <Heading
            title="강사 신청"
            description="당신의 경험을 새로운 배움으로 나눠주세요."
          />
          {request ? (
            <>
              <span className="inline-block px-3 py-[3px] rounded-[24px] bg-[#fff0df] text-[#df700e] text-[13px] font-bold">
                {request.status}
              </span>
              <p style={{ marginTop: 14 }}>신청일: {request.date}</p>
              <p>{request.bio}</p>
              <p>{request.files.join(", ")}</p>
              <button
                className="flex w-fit max-w-full ml-auto justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                onClick={() => setRequest(null)}
              >
                신청 취소
              </button>
            </>
          ) : applying ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setRequest({
                  bio,
                  files: files.map((f) => f.name),
                  date: "2026-10-01",
                  status: "관리자 검토 중",
                });
                setApplying(false);
              }}
            >
              <Field label="강사 소개 및 경력">
                <textarea
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="경력 및 활동 이력을 적어주세요."
                />
              </Field>
              <Field label="자격 및 경력 증명 서류">
                <input
                  required
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                />
              </Field>
              <p className="text-[13px] leading-[1.8] text-[#999]">
                미리보기에는 파일 이름만 보관하며 파일을 업로드하지 않습니다.
              </p>
              <div className="flex gap-3 items-center flex-wrap mt-[29px] justify-end">
                <button className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-accent text-white border border-accent font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed">
                  신청 화면 완료
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                  onClick={() => setApplying(false)}
                >
                  취소
                </button>
              </div>
            </form>
          ) : (
            <button
              className="flex w-fit max-w-full ml-auto justify-center items-center gap-[7px] min-h-[50px] px-[26px] py-3 rounded-lg bg-white text-[#e56b00] border border-[#edddcf] font-bold text-[17px] leading-[1.3] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
              onClick={() => setApplying(true)}
            >
              강사 신청하기
            </button>
          )}
        </section>
      )}
      {message && (
        <p
          className="px-[17px] py-[13px] my-[18px] rounded-[7px] bg-[#f3f7f2] text-[#477754] text-[16px]"
          role="status"
        >
          {message}
        </p>
      )}
      <button
        className="bg-transparent border-0 p-[7px] text-[#b75b46]!"
        onClick={() =>
          setMessage(
            "회원 탈퇴는 실제 계정과 예약·환불 상태 확인이 필요하므로 미리보기에서 처리하지 않습니다.",
          )
        }
      >
        회원 탈퇴 안내
      </button>
    </Workspace>
  );
}
