// Huy hiệu tick hiển thị cạnh tên người dùng ở mọi nơi
export type TickColor = "blue" | "gold" | "pink" | "red";

const styles: Record<TickColor, string> = {
  blue: "bg-tick-blue",
  gold: "bg-tick-gold",
  pink: "bg-tick-pink",
  red: "bg-tick-red",
};

const defaultLabels: Record<TickColor, string> = {
  blue: "Giáo viên – đã xác minh",
  gold: "Hiệu trưởng – đã xác minh",
  pink: "Tổng phụ trách – đã xác minh",
  red: "Người sáng lập / Quản trị viên tối cao",
};

export function TickBadge({ color, label, size = 16 }: { color: TickColor; label?: string; size?: number }) {
  const text = label ?? defaultLabels[color];
  return (
    <span className="group relative inline-flex align-middle" tabIndex={0} aria-label={text}>
      <span
        className={`inline-flex items-center justify-center rounded-full text-primary-foreground ${styles[color]}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.65} height={size * 0.65} fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
        {text}
      </span>
    </span>
  );
}
