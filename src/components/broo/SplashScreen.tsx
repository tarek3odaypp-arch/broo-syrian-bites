import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setClosing(true), 1500);
    const t2 = setTimeout(onDone, 2050);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[200] grid place-items-center bg-[oklch(0.94_0.03_75)] transition-opacity ${closing ? "opacity-0" : "opacity-100"}`}
      style={{ backgroundImage: "radial-gradient(circle at 30% 20%, oklch(0.97 0.03 80) 0%, transparent 60%), radial-gradient(circle at 70% 80%, oklch(0.90 0.04 70) 0%, transparent 55%)" }}
    >
      <div className="splash-pop flex flex-col items-center gap-4">
        <div className="w-32 h-32 rounded-full bg-[oklch(0.28_0.02_230)] grid place-items-center shadow-elegant relative">
          <div className="text-white font-black text-3xl tracking-wider flex items-center gap-0.5">
            <span>B</span>
            <span>R</span>
            <MapPin className="w-7 h-7 text-brand-gold pin-glow -mx-0.5" fill="currentColor" />
            <span>O</span>
          </div>
        </div>
        <div className="text-center">
          <div className="font-black text-xl text-[oklch(0.28_0.02_230)]">BROO delivery</div>
          <div className="text-xs text-muted-foreground mt-0.5">دقّة في الموقع · سرعة في التوصيل</div>
        </div>
      </div>
    </div>
  );
}