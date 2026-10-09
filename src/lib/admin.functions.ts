// Chức năng máy chủ chỉ dành cho quản trị viên (tick đỏ)
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: { rpc: (fn: "is_admin", args: { _uid: string }) => PromiseLike<{ data: unknown }> }, userId: string) {
  const { data } = await supabase.rpc("is_admin", { _uid: userId });
  if (!data) throw new Error("Không có quyền");
}

// Đặt lại mật khẩu giúp người dùng (khi họ không có email)
export const adminResetPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid(), password: z.string().min(8).max(72) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: isTargetAdmin } = await context.supabase.rpc("is_admin", { _uid: data.userId });
    if (isTargetAdmin && data.userId !== context.userId) throw new Error("Không thể đặt lại mật khẩu quản trị viên khác");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, { password: data.password });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Khoá / mở khoá đăng nhập của tài khoản
export const adminBanUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid(), locked: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error: e1 } = await context.supabase.rpc("admin_set_locked", { _uid: data.userId, _locked: data.locked });
    if (e1) throw new Error(e1.message);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, { ban_duration: data.locked ? "876000h" : "none" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
