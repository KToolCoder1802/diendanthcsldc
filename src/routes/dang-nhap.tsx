import { createFileRoute, Link } from "@tanstack/react-router";

// Trang đăng nhập — sẽ hoàn thiện ở Giai đoạn 2
export const Route = createFileRoute("/dang-nhap")({
  head: () => ({
    meta: [
      { title: "Đăng nhập – Diễn đàn THCS Tây Nha Trang Phân hiệu 2" },
      { name: "description", content: "Đăng nhập vào diễn đàn nhà trường." },
    ],
  }),
  component: DangNhapPage,
});

function DangNhapPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-card-foreground">Đăng nhập</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Tính năng đăng nhập sẽ được mở ở giai đoạn tiếp theo. Vui lòng quay
          lại sau!
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
