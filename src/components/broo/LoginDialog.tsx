import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Bike, ShieldCheck, Lock, Info, Clock } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export function LoginDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { login, settings, registerCustomer, loginCustomer } = useApp();
  const [driverPass, setDriverPass] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-xl font-black">تسجيل الدخول إلى BROO</DialogTitle>
          <DialogDescription className="text-right">
            اختر نوع الحساب الخاص بك للمتابعة
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="customer" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="customer" className="gap-1.5"><User className="w-4 h-4" />زبون</TabsTrigger>
            <TabsTrigger value="driver" className="gap-1.5"><Bike className="w-4 h-4" />سائق</TabsTrigger>
            <TabsTrigger value="admin" className="gap-1.5"><ShieldCheck className="w-4 h-4" />مدير</TabsTrigger>
          </TabsList>

          <TabsContent value="customer" className="space-y-3 mt-4">
            <div className="flex gap-2 bg-muted rounded-xl p-1">
              <button onClick={() => setMode("login")} className={`flex-1 h-9 rounded-lg text-sm font-bold ${mode === "login" ? "bg-background shadow-soft" : "text-muted-foreground"}`}>دخول</button>
              <button onClick={() => setMode("signup")} className={`flex-1 h-9 rounded-lg text-sm font-bold ${mode === "signup" ? "bg-background shadow-soft" : "text-muted-foreground"}`}>تسجيل جديد</button>
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label>الاسم الكامل</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: أحمد محمد" />
              </div>
            )}

            <div className="space-y-2">
              <Label>رقم الموبايل</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xxxxxxxx" inputMode="numeric" maxLength={10} />
            </div>

            <div className="space-y-2">
              <Label>كلمة المرور</Label>
              <Input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" />
            </div>

            {mode === "signup" && (
              <>
                <div className="space-y-2">
                  <Label>عنوان التوصيل (اختياري)</Label>
                  <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} placeholder="المدينة، الحي، تفاصيل إضافية" />
                </div>
                <div className="flex gap-2 bg-accent text-accent-foreground rounded-xl p-3 text-xs leading-relaxed">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>سيُنشأ حسابك بحالة <b>«قيد المراجعة»</b>. يتمّ تنبيه الإدارة فوراً، وتفعَّل خدماتك بعد الموافقة.</span>
                </div>
              </>
            )}

            <Button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  if (mode === "signup") {
                    const res = await registerCustomer({ name, phone, password: pass, address });
                    if (!res.ok) return toast.error(res.message);
                    toast.success(res.message);
                    onOpenChange(false);
                  } else {
                    const res = await loginCustomer(phone, pass);
                    if (!res.ok) return toast.error(res.message);
                    toast.success(res.message);
                    onOpenChange(false);
                  }
                } finally { setBusy(false); }
              }}
              className="w-full bg-gradient-hero text-white h-11 rounded-xl font-bold"
            >
              {busy ? "..." : mode === "signup" ? "إنشاء الحساب" : "دخول كزبون"}
            </Button>
          </TabsContent>

          <TabsContent value="driver" className="space-y-3 mt-4">
            <NoticeBox />
            <div className="space-y-2">
              <Label>رقم السائق</Label>
              <Input placeholder="مثال: DRV-1024" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1"><Lock className="w-3 h-3" /> كلمة المرور</Label>
              <Input type="password" value={driverPass} onChange={(e) => setDriverPass(e.target.value)} placeholder="••••••••" />
            </div>
            <Button
              onClick={() => {
                if (driverPass === settings.driverPassword) {
                  login("driver");
                  onOpenChange(false);
                  toast.success("مرحباً أيها السائق");
                } else toast.error("كلمة المرور غير صحيحة - راجع الأدمن");
              }}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-11 rounded-xl font-bold"
            >
              دخول لوحة السائق
            </Button>
            <p className="text-[11px] text-muted-foreground text-center">يتحكم الأدمن بكلمة المرور من لوحة الإعدادات</p>
          </TabsContent>

          <TabsContent value="admin" className="space-y-3 mt-4">
            <NoticeBox />
            <div className="space-y-2">
              <Label>اسم المستخدم</Label>
              <Input placeholder="admin" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1"><Lock className="w-3 h-3" /> كلمة المرور</Label>
              <Input type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} placeholder="••••••••" />
            </div>
            <Button
              onClick={() => {
                if (adminPass === settings.adminPassword) {
                  login("admin");
                  onOpenChange(false);
                  toast.success("مرحباً بك في لوحة الإدارة");
                } else toast.error("كلمة المرور غير صحيحة");
              }}
              className="w-full bg-foreground hover:bg-foreground/90 text-background h-11 rounded-xl font-bold"
            >
              دخول لوحة الإدارة
            </Button>
            <p className="text-[11px] text-muted-foreground text-center">يمكن تغيير كلمة المرور من إعدادات النظام</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function NoticeBox() {
  return (
    <div className="flex gap-2 bg-accent text-accent-foreground rounded-xl p-3 text-xs leading-relaxed">
      <Info className="w-4 h-4 shrink-0 mt-0.5" />
      <span>
        لوحات السائق والمدير <b>محميتان بكلمات مرور يتحكم بها الأدمن حصراً</b>. للحصول على بيانات الدخول، يرجى التواصل مع إدارة BROO.
      </span>
    </div>
  );
}