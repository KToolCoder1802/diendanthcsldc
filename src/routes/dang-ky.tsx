import { createFileRoute, Link } from "@tanstack/react-router";

// Trang đăng ký — sẽ hoàn thiện ở Giai đoạn 2 (đăng ký học sinh/giáo viên)
export const Route = createFileRoute("/dang-ky")({
  head: () => ({
    meta: [
      { title: "Đăng ký – Diễn đàn THCS Tây Nha Trang Phân hiệu 2" },
      { name: "description", content: "Đăng ký tài khoản học sinh hoặc giáo viên." },
    ],
  }),
  component: DangKyPage,
});

function DangKyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-card-foreground">Đăng ký tài khoản</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Tính năng đăng ký dành cho học sinh và giáo viên sẽ được mở ở giai đoạn
          tiếp theo. Vui lòng quay lại sau!
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          ← Về trang chào
        </Link>
      </div>
    </div>
  );
}
