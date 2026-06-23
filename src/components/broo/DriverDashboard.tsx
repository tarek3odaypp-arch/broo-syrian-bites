import { Bike, LogOut, MapPin, Phone, Package, CheckCircle2, Navigation, Wallet } from "lucide-react";
import { useApp, formatSYP, type OrderStatus } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const next: Record<OrderStatus, OrderStatus | null> = {
  "جديد": "قيد التحضير",
  "قيد التحضير": "جاري التوصيل",
  "جاري التوصيل": "تم التسليم",
  "تم التسليم": null,
};

const tone: Record<OrderStatus, string> = {
  "جديد": "bg-blue-100 text-blue-700",
  "قيد التحضير": "bg-amber-100 text-amber-700",
  "جاري التوصيل": "bg-orange-100 text-orange-700",
  "تم التسليم": "bg-green-100 text-green-700",
};

export function DriverDashboard() {
  const { orders, updateOrderStatus, logout, driverEarnings } = useApp();
  const active = orders.filter((o) => o.status !== "تم التسليم");
  const done = orders.filter((o) => o.status === "تم التسليم");

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-gradient-warm text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/15 grid place-items-center"><Bike className="w-5 h-5" /></div>
          <div className="flex-1">
            <div className="font-black text-lg">لوحة السائق</div>
            <div className="text-xs opacity-90">BROO delivery - السائق #DRV-1024</div>
          </div>
          <Button variant="secondary" onClick={logout} className="gap-2"><LogOut className="w-4 h-4" />خروج</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="طلبات نشطة" value={active.length.toString()} />
          <Stat label="طلبات اليوم" value={orders.length.toString()} />
          <Stat label="تم التسليم" value={done.length.toString()} />
          <Stat label="محفظتي" value={formatSYP(driverEarnings)} icon={Wallet} />
        </div>

        <section>
          <h2 className="font-black text-xl mb-3 flex items-center gap-2"><Package className="w-5 h-5 text-primary" />الطلبات الواردة</h2>
          <div className="grid gap-3">
            {active.length === 0 && <div className="text-center text-muted-foreground py-10 bg-card rounded-2xl border">لا توجد طلبات نشطة حالياً</div>}
            {active.map((o) => (
              <article key={o.id} className="bg-card border border-border rounded-2xl p-4 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="font-black">طلب #{o.id}</div>
                    <div className="text-xs text-muted-foreground">{o.createdAt}</div>
                  </div>
                  <Badge className={tone[o.status] + " border-0"}>{o.status}</Badge>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-sm mb-3">
                  <div className="space-y-1">
                    <div className="font-bold">{o.customer}</div>
                    <a href={`tel:${o.phone}`} className="inline-flex items-center gap-1 text-primary"><Phone className="w-3.5 h-3.5" />{o.phone}</a>
                  </div>
                  <div className="text-muted-foreground inline-flex items-start gap-1.5"><MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />{o.address}</div>
                </div>
                <ul className="text-xs text-muted-foreground border-t pt-2 mb-3 space-y-0.5">
                  {o.items.map((i) => <li key={i.product.id}>× {i.qty} - {i.product.name}</li>)}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="font-black text-primary">{formatSYP(o.total)}</span>
                  {next[o.status] && (
                    <Button onClick={() => updateOrderStatus(o.id, next[o.status]!)} className="bg-gradient-hero text-white gap-2">
                      {o.status === "جاري التوصيل" ? <><CheckCircle2 className="w-4 h-4" /> تأكيد التسليم</> : <><Navigation className="w-4 h-4" /> {next[o.status]}</>}
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 text-center shadow-soft">
      <div className="text-2xl font-black text-primary inline-flex items-center gap-1.5 justify-center">
        {Icon && <Icon className="w-5 h-5" />}{value}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}