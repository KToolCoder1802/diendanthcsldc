import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/SectionPage";

export const Route = createFileRoute("/_authenticated/goc-update")({
  head: () => ({
    meta: [
      { title: "Góc Update – Diễn đàn THCS Tây Nha Trang PH2" },
      { name: "description", content: "Góc Update của Diễn đàn trường THCS Tây Nha Trang – Phân hiệu 2." },
      { property: "og:title", content: "Góc Update – Diễn đàn THCS Tây Nha Trang PH2" },
      { property: "og:description", content: "Góc Update của Diễn đàn trường THCS Tây Nha Trang – Phân hiệu 2." },
    ],
  }),
  component: () => <SectionPage section="update" />,
});
