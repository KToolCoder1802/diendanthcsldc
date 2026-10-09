import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AuthLayout, Field, inputCls } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { CLASSES, errMsg } from "@/lib/forum";
import { checkUsername, registerAccount, validatePassword } from "@/lib/signup";

// Trang đăng ký tài khoản học sinh
export const Route = createFileRoute("/dang-ky")({
  head: () => ({
    meta: [
      { title: "Đăng ký học sinh – Diễn đàn THCS Tây Nha Trang PH2" },
      { name: "description", content: "Tạo tài khoản học sinh để tham gia diễn đàn trường." },
      { property: "og:title", content: "Đăng ký học sinh – Diễn đàn THCS Tây Nha Trang PH2" },
      { property: "og:description", content: "Tạo tài khoản học sinh để tham gia diễn đàn trường." },
    ],
  }),
  component: DangKyPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Vui lòng nhập họ tên").max(80),
  className: z.string().min(1, "Vui lòng chọn lớp"),
  email: z.string().trim().email("Email không hợp lệ").max(255).optional().or(z.literal("")),
});

function DangKyPage() {
  const navigate = useNavigate();
  const [f, setF] = useState({ username: "", fullName: "", className: "", email: "", password: "", password2: "", agree: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const r = schema.safeParse(f);
    if (!r.success) r.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
    const u = await checkUsername(f.username); if (u) errs.username = u;
    const p = validatePassword(f.password, f.password2); if (p) errs.password2 = p;
    if (!f.agree) errs.agree = "Bạn cần đồng ý nội quy diễn đàn";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await registerAccount({ kind: "student", username: f.username, password: f.password, fullName: f.fullName, className: f.className, email: f.email });
      toast.success("Đăng ký thành công! Chào mừng bạn đến với diễn đàn 🎉");
      navigate({ to: "/bang-tin" });
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  }

  return (
    <AuthLayout
      title="Đăng ký học sinh"
      subtitle="Tham gia cộng đồng THCS Tây Nha Trang – Phân hiệu 2"
      footer={<Link to="/dang-ky-giao-vien" className="underline">Đăng ký tài khoản giáo viên</Link>}
    >
      <form onSubmit={submit} className="space-y-3">
        <Field label="Tên đăng nhập" error={errors.username}>
          <input className={inputCls} value={f.username} onChange={set("username")} autoComplete="username" placeholder="vd: nguyenvana_7a1" />
        </Field>
        <Field label="Họ và tên" error={errors.fullName}><input className={inputCls} value={f.fullName} onChange={set("fullName")} /></Field>
        <Field label="Lớp" error={errors.className}>
          <select className={inputCls} value={f.className} onChange={set("className")}>
            <option value="">— Chọn lớp —</option>
            {CLASSES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Email" hint="(nếu có – để liên hệ khi quên mật khẩu)" error={errors.email}>
          <input type="email" className={inputCls} value={f.email} onChange={set("email")} />
        </Field>
        <Field label="Mật khẩu" hint="(≥ 8 ký tự, có chữ và số)"><input type="password" className={inputCls} value={f.password} onChange={set("password")} autoComplete="new-password" /></Field>
        <Field label="Nhập lại mật khẩu" error={errors.password2}><input type="password" className={inputCls} value={f.password2} onChange={set("password2")} autoComplete="new-password" /></Field>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={f.agree} onChange={set("agree")} className="mt-1" />
          <span>Tôi đồng ý với <Link to="/" hash="noi-quy" className="text-primary underline">nội quy diễn đàn</Link></span>
        </label>
        {errors.agree && <p className="text-xs text-destructive">{errors.agree}</p>}
        <Button type="submit" className="w-full" disabled={busy}>{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Đăng ký</Button>
        <p className="text-center text-sm text-muted-foreground">Đã có tài khoản? <Link to="/dang-nhap" className="font-semibold text-primary">Đăng nhập</Link></p>
      </form>
    </AuthLayout>
  );
}
