import { ShieldCheck, LogOut, Plus, Pencil, Trash2, Package, Users, DollarSign, X, Settings as SettingsIcon, Megaphone, Tag, KeyRound, Wallet, UserCheck, UserX, UserPlus } from "lucide-react";
import { useApp, formatSYP, type Product, type OrderStatus, type Category } from "@/context/AppContext";
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
const iconChoices = ["UtensilsCrossed", "Pizza", "IceCream", "ShoppingBasket", "Flame", "Coffee", "Tag"];

export function AdminDashboard() {
  const {
    products, restaurants, orders, categories, settings, driverEarnings,
    upsertProduct, deleteProduct, updateOrderStatus, logout,
    upsertCategory, deleteCategory, updateSettings,
    profiles, setProfileStatus, deleteProfile,
  } = useApp();

  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const [editCat, setEditCat] = useState<Category | null>(null);
  const [catOpen, setCatOpen] = useState(false);

  const [newAdminPass, setNewAdminPass] = useState("");
  const [newDriverPass, setNewDriverPass] = useState("");
  const [announceText, setAnnounceText] = useState(settings.announcements.join("\n"));

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingProfiles = profiles.filter((p) => p.status === "pending");

  const startNewProduct = () => {
    setEditing({ id: "p" + Date.now(), restaurantId: restaurants[0].id, name: "", description: "", price: 0, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80" });
    setOpen(true);
  };

  const startNewCategory = () => {
    setEditCat({ id: "c" + Date.now(), name: "", icon: "Tag" });
    setCatOpen(true);
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Stat icon={Package} label="عدد الطلبات" value={orders.length.toString()} />
          <Stat icon={Users} label="المطاعم" value={restaurants.length.toString()} />
          <Stat icon={Tag} label="الأقسام" value={categories.length.toString()} />
          <Stat icon={DollarSign} label="الإيرادات" value={formatSYP(totalRevenue)} />
          <Stat icon={Wallet} label="أرباح الكباتن" value={formatSYP(driverEarnings)} />
        </div>

        <Tabs defaultValue="orders">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
            <TabsTrigger value="registrations" className="gap-1.5">
              <UserPlus className="w-3.5 h-3.5" />
              طلبات التسجيل
              {pendingProfiles.length > 0 && (
                <span className="bg-primary text-white text-[10px] font-black rounded-full px-1.5 min-w-[18px] grid place-items-center">{pendingProfiles.length}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="products">المنتجات</TabsTrigger>
            <TabsTrigger value="categories">الأقسام</TabsTrigger>
            <TabsTrigger value="settings">إعدادات النظام</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-4 space-y-3">
            {orders.length === 0 && (
              <div className="text-center py-12 bg-card rounded-2xl border text-muted-foreground">لا توجد طلبات حالياً - الإحصائيات تبدأ من صفر وتتحدث تلقائياً مع كل طلب جديد</div>
            )}
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

          <TabsContent value="registrations" className="mt-4 space-y-3">
            <h3 className="font-black text-lg flex items-center gap-2"><UserPlus className="w-5 h-5 text-primary" />طلبات تسجيل الزبائن</h3>
            {profiles.length === 0 && (
              <div className="text-center py-12 bg-card rounded-2xl border text-muted-foreground">لا توجد طلبات تسجيل بعد — ستظهر الطلبات الجديدة هنا فوراً مع تنبيه لحظي</div>
            )}
            {profiles.map((p) => (
              <div key={p.id} className="bg-card border border-border rounded-2xl p-4 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-black">{p.name}</div>
                    <div className="text-xs text-muted-foreground" dir="ltr">{p.phone}</div>
                    {p.address && <div className="text-xs text-muted-foreground mt-0.5">📍 {p.address}</div>}
                    <div className="text-[11px] text-muted-foreground mt-1">سُجّل: {p.createdAt}</div>
                  </div>
                  <Badge variant={p.status === "approved" ? "default" : p.status === "rejected" ? "destructive" : "secondary"}>
                    {p.status === "pending" ? "قيد المراجعة" : p.status === "approved" ? "موافَق عليه" : "مرفوض"}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 border-t pt-3">
                  {p.status !== "approved" && (
                    <Button size="sm" onClick={() => { setProfileStatus(p.id, "approved"); toast.success(`تم تفعيل حساب ${p.name}`); }} className="gap-1 bg-gradient-hero text-white">
                      <UserCheck className="w-3.5 h-3.5" />موافقة
                    </Button>
                  )}
                  {p.status !== "rejected" && (
                    <Button size="sm" variant="outline" onClick={() => { setProfileStatus(p.id, "rejected"); toast.success("تم الرفض"); }} className="gap-1">
                      <UserX className="w-3.5 h-3.5" />رفض
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => { deleteProfile(p.id); toast.success("تم الحذف"); }} className="gap-1 text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />حذف
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="products" className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-black text-lg">إدارة المنتجات والأسعار</h3>
              <Button onClick={startNewProduct} className="bg-gradient-hero text-white gap-2"><Plus className="w-4 h-4" />منتج جديد</Button>
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

          <TabsContent value="categories" className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-black text-lg flex items-center gap-2"><Tag className="w-5 h-5 text-primary" />إدارة الأقسام الرئيسية</h3>
              <Button onClick={startNewCategory} className="bg-gradient-hero text-white gap-2"><Plus className="w-4 h-4" />قسم جديد</Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((c) => (
                <div key={c.id} className="bg-card border border-border rounded-2xl p-4 shadow-soft flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-hero text-white grid place-items-center font-black">{c.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate">{c.name}</div>
                    <div className="text-[11px] text-muted-foreground">أيقونة: {c.icon}</div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => { setEditCat(c); setCatOpen(true); }} className="h-8 px-2 gap-1"><Pencil className="w-3 h-3" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => { deleteCategory(c.id); toast.success("تم حذف القسم"); }} className="h-8 px-2 text-destructive"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-4 space-y-4">
            <h3 className="font-black text-lg flex items-center gap-2"><SettingsIcon className="w-5 h-5 text-primary" />إعدادات النظام</h3>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
              <h4 className="font-black mb-3 flex items-center gap-2"><KeyRound className="w-4 h-4 text-primary" />كلمات المرور</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>كلمة مرور الأدمن الحالية: <code className="bg-muted px-1 rounded text-xs">{settings.adminPassword}</code></Label>
                  <div className="flex gap-2">
                    <Input value={newAdminPass} onChange={(e) => setNewAdminPass(e.target.value)} placeholder="كلمة مرور جديدة للأدمن" />
                    <Button onClick={() => {
                      if (!newAdminPass) return toast.error("أدخل كلمة مرور");
                      updateSettings({ adminPassword: newAdminPass });
                      setNewAdminPass("");
                      toast.success("تم تحديث كلمة مرور الأدمن");
                    }}>حفظ</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>كلمة مرور الكابتن الحالية: <code className="bg-muted px-1 rounded text-xs">{settings.driverPassword}</code></Label>
                  <div className="flex gap-2">
                    <Input value={newDriverPass} onChange={(e) => setNewDriverPass(e.target.value)} placeholder="كلمة مرور جديدة للكابتن" />
                    <Button onClick={() => {
                      if (!newDriverPass) return toast.error("أدخل كلمة مرور");
                      updateSettings({ driverPassword: newDriverPass });
                      setNewDriverPass("");
                      toast.success("تم تحديث كلمة مرور الكابتن");
                    }}>حفظ</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
              <h4 className="font-black mb-3 flex items-center gap-2"><Megaphone className="w-4 h-4 text-primary" />نص الإعلان المتحرك</h4>
              <p className="text-xs text-muted-foreground mb-2">كل سطر يمثل إعلاناً منفصلاً يظهر في الشريط العلوي للتطبيق</p>
              <Textarea value={announceText} onChange={(e) => setAnnounceText(e.target.value)} rows={6} className="font-mono text-sm" />
              <Button
                className="mt-3 bg-gradient-hero text-white"
                onClick={() => {
                  const lines = announceText.split("\n").map((l) => l.trim()).filter(Boolean);
                  updateSettings({ announcements: lines });
                  toast.success("تم تحديث الإعلانات - شاهدها فوراً في الشريط العلوي");
                }}
              >حفظ الإعلانات</Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Product dialog */}
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

      {/* Category dialog */}
      <Dialog open={catOpen} onOpenChange={setCatOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle className="text-right">{editCat && categories.find((x) => x.id === editCat.id) ? "تعديل قسم" : "قسم جديد"}</DialogTitle></DialogHeader>
          {editCat && (
            <div className="space-y-3">
              <div className="space-y-2"><Label>اسم القسم</Label><Input value={editCat.name} onChange={(e) => setEditCat({ ...editCat, name: e.target.value })} placeholder="مثال: مشاوي، بقالة، حلويات" /></div>
              <div className="space-y-2"><Label>الأيقونة</Label>
                <Select value={editCat.icon} onValueChange={(v) => setEditCat({ ...editCat, icon: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{iconChoices.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-gradient-hero text-white" onClick={() => {
                  if (!editCat.name.trim()) return toast.error("أدخل اسم القسم");
                  upsertCategory(editCat); setCatOpen(false); toast.success("تم حفظ القسم - يظهر فوراً في الواجهة");
                }}>حفظ</Button>
                <Button variant="outline" onClick={() => setCatOpen(false)}><X className="w-4 h-4" /></Button>
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
