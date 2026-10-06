export function Field({ label, children, ...props }) {
  return (
    <label className="flex flex-col gap-[10px] mb-[22px] font-bold">
      <span className="text-[16px]">{label}</span>
      {children || <input {...props} />}
    </label>
  );
}
