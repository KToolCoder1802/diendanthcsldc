import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/SectionPage";

export const Route = createFileRoute("/_authenticated/thong-bao")({
  head: () => ({
    meta: [
      { title: "Bảng thông báo – Diễn đàn THCS Tây Nha Trang PH2" },
      { name: "description", content: "Bảng thông báo của Diễn đàn trường THCS Tây Nha Trang – Phân hiệu 2." },
      { property: "og:title", content: "Bảng thông báo – Diễn đàn THCS Tây Nha Trang PH2" },
      { property: "og:description", content: "Bảng thông báo của Diễn đàn trường THCS Tây Nha Trang – Phân hiệu 2." },
    ],
  }),
  component: () => <SectionPage section="announce" />,
});
