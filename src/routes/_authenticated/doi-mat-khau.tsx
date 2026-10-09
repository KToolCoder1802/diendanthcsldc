import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/hooks/use-me";
import { Field, inputCls } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { errMsg, usernameToEmail } from "@/lib/forum";
import { validatePassword } from "@/lib/signup";

export const Route = createFileRoute("/_authenticated/doi-mat-khau")({
  head: () => ({
    meta: [
      { title: "Đổi mật khẩu – Diễn đàn THCS Tây Nha Trang PH2" },
      { name: "description", content: "Đổi mật khẩu tài khoản diễn đàn." },
      { property: "og:title", content: "Đổi mật khẩu – Diễn đàn THCS Tây Nha Trang PH2" },
      { property: "og:description", content: "Đổi mật khẩu tài khoản diễn đàn." },
    ],
  }),
  component: ChangePassword,
});

function ChangePassword() {
  const { data: me } = useMe();
  const navigate = useNavigate();
  const [cur, setCur] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!me?.profile) return;
    const v = validatePassword(pw, pw2); if (v) return toast.error(v);
    setBusy(true);
    // Xác nhận mật khẩu hiện tại trước khi đổi
    const { error: e1 } = await supabase.auth.signInWithPassword({ email: usernameToEmail(me.profile.username), password: cur });
    if (e1) { setBusy(false); return toast.error("Mật khẩu hiện tại không đúng"); }
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return toast.error(errMsg(error));
    toast.success("Đã đổi mật khẩu");
    navigate({ to: "/bang-tin" });
  }
  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border bg-card p-5 shadow-sm">
      <h1 className="text-xl font-extrabold">Đổi mật khẩu</h1>
      <Field label="Mật khẩu hiện tại"><input type="password" className={inputCls} value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" /></Field>
      <Field label="Mật khẩu mới" hint="(≥ 8 ký tự, có chữ và số)"><input type="password" className={inputCls} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" /></Field>
      <Field label="Nhập lại mật khẩu mới"><input type="password" className={inputCls} value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" /></Field>
      <Button type="submit" disabled={busy} className="w-full">Lưu mật khẩu mới</Button>
    </form>
  );
}
