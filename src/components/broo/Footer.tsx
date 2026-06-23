import { Phone, MessageCircle, MapPin, Mail, Facebook, Instagram } from "lucide-react";

const customerService = "0994815815";
const complaints = "0952203148";
const waLink = (n: string) => `https://wa.me/963${n.replace(/^0/, "")}`;

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-10">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-hero grid place-items-center font-black text-lg text-white">B</div>
            <div>
              <div className="font-black text-lg">BROO delivery</div>
              <div className="text-xs opacity-70">برو ديليفري</div>
            </div>
          </div>
          <p className="text-sm opacity-75 leading-relaxed">
            خدمة توصيل الطعام والبضائع الأسرع في سوريا. نوصلك كل ما تحتاجه إلى باب بيتك.
          </p>
        </div>

        <div>
          <h4 className="font-black mb-3 text-primary-glow">خدمة العملاء</h4>
          <a
            href={waLink(customerService)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-secondary/20 hover:bg-secondary/30 rounded-xl p-3 mb-2 transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-secondary" />
            <div>
              <div className="text-xs opacity-75">واتساب - خدمة الزبائن</div>
              <div className="font-bold tracking-wider" dir="ltr">{customerService}</div>
            </div>
          </a>
          <a href={`tel:${customerService}`} className="text-xs opacity-75 inline-flex items-center gap-1">
            <Phone className="w-3 h-3" /> اتصال مباشر
          </a>
        </div>

        <div>
          <h4 className="font-black mb-3 text-primary-glow">الشكاوى والاقتراحات</h4>
          <a
            href={waLink(complaints)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-secondary/20 hover:bg-secondary/30 rounded-xl p-3 mb-2 transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-secondary" />
            <div>
              <div className="text-xs opacity-75">واتساب - الشكاوى</div>
              <div className="font-bold tracking-wider" dir="ltr">{complaints}</div>
            </div>
          </a>
          <a href={`tel:${complaints}`} className="text-xs opacity-75 inline-flex items-center gap-1">
            <Phone className="w-3 h-3" /> اتصال مباشر
          </a>
        </div>

        <div>
          <h4 className="font-black mb-3 text-primary-glow">تواصل معنا</h4>
          <p className="text-sm opacity-75 flex items-start gap-2 mb-2">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" /> سوريا - جميع المحافظات
          </p>
          <p className="text-sm opacity-75 flex items-center gap-2 mb-3">
            <Mail className="w-4 h-4" /> info@broo-delivery.sy
          </p>
          <div className="flex gap-2">
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} BROO delivery - جميع الحقوق محفوظة
      </div>
    </footer>
  );
}