import { Search, Star, Clock, UtensilsCrossed, Pizza, IceCream, ShoppingBasket, Flame, Coffee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

const categories = [
  { name: "وجبات سريعة", icon: UtensilsCrossed },
  { name: "إيطالي", icon: Pizza },
  { name: "حلويات", icon: IceCream },
  { name: "بقالة", icon: ShoppingBasket },
  { name: "مشاوي", icon: Flame },
  { name: "شامي", icon: Coffee },
];

export function Home({ onOpenRestaurant }: { onOpenRestaurant: (id: string) => void }) {
  const { restaurants } = useApp();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const filtered = restaurants.filter(
    (r) => (!cat || r.category === cat) && (q === "" || r.name.includes(q) || r.category.includes(q)),
  );

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
        <div className="container mx-auto px-4 py-10 md:py-16 relative">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-medium mb-4">
              🚀 توصيل سريع في كل سوريا
            </span>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-3">
              جوعان؟ <span className="text-yellow-200">برو</span> هنا!
            </h1>
            <p className="text-white/90 text-base md:text-lg mb-6">
              اطلب من ألذ المطاعم وأقرب المحلات، ووصلك خلال دقائق إلى باب بيتك.
            </p>
            <div className="bg-white rounded-2xl p-2 shadow-elegant flex items-center gap-2">
              <Search className="w-5 h-5 text-muted-foreground mr-2 shrink-0" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ابحث عن مطعم، طبق، أو محل..."
                className="flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 shadow-none"
              />
              <button className="bg-gradient-hero text-white px-5 py-2 rounded-xl text-sm font-bold shrink-0">
                ابحث
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-black">التصنيفات</h2>
          {cat && (
            <button onClick={() => setCat(null)} className="text-xs text-primary font-bold">
              عرض الكل
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {categories.map((c) => {
            const active = cat === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setCat(active ? null : c.name)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                  active
                    ? "bg-gradient-hero text-white border-transparent shadow-elegant"
                    : "bg-card border-border hover:border-primary/40 hover:-translate-y-0.5 shadow-soft"
                }`}
              >
                <c.icon className="w-7 h-7" />
                <span className="text-xs font-bold">{c.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* RESTAURANTS */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-black">المطاعم القريبة منك</h2>
          <span className="text-xs text-muted-foreground">{filtered.length} نتيجة</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => onOpenRestaurant(r.id)}
              className="text-right group bg-card border border-border rounded-3xl overflow-hidden shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all"
            >
              <div className="relative h-44 overflow-hidden">
                <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                  {r.rating}
                </div>
                <div className="absolute bottom-3 right-3 bg-gradient-warm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {r.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-black text-lg">{r.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 mb-3">{r.tagline}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {r.deliveryTime}
                  </span>
                  <span className="text-primary font-bold">عرض القائمة ←</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">لا توجد نتائج مطابقة</div>
        )}
      </section>
    </div>
  );
}