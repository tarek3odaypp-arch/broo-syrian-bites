import { createFileRoute } from "@tanstack/react-router";
import { AppProvider } from "@/context/AppContext";
import { AppShell } from "@/components/broo/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BROO delivery - توصيل الطعام والبضائع" },
      { name: "description", content: "برو ديليفري - خدمة توصيل الطعام والبضائع في كل سوريا. اطلب وجبتك المفضلة الآن!" },
      { property: "og:title", content: "BROO delivery" },
      { property: "og:description", content: "خدمة توصيل الطعام والبضائع في كل سوريا" },
    ],
  }),
  component: () => (
    <AppProvider>
      <AppShell />
    </AppProvider>
  ),
});
