import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/hooks/use-me";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserName } from "@/components/UserName";
import { adminBanUser, adminResetPassword } from "@/lib/admin.functions";
import { POSITION_LABEL, SUBJECTS, errMsg, subtitle, timeAgo, type Profile, type TickColor } from "@/lib/forum";

// Trang quản trị – chỉ tick đỏ (quyền thật được kiểm tra ở cơ sở dữ liệu)
export const Route = createFileRoute("/_authenticated/quan-tri")({
  head: () => ({
    meta: [
      { title: "Quản trị – Diễn đàn THCS Tây Nha Trang PH2" },
      { name: "description", content: "Trang quản trị diễn đàn." },
      { property: "og:title", content: "Quản trị – Diễn đàn THCS Tây Nha Trang PH2" },
      { property: "og:description", content: "Trang quản trị diễn đàn." },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { data: me, isLoading } = useMe();
  if (isLoading) return null;
  if (!me?.isAdmin) return <p className="py-10 text-center text-muted-foreground">Chỉ quản trị viên mới truy cập được trang này.</p>;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">🛡 Quản trị</h1>
      <Tabs defaultValue="req">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="req">Duyệt tick</TabsTrigger>
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          <TabsTrigger value="stats">Thống kê</TabsTrigger>
        </TabsList>
        <TabsContent value="req"><Requests /></TabsContent>
        <TabsContent value="users"><Users /></TabsContent>
        <TabsContent value="reports"><Reports /></TabsContent>
        <TabsContent value="stats"><Stats /></TabsContent>
      </Tabs>
    </div>
  );
}

function Requests() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin-requests"],
    queryFn: async () => (await supabase.from("tick_requests").select("*").order("created_at", { ascending: false }).limit(100)).data ?? [],
  });
  const { data: holders = [] } = useQuery({
    queryKey: ["tick-holders"],
    queryFn: async () => (await supabase.from("profiles").select("full_name, tick").in("tick", ["gold", "pink"])).data ?? [],
  });
  async function review(id: string, approve: boolean, position: string) {
    let reason = "";
    if (approve) {
      const t = position === "principal" ? "gold" : position === "tpt" ? "pink" : null;
      const h = holders.find((x) => x.tick === t);
      if (h && !confirm(`⚠️ ${h.full_name} đang giữ tick này. Vẫn duyệt?`)) return;
    } else {
      reason = prompt("Lý do từ chối:") ?? "";
      if (!reason.trim()) return;
    }
    const { error } = await supabase.rpc("review_tick_request", { _id: id, _approve: approve, _reason: reason });
    if (error) return toast.error(errMsg(error));
    toast.success(approve ? "Đã duyệt và cấp tick" : "Đã từ chối");
    qc.invalidateQueries();
  }
  if (!data.length) return <p className="py-6 text-center text-muted-foreground">Chưa có yêu cầu nào.</p>;
  return (
    <div className="space-y-3">
      {data.map((r) => {
        const phone = r.zalo.replace(/^\+84/, "0");
        return (
          <div key={r.id} className="space-y-1 rounded-xl border bg-card p-4 text-sm">
            <div className="flex justify-between"><b>{r.full_name}</b><span className="text-xs text-muted-foreground">{timeAgo(r.created_at)}</span></div>
            <p>@{r.username} · {POSITION_LABEL[r.position]}{r.subject && ` – ${r.subject}`}</p>
            <p>📱 {r.zalo}{r.email && ` · ✉️ ${r.email}`}</p>
            {r.status === "pending" ? (
              <div className="flex flex-wrap gap-2 pt-2">
                <a href={`https://zalo.me/${phone}`} target="_blank" rel="noreferrer"><Button size="sm" variant="secondary">Mở Zalo</Button></a>
                <a href={`tel:${phone}`}><Button size="sm" variant="secondary">Gọi</Button></a>
                <Button size="sm" onClick={() => review(r.id, true, r.position)}>Duyệt</Button>
                <Button size="sm" variant="destructive" onClick={() => review(r.id, false, r.position)}>Từ chối</Button>
              </div>
            ) : (
              <p className={r.status === "approved" ? "text-tick-blue" : "text-destructive"}>{r.status === "approved" ? "✅ Đã duyệt" : `❌ Từ chối: ${r.reason}`}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Users() {
  const qc = useQueryClient();
  const reset = useServerFn(adminResetPassword);
  const ban = useServerFn(adminBanUser);
  const [q, setQ] = useState("");
  const { data = [] } = useQuery({
    queryKey: ["admin-users", q],
    queryFn: async () => {
      let s = supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(50);
      if (q) s = s.or(`username.ilike.%${q.replace(/[%,()]/g, "")}%,full_name.ilike.%${q.replace(/[%,()]/g, "")}%`);
      return ((await s).data ?? []) as Profile[];
    },
  });
  async function setTick(p: Profile, tick: string) {
    let subject = p.subject ?? "";
    if (tick === "blue") subject = prompt(`Môn dạy (${SUBJECTS.slice(0, 5).join(", ")}…):`, subject) ?? "";
    const { error } = await supabase.rpc("admin_set_tick", { _uid: p.id, _tick: (tick || null) as TickColor, _subject: subject });
    if (error) return toast.error(errMsg(error));
    toast.success("Đã cập nhật tick"); qc.invalidateQueries({ queryKey: ["admin-users"] });
  }
  async function resetPw(p: Profile) {
    const pw = prompt(`Mật khẩu mới cho @${p.username} (≥ 8 ký tự):`);
    if (!pw || pw.length < 8) return;
    try { await reset({ data: { userId: p.id, password: pw } }); toast.success("Đã đặt lại mật khẩu"); } catch (e) { toast.error(errMsg(e)); }
  }
  async function toggleLock(p: Profile) {
    try { await ban({ data: { userId: p.id, locked: !p.locked } }); toast.success(p.locked ? "Đã mở khoá" : "Đã khoá tài khoản"); qc.invalidateQueries({ queryKey: ["admin-users"] }); } catch (e) { toast.error(errMsg(e)); }
  }
  return (
    <div className="space-y-3">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên hoặc tên đăng nhập…" className="w-full rounded-lg border bg-card px-3 py-2 text-sm" />
      {data.map((p) => (
        <div key={p.id} className="space-y-2 rounded-xl border bg-card p-3 text-sm">
          <div><UserName p={p} /> <span className="text-muted-foreground">@{p.username} · {subtitle(p)}</span>{p.locked && <span className="ml-1 text-destructive">(đã khoá)</span>}</div>
          {p.tick !== "red" && (
            <div className="flex flex-wrap gap-2">
              <select value={p.tick ?? ""} onChange={(e) => setTick(p, e.target.value)} className="rounded-md border bg-background px-2 py-1">
                <option value="">Không tick</option><option value="blue">Tick xanh</option><option value="gold">Tick vàng</option><option value="pink">Tick hồng</option>
              </select>
              <Button size="sm" variant="secondary" onClick={() => resetPw(p)}>Đặt lại mật khẩu</Button>
              <Button size="sm" variant={p.locked ? "secondary" : "destructive"} onClick={() => toggleLock(p)}>{p.locked ? "Mở khoá" : "Khoá"}</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Reports() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => (await supabase.from("reports")
      .select("*, reporter:profiles!reports_reporter_id_fkey(full_name), post:posts(id, content, hidden), comment:comments(id, content, hidden)")
      .eq("resolved", false).order("created_at", { ascending: false })).data ?? [],
  });
  async function act(r: (typeof data)[number], action: "hide" | "delete" | "dismiss") {
    if (action !== "dismiss") {
      const table = r.comment_id ? "comments" : "posts";
      const id = r.comment_id ?? r.post_id!;
      const { error } = action === "hide"
        ? await supabase.from(table).update({ hidden: true }).eq("id", id)
        : await supabase.from(table).delete().eq("id", id);
      if (error) return toast.error(errMsg(error));
    }
    await supabase.from("reports").update({ resolved: true }).eq("id", r.id);
    qc.invalidateQueries({ queryKey: ["admin-reports"] }); qc.invalidateQueries({ queryKey: ["posts"] });
  }
  if (!data.length) return <p className="py-6 text-center text-muted-foreground">Không có báo cáo nào cần xử lý 🎉</p>;
  return (
    <div className="space-y-3">
      {data.map((r) => (
        <div key={r.id} className="space-y-2 rounded-xl border bg-card p-3 text-sm">
          <p><b>{r.reporter?.full_name}</b> báo cáo {r.comment_id ? "bình luận" : "bài viết"} · {timeAgo(r.created_at)}</p>
          <p className="text-destructive">Lý do: {r.reason}</p>
          <p className="line-clamp-3 rounded bg-muted p-2">{r.comment?.content ?? r.post?.content ?? "(đã bị xoá)"}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => act(r, "hide")}>Ẩn</Button>
            <Button size="sm" variant="destructive" onClick={() => act(r, "delete")}>Xoá</Button>
            <Button size="sm" variant="ghost" onClick={() => act(r, "dismiss")}>Bỏ qua</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Stats() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const c = async (t: "profiles" | "posts" | "comments" | "reports") => (await supabase.from(t).select("*", { count: "exact", head: true })).count ?? 0;
      const [u, p, cm, r] = await Promise.all([c("profiles"), c("posts"), c("comments"), c("reports")]);
      return [["Thành viên", u], ["Bài viết", p], ["Bình luận", cm], ["Báo cáo", r]] as const;
    },
  });
  return (
    <div className="grid grid-cols-2 gap-3">
      {data?.map(([k, v]) => (
        <div key={k} className="rounded-xl border bg-card p-4 text-center"><p className="text-3xl font-extrabold text-primary">{v}</p><p className="text-sm text-muted-foreground">{k}</p></div>
      ))}
    </div>
  );
}
