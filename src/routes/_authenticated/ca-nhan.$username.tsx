import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/hooks/use-me";
import { Avatar } from "@/components/UserName";
import { TickBadge } from "@/components/TickBadge";
import { Feed, PostSkeleton } from "@/components/Feed";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PHONE_RE, POSITION_LABEL, SUBJECTS, errMsg, subtitle, tickLabel, type Position, type Profile } from "@/lib/forum";

// Trang cá nhân (không bao giờ hiển thị SĐT/email ra công khai)
export const Route = createFileRoute("/_authenticated/ca-nhan/$username")({
  head: ({ params }) => ({
    meta: [
      { title: `@${params.username} – Diễn đàn THCS Tây Nha Trang PH2` },
      { name: "description", content: "Trang cá nhân thành viên diễn đàn." },
      { property: "og:title", content: `@${params.username} – Diễn đàn THCS Tây Nha Trang PH2` },
      { property: "og:description", content: "Trang cá nhân thành viên diễn đàn." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { username } = Route.useParams();
  const { data: me } = useMe();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", bio: "" });

  const { data: p, isLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("username", username).maybeSingle();
      return data as Profile | null;
    },
  });
  const isMe = !!p && me?.userId === p.id;

  async function save() {
    if (!p) return;
    const { error } = await supabase.from("profiles").update({ full_name: form.full_name, bio: form.bio }).eq("id", p.id);
    if (error) return toast.error(errMsg(error));
    setEditing(false);
    qc.invalidateQueries({ queryKey: ["profile", username] }); qc.invalidateQueries({ queryKey: ["me"] });
  }
  async function uploadAvatar(file?: File) {
    if (!file || !p) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return toast.error("Chỉ nhận ảnh ≤ 5MB");
    const path = `${p.id}/avatar-${Date.now()}.${file.type.split("/")[1]}`;
    const { error } = await supabase.storage.from("uploads").upload(path, file, { contentType: file.type });
    if (error) return toast.error(errMsg(error));
    const { data } = await supabase.storage.from("uploads").createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
    await supabase.from("profiles").update({ avatar_url: data?.signedUrl ?? null }).eq("id", p.id);
    qc.invalidateQueries({ queryKey: ["profile", username] }); qc.invalidateQueries({ queryKey: ["me"] });
  }

  if (isLoading) return <PostSkeleton />;
  if (!p) return <p className="py-10 text-center text-muted-foreground">Không tìm thấy người dùng này.</p>;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="h-28 bg-gradient-to-r from-primary to-flame" />
        <div className="-mt-12 flex flex-col items-center px-4 pb-5 text-center">
          <div className="relative rounded-full border-4 border-card">
            <Avatar p={p} size={96} />
            {isMe && (
              <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-muted p-1.5 shadow" aria-label="Đổi ảnh đại diện">
                <Camera className="h-4 w-4" />
                <input type="file" accept="image/*" hidden onChange={(e) => uploadAvatar(e.target.files?.[0])} />
              </label>
            )}
          </div>
          <h1 className="mt-2 flex items-center gap-1.5 text-xl font-extrabold">
            {p.full_name} {p.tick && <TickBadge color={p.tick} label={tickLabel(p)} size={20} />}
          </h1>
          <p className="text-sm text-muted-foreground">@{p.username}{subtitle(p) && ` · ${subtitle(p)}`}</p>
          {p.locked && <p className="mt-1 rounded bg-destructive/10 px-2 text-xs text-destructive">Tài khoản đang bị khoá</p>}
          {editing ? (
            <div className="mt-3 w-full max-w-sm space-y-2 text-left">
              <input className="w-full rounded-lg border bg-background px-3 py-2 text-sm" value={form.full_name} maxLength={80} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              <Textarea value={form.bio} maxLength={300} placeholder="Giới thiệu ngắn về bạn" onChange={(e) => setForm({ ...form, bio: e.target.value })} />
              <div className="flex justify-end gap-2"><Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Huỷ</Button><Button size="sm" onClick={save}>Lưu</Button></div>
            </div>
          ) : (
            <>
              {p.bio && <p className="mt-2 max-w-md whitespace-pre-wrap text-sm">{p.bio}</p>}
              {isMe && <Button variant="secondary" size="sm" className="mt-3" onClick={() => { setForm({ full_name: p.full_name, bio: p.bio ?? "" }); setEditing(true); }}>Chỉnh sửa trang cá nhân</Button>}
            </>
          )}
        </div>
      </div>
      {isMe && p.is_teacher && p.tick === null && <TickStatus />}
      <h2 className="px-1 font-bold">Bài viết</h2>
      <Feed authorId={p.id} />
    </div>
  );
}

// Trạng thái yêu cầu xác minh tick của giáo viên
function TickStatus() {
  const qc = useQueryClient();
  const { data: req } = useQuery({
    queryKey: ["my-tick-request"],
    queryFn: async () => {
      const { data } = await supabase.from("tick_requests").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle();
      return data;
    },
  });
  const [position, setPosition] = useState<Position>("subject");
  const [subject, setSubject] = useState("");
  const [zalo, setZalo] = useState("");
  async function resubmit() {
    if (!PHONE_RE.test(zalo)) return toast.error("Số Zalo không hợp lệ");
    const { error } = await supabase.rpc("resubmit_tick_request", { _position: position, _subject: subject, _zalo: zalo });
    if (error) return toast.error(errMsg(error));
    toast.success("Đã gửi lại yêu cầu xác minh");
    qc.invalidateQueries({ queryKey: ["my-tick-request"] });
  }
  if (!req) return null;
  return (
    <div className="rounded-xl border bg-card p-4 text-sm shadow-sm">
      <p className="font-semibold">Trạng thái xác minh tick ({POSITION_LABEL[req.position]})</p>
      {req.status === "pending" && <p className="mt-1 text-flame">⏳ Đang chờ duyệt</p>}
      {req.status === "approved" && <p className="mt-1 text-tick-blue">✅ Đã được duyệt</p>}
      {req.status === "rejected" && (
        <div className="mt-1 space-y-2">
          <p className="text-destructive">❌ Bị từ chối – Lý do: {req.reason}</p>
          <div className="grid gap-2 sm:grid-cols-3">
            <select value={position} onChange={(e) => setPosition(e.target.value as Position)} className="rounded-md border bg-background px-2 py-2">
              {(Object.keys(POSITION_LABEL) as Position[]).map((k) => <option key={k} value={k}>{POSITION_LABEL[k]}</option>)}
            </select>
            {position === "subject" && (
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-md border bg-background px-2 py-2">
                <option value="">Môn dạy…</option>{SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            )}
            <input value={zalo} onChange={(e) => setZalo(e.target.value)} placeholder="Số Zalo" className="rounded-md border bg-background px-2 py-2" />
          </div>
          <Button size="sm" onClick={resubmit}>Gửi lại yêu cầu</Button>
        </div>
      )}
    </div>
  );
}
