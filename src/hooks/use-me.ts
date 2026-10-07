// Lấy thông tin tài khoản đang đăng nhập (hồ sơ + quyền admin)
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/lib/forum";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const [{ data: profile }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", u.user.id),
      ]);
      return {
        userId: u.user.id,
        profile: profile as Profile | null,
        isAdmin: !!roles?.some((r) => r.role === "admin"),
      };
    },
    staleTime: 60_000,
  });
}
