import { ShieldCheck, LogOut, Plus, Pencil, Trash2, Package, Users, DollarSign, X } from "lucide-react";
import { useApp, formatSYP, type Product, type OrderStatus } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

const statuses: OrderStatus[] = ["جديد", "قيد التحضير", "جاري التوصيل", "تم التسليم"];

export function AdminDashboard() {
  const { products, restaurants, orders, upsertProduct, deleteProduct, updateOrderStatus, logout } = useApp();
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  const startNew = () => {
    setEditing({ id: "p" + Date.now(), restaurantId: restaurants[0].id, name: "", description: "", price: 0, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80" });
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-foreground text-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary grid place-items-center"><ShieldCheck className="w-5 h-5" /></div>
          <div className="flex-1">
            <div className="font-black text-lg">لوحة الإدارة</div>
            <div className="text-xs opacity-75">BROO delivery - admin</div>
          </div>
          <Button variant="secondary" onClick={logout} className="gap-2"><LogOut className="w-4 h-4" />خروج</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat icon={Package} label="عدد الطلبات" value={orders.length.toString()} />
          <Stat icon={Users} label="المطاعم" value={restaurants.length.toString()} />
          <Stat icon={Package} label="المنتجات" value={products.length.toString()} />
          <Stat icon={DollarSign} label="الإيرادات" value={formatSYP(totalRevenue)} />
        </div>

        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
            <TabsTrigger value="products">المنتجات</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-4 space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="bg-card border border-border rounded-2xl p-4 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-black">طلب #{o.id} - {o.customer}</div>
                    <div className="text-xs text-muted-foreground">{o.phone} · {o.address}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{o.createdAt}</div>
                  </div>
                  <div className="text-left">
                    <div className="font-black text-primary">{formatSYP(o.total)}</div>
                    <Badge variant="secondary" className="mt-1">{o.status}</Badge>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 border-t pt-3">
                  <span className="text-xs text-muted-foreground">تحديث الحالة:</span>
                  <Select value={o.status} onValueChange={(v) => { updateOrderStatus(o.id, v as OrderStatus); toast.success("تم تحديث الحالة"); }}>
                    <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="products" className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-black text-lg">إدارة المنتجات والأسعار</h3>
              <Button onClick={startNew} className="bg-gradient-hero text-white gap-2"><Plus className="w-4 h-4" />منتج جديد</Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.map((p) => {
                const r = restaurants.find((x) => x.id === p.restaurantId);
                return (
                  <div key={p.id} className="bg-card border border-border rounded-2xl p-3 shadow-soft flex gap-3">
                    <img src={p.image} alt={p.name} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{p.name}</div>
                      <div className="text-[11px] text-muted-foreground">{r?.name}</div>
                      <div className="text-primary font-black text-sm mt-1">{formatSYP(p.price)}</div>
                      <div className="flex gap-1 mt-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditing(p); setOpen(true); }} className="h-7 px-2 text-xs gap-1"><Pencil className="w-3 h-3" />تعديل</Button>
                        <Button size="sm" variant="ghost" onClick={() => { deleteProduct(p.id); toast.success("تم الحذف"); }} className="h-7 px-2 text-xs text-destructive gap-1"><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle className="text-right">{editing && products.find((x) => x.id === editing.id) ? "تعديل منتج" : "منتج جديد"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="space-y-2"><Label>اسم المنتج</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>الوصف</Label><Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>السعر (ل.س)</Label><Input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>المطعم</Label>
                  <Select value={editing.restaurantId} onValueChange={(v) => setEditing({ ...editing, restaurantId: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{restaurants.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>رابط الصورة</Label><Input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-gradient-hero text-white" onClick={() => { upsertProduct(editing); setOpen(false); toast.success("تم الحفظ - التحديث ظاهر فوراً في قائمة الزبون"); }}>حفظ</Button>
                <Button variant="outline" onClick={() => setOpen(false)}><X className="w-4 h-4" /></Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
      <div className="flex items-center gap-2 text-muted-foreground text-xs"><Icon className="w-4 h-4 text-primary" />{label}</div>
      <div className="text-xl font-black mt-1 truncate">{value}</div>
    </div>
  );
}