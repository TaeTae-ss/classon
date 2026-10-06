export function Art({ item, hero = false, className = "" }) {
  return (
    <div
      className={`${
        hero
          ? "overflow-hidden h-full max-md:h-[252px]"
          : "overflow-hidden aspect-[400/260]"
      } ${className}`}
      style={{ background: item.color }}
    >
      <svg
        viewBox="0 0 400 260"
        role="img"
        aria-label={item.title}
        className={
          hero
            ? "w-full h-full block min-h-[372px] max-md:min-h-0"
            : "w-full h-full block"
        }
      >
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
