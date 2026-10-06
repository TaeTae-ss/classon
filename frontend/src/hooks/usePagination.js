import { useState } from "react";

export function usePagination(items, size = 8) {
  const [selection, setSelection] = useState({ key: "", page: 1 });
  const key = items.map((item) => item.id).join(",");
  const pages = Math.max(1, Math.ceil(items.length / size));
  const page = selection.key === key ? Math.min(selection.page, pages) : 1;
  return {
    items: items.slice((page - 1) * size, page * size),
    page,
    pages,
    onChange: (next) => setSelection({ key, page: next }),
  };
}

