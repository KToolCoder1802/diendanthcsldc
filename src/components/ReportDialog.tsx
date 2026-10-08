// Báo cáo bài viết / bình luận vi phạm
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { errMsg } from "@/lib/forum";

const REASONS = ["Nội dung thô tục", "Bắt nạt, xúc phạm người khác", "Spam / quảng cáo", "Mạo danh", "Thông tin sai sự thật", "Khác"];

export function ReportDialog({
  open, onOpenChange, postId, commentId, userId,
}: { open: boolean; onOpenChange: (o: boolean) => void; postId?: string; commentId?: string; userId: string }) {
  const [reason, setReason] = useState(REASONS[0]);
  const [note, setNote] = useState("");
  async function send() {
    const full = (reason + (note.trim() ? `: ${note.trim()}` : "")).slice(0, 500);
    const { error } = await supabase.from("reports").insert({ reporter_id: userId, post_id: postId ?? null, comment_id: commentId ?? null, reason: full });
    if (error) return toast.error(errMsg(error));
    toast.success("Đã gửi báo cáo. Cảm ơn bạn đã giúp diễn đàn văn minh hơn!");
    setNote(""); onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Báo cáo vi phạm</DialogTitle></DialogHeader>
        <div className="space-y-2">
          {REASONS.map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm">
              <input type="radio" checked={reason === r} onChange={() => setReason(r)} /> {r}
            </label>
          ))}
          <Textarea value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} placeholder="Mô tả thêm (không bắt buộc)" />
          <Button className="w-full" onClick={send}>Gửi báo cáo</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
