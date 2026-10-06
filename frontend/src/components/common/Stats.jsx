export function Stats({ items }) {
  return (
    <div
      className={`grid gap-[17px] my-[29px] grid-cols-4 max-[900px]:grid-cols-2 max-[420px]:gap-3 ${items.length === 3 ? "min-[901px]:grid-cols-3" : ""}`}
    >
      {items.map(([label, value]) => (
        <div className="bg-white border border-[#eee5db] rounded-[10px] p-6 max-[420px]:p-[18px]" key={label}>
          <span className="text-[14px] text-[#888]">{label}</span>
          <strong className="block text-[31px] mt-[10px]">{value}</strong>
        </div>
      ))}
    </div>
  );
}
