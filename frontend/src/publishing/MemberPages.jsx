import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { loginPost } from "../api/memberApi";
import { setCookie } from "../util/cookieUtil";
import { initialProfile, useStore } from "./data";
import { ButtonLink, Heading, Field, Workspace } from "./ui";

export function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [, setRole] = useStore("role", "PUBLIC");
  const destination = params.get("returnTo");
  const go = (role) => {
    setRole(role);
    navigate(
      destination?.startsWith("/") && !destination.startsWith("//")
        ? destination
        : role === "ADMIN"
          ? "/admin"
          : role === "INS"
            ? "/instructor"
            : "/member/mypage",
    );
  };
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await loginPost({
        memEmail: email,
        memPassword: password,
      });
      setCookie("member", { ...result }, 1);
      go(
        result.memRole === "ADMIN"
          ? "ADMIN"
          : ["INS", "INSTRUCTOR"].includes(result.memRole)
            ? "INS"
            : "USER",
      );
    } catch {
      setError(
        "로그인에 실패했습니다. 이메일·비밀번호 또는 서버 연결 상태를 확인해주세요.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="co-narrow">
      <section className="co-panel">
        <div className="co-login-heading">
          <Heading
            title="로그인"
            description="다양한 배움과 새로운 취미를 함께해요."
          />
        </div>
        <form onSubmit={submit}>
          <Field
            label="이메일"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요."
          />
          <Field
            label="비밀번호"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요."
          />
          {error && (
            <p className="co-notice co-error" role="alert">
              {error}
            </p>
          )}
          <button disabled={busy} className="co-button co-full">
            {busy ? "로그인 중…" : "로그인"}
          </button>
        </form>
      </section>
    </div>
  );
}
export function SignupPage() {
  const navigate = useNavigate();
  const [, setProfile] = useStore("profile", initialProfile);
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    phone: "",
    birth: "",
    address: "",
    detail: "",
    password: "",
    confirm: "",
    code: "",
  });
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [checked, setChecked] = useState(false);
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState("");
  const field = (key, label, type = "text", extra = {}) => (
    <Field
      label={label}
      type={type}
      required
      value={form[key]}
      onChange={(e) => {
        setForm({ ...form, [key]: e.target.value });
        if (key === "email") {
          setSent(false);
          setVerified(false);
        }
        if (key === "nickname") setChecked(false);
      }}
      {...extra}
    />
  );
  const submit = (e) => {
    e.preventDefault();
    if (!verified || !checked) {
      setMessage("이메일 인증과 닉네임 중복확인을 완료해주세요.");
      return;
    }
    if (form.password !== form.confirm) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!agree) return;
    const {
      password: ignored,
      confirm: ignoredConfirm,
      code: ignoredCode,
      ...profile
    } = form;
    void ignored;
    void ignoredConfirm;
    void ignoredCode;
    setProfile({ id: 1, ...profile });
    navigate("/auth/login");
  };
  return (
    <div className="co-narrow">
      <Heading
        title="회원가입"
        description="지금, 새로운 배움의 여정을 시작해보세요."
      />
      <form className="co-panel" onSubmit={submit}>
        <p className="co-tiny">
          미리보기에서는 예시 프로필만 저장합니다. 실제 회원가입과 이메일 발송은
          수행하지 않습니다.
        </p>
        {field("email", "이메일", "email")}
        <button
          type="button"
          className="co-button co-secondary"
          disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)}
          onClick={() => {
            setSent(true);
            setMessage(
              "미리보기 인증번호는 123456입니다. 이메일은 발송되지 않습니다.",
            );
          }}
        >
          인증번호 받기
        </button>
        {sent && (
          <>
            <div style={{ marginTop: 15 }}>
              {field("code", "인증번호", "text", { maxLength: 6 })}
            </div>
            <button
              type="button"
              className="co-button co-secondary"
              onClick={() => {
                setVerified(form.code === "123456");
                setMessage(
                  form.code === "123456"
                    ? "예시 이메일 인증을 완료했습니다."
                    : "인증번호를 확인해주세요.",
                );
              }}
            >
              인증 확인
            </button>
          </>
        )}
        <div style={{ marginTop: 20 }}>
          {field("password", "비밀번호", "password", {
            minLength: 8,
            autoComplete: "new-password",
          })}
          {field("confirm", "비밀번호 확인", "password", {
            minLength: 8,
            autoComplete: "new-password",
          })}
          {field("nickname", "닉네임", "text", { minLength: 2 })}
          <button
            type="button"
            className="co-button co-secondary"
            onClick={() => {
              const valid =
                form.nickname.trim().length >= 2 &&
                !["관리자", "admin"].includes(
                  form.nickname.trim().toLowerCase(),
                );
              setChecked(valid);
              setMessage(
                valid
                  ? "미리보기에서 사용할 수 있는 닉네임입니다."
                  : "닉네임은 2자 이상이며 관리자 이름은 사용할 수 없습니다.",
              );
            }}
          >
            중복확인
          </button>
          <div style={{ marginTop: 20 }}>
            {field("phone", "전화번호", "tel", { pattern: "[0-9-]{9,13}" })}
            {field("birth", "생년월일", "date", { max: "2026-10-01" })}
            {field("address", "도로명 주소")}
            {field("detail", "상세 주소")}
          </div>
          <label className="co-check">
            <input
              required
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />{" "}
            서비스 이용약관과 개인정보 처리에 동의합니다.
          </label>
          {message && (
            <p className="co-notice" role="status">
              {message}
            </p>
          )}
          <button className="co-button co-full" style={{ marginTop: 20 }}>
            회원가입 화면 완료
          </button>
        </div>
      </form>
    </div>
  );
}
export function MyPage({ instructor = false, edit = false }) {
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
      <section className="co-panel">
        <div className="co-profile">
          <div className="co-avatar">{profile.nickname[0]}</div>
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
            <div className="co-inline-form">
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
            <div className="co-actions">
              <button className="co-button">수정 저장</button>
              <ButtonLink secondary to={base}>
                취소
              </ButtonLink>
            </div>
          </form>
        ) : (
          <>
            <dl className="co-details">
              {[
                ["이메일", profile.email],
                ["전화번호", profile.phone],
                ["생년월일", profile.birth],
                ["주소", `${profile.address} ${profile.detail}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "contents" }}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <ButtonLink to={`${base}/edit`}>내 정보 수정</ButtonLink>
          </>
        )}
      </section>
      {!isInstructor && !edit && (
        <section className="co-panel">
          <Heading
            title="강사 신청"
            description="당신의 경험을 새로운 배움으로 나눠주세요."
          />
          {request ? (
            <>
              <span className="co-badge">{request.status}</span>
              <p style={{ marginTop: 14 }}>신청일: {request.date}</p>
              <p>{request.bio}</p>
              <p>{request.files.join(", ")}</p>
              <button
                className="co-button co-secondary"
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
              <p className="co-tiny">
                미리보기에는 파일 이름만 보관하며 파일을 업로드하지 않습니다.
              </p>
              <div className="co-actions">
                <button className="co-button">신청 화면 완료</button>
                <button
                  type="button"
                  className="co-button co-secondary"
                  onClick={() => setApplying(false)}
                >
                  취소
                </button>
              </div>
            </form>
          ) : (
            <button
              className="co-button co-secondary"
              onClick={() => setApplying(true)}
            >
              강사 신청하기
            </button>
          )}
        </section>
      )}
      {message && (
        <p className="co-notice" role="status">
          {message}
        </p>
      )}
      <button
        className="co-text-button co-danger"
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
