export function Heading({ title, description, action, center = false }) {
  return (
    <div
      className={`flex items-center justify-between gap-[19px] my-[30px] max-md:items-start ${center ? "justify-center text-center" : ""}`}
    >
      <div className={center ? "w-full" : undefined}>
        <h1>{title}</h1>
        {description && <p className="mb-0">{description}</p>}
      </div>
      {action}
    </div>
  );
}
