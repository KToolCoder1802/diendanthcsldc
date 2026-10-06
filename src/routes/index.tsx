import { createFileRoute, Link } from "@tanstack/react-router";
import congTruong from "@/assets/cong-truong.jpg.asset.json";
import leKhaiGiang from "@/assets/le-khai-giang.jpg.asset.json";

// Trang chào (Giai đoạn 1): ảnh nền cổng trường + phần "Tìm hiểu thêm"
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diễn đàn Trường THCS Tây Nha Trang – Phân hiệu 2" },
      {
        name: "description",
        content:
          "Diễn đàn kết nối học sinh, giáo viên Trường THCS Tây Nha Trang – Phân hiệu 2 (tên cũ: THCS Lương Định Của).",
      },
      { property: "og:title", content: "Diễn đàn Trường THCS Tây Nha Trang – Phân hiệu 2" },
      {
        property: "og:description",
        content: "Nơi kết nối, chia sẻ và học hỏi của cộng đồng nhà trường.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WelcomePage,
});

function WelcomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ===== Phần chào với ảnh nền cổng trường ===== */}
      <section className="relative flex min-h-screen items-center justify-center">
        <img
          src={congTruong.url}
          alt="Cổng Trường THCS Tây Nha Trang – Phân hiệu 2"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Lớp phủ tối để chữ dễ đọc */}
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center text-white">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-white/80">
            Tên cũ: THCS Lương Định Của
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
            DIỄN ĐÀN TRƯỜNG THCS TÂY NHA TRANG
            <span className="mt-2 block text-xl sm:text-2xl">– PHÂN HIỆU 2 –</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/90 sm:text-lg">
            Nơi kết nối học sinh và giáo viên — chia sẻ bài viết, thảo luận,
            học hỏi và lan tỏa những điều tích cực trong nhà trường.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/dang-ky"
              className="w-full rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg transition hover:opacity-90 sm:w-auto"
            >
              Tham gia ngay
            </Link>
            <a
              href="#tim-hieu-them"
              className="w-full rounded-lg border border-white/70 px-8 py-3 text-base font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              Tìm hiểu thêm
            </a>
          </div>
        </div>
      </section>

      {/* ===== Phần "Tìm hiểu thêm" ===== */}
      <section id="tim-hieu-them" className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          Tìm hiểu thêm về diễn đàn
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          Diễn đàn được xây dựng như một mạng xã hội thu nhỏ dành riêng cho
          cộng đồng Trường THCS Tây Nha Trang – Phân hiệu 2.
        </p>

        <div className="mt-10 grid items-center gap-8 md:grid-cols-2">
          <img
            src={leKhaiGiang.url}
            alt="Hoạt động tập thể của trường"
            className="w-full rounded-xl object-cover shadow-md"
          />
          <ul className="space-y-5">
            <li className="rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="font-semibold text-card-foreground">📰 Đăng bài & chia sẻ</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Học sinh và giáo viên có thể đăng bài, bình luận và bày tỏ cảm
                xúc giống như trên mạng xã hội.
              </p>
            </li>
            <li className="rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="font-semibold text-card-foreground">✅ Hệ thống tick xác minh</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Tick vàng dành cho giáo viên, tick xanh cho học sinh tiêu biểu —
                giúp mọi người dễ dàng nhận diện tài khoản tin cậy.
              </p>
            </li>
            <li className="rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="font-semibold text-card-foreground">🛡️ An toàn & văn minh</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Nội dung được kiểm duyệt, bảo vệ học sinh khỏi thông tin xấu độc
                và ngôn từ thiếu văn hóa.
              </p>
            </li>
          </ul>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/dang-ky"
            className="inline-block rounded-lg bg-primary px-10 py-3 text-base font-semibold text-primary-foreground shadow transition hover:opacity-90"
          >
            Đăng ký tài khoản
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link to="/dang-nhap" className="font-medium text-primary hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </section>

      {/* ===== Chân trang ===== */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © 2026 Trường THCS Tây Nha Trang – Phân hiệu 2 (tên cũ: THCS Lương Định Của)
      </footer>
    </div>
  );
}
