import { ShoppingCart, MapPin, LogIn, LogOut, Menu, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export function Navbar({ onLogin, onHome }: { onLogin: () => void; onHome: () => void }) {
  const { cart, setCartOpen, currentUser, role, logout } = useApp();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const isLoggedIn = !!currentUser || role !== null;
  const displayName = currentUser?.name ?? (role === "admin" ? "المدير" : role === "driver" ? "السائق" : "");

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center gap-3">
        <button onClick={onHome} className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-hero grid place-items-center text-white font-black text-lg shadow-elegant">
            B
          </div>
          <div className="leading-tight text-right">
            <div className="font-black text-lg text-foreground">BROO</div>
            <div className="text-[10px] text-muted-foreground -mt-0.5">برو ديليفري</div>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground mr-4">
          <MapPin className="w-4 h-4 text-primary" />
          <span>دمشق، المزة</span>
        </div>

        <div className="flex-1" />

        {isLoggedIn ? (
          <>
            {displayName && (
              <span className="hidden md:flex items-center gap-1.5 text-sm font-bold text-foreground bg-accent/60 rounded-xl px-3 h-10">
                <UserCircle2 className="w-4 h-4 text-primary" />
                {displayName}
              </span>
            )}
            <Button
              onClick={() => { logout(); toast.success("تم تسجيل الخروج"); }}
              variant="outline"
              className="gap-2 h-11 px-5 rounded-xl border-2 border-destructive/40 text-destructive hover:bg-destructive hover:text-white hover:border-destructive font-bold shadow-soft transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </Button>
          </>
        ) : (
          <Button
            onClick={onLogin}
            className="gap-2 h-11 px-6 rounded-xl bg-gradient-hero text-white font-black text-base shadow-elegant hover:shadow-2xl hover:scale-105 transition-all duration-300 ring-2 ring-primary/30 hover:ring-primary/50"
          >
            <LogIn className="w-5 h-5" />
            <span>دخول</span>
          </Button>
        )}
        <Button onClick={() => setCartOpen(true)} variant="outline" className="gap-2 h-11 rounded-xl border-2 relative">
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">السلة</span>
          {count > 0 && (
            <span className="absolute -top-1 -left-1 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full w-5 h-5 grid place-items-center">
              {count}
            </span>
          )}
        </Button>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}