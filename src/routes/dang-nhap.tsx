import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout, Field, inputCls } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { errMsg, usernameToEmail } from "@/lib/forum";

// Trang đăng nhập: chỉ cần tên đăng nhập + mật khẩu
export const Route = createFileRoute("/dang-nhap")({
  head: () => ({
    meta: [
      { title: "Đăng nhập – Diễn đàn THCS Tây Nha Trang PH2" },
      { name: "description", content: "Đăng nhập vào diễn đàn trường THCS Tây Nha Trang – Phân hiệu 2." },
      { property: "og:title", content: "Đăng nhập – Diễn đàn THCS Tây Nha Trang PH2" },
      { property: "og:description", content: "Đăng nhập vào diễn đàn trường THCS Tây Nha Trang – Phân hiệu 2." },
    ],
  }),
  component: DangNhapPage,
});

function DangNhapPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) return toast.error("Vui lòng nhập đủ thông tin");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: usernameToEmail(username), password });
    setBusy(false);
    if (error) return toast.error(errMsg(error));
    qc.clear();
    navigate({ to: "/bang-tin" });
  }

  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle="Chào mừng bạn quay lại diễn đàn!"
      footer={<Link to="/dang-ky-giao-vien" className="underline">Đăng ký tài khoản giáo viên</Link>}
    >
      <form onSubmit={submit} className="space-y-3">
        <Field label="Tên đăng nhập"><input className={inputCls} value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" /></Field>
        <Field label="Mật khẩu">
          <div className="relative">
            <input type={show ? "text" : "password"} className={`${inputCls} pr-10`} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground" aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <Button type="submit" className="w-full" disabled={busy}>{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Đăng nhập</Button>
        <p className="text-center text-xs text-muted-foreground">Quên mật khẩu? Hãy nhờ quản trị viên (tick đỏ) đặt lại giúp bạn.</p>
        <p className="text-center text-sm text-muted-foreground">Chưa có tài khoản? <Link to="/dang-ky" className="font-semibold text-primary">Đăng ký</Link></p>
      </form>
    </AuthLayout>
  );
}
