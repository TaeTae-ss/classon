export default function Pagination({ page = 1, pages = 1, onChange }) {
  const start = Math.floor((page - 1) / 5) * 5 + 1;
  const end = Math.min(start + 4, pages);
  const numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return (
    <nav className="co-pagination" aria-label="목록 페이지 이동">
      <button className="co-pagination-move" type="button" aria-label="이전 5페이지 묶음" disabled={start === 1} onClick={() => onChange(Math.max(1, start - 5))}>‹ 이전</button>
      {numbers.map((number) => (
        <button type="button" key={number} className={page === number ? "is-active" : ""} aria-current={page === number ? "page" : undefined} aria-label={number + "페이지"} onClick={() => onChange(number)}>{number}</button>
      ))}
      <button className="co-pagination-move" type="button" aria-label="다음 5페이지 묶음" disabled={end === pages} onClick={() => onChange(start + 5)}>다음 ›</button>
    </nav>
  );
}
