import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, MessagesSquare, Megaphone, BookOpen, CalendarDays, PartyPopper, UserPlus, LogIn, PenSquare, ShieldCheck, Heart, Lightbulb, Plus, Minus, ArrowRight } from "lucide-react";
import congTruong from "@/assets/cong-truong.jpg.asset.json";
import leKhaiGiang from "@/assets/le-khai-giang.jpg.asset.json";
import { TickBadge } from "@/components/TickBadge";

// Trang chào: hero ảnh cổng trường + khu "Tìm hiểu thêm" đầy đủ
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diễn đàn Trường THCS Tây Nha Trang – Phân hiệu 2" },
      { name: "description", content: "Diễn đàn kết nối học sinh, giáo viên Trường THCS Tây Nha Trang – Phân hiệu 2 (tên cũ: THCS Lương Định Của)." },
      { property: "og:title", content: "Diễn đàn Trường THCS Tây Nha Trang – Phân hiệu 2" },
      { property: "og:description", content: "Giao lưu, thông báo, tài liệu và thời khoá biểu cho cộng đồng nhà trường." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WelcomePage,
});

const FEATURES = [
  { icon: MessagesSquare, title: "Giao lưu", desc: "Chia sẻ khoảnh khắc, trò chuyện và kết nối bạn bè, thầy cô." },
  { icon: Megaphone, title: "Thông báo", desc: "Tin chính thức từ Ban giám hiệu và Tổng phụ trách, luôn được ghim." },
  { icon: BookOpen, title: "Tài liệu học tập", desc: "Giáo viên đăng bài giảng, đề cương, phiếu bài tập theo môn và lớp." },
  { icon: CalendarDays, title: "Thời khoá biểu", desc: "Cập nhật lịch học, lịch thi và các thay đổi nhanh chóng." },
  { icon: PartyPopper, title: "Góc vui trường học", desc: "Những câu chuyện, hình ảnh vui vẻ trong mỗi ngày đến trường." },
];

const STEPS = [
  { icon: UserPlus, title: "Đăng ký", desc: "Tạo tài khoản với tên đăng nhập, họ tên và lớp." },
  { icon: LogIn, title: "Đăng nhập", desc: "Chỉ cần tên đăng nhập và mật khẩu." },
  { icon: PenSquare, title: "Đăng bài", desc: "Bấm nút + để chia sẻ bài viết, ảnh, tài liệu." },
];

const RULES = [
  "Tôn trọng thầy cô, bạn bè; không dùng ngôn từ thô tục, xúc phạm.",
  "Không đăng nội dung bạo lực, sai sự thật, quảng cáo hay spam.",
  "Không mạo danh người khác, không chia sẻ thông tin cá nhân của người khác.",
  "Đăng bài đúng chuyên mục; báo cáo nội dung vi phạm cho quản trị viên.",
];

const FAQ = [
  { q: "Tôi không có email thì có đăng ký được không?", a: "Được. Email không bắt buộc. Nếu quên mật khẩu, quản trị viên sẽ giúp bạn đặt lại." },
  { q: "Làm sao để giáo viên có tick xác minh?", a: "Dùng mục “Đăng ký tài khoản giáo viên”. Quản trị viên sẽ liên hệ xác minh rồi cấp tick theo chức vụ." },
  { q: "Ai được đăng ở Bảng thông báo?", a: "Chỉ Hiệu trưởng (tick vàng) và Tổng phụ trách (tick hồng). Mọi người đều xem và bình luận được." },
  { q: "Số điện thoại của tôi có bị công khai không?", a: "Không. Số Zalo và email chỉ quản trị viên xem được, không hiển thị ở bất kỳ đâu khác." },
];

