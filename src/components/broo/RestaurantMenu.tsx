import { ArrowRight, Star, Clock, Plus } from "lucide-react";
import { useApp, formatSYP } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function RestaurantMenu({ restaurantId, onBack }: { restaurantId: string; onBack: () => void }) {
  const { restaurants, products, addToCart, setCartOpen } = useApp();
  const restaurant = restaurants.find((r) => r.id === restaurantId);
  if (!restaurant) return null;
  const menu = products.filter((p) => p.restaurantId === restaurantId);

  return (
    <div>
      <div className="relative h-52 md:h-72 overflow-hidden">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <button
          onClick={onBack}
          className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-full p-2.5 shadow-elegant"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="absolute bottom-0 right-0 left-0 p-5 text-white">
          <div className="container mx-auto">
            <span className="bg-white/20 backdrop-blur text-xs font-bold px-2.5 py-1 rounded-full">
              {restaurant.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-black mt-2">{restaurant.name}</h1>
            <p className="text-white/85 text-sm mt-1">{restaurant.tagline}</p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="inline-flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {restaurant.rating}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4" /> {restaurant.deliveryTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-black mb-5">قائمة الطعام</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menu.map((p) => (
            <article key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft flex gap-4 p-3 hover:shadow-elegant transition-shadow">
              <img src={p.image} alt={p.name} className="w-28 h-28 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col">
                <h3 className="font-black text-base truncate">{p.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                <div className="flex-1" />
                <div className="flex items-center justify-between gap-2 mt-2">
                  <span className="font-black text-primary text-base">{formatSYP(p.price)}</span>
                  <Button
                    size="sm"
                    onClick={() => {
                      addToCart(p);
                      toast.success("تمت إضافة " + p.name + " إلى السلة", {
                        action: { label: "عرض السلة", onClick: () => setCartOpen(true) },
                      });
                    }}
                    className="bg-gradient-hero hover:opacity-90 text-white gap-1 rounded-xl"
                  >
                    <Plus className="w-4 h-4" /> إضافة
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {menu.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">لا توجد منتجات حالياً</div>
        )}
      </div>
    </div>
  );
}