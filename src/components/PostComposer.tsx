// Khung đăng bài: nội dung + ảnh/video/tài liệu, chọn khu vực theo quyền
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Paperclip, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/hooks/use-me";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, UserName } from "./UserName";
import {
  ALLOWED_TYPES, CLASSES, MAX_FILE, SECTIONS, SUBJECTS, canPostIn, errMsg,
  type Attachment, type Section,
} from "@/lib/forum";

export function PostComposer({
  open, onOpenChange, defaultSection = "home",
}: { open: boolean; onOpenChange: (o: boolean) => void; defaultSection?: Section }) {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const allowed = (Object.keys(SECTIONS) as Section[]).filter((s) => canPostIn(me?.profile, !!me?.isAdmin, s));
  const [section, setSection] = useState<Section>(defaultSection);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [tagSubject, setTagSubject] = useState("");
  const [tagClass, setTagClass] = useState("");
  const [busy, setBusy] = useState(false);
  const current = allowed.includes(section) ? section : allowed[0] ?? "home";

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = [...files];
    for (const f of Array.from(list)) {
      if (!ALLOWED_TYPES.includes(f.type)) { toast.error(`"${f.name}": loại tệp không được hỗ trợ`); continue; }
      if (f.size > MAX_FILE) { toast.error(`"${f.name}" vượt quá 20MB`); continue; }
      next.push(f);
    }
    setFiles(next.slice(0, 10));
  }

  async function submit() {
    if (!me?.profile) return;
    if (!content.trim() && files.length === 0) return toast.error("Hãy viết gì đó hoặc đính kèm tệp");
    setBusy(true);
    try {
      const attachments: Attachment[] = [];
      for (const f of files) {
        const ext = f.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "bin";
        const path = `${me.userId}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("uploads").upload(path, f, { contentType: f.type });
        if (error) throw error;
        attachments.push({ path, name: f.name.slice(0, 120), type: f.type, size: f.size });
      }
      const { error } = await supabase.from("posts").insert({
        author_id: me.userId, section: current, content: content.trim(), attachments,
        tag_subject: current === "teachers" && tagSubject ? tagSubject : null,
        tag_class: current === "teachers" && tagClass ? tagClass : null,
      });
      if (error) throw error;
      toast.success("Đã đăng bài!");
      setContent(""); setFiles([]); setTagClass(""); setTagSubject("");
      qc.invalidateQueries({ queryKey: ["posts"] });
      onOpenChange(false);
    } catch (e) {
      toast.error(errMsg(e));
    } finally { setBusy(false); }
  }

  if (!me?.profile) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader><DialogTitle>Tạo bài viết</DialogTitle></DialogHeader>
        {me.profile.locked ? (
          <p className="text-sm text-destructive">Tài khoản của bạn đang bị khoá nên không thể đăng bài.</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Avatar p={me.profile} />
              <div>
                <UserName p={me.profile} />
                <select
                  value={current}
                  onChange={(e) => setSection(e.target.value as Section)}
                  className="mt-0.5 block rounded-md border bg-background px-2 py-1 text-xs"
                >
                  {allowed.map((s) => <option key={s} value={s}>{SECTIONS[s].emoji} {SECTIONS[s].title}</option>)}
                </select>
              </div>
            </div>
            <Textarea
              autoFocus value={content} maxLength={5000} rows={5}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`${me.profile.full_name.split(" ").pop()} ơi, bạn đang nghĩ gì?`}
              className="resize-none border-0 text-base shadow-none focus-visible:ring-0"
            />
            {current === "teachers" && (
              <div className="grid grid-cols-2 gap-2">
                <select value={tagSubject} onChange={(e) => setTagSubject(e.target.value)} className="rounded-md border bg-background px-2 py-2 text-sm">
                  <option value="">Gắn nhãn môn…</option>
                  {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <select value={tagClass} onChange={(e) => setTagClass(e.target.value)} className="rounded-md border bg-background px-2 py-2 text-sm">
                  <option value="">Gắn nhãn lớp…</option>
                  {["Khối 6", "Khối 7", "Khối 8", "Khối 9", ...CLASSES].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            )}
            {files.length > 0 && (
              <ul className="space-y-1">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center justify-between rounded-md bg-muted px-3 py-1.5 text-sm">
                    <span className="truncate">{f.name}</span>
                    <button onClick={() => setFiles(files.filter((_, j) => j !== i))} aria-label="Bỏ tệp"><X className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center gap-2 rounded-lg border p-2">
              <span className="flex-1 text-sm font-medium text-muted-foreground">Thêm vào bài viết</span>
              <label className="cursor-pointer rounded-full p-2 hover:bg-muted" title="Ảnh / video">
                <ImagePlus className="h-5 w-5 text-tick-blue" />
                <input type="file" multiple hidden accept="image/*,video/mp4,video/webm,video/quicktime" onChange={(e) => addFiles(e.target.files)} />
              </label>
              <label className="cursor-pointer rounded-full p-2 hover:bg-muted" title="Tài liệu PDF/Word/PPT">
                <Paperclip className="h-5 w-5 text-flame" />
                <input type="file" multiple hidden accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={(e) => addFiles(e.target.files)} />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">Tối đa 10 tệp, mỗi tệp ≤ 20MB. Hãy đăng nội dung văn minh, lịch sự nhé!</p>
            <Button className="w-full" disabled={busy} onClick={submit}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Đăng
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
