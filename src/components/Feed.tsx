// Bảng tin cuộn vô hạn cho từng khu vực
import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/hooks/use-me";
import { PostCard, POST_SELECT, type PostRow } from "./PostCard";
import { PostComposer } from "./PostComposer";
import { Avatar } from "./UserName";
import { SECTIONS, SUBJECTS, canPostIn, type Section } from "@/lib/forum";

const PAGE = 10;

export function PostSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex gap-3"><div className="h-10 w-10 animate-pulse rounded-full bg-muted" /><div className="flex-1 space-y-2"><div className="h-3 w-1/3 animate-pulse rounded bg-muted" /><div className="h-2.5 w-1/4 animate-pulse rounded bg-muted" /></div></div>
      <div className="h-3 w-full animate-pulse rounded bg-muted" /><div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
    </div>
  );
}

export function Feed({ section, authorId }: { section?: Section; authorId?: string }) {
  const { data: me } = useMe();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const q = useInfiniteQuery({
    queryKey: ["posts", section ?? "all", authorId ?? "", subject],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      let query = supabase.from("posts").select(POST_SELECT);
      if (section) query = query.eq("section", section);
      if (authorId) query = query.eq("author_id", authorId);
      if (subject) query = query.eq("tag_subject", subject);
      if (section && section !== "home") query = query.order("pinned", { ascending: false });
      const { data, error } = await query.order("created_at", { ascending: false }).range(pageParam, pageParam + PAGE - 1);
      if (error) throw error;
      return data as unknown as PostRow[];
    },
    getNextPageParam: (last, all) => (last.length < PAGE ? undefined : all.length * PAGE),
  });

  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting && q.hasNextPage && !q.isFetchingNextPage) q.fetchNextPage(); });
    io.observe(el);
    return () => io.disconnect();
  }, [q]);

  const posts = q.data?.pages.flat() ?? [];
  const canPost = section && canPostIn(me?.profile, !!me?.isAdmin, section);

  return (
    <div className="space-y-4">
      {canPost && me?.profile && (
        <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm">
          <Avatar p={me.profile} />
          <button onClick={() => setOpen(true)} className="flex-1 rounded-full bg-muted px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted/70">
            {me.profile.full_name.split(" ").pop()} ơi, bạn đang nghĩ gì?
          </button>
          <button onClick={() => setOpen(true)} className="rounded-full bg-primary p-2 text-primary-foreground" aria-label="Đăng bài"><Plus className="h-5 w-5" /></button>
        </div>
      )}
      {section && section !== "home" && !canPost && (
        <p className="rounded-lg bg-secondary px-3 py-2 text-center text-xs text-secondary-foreground">
          Bạn có thể xem, thả cảm xúc và bình luận ở {SECTIONS[section].title}.
        </p>
      )}
      {section === "teachers" && (
        <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-lg border bg-card px-3 py-2 text-sm">
          <option value="">📚 Tất cả môn học</option>
          {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
        </select>
      )}
      {q.isLoading && <><PostSkeleton /><PostSkeleton /></>}
      {q.isError && <p className="text-center text-sm text-destructive">Không tải được bài viết. Vui lòng thử lại.</p>}
      {!q.isLoading && posts.length === 0 && (
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">Chưa có bài viết nào ở đây.</div>
      )}
      {posts.map((p) => <PostCard key={p.id} post={p} showSection={!section} />)}
      <div ref={sentinel} />
      {q.isFetchingNextPage && <PostSkeleton />}
      {section && <PostComposer open={open} onOpenChange={setOpen} defaultSection={section} />}
    </div>
  );
}
