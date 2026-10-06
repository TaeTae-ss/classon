const baseButton =
  "inline-flex items-center justify-center cursor-pointer flex-none min-w-[32px] h-8 rounded-none text-[13px] hover:bg-transparent hover:border-transparent hover:text-brand hover:underline disabled:opacity-40 disabled:cursor-default focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2";

export default function Pagination({ page = 1, pages = 1, onChange }) {
  const start = Math.floor((page - 1) / 5) * 5 + 1;
  const end = Math.min(start + 4, pages);
  const numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return (
    <nav
      className="flex items-center justify-center flex-wrap w-full gap-1 py-4 mt-6 mb-3"
      aria-label="목록 페이지 이동"
    >
      <button
        className={`${baseButton} mx-2 px-[10px] bg-transparent border border-transparent text-[#333] font-normal`}
        type="button"
        aria-label="이전 5페이지 묶음"
        disabled={start === 1}
        onClick={() => onChange(Math.max(1, start - 5))}
      >
        ‹ 이전
      </button>
      {numbers.map((number) => (
        <button
          type="button"
          key={number}
          className={`${baseButton} px-2 ${page === number ? "bg-white border-none text-brand font-bold" : "bg-transparent border border-transparent text-[#333] font-normal"}`}
          aria-current={page === number ? "page" : undefined}
          aria-label={number + "페이지"}
          onClick={() => onChange(number)}
        >
          {number}
        </button>
      ))}
      <button
        className={`${baseButton} mx-2 px-[10px] bg-transparent border border-transparent text-[#333] font-normal`}
        type="button"
        aria-label="다음 5페이지 묶음"
        disabled={end === pages}
        onClick={() => onChange(start + 5)}
      >
        다음 ›
      </button>
    </nav>
  );
}
