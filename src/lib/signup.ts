// Logic đăng ký dùng chung cho học sinh và giáo viên
import { supabase } from "@/integrations/supabase/client";
import { USERNAME_RE, usernameToEmail, type Position } from "./forum";

export async function checkUsername(u: string): Promise<string | null> {
  const name = u.trim().toLowerCase();
  if (!USERNAME_RE.test(name)) return "3–30 ký tự, chỉ gồm chữ thường không dấu, số, dấu _ hoặc .";
  const { data } = await supabase.rpc("username_available", { _username: name });
  return data ? null : "Tên đăng nhập đã có người dùng";
}

export function validatePassword(pw: string, pw2: string): string | null {
  if (pw.length < 8) return "Mật khẩu tối thiểu 8 ký tự";
  if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) return "Mật khẩu cần có cả chữ và số";
  if (pw !== pw2) return "Mật khẩu nhập lại không khớp";
  return null;
}

export async function registerAccount(args: {
  username: string; password: string; fullName: string; email?: string;
  kind: "student" | "teacher"; className?: string; position?: Position; subject?: string; zalo?: string;
}) {
  const { error } = await supabase.auth.signUp({ email: usernameToEmail(args.username), password: args.password });
  if (error) throw new Error(error.message.includes("already") ? "Tên đăng nhập đã có người dùng" : error.message);
  const { error: e2 } = await supabase.rpc("complete_signup", {
    _full_name: args.fullName.trim(),
    _class_name: args.className ?? "",
    _kind: args.kind,
    _position: (args.position ?? null) as Position,
    _subject: args.subject ?? "",
    _zalo: args.zalo ?? "",
    _email: args.email?.trim() ?? "",
  });
  if (e2) throw e2;
}
