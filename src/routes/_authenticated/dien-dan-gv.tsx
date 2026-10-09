import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/SectionPage";

export const Route = createFileRoute("/_authenticated/dien-dan-gv")({
  head: () => ({
    meta: [
      { title: "Diễn đàn giáo viên – Diễn đàn THCS Tây Nha Trang PH2" },
      { name: "description", content: "Diễn đàn giáo viên của Diễn đàn trường THCS Tây Nha Trang – Phân hiệu 2." },
      { property: "og:title", content: "Diễn đàn giáo viên – Diễn đàn THCS Tây Nha Trang PH2" },
      { property: "og:description", content: "Diễn đàn giáo viên của Diễn đàn trường THCS Tây Nha Trang – Phân hiệu 2." },
    ],
  }),
  component: () => <SectionPage section="teachers" />,
});
