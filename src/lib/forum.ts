// Hằng số & tiện ích dùng chung cho diễn đàn
import type { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type TickColor = Database["public"]["Enums"]["tick_color"];
export type Section = Database["public"]["Enums"]["post_section"];
export type Position = Database["public"]["Enums"]["teacher_position"];

// Đăng nhập bằng tên đăng nhập → tạo email nội bộ ảo cho hệ thống tài khoản
export const EMAIL_DOMAIN = "diendan.local";
export const usernameToEmail = (u: string) => `${u.trim().toLowerCase()}@${EMAIL_DOMAIN}`;
export const USERNAME_RE = /^[a-z0-9_.]{3,30}$/;
export const PHONE_RE = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

export const CLASSES = ["6", "7", "8", "9"].flatMap((g) =>
  Array.from({ length: 8 }, (_, i) => `${g}A${i + 1}`),
);

export const SUBJECTS = [
  "Toán", "Ngữ văn", "Tiếng Anh", "Vật lí", "Hoá học", "Sinh học", "Khoa học tự nhiên",
  "Lịch sử", "Địa lí", "Lịch sử và Địa lí", "GDCD", "Tin học", "Công nghệ",
  "Âm nhạc", "Mĩ thuật", "Thể dục", "Hoạt động trải nghiệm", "Khác",
];

export const POSITION_LABEL: Record<Position, string> = {
  principal: "Hiệu trưởng",
  tpt: "Tổng phụ trách",
  subject: "Giáo viên bộ môn",
};

export function tickLabel(p: Pick<Profile, "tick" | "subject">) {
  switch (p.tick) {
    case "red": return "Người sáng lập / Quản trị viên tối cao";
    case "gold": return "Hiệu trưởng – đã xác minh";
    case "pink": return "Tổng phụ trách – đã xác minh";
    case "blue": return `Giáo viên ${p.subject ?? ""} – đã xác minh`.replace("  ", " ");
    default: return "";
  }
}

// Dòng phụ dưới tên: lớp hoặc chức vụ/môn
export function subtitle(p: Pick<Profile, "tick" | "subject" | "class_name" | "is_teacher">) {
  if (p.tick === "red") return "Người sáng lập";
  if (p.tick === "gold") return "Hiệu trưởng";
  if (p.tick === "pink") return "Tổng phụ trách";
  if (p.tick === "blue") return `Giáo viên ${p.subject ?? ""}`;
  if (p.is_teacher) return "Giáo viên (chờ xác minh)";
  return p.class_name ? `Lớp ${p.class_name}` : "";
}

export const SECTIONS: Record<Section, { title: string; emoji: string; desc: string; path: string }> = {
  home: { title: "Bảng tin", emoji: "🏠", desc: "Mọi người cùng chia sẻ điều vui ở trường", path: "/bang-tin" },
  announce: { title: "Bảng thông báo", emoji: "📢", desc: "Thông báo chính thức từ Hiệu trưởng và Tổng phụ trách", path: "/thong-bao" },
  teachers: { title: "Diễn đàn GV", emoji: "👩‍🏫", desc: "Tài liệu, bài giảng và thông báo từ thầy cô", path: "/dien-dan-gv" },
  update: { title: "Góc Update", emoji: "🛠", desc: "Thông tin bảo trì, nâng cấp website", path: "/goc-update" },
};

// Ai được đăng ở khu vực nào (chỉ để hiển thị nút — quyền thật nằm ở cơ sở dữ liệu)
export function canPostIn(p: Profile | null | undefined, isAdmin: boolean, s: Section) {
  if (!p || p.locked) return false;
  if (isAdmin) return true;
  if (s === "home") return true;
  if (s === "announce") return p.tick === "gold" || p.tick === "pink" || p.tick === "red";
  if (s === "teachers") return !!p.tick;
  return p.tick === "red";
}

export const REACTIONS = [
  { type: "like", emoji: "👍", label: "Thích" },
  { type: "love", emoji: "❤️", label: "Yêu thích" },
  { type: "haha", emoji: "😆", label: "Haha" },
  { type: "wow", emoji: "😮", label: "Wow" },
  { type: "sad", emoji: "😢", label: "Buồn" },
] as const;

export type Attachment = { path: string; name: string; type: string; size: number };

export const MAX_FILE = 20 * 1024 * 1024;
export const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "video/mp4", "video/webm", "video/quicktime", "application/pdf",
  "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

export function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "Vừa xong";
  if (s < 3600) return `${Math.floor(s / 60)} phút trước`;
  if (s < 86400) return `${Math.floor(s / 3600)} giờ trước`;
  if (s < 604800) return `${Math.floor(s / 86400)} ngày trước`;
  return new Date(iso).toLocaleDateString("vi-VN");
}

export function errMsg(e: unknown) {
  const m = (e as { message?: string })?.message ?? String(e);
  if (m.includes("Invalid login")) return "Sai tên đăng nhập hoặc mật khẩu";
  if (m.includes("row-level security")) return "Bạn không có quyền thực hiện thao tác này";
  return m;
}

export const ADMIN_PROFILE_SELECT = "id, username, full_name, tick, subject, class_name, is_teacher, avatar_url";
