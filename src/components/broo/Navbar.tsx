import { ShoppingCart, MapPin, LogIn, LogOut, Menu, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { useState } from "react";

export function Navbar({ onLogin, onHome }: { onLogin: () => void; onHome: () => void }) {
  const { cart, setCartOpen, currentUser, role, logout } = useApp();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const isLoggedIn = !!currentUser || role !== null;
  const displayName = currentUser?.name ?? (role === "admin" ? "المدير" : role === "driver" ? "السائق" : "");
  const [bounce, setBounce] = useState(0);
  const triggerBounce = () => setBounce((n) => n + 1);

  return (
    <header className="sticky top-0 z-40 bg-gradient-header text-white border-b border-white/10 shadow-elegant">
      <div className="container mx-auto px-4 h-16 flex items-center gap-3">
        <button onClick={() => { triggerBounce(); onHome(); }} className="flex items-center gap-2 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur grid place-items-center font-black text-lg shadow-elegant">
            <span className="flex items-center gap-0 leading-none tracking-wider">
              <span>B</span>
              <span>R</span>
              <MapPin
                key={bounce}
                className={`w-4 h-4 text-brand-gold pin-glow ${bounce ? "pin-bounce" : ""} -mx-px`}
                fill="currentColor"
              />
              <span>O</span>
            </span>
          </div>
          <div className="leading-tight text-right">
            <div className="font-black text-base">BROO</div>
            <div className="text-[10px] text-white/70 -mt-0.5">برو ديليفري</div>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-1 text-sm text-white/80 mr-4">
          <MapPin className="w-4 h-4 text-brand-gold" />
          <span>دمشق، المزة</span>
        </div>

        <div className="flex-1" />

        {isLoggedIn ? (
          <>
            {displayName && (
              <span className="hidden md:flex items-center gap-1.5 text-sm font-bold bg-white/10 ring-1 ring-white/15 rounded-xl px-3 h-10">
                <UserCircle2 className="w-4 h-4 text-brand-gold" />
                {displayName}
              </span>
            )}
            <Button
              onClick={() => { triggerBounce(); logout(); toast.success("تم تسجيل الخروج"); }}
              variant="outline"
              className="gap-2 h-11 px-5 rounded-xl border-2 border-white/30 bg-white/5 text-white hover:bg-destructive hover:text-white hover:border-destructive font-bold transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </Button>
          </>
        ) : (
          <Button
            onClick={() => { triggerBounce(); onLogin(); }}
            className="gap-2 h-11 px-6 rounded-xl bg-gradient-hero text-white font-black text-base shadow-elegant hover:shadow-2xl hover:scale-105 transition-all duration-300 ring-2 ring-brand-gold/40 hover:ring-brand-gold/70"
          >
            <LogIn className="w-5 h-5" />
            <span>دخول</span>
          </Button>
        )}
        <Button onClick={() => { triggerBounce(); setCartOpen(true); }} variant="outline" className="gap-2 h-11 rounded-xl border-2 border-white/25 bg-white/5 text-white hover:bg-white/15 relative">
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">السلة</span>
          {count > 0 && (
            <span className="absolute -top-1 -left-1 bg-brand-gold text-[oklch(0.24_0.04_230)] text-[10px] font-black rounded-full w-5 h-5 grid place-items-center">
              {count}
            </span>
          )}
        </Button>
        <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}