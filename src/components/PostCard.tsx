// Thẻ bài viết: tác giả + tick, nội dung, tệp, cảm xúc, bình luận, sửa/xoá/báo cáo/ghim
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { MessageCircle, MoreHorizontal, Pin, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/hooks/use-me";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, UserName } from "./UserName";
import { Attachments } from "./Attachments";
import { Comments } from "./Comments";
import { ReportDialog } from "./ReportDialog";
import { REACTIONS, SECTIONS, errMsg, subtitle, timeAgo, type Attachment, type Profile, type Section } from "@/lib/forum";

export type PostRow = {
  id: string; author_id: string; section: Section; content: string; attachments: Attachment[];
  tag_subject: string | null; tag_class: string | null; pinned: boolean; hidden: boolean;
  created_at: string; updated_at: string;
  author: Pick<Profile, "id" | "username" | "full_name" | "tick" | "subject" | "class_name" | "is_teacher" | "avatar_url">;
  reactions: { user_id: string; type: string }[];
  comments: { count: number }[];
};

export const POST_SELECT =
  "*, author:profiles!posts_author_id_fkey(id, username, full_name, tick, subject, class_name, is_teacher, avatar_url), reactions(user_id, type), comments(count)";

export function PostCard({ post, showSection = false, defaultOpen = false }: { post: PostRow; showSection?: boolean; defaultOpen?: boolean }) {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const [showComments, setShowComments] = useState(defaultOpen);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.content);
  const [report, setReport] = useState(false);
  const [picker, setPicker] = useState(false);

  const mine = me?.reactions ?? null; // không dùng
  void mine;
  const myReaction = post.reactions.find((r) => r.user_id === me?.userId)?.type;
  const isOwner = me?.userId === post.author_id;
  const canPin = me?.isAdmin || (post.section === "announce" && (me?.profile?.tick === "gold" || me?.profile?.tick === "pink"));
  const refresh = () => { qc.invalidateQueries({ queryKey: ["posts"] }); qc.invalidateQueries({ queryKey: ["post", post.id] }); };

  async function react(type: string) {
    if (!me) return;
    setPicker(false);
    const q = myReaction === type
      ? supabase.from("reactions").delete().eq("post_id", post.id).eq("user_id", me.userId)
      : supabase.from("reactions").upsert({ post_id: post.id, user_id: me.userId, type });
    const { error } = await q;
    if (error) return toast.error(errMsg(error));
    refresh();
  }
  async function update(patch: { content?: string; pinned?: boolean; hidden?: boolean }) {
    const { error } = await supabase.from("posts").update(patch).eq("id", post.id);
    if (error) return toast.error(errMsg(error));
    setEditing(false); refresh();
  }
  async function del() {
    if (!confirm("Bạn chắc chắn muốn xoá bài viết này?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) return toast.error(errMsg(error));
    toast.success("Đã xoá bài viết"); refresh();
  }

  const counts = REACTIONS.map((r) => ({ ...r, n: post.reactions.filter((x) => x.type === r.type).length })).filter((r) => r.n > 0);
  const commentCount = post.comments?.[0]?.count ?? 0;
  const current = REACTIONS.find((r) => r.type === myReaction);

  return (
    <article className={`rounded-xl border bg-card shadow-sm ${post.hidden ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-3 p-4 pb-2">
        <Avatar p={post.author} />
        <div className="min-w-0 flex-1">
          <UserName p={post.author} />
          <div className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
            {subtitle(post.author) && <span>{subtitle(post.author)} ·</span>}
            <Link to="/bai-viet/$id" params={{ id: post.id }} className="hover:underline">{timeAgo(post.created_at)}</Link>
            {post.updated_at !== post.created_at && <span>· đã sửa</span>}
            {showSection && <span>· {SECTIONS[post.section].emoji} {SECTIONS[post.section].title}</span>}
          </div>
        </div>
        {post.pinned && <Pin className="h-4 w-4 text-flame" aria-label="Đã ghim" />}
        {post.hidden && <EyeOff className="h-4 w-4 text-muted-foreground" aria-label="Đã ẩn" />}
        {me && (
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full p-1.5 hover:bg-muted" aria-label="Tuỳ chọn"><MoreHorizontal className="h-5 w-5" /></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwner && <DropdownMenuItem onClick={() => { setDraft(post.content); setEditing(true); }}>Sửa bài viết</DropdownMenuItem>}
              {canPin && <DropdownMenuItem onClick={() => update({ pinned: !post.pinned })}>{post.pinned ? "Bỏ ghim" : "Ghim lên đầu"}</DropdownMenuItem>}
              {me.isAdmin && <DropdownMenuItem onClick={() => update({ hidden: !post.hidden })}>{post.hidden ? "Hiện lại bài" : "Ẩn bài viết"}</DropdownMenuItem>}
              {(isOwner || me.isAdmin) && <DropdownMenuItem className="text-destructive" onClick={del}>Xoá bài viết</DropdownMenuItem>}
              {!isOwner && <DropdownMenuItem onClick={() => setReport(true)}>Báo cáo vi phạm</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="space-y-3 px-4 pb-3">
        {(post.tag_subject || post.tag_class) && (
          <div className="flex gap-1.5">
            {post.tag_subject && <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">📘 {post.tag_subject}</span>}
            {post.tag_class && <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">🏫 {post.tag_class}</span>}
          </div>
        )}
        {editing ? (
          <div className="space-y-2">
            <Textarea value={draft} maxLength={5000} rows={4} onChange={(e) => setDraft(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Huỷ</Button>
              <Button size="sm" onClick={() => update({ content: draft })}>Lưu</Button>
            </div>
          </div>
        ) : (
          post.content && <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">{post.content}</p>
        )}
        <Attachments items={post.attachments ?? []} />
      </div>

      {(counts.length > 0 || commentCount > 0) && (
        <div className="flex items-center justify-between px-4 pb-2 text-sm text-muted-foreground">
          <span>{counts.map((c) => c.emoji).join("")} {counts.reduce((a, c) => a + c.n, 0) || ""}</span>
          {commentCount > 0 && <button onClick={() => setShowComments(true)} className="hover:underline">{commentCount} bình luận</button>}
        </div>
      )}

      <div className="relative mx-4 flex border-t py-1">
        {picker && (
          <div className="absolute bottom-full left-0 z-10 mb-1 flex gap-1 rounded-full border bg-popover p-1.5 shadow-lg animate-in fade-in zoom-in-95">
            {REACTIONS.map((r) => (
              <button key={r.type} title={r.label} onClick={() => react(r.type)} className="text-2xl transition-transform hover:scale-125">{r.emoji}</button>
            ))}
          </div>
        )}
        <button
          onClick={() => (myReaction ? react(myReaction) : setPicker(!picker))}
          onContextMenu={(e) => { e.preventDefault(); setPicker(!picker); }}
          onMouseEnter={() => setPicker(true)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-semibold hover:bg-muted ${current ? "text-primary" : "text-muted-foreground"}`}
        >
          <span>{current ? current.emoji : "👍"}</span> {current ? current.label : "Thích"}
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-semibold text-muted-foreground hover:bg-muted">
          <MessageCircle className="h-4 w-4" /> Bình luận
        </button>
      </div>
      {picker && <div className="fixed inset-0 z-0" onClick={() => setPicker(false)} onMouseEnter={() => setPicker(false)} />}

      {showComments && <div className="px-4 pb-4"><Comments postId={post.id} /></div>}
      {me && <ReportDialog open={report} onOpenChange={setReport} postId={post.id} userId={me.userId} />}
    </article>
  );
}
