import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostCard, POST_SELECT, type PostRow } from "@/components/PostCard";
import { PostSkeleton } from "@/components/Feed";

// Xem chi tiết một bài viết (mở từ thông báo)
export const Route = createFileRoute("/_authenticated/bai-viet/$id")({
  head: () => ({
    meta: [
      { title: "Bài viết – Diễn đàn THCS Tây Nha Trang PH2" },
      { name: "description", content: "Chi tiết bài viết trên diễn đàn trường." },
      { property: "og:title", content: "Bài viết – Diễn đàn THCS Tây Nha Trang PH2" },
      { property: "og:description", content: "Chi tiết bài viết trên diễn đàn trường." },
    ],
  }),
  component: PostDetail,
});

function PostDetail() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data } = await supabase.from("posts").select(POST_SELECT).eq("id", id).maybeSingle();
      return data as unknown as PostRow | null;
    },
  });
  if (isLoading) return <PostSkeleton />;
  if (!data) return <p className="py-10 text-center text-muted-foreground">Bài viết không tồn tại hoặc đã bị xoá.</p>;
  return <PostCard post={data} showSection defaultOpen />;
}
