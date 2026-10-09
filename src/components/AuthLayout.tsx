// Khung chung cho các trang đăng ký / đăng nhập (nền ảnh cổng trường)
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import congTruong from "@/assets/cong-truong.jpg.asset.json";

export function AuthLayout({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <img src={congTruong.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-foreground/60" />
      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link to="/" className="mb-4 block text-center font-display text-sm font-bold text-hero-foreground">
          ← DIỄN ĐÀN THCS TÂY NHA TRANG – PHÂN HIỆU 2
        </Link>
        <div className="rounded-2xl bg-card p-6 shadow-2xl sm:p-8">
          <h1 className="text-2xl font-extrabold text-card-foreground">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-5">{children}</div>
        </div>
        {footer && <div className="mt-4 text-center text-xs text-hero-foreground/90">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium">{label} {hint && <span className="font-normal text-muted-foreground">{hint}</span>}</span>
      {children}
      {error && <span className="block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export const inputCls = "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";
