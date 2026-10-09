import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { AuthLayout, Field, inputCls } from "@/components/AuthLayout";
import { TickBadge } from "@/components/TickBadge";
import { Button } from "@/components/ui/button";
import { PHONE_RE, POSITION_LABEL, SUBJECTS, errMsg, type Position } from "@/lib/forum";
import { checkUsername, registerAccount, validatePassword } from "@/lib/signup";

// Đăng ký tài khoản giáo viên: chọn chức vụ → điền thông tin → chờ admin duyệt tick
export const Route = createFileRoute("/dang-ky-giao-vien")({
  head: () => ({
    meta: [
      { title: "Đăng ký giáo viên – Diễn đàn THCS Tây Nha Trang PH2" },
      { name: "description", content: "Thầy cô đăng ký tài khoản và gửi yêu cầu xác minh tick." },
      { property: "og:title", content: "Đăng ký giáo viên – Diễn đàn THCS Tây Nha Trang PH2" },
      { property: "og:description", content: "Thầy cô đăng ký tài khoản và gửi yêu cầu xác minh tick." },
    ],
  }),
  component: TeacherSignup,
});

const POSITIONS: { v: Position; tick: "gold" | "pink" | "blue" }[] = [
  { v: "principal", tick: "gold" },
  { v: "tpt", tick: "pink" },
  { v: "subject", tick: "blue" },
];

function TeacherSignup() {
  const navigate = useNavigate();
  const [position, setPosition] = useState<Position | null>(null);
  const [f, setF] = useState({ username: "", fullName: "", zalo: "", email: "", subject: "", password: "", password2: "", agree: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const u = await checkUsername(f.username); if (u) errs.username = u;
    if (f.fullName.trim().length < 2) errs.fullName = "Vui lòng nhập họ tên";
    if (!PHONE_RE.test(f.zalo.replace(/\s/g, ""))) errs.zalo = "Số điện thoại Việt Nam không hợp lệ (vd: 0912345678)";
    if (f.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) errs.email = "Email không hợp lệ";
    if (position === "subject" && !f.subject) errs.subject = "Vui lòng chọn môn dạy";
    const p = validatePassword(f.password, f.password2); if (p) errs.password2 = p;
    if (!f.agree) errs.agree = "Thầy/cô cần đồng ý nội quy";
    setErrors(errs);
    if (Object.keys(errs).length || !position) return;
    setBusy(true);
    try {
      await registerAccount({
        kind: "teacher", username: f.username, password: f.password, fullName: f.fullName, email: f.email,
        position, subject: position === "subject" ? f.subject : "", zalo: f.zalo.replace(/\s/g, ""),
      });
      setDone(true);
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  }

  if (done) {
    return (
      <AuthLayout title="Đăng ký thành công!">
        <div className="space-y-4 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-tick-blue" />
          <p>Yêu cầu của bạn đang chờ quản trị viên xác minh để cấp tick.</p>
          <p className="text-sm text-muted-foreground">Trong lúc chờ, tài khoản hoạt động như tài khoản thường. Bạn sẽ nhận thông báo ngay khi được duyệt.</p>
          <Button className="w-full" onClick={() => navigate({ to: "/bang-tin" })}>Vào diễn đàn</Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Đăng ký giáo viên" subtitle={position ? `Bước 2: Thông tin – ${POSITION_LABEL[position]}` : "Bước 1: Chọn chức vụ của thầy/cô"}
      footer={<Link to="/dang-nhap" className="underline">← Quay lại đăng nhập</Link>}>
      {!position ? (
        <div className="space-y-3">
          {POSITIONS.map((p) => (
            <button key={p.v} onClick={() => setPosition(p.v)}
              className="flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition hover:border-primary hover:bg-secondary">
              <TickBadge color={p.tick} size={22} />
              <span className="font-semibold">{POSITION_LABEL[p.v]}</span>
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <button type="button" onClick={() => setPosition(null)} className="text-sm text-primary">← Đổi chức vụ</button>
          <Field label="Tên đăng nhập" error={errors.username}><input className={inputCls} value={f.username} onChange={set("username")} autoComplete="username" /></Field>
          <Field label="Họ và tên" error={errors.fullName}><input className={inputCls} value={f.fullName} onChange={set("fullName")} /></Field>
          <Field label="Số điện thoại Zalo" hint="(chỉ quản trị viên xem được)" error={errors.zalo}>
            <input type="tel" inputMode="tel" className={inputCls} value={f.zalo} onChange={set("zalo")} placeholder="0912345678" />
          </Field>
          <Field label="Email" hint="(nếu có)" error={errors.email}><input type="email" className={inputCls} value={f.email} onChange={set("email")} /></Field>
          {position === "subject" && (
            <Field label="Giáo viên môn" error={errors.subject}>
              <select className={inputCls} value={f.subject} onChange={set("subject")}>
                <option value="">— Chọn môn —</option>
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          )}
          <Field label="Mật khẩu" hint="(≥ 8 ký tự, có chữ và số)"><input type="password" className={inputCls} value={f.password} onChange={set("password")} autoComplete="new-password" /></Field>
          <Field label="Nhập lại mật khẩu" error={errors.password2}><input type="password" className={inputCls} value={f.password2} onChange={set("password2")} autoComplete="new-password" /></Field>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={f.agree} onChange={set("agree")} className="mt-1" /> Tôi đồng ý với nội quy diễn đàn
          </label>
          {errors.agree && <p className="text-xs text-destructive">{errors.agree}</p>}
          <Button type="submit" className="w-full" disabled={busy}>{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Gửi đăng ký</Button>
        </form>
      )}
    </AuthLayout>
  );
}
