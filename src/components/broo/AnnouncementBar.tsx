import { Sparkles, Truck, Percent, Gift, Flame } from "lucide-react";

const items = [
  { icon: Percent, text: "خصم 25% على أول طلب لك من برو ديليفري" },
  { icon: Truck, text: "توصيل مجاني للطلبات فوق 100,000 ل.س" },
  { icon: Gift, text: "اطلب وجبتين واحصل على عصير مجاناً" },
  { icon: Flame, text: "عروض المطاعم الشامية - وفر حتى 30%" },
  { icon: Sparkles, text: "تطبيق برو الآن في كل المحافظات السورية" },
];

export function AnnouncementBar() {
  const loop = [...items, ...items];
  return (
    <div className="bg-gradient-warm text-white overflow-hidden border-b border-white/10">
      <div className="relative h-9 flex items-center">
        <div className="animate-marquee flex gap-12 whitespace-nowrap px-6 text-sm font-medium">
          {loop.map((it, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              <it.icon className="w-4 h-4" />
              {it.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}