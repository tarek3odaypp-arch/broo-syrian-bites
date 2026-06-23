import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Bike, ShieldCheck, Lock, Info } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

// Mock credentials — note shown to user that admin controls these
const DRIVER_PASS = "driver123";
const ADMIN_PASS = "admin123";

export function LoginDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { login } = useApp();
  const [driverPass, setDriverPass] = useState("");
  const [adminPass, setAdminPass] = useState("");

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
            <div className="space-y-2">
              <Label>رقم الموبايل</Label>
              <Input placeholder="09xxxxxxxx" />
            </div>
            <div className="space-y-2">
              <Label>كلمة المرور</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button onClick={() => { toast.success("أهلاً وسهلاً بك!"); onOpenChange(false); }} className="w-full bg-gradient-hero text-white h-11 rounded-xl font-bold">
              دخول كزبون
            </Button>
            <p className="text-xs text-center text-muted-foreground">ليس لديك حساب؟ <span className="text-primary font-bold cursor-pointer">سجل الآن</span></p>
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
                if (driverPass === DRIVER_PASS) {
                  login("driver");
                  onOpenChange(false);
                  toast.success("مرحباً أيها السائق");
                } else toast.error("كلمة المرور غير صحيحة - راجع الأدمن");
              }}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-11 rounded-xl font-bold"
            >
              دخول لوحة السائق
            </Button>
            <p className="text-[11px] text-muted-foreground text-center">للتجربة: <code className="bg-muted px-1 rounded">driver123</code></p>
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
                if (adminPass === ADMIN_PASS) {
                  login("admin");
                  onOpenChange(false);
                  toast.success("مرحباً بك في لوحة الإدارة");
                } else toast.error("كلمة المرور غير صحيحة");
              }}
              className="w-full bg-foreground hover:bg-foreground/90 text-background h-11 rounded-xl font-bold"
            >
              دخول لوحة الإدارة
            </Button>
            <p className="text-[11px] text-muted-foreground text-center">للتجربة: <code className="bg-muted px-1 rounded">admin123</code></p>
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