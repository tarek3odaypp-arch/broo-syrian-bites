import { Megaphone } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function AnnouncementBar() {
  const { settings } = useApp();
  const items = settings.announcements.length ? settings.announcements : ["مرحباً بكم في BROO delivery"];
  const loop = [...items, ...items];
  return (
    <div className="bg-gradient-warm text-white overflow-hidden border-b border-white/10">
      <div className="relative h-9 flex items-center">
        <div className="animate-marquee flex gap-12 whitespace-nowrap px-6 text-sm font-medium">
          {loop.map((text, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}