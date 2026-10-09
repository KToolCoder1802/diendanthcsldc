import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/SectionPage";

export const Route = createFileRoute("/_authenticated/bang-tin")({
  head: () => ({
    meta: [
      { title: "Bảng tin – Diễn đàn THCS Tây Nha Trang PH2" },
      { name: "description", content: "Bảng tin của Diễn đàn trường THCS Tây Nha Trang – Phân hiệu 2." },
      { property: "og:title", content: "Bảng tin – Diễn đàn THCS Tây Nha Trang PH2" },
      { property: "og:description", content: "Bảng tin của Diễn đàn trường THCS Tây Nha Trang – Phân hiệu 2." },
    ],
  }),
  component: () => <SectionPage section="home" />,
});
