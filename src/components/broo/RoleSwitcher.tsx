import { useApp, type Role } from "@/context/AppContext";
import { ShieldCheck, Bike, User, Zap } from "lucide-react";
import { useState } from "react";

export function RoleSwitcher() {
  const { role, setRole } = useApp();
  const [open, setOpen] = useState(false);

  const opts: { id: Role | null; label: string; icon: any }[] = [
    { id: null, label: "زبون", icon: User },
    { id: "driver", label: "كابتن", icon: Bike },
    { id: "admin", label: "أدمن", icon: ShieldCheck },
  ];

  return (
    <div className="fixed top-1/2 -translate-y-1/2 right-0 z-50 flex flex-col items-end">
      <button
        onClick={() => setOpen(!open)}
        className="bg-foreground text-background px-2 py-3 rounded-l-xl shadow-elegant flex items-center gap-1 text-[10px] font-bold writing-mode-vertical"
        style={{ writingMode: "vertical-rl" }}
        aria-label="تبديل سريع للأدوار"
      >
        <Zap className="w-3.5 h-3.5" />
        تجربة سريعة
      </button>
      {open && (
        <div className="bg-card border border-border rounded-l-2xl shadow-elegant mt-2 p-2 space-y-1 min-w-[140px]">
          <div className="text-[10px] text-muted-foreground text-center px-2 pb-1 border-b mb-1">وضع التجربة (بدون كلمة مرور)</div>
          {opts.map((o) => {
            const active = role === o.id;
            return (
              <button
                key={o.label}
                onClick={() => { setRole(o.id); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${
                  active ? "bg-gradient-hero text-white" : "hover:bg-muted"
                }`}
              >
                <o.icon className="w-4 h-4" />
                {o.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
