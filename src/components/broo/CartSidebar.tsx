import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp, formatSYP } from "@/context/AppContext";
import { useState } from "react";
import { toast } from "sonner";

export function CartSidebar() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, placeOrder } = useApp();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const delivery = subtotal === 0 ? 0 : subtotal > 100000 ? 0 : 15000;
  const total = subtotal + delivery;

  const checkout = () => {
    if (!name || !phone || !address) {
      toast.error("الرجاء تعبئة كافة الحقول");
      return;
    }
    placeOrder({ customer: name, phone, address });
    toast.success("تم استلام طلبك! سيتواصل معك السائق قريباً");
    setName(""); setPhone(""); setAddress("");
    setCartOpen(false);
  };

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="left" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-5 border-b">
          <SheetTitle className="text-right text-xl font-black flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            سلة المشتريات
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 grid place-items-center text-center p-8">
            <div>
              <div className="w-20 h-20 mx-auto rounded-full bg-muted grid place-items-center mb-3">
                <ShoppingBag className="w-9 h-9 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">سلتك فارغة - ابدأ بإضافة منتجاتك المفضلة</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((i) => (
                <div key={i.product.id} className="flex gap-3 p-3 bg-card border border-border rounded-2xl">
                  <img src={i.product.image} alt={i.product.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm truncate">{i.product.name}</h4>
                      <button onClick={() => removeFromCart(i.product.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-primary font-black text-sm mt-1">{formatSYP(i.product.price * i.qty)}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(i.product.id, i.qty - 1)} className="w-7 h-7 rounded-lg border border-border grid place-items-center">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-sm w-5 text-center">{i.qty}</span>
                      <button onClick={() => updateQty(i.product.id, i.qty + 1)} className="w-7 h-7 rounded-lg bg-gradient-hero text-white grid place-items-center">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-muted/60 rounded-2xl p-4 space-y-2 mt-4">
                <h4 className="font-bold text-sm mb-2">معلومات التوصيل</h4>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" className="bg-background" />
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الموبايل" className="bg-background" />
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="العنوان التفصيلي" className="bg-background" />
              </div>
            </div>

            <div className="border-t p-5 space-y-2 bg-background">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>المجموع الفرعي</span>
                <span className="font-bold text-foreground">{formatSYP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>رسوم التوصيل</span>
                <span className="font-bold text-foreground">{delivery === 0 ? "مجاناً" : formatSYP(delivery)}</span>
              </div>
              <div className="flex justify-between font-black text-lg pt-2 border-t">
                <span>الإجمالي</span>
                <span className="text-primary">{formatSYP(total)}</span>
              </div>
              <Button onClick={checkout} className="w-full bg-gradient-hero hover:opacity-90 text-white h-12 rounded-2xl font-black shadow-elegant mt-2">
                تأكيد الطلب
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}