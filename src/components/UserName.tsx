// Tên + tick + avatar hiển thị ở mọi nơi
import { Link } from "@tanstack/react-router";
import { TickBadge } from "./TickBadge";
import { tickLabel, type Profile } from "@/lib/forum";

type P = Pick<Profile, "username" | "full_name" | "tick" | "subject"> & { avatar_url?: string | null };

export function Avatar({ p, size = 40 }: { p: Pick<P, "full_name" | "avatar_url">; size?: number }) {
  const initials = p.full_name.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase();
  return p.avatar_url ? (
    <img src={p.avatar_url} alt={p.full_name} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}

export function UserName({ p, className = "" }: { p: P; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <Link to="/ca-nhan/$username" params={{ username: p.username }} className="font-semibold text-foreground hover:underline">
        {p.full_name}
      </Link>
      {p.tick && <TickBadge color={p.tick} label={tickLabel(p)} size={15} />}
    </span>
  );
}
