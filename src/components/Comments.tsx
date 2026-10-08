// Bình luận + trả lời bình luận (cập nhật theo thời gian thực)
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/hooks/use-me";
import { Avatar, UserName } from "./UserName";
import { ReportDialog } from "./ReportDialog";
import { ADMIN_PROFILE_SELECT, errMsg, timeAgo, type Profile } from "@/lib/forum";

type C = {
  id: string; post_id: string; parent_id: string | null; content: string; created_at: string; author_id: string; hidden: boolean;
  author: Pick<Profile, "id" | "username" | "full_name" | "tick" | "subject" | "avatar_url">;
};

export function Comments({ postId }: { postId: string }) {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const key = ["comments", postId];
  const { data: comments = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`*, author:profiles!comments_author_id_fkey(${ADMIN_PROFILE_SELECT})`)
        .eq("post_id", postId).order("created_at");
      if (error) throw error;
      return data as unknown as C[];
    },
  });

  useEffect(() => {
    const ch = supabase
      .channel(`comments-${postId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "comments", filter: `post_id=eq.${postId}` },
        () => { qc.invalidateQueries({ queryKey: ["comments", postId] }); qc.invalidateQueries({ queryKey: ["posts"] }); })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [postId, qc]);

  const roots = comments.filter((c) => !c.parent_id);
  return (
    <div className="space-y-3 border-t pt-3">
      {isLoading && <div className="h-10 animate-pulse rounded-lg bg-muted" />}
      {roots.map((c) => (
        <CommentItem key={c.id} c={c} replies={comments.filter((r) => r.parent_id === c.id)} postId={postId} />
      ))}
      {me?.profile && <CommentInput postId={postId} />}
    </div>
  );
}

function CommentItem({ c, replies, postId }: { c: C; replies: C[]; postId: string }) {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const [reply, setReply] = useState(false);
  const [report, setReport] = useState(false);
  const canDelete = me && (me.userId === c.author_id || me.isAdmin);
  async function del() {
    if (!confirm("Xoá bình luận này?")) return;
    const { error } = await supabase.from("comments").delete().eq("id", c.id);
    if (error) return toast.error(errMsg(error));
    qc.invalidateQueries({ queryKey: ["comments", postId] });
  }
  return (
    <div className="flex gap-2">
      <Avatar p={c.author} size={32} />
      <div className="min-w-0 flex-1">
        <div className={`inline-block max-w-full rounded-2xl bg-muted px-3 py-2 ${c.hidden ? "opacity-50" : ""}`}>
          <UserName p={c.author} className="text-sm" />
          <p className="whitespace-pre-wrap break-words text-sm">{c.content}</p>
        </div>
        <div className="mt-0.5 flex gap-3 px-2 text-xs text-muted-foreground">
          <span>{timeAgo(c.created_at)}</span>
          {!c.parent_id && me?.profile && <button className="font-semibold hover:underline" onClick={() => setReply(!reply)}>Trả lời</button>}
          {me && me.userId !== c.author_id && <button className="hover:underline" onClick={() => setReport(true)}>Báo cáo</button>}
          {canDelete && <button className="hover:underline" onClick={del}>Xoá</button>}
        </div>
        {replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {replies.map((r) => <CommentItem key={r.id} c={r} replies={[]} postId={postId} />)}
          </div>
        )}
        {reply && <div className="mt-2"><CommentInput postId={postId} parentId={c.id} onDone={() => setReply(false)} /></div>}
      </div>
      {me && <ReportDialog open={report} onOpenChange={setReport} commentId={c.id} userId={me.userId} />}
    </div>
  );
}

function CommentInput({ postId, parentId, onDone }: { postId: string; parentId?: string; onDone?: () => void }) {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!me || !text.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("comments").insert({ post_id: postId, author_id: me.userId, parent_id: parentId ?? null, content: text.trim() });
    setBusy(false);
    if (error) return toast.error(errMsg(error));
    setText(""); onDone?.();
    qc.invalidateQueries({ queryKey: ["comments", postId] });
  }
  if (!me?.profile) return null;
  return (
    <form onSubmit={send} className="flex items-center gap-2">
      <Avatar p={me.profile} size={30} />
      <input
        value={text} maxLength={2000} onChange={(e) => setText(e.target.value)}
        placeholder={parentId ? "Viết câu trả lời…" : "Viết bình luận…"}
        className="flex-1 rounded-full border-0 bg-muted px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
      <button disabled={busy || !text.trim()} className="rounded-full p-2 text-primary disabled:opacity-40" aria-label="Gửi">
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
