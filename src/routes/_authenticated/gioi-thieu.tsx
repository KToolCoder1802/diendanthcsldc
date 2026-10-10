import { createFileRoute } from "@tanstack/react-router";
import { TickBadge } from "@/components/TickBadge";

export const Route = createFileRoute("/_authenticated/gioi-thieu")({
  head: () => ({
    meta: [
      { title: "Tìm hiểu thêm – Diễn đàn THCS Tây Nha Trang PH2" },
      { name: "description", content: "Mục đích diễn đàn và người sáng lập." },
      { property: "og:title", content: "Tìm hiểu thêm – Diễn đàn THCS Tây Nha Trang PH2" },
      { property: "og:description", content: "Mục đích diễn đàn và người sáng lập." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
      <h1 className="text-xl font-extrabold">ℹ️ Về diễn đàn</h1>
      <p>Diễn đàn Trường THCS Tây Nha Trang – Phân hiệu 2 (tên cũ: THCS Lương Định Của) là nơi học sinh và thầy cô giao lưu, nhận thông báo, tài liệu học tập, thời khoá biểu và chia sẻ những điều vui ở trường.</p>
      <p className="font-semibold text-primary">Vui vẻ – Văn minh – Hữu ích</p>
      <div>
        <h2 className="font-bold">Hệ thống tick</h2>
        <ul className="mt-2 space-y-1 text-sm">
          <li className="flex items-center gap-2"><TickBadge color="red" /> Người sáng lập / Quản trị viên</li>
          <li className="flex items-center gap-2"><TickBadge color="gold" /> Hiệu trưởng</li>
          <li className="flex items-center gap-2"><TickBadge color="pink" /> Tổng phụ trách</li>
          <li className="flex items-center gap-2"><TickBadge color="blue" /> Giáo viên bộ môn</li>
        </ul>
      </div>
      <div className="rounded-lg bg-secondary p-4">
        <p className="text-sm text-muted-foreground">Người sáng lập</p>
        <p className="flex items-center gap-1.5 font-bold">KToolCoder1802 – Nguyễn Hoàng Anh Khoa <TickBadge color="red" /></p>
      </div>
    </div>
  );
}
