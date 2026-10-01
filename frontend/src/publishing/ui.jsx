import { Link, NavLink, useLocation } from "react-router";
import { classes, money, useStore } from "./data";
import "./publishing.css";

export function Art({ item, hero = false }) {
  return (
    <div
      className={`co-art ${hero ? "co-art-hero" : ""}`}
      style={{ background: item.color }}
    >
      <svg viewBox="0 0 400 260" role="img" aria-label={item.title}>
        <circle cx="330" cy="35" r="110" fill="#fff" opacity=".25" />
        <circle cx="40" cy="245" r="95" fill="#fff" opacity=".2" />
        <ellipse
          cx="200"
          cy="220"
          rx="125"
          ry="12"
          fill="#29231b"
          opacity=".12"
        />
        {item.art === "pottery" ? (
          <>
            <ellipse cx="200" cy="198" rx="93" ry="20" fill="#bd8d62" />
            <path
              d="M135 110 Q135 200 160 200 L240 200 Q265 190 265 110"
              fill="#c89e78"
            />
            <ellipse cx="200" cy="110" rx="65" ry="20" fill="#b9885e" />
            <ellipse cx="200" cy="110" rx="49" ry="11" fill="#72513c" />
            <path
              d="M267 126 Q314 118 298 160 Q286 178 257 169"
              fill="none"
              stroke="#c89e78"
              strokeWidth="15"
            />
            <path
              d="M156 145 Q197 158 246 145 M155 170 Q198 184 246 170"
              stroke="#e4bd97"
              strokeWidth="5"
              fill="none"
            />
          </>
        ) : item.art === "perfume" ? (
          <>
            <rect
              x="140"
              y="98"
              width="120"
              height="112"
              rx="16"
              fill="#faf7e5"
            />
            <rect
              x="156"
              y="132"
              width="88"
              height="60"
              rx="4"
              fill="#d5bc8a"
            />
            <rect x="172" y="77" width="56" height="24" fill="#444238" />
            <rect x="169" y="148" width="62" height="26" fill="#fffaf0" />
            <text
              x="200"
              y="166"
              textAnchor="middle"
              fontSize="12"
              fill="#74644e"
            >
              CLASS:ON
            </text>
            <path
              d="M293 194 Q278 125 312 71"
              stroke="#8b9569"
              strokeWidth="4"
              fill="none"
            />
            <ellipse
              cx="306"
              cy="109"
              rx="14"
              ry="30"
              fill="#87966a"
              transform="rotate(30 306 109)"
            />
          </>
        ) : item.art === "code" || item.art === "design" ? (
          <>
            <rect
              x="89"
              y="50"
              width="222"
              height="148"
              rx="10"
              fill="#373e49"
            />
            <rect
              x="100"
              y="62"
              width="200"
              height="124"
              rx="4"
              fill={item.art === "code" ? "#213847" : "#faf7ff"}
            />
            <path d="M75 198 H325 L340 210 H60 Z" fill="#8a939c" />
            {item.art === "code" ? (
              <>
                <path
                  d="M158 104 L132 125 L158 146 M242 104 L268 125 L242 146 M213 96 L187 155"
                  fill="none"
                  stroke="#85ccd9"
                  strokeWidth="7"
                />
              </>
            ) : (
              <>
                <rect
                  x="120"
                  y="80"
                  width="46"
                  height="86"
                  rx="5"
                  fill="#cab6e8"
                />
                <rect
                  x="176"
                  y="80"
                  width="104"
                  height="35"
                  rx="5"
                  fill="#f6af82"
                />
                <rect
                  x="176"
                  y="125"
                  width="46"
                  height="41"
                  rx="5"
                  fill="#b6d5d3"
                />
                <rect
                  x="232"
                  y="125"
                  width="48"
                  height="41"
                  rx="5"
                  fill="#e8d9ee"
                />
              </>
            )}
          </>
        ) : item.art === "paint" ? (
          <>
            <rect
              x="113"
              y="54"
              width="174"
              height="149"
              rx="3"
              fill="#fff9ef"
              transform="rotate(-8 200 130)"
            />
            <path
              d="M131 176 Q144 120 176 134 Q193 80 214 130 Q240 105 272 167Z"
              fill="#92a795"
            />
            <circle cx="240" cy="83" r="19" fill="#e3bc8d" />
            <path d="M97 196 L290 72" stroke="#8f6550" strokeWidth="8" />
            <path d="M284 76 L307 63 L301 86Z" fill="#73504b" />
          </>
        ) : (
          <>
            <ellipse cx="200" cy="157" rx="99" ry="56" fill="#fcf7ee" />
            <ellipse cx="200" cy="157" rx="82" ry="44" fill="#e8dcc7" />
            {[0, 1, 2, 3, 4].map((n) => (
              <g key={n}>
                <circle
                  cx={150 + (n % 3) * 49}
                  cy={132 + Math.floor(n / 3) * 47}
                  r="24"
                  fill="#c69051"
                />
                <circle
                  cx={143 + (n % 3) * 49}
                  cy={124 + Math.floor(n / 3) * 47}
                  r="3"
                  fill="#5e3e2c"
                />
                <circle
                  cx={157 + (n % 3) * 49}
                  cy={139 + Math.floor(n / 3) * 47}
                  r="4"
                  fill="#5e3e2c"
                />
              </g>
            ))}
          </>
        )}
      </svg>
    </div>
  );
}
export function ButtonLink({ to, children, secondary = false, ...props }) {
  return (
    <Link
      className={`co-button ${secondary ? "co-secondary" : ""}`}
      to={to}
      {...props}
    >
      {children}
    </Link>
  );
}
export function Heading({ title, description, action }) {
  return (
    <div className="co-heading">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function Empty({ children = "표시할 내역이 없습니다.", to, label }) {
  return (
    <div className="co-empty">
      <span aria-hidden="true">○</span>
      <p>{children}</p>
      {to && <ButtonLink to={to}>{label}</ButtonLink>}
    </div>
  );
}
export function Field({ label, children, ...props }) {
  return (
    <label className="co-field">
      <span>{label}</span>
      {children || <input {...props} />}
    </label>
  );
}
export function Card({ item, select, selected }) {
  const [favorites, setFavorites] = useStore("favorites", [1, 2]);
  const liked = favorites.includes(item.id);
  return (
    <article className="co-card">
      <Link to={`/class/${item.id}`}>
        <Art item={item} />
      </Link>
      <button
        className={`co-heart ${liked ? "is-liked" : ""}`}
        aria-label={`${item.title} ${liked ? "찜 해제" : "찜하기"}`}
        aria-pressed={liked}
        onClick={() =>
          setFavorites((v) =>
            liked ? v.filter((id) => id !== item.id) : [...v, item.id],
          )
        }
      >
        {liked ? "♥" : "♡"}
      </button>
      <div className="co-card-body">
        <span className="co-muted">
          {item.category} · {item.difficulty}
        </span>
        <Link to={`/class/${item.id}`}>
          <h3>{item.title}</h3>
        </Link>
        <p>
          {item.instructor} 강사{" "}
          <span className="co-star">★ {item.rating}</span>
        </p>
        <strong>{money(item.price)}</strong>
        {select && (
          <label className="co-check">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => select(item.id)}
            />{" "}
            비교 선택
          </label>
        )}
      </div>
    </article>
  );
}
const memberMenu = [
  ["/member/mypage", "내 정보"],
  ["/reservation/member/1", "예약 내역"],
  ["/payment/member/1", "결제 내역"],
  ["/member/favorites", "내가 찜한 클래스"],
  ["/member/reviews", "내가 작성한 후기"],
  ["/inquiry/list", "문의 및 신고 내역"],
];
const instructorMenu = [
  ["/instructor", "강사 대시보드"],
  ["/instructor/classes", "내 클래스 관리"],
  ["/instructor/schedules", "수업 일정 관리"],
  ["/reservation/instructor/1", "예약 회원 정보"],
  ["/instructor/reviews", "클래스 후기"],
  ["/instructor/mypage", "내 정보"],
];
const adminMenu = [
  ["/admin", "관리자 대시보드"],
  ["/admin/members", "회원 관리"],
  ["/admin/classes", "클래스 관리"],
  ["/admin/reviews", "후기 관리"],
  ["/admin/notice/list", "공지사항 관리"],
  ["/admin/inquiry/list", "문의 및 신고 관리"],
  ["/admin/reservations", "예약·결제 현황"],
];
export function Workspace({ kind = "member", children }) {
  const [role] = useStore("role", "PUBLIC");
  const menuKind = kind === "member" && role === "INS" ? "instructor" : kind;
  const groups =
    menuKind === "admin"
      ? [
          { title: "관리", items: adminMenu.slice(0, 4) },
          { title: "서비스 운영", items: adminMenu.slice(4) },
        ]
      : menuKind === "instructor"
        ? [
            {
              title: "강사 관리",
              items: instructorMenu.filter(
                ([to]) => to !== "/instructor/mypage",
              ),
            },
            {
              title: "내 계정",
              items: [
                ["/instructor/mypage", "내 정보"],
                ...memberMenu.filter(([to]) => to !== "/member/mypage"),
              ],
            },
          ]
        : [
            { title: "내 계정", items: memberMenu.slice(0, 1) },
            { title: "클래스 활동", items: memberMenu.slice(1, 5) },
            { title: "고객 지원", items: memberMenu.slice(5) },
          ];
  return (
    <div className="co-workspace">
      <aside className="co-sidebar">
        <h2>
          {menuKind === "admin"
            ? "관리자 메뉴"
            : menuKind === "instructor"
              ? "강사 메뉴"
              : "마이페이지"}
        </h2>
        {groups.map((group) => (
          <nav
            className="co-sidebar-group"
            aria-label={group.title}
            key={group.title}
          >
            <h3>{group.title}</h3>
            {group.items.map(([to, label]) => (
              <NavLink end key={to} to={to}>
                {label}
              </NavLink>
            ))}
          </nav>
        ))}
      </aside>
      <div className="co-workbody">{children}</div>
    </div>
  );
}
export function DemoBar() {
  const [role, setRole] = useStore("role", "PUBLIC");
  const location = useLocation();
  return (
    <div className="co-demo">
      <span>퍼블리싱 미리보기 · 예시 데이터</span>
      <label>
        화면 권한{" "}
        <select
          aria-label="미리보기 권한"
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            window.location.assign(location.pathname + location.search);
          }}
        >
          <option value="PUBLIC">비회원</option>
          <option value="USER">회원</option>
          <option value="INS">강사</option>
          <option value="ADMIN">관리자</option>
        </select>
      </label>
      <Link
        to={
          role === "ADMIN"
            ? "/admin"
            : role === "INS"
              ? "/instructor"
              : "/member/mypage"
        }
      >
        내 메뉴 →
      </Link>
    </div>
  );
}
export function ClassSummary({ reservation, list = classes }) {
  const item = list.find((c) => c.id === reservation.classId);
  return item ? (
    <div className="co-summary">
      <Art item={item} />
      <div>
        <span className="co-muted">
          {item.category} · {item.instructor} 강사
        </span>
        <h3>{item.title}</h3>
        <p>{money(item.price)} / 1인</p>
      </div>
    </div>
  ) : (
    <Empty>삭제된 클래스입니다.</Empty>
  );
}