function WelcomePage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="min-h-screen bg-background">
      {/* ===== HERO ===== */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <img src={congTruong.url} alt="Cổng Trường THCS Tây Nha Trang – Phân hiệu 2" className="absolute inset-0 h-full w-full scale-105 object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />

        <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 text-hero-foreground">
          <span className="font-display text-sm font-extrabold tracking-wide">THCS TÂY NHA TRANG · PH2</span>
          <div className="flex items-center gap-2">
            <Link to="/dang-nhap" className="rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-hero-foreground/10">Đăng nhập</Link>
            <Link to="/dang-ky" className="hidden rounded-full bg-hero-foreground px-4 py-2 text-sm font-semibold text-foreground transition hover:opacity-90 sm:inline-block">Đăng ký</Link>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 text-center text-hero-foreground">
          <span className="animate-rise mb-6 inline-flex items-center gap-2 rounded-full border border-hero-foreground/30 bg-hero-foreground/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-sun" /> Mạng xã hội học đường
          </span>
          <h1 className="animate-rise font-display text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl md:text-7xl" style={{ animationDelay: "120ms" }}>
            DIỄN ĐÀN TRƯỜNG<br />
            <span className="bg-sunset bg-clip-text text-transparent">THCS TÂY NHA TRANG</span>
          </h1>
          <p className="animate-rise mt-4 font-display text-lg font-bold tracking-[0.3em] sm:text-2xl" style={{ animationDelay: "240ms" }}>– PHÂN HIỆU 2 –</p>
          <p className="animate-rise mt-2 text-sm italic text-hero-foreground/80" style={{ animationDelay: "320ms" }}>(Tên cũ: THCS Lương Định Của)</p>

          <div className="animate-rise mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row" style={{ animationDelay: "440ms" }}>
            <Link to="/dang-ky" className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-sunset px-8 py-3.5 text-base font-bold text-hero-foreground shadow-glow transition hover:scale-[1.03] sm:w-auto">
              Tham gia diễn đàn <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <a href="#tim-hieu-them" className="w-full rounded-full border border-hero-foreground/50 bg-hero-foreground/10 px-8 py-3.5 text-base font-semibold backdrop-blur transition hover:bg-hero-foreground/20 sm:w-auto">
              Tìm hiểu thêm
            </a>
          </div>
        </div>

        <a href="#tim-hieu-them" aria-label="Kéo xuống" className="relative z-10 mx-auto mb-6 flex flex-col items-center text-xs text-hero-foreground/80">
          Kéo xuống
          <ChevronDown className="animate-bob mt-1 h-6 w-6" />
        </a>
      </section>

      {/* ===== GIÁ TRỊ ===== */}
      <section className="border-b bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x px-4 py-6 text-center">
          {[["Vui vẻ", Heart], ["Văn minh", ShieldCheck], ["Hữu ích", Lightbulb]].map(([t, I]: any) => (
            <div key={t} className="flex flex-col items-center gap-1 sm:flex-row sm:justify-center sm:gap-3">
              <I className="h-6 w-6 text-flame" />
              <span className="font-display text-sm font-extrabold sm:text-lg">{t}</span>
            </div>
          ))}
        </div>
      </section>

      <div id="tim-hieu-them" className="scroll-mt-4" />

      {/* ===== GIỚI THIỆU & CỘI NGUỒN ===== */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative">
            <img src={leKhaiGiang.url} alt="Lễ tập trung của học sinh nhà trường" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-card" />
            <div className="absolute -bottom-6 -right-2 rounded-2xl bg-card p-4 shadow-card sm:-right-6">
              <p className="text-xs text-muted-foreground">Tên cũ</p>
              <p className="font-display font-extrabold text-primary">THCS Lương Định Của</p>
            </div>
          </div>
          <div>
            <SectionLabel>Giới thiệu & cội nguồn</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-black leading-tight sm:text-4xl">Ngôi nhà chung trên mạng của thầy và trò</h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Diễn đàn ra đời để giao lưu, đăng thông báo, bổ sung tài liệu và thời khoá biểu cho học sinh. Đây là nơi học sinh và giáo viên tự do chia sẻ những điều vui ở trường, còn thầy cô có thể gửi tài liệu và thông báo đến các em nhanh nhất.
            </p>
            <div className="mt-6 rounded-2xl border-l-4 border-sun bg-secondary p-5">
              <p className="text-sm font-semibold text-secondary-foreground">Hành trình đổi tên</p>
              <p className="mt-1 text-sm leading-relaxed text-secondary-foreground/80">
                Từ <b>THCS Lương Định Của</b>, trường nay trở thành <b>THCS Tây Nha Trang – Phân hiệu 2</b>, tiếp nối truyền thống dạy tốt – học tốt. (Phần lịch sử chi tiết của trường sẽ được bổ sung.)
              </p>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              <b className="text-foreground">Sứ mệnh:</b> xây dựng một không gian trực tuyến an toàn, tích cực, nơi mỗi học sinh đều được lắng nghe và mỗi thầy cô đều kết nối dễ dàng với học trò.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CHỨC NĂNG ===== */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <SectionLabel>Chức năng chính</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">Mọi thứ bạn cần ở một nơi</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`group rounded-3xl border bg-card p-6 shadow-card transition hover:-translate-y-1 ${i === 0 ? "lg:row-span-1" : ""}`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sunset text-hero-foreground shadow-glow transition group-hover:scale-110">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-extrabold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
            <div className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-card">
              <h3 className="font-display text-lg font-extrabold">Hệ thống tick xác minh</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li className="flex items-center gap-2"><TickBadge color="blue" label="Giáo viên bộ môn" size={16} /> Giáo viên bộ môn</li>
                <li className="flex items-center gap-2"><TickBadge color="gold" label="Hiệu trưởng" size={16} /> Hiệu trưởng</li>
                <li className="flex items-center gap-2"><TickBadge color="pink" label="Tổng phụ trách" size={16} /> Tổng phụ trách</li>
                <li className="flex items-center gap-2"><TickBadge color="red" label="Người sáng lập" size={16} /> Người sáng lập</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3 BƯỚC ===== */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="text-center">
          <SectionLabel>Bắt đầu nhanh</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">Chỉ 3 bước đơn giản</h2>
        </div>
        <div className="relative mt-12 grid gap-8 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-8 hidden h-0.5 bg-border md:block" />
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative text-center">
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-card">
                <s.icon className="h-7 w-7" />
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-sun text-xs font-black text-foreground">{i + 1}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-extrabold">{s.title}</h3>
              <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== NỘI QUY + FAQ ===== */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-2">
          <div>
            <SectionLabel>Nội quy diễn đàn</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-black">Cùng nhau giữ gìn văn minh</h2>
            <ol className="mt-8 space-y-3">
              {RULES.map((r, i) => (
                <li key={r} className="flex gap-4 rounded-2xl bg-card p-4 shadow-card">
                  <span className="font-display text-2xl font-black text-flame">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm leading-relaxed">{r}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <SectionLabel>Câu hỏi thường gặp</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-black">Bạn thắc mắc?</h2>
            <div className="mt-8 space-y-3">
              {FAQ.map((f, i) => (
                <div key={f.q} className="overflow-hidden rounded-2xl bg-card shadow-card">
                  <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-3 p-4 text-left text-sm font-semibold">
                    {f.q}
                    {open === i ? <Minus className="h-4 w-4 shrink-0 text-primary" /> : <Plus className="h-4 w-4 shrink-0 text-primary" />}
                  </button>
                  {open === i && <p className="animate-in fade-in px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== NGƯỜI SÁNG LẬP + CTA ===== */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="relative overflow-hidden rounded-[2rem]">
          <img src={congTruong.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-hero-overlay" />
          <div className="relative grid gap-10 p-8 text-hero-foreground sm:p-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sun">Người sáng lập</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sunset font-display text-2xl font-black">K</div>
                <div>
                  <p className="flex items-center gap-1.5 font-display text-xl font-extrabold">Nguyễn Hoàng Anh Khoa <TickBadge color="red" label="Người sáng lập – Quản trị viên" size={18} /></p>
                  <p className="text-sm text-hero-foreground/80">@KToolCoder1802</p>
                </div>
              </div>
            </div>
            <div className="md:text-right">
              <h2 className="font-display text-2xl font-black sm:text-3xl">Sẵn sàng tham gia?</h2>
              <p className="mt-2 text-sm text-hero-foreground/80">Miễn phí, an toàn và dành riêng cho trường mình.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row md:justify-end">
                <Link to="/dang-ky" className="rounded-full bg-sunset px-7 py-3 text-center font-bold shadow-glow transition hover:scale-[1.03]">Đăng ký</Link>
                <Link to="/dang-nhap" className="rounded-full border border-hero-foreground/50 px-7 py-3 text-center font-semibold transition hover:bg-hero-foreground/10">Đăng nhập</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © 2026 Trường THCS Tây Nha Trang – Phân hiệu 2 (tên cũ: THCS Lương Định Của)
      </footer>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[0.25em] text-flame">{children}</p>;
}
