// Hiển thị tệp đính kèm (ảnh/video/tài liệu) bằng đường dẫn tạm có thời hạn
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Attachment } from "@/lib/forum";

export function Attachments({ items }: { items: Attachment[] }) {
  const { data: urls } = useQuery({
    queryKey: ["signed", items.map((i) => i.path).join("|")],
    enabled: items.length > 0,
    staleTime: 50 * 60_000,
    queryFn: async () => {
      const { data } = await supabase.storage.from("uploads").createSignedUrls(items.map((i) => i.path), 3600);
      return Object.fromEntries((data ?? []).map((d) => [d.path, d.signedUrl]));
    },
  });
  if (!items.length) return null;
  const media = items.filter((i) => i.type.startsWith("image/") || i.type.startsWith("video/"));
  const docs = items.filter((i) => !media.includes(i));
  return (
    <div className="space-y-2">
      {media.length > 0 && (
        <div className={`grid gap-1 ${media.length > 1 ? "grid-cols-2" : ""}`}>
          {media.map((m) => {
            const u = urls?.[m.path];
            if (!u) return <div key={m.path} className="aspect-video animate-pulse rounded-lg bg-muted" />;
            return m.type.startsWith("image/") ? (
              <a key={m.path} href={u} target="_blank" rel="noreferrer">
                <img src={u} alt={m.name} loading="lazy" className="max-h-[480px] w-full rounded-lg object-cover" />
              </a>
            ) : (
              <video key={m.path} src={u} controls className="w-full rounded-lg bg-muted" />
            );
          })}
        </div>
      )}
      {docs.map((d) => (
        <a
          key={d.path}
          href={urls?.[d.path]}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3 text-sm hover:bg-muted"
        >
          <FileText className="h-5 w-5 text-primary" />
          <span className="flex-1 truncate font-medium">{d.name}</span>
          <span className="text-xs text-muted-foreground">{(d.size / 1024 / 1024).toFixed(1)} MB</span>
        </a>
      ))}
    </div>
  );
}
