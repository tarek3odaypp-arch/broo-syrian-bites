import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Role = "customer" | "driver" | "admin";

export type Product = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

export type Restaurant = {
  id: string;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  image: string;
  tagline: string;
};

export type Category = { id: string; name: string; icon: string };

export type ChatMessage = {
  id: string;
  from: "customer" | "support";
  text: string;
  at: string;
};

export type Settings = {
  adminPassword: string;
  driverPassword: string;
  announcements: string[];
};

export type ProfileStatus = "pending" | "approved" | "rejected";
export type Profile = {
  id: string;
  name: string;
  phone: string;
  password: string;
  address: string;
  status: ProfileStatus;
  createdAt: string;
};

export type CartItem = { product: Product; qty: number };

export type OrderStatus = "جديد" | "قيد التحضير" | "جاري التوصيل" | "تم التسليم";

export type Order = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};

const initialRestaurants: Restaurant[] = [
  { id: "r1", name: "مطعم الشام", category: "شامي", rating: 4.8, deliveryTime: "25-35 د", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80", tagline: "أطباق شامية أصيلة" },
  { id: "r2", name: "بيت البرغر", category: "وجبات سريعة", rating: 4.6, deliveryTime: "20-30 د", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80", tagline: "برغر طازج يومياً" },
  { id: "r3", name: "بيتزا روما", category: "إيطالي", rating: 4.7, deliveryTime: "30-40 د", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80", tagline: "بيتزا إيطالية بالحطب" },
  { id: "r4", name: "حلويات السلطان", category: "حلويات", rating: 4.9, deliveryTime: "15-25 د", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80", tagline: "بقلاوة وكنافة شهية" },
  { id: "r5", name: "سوبر ماركت النور", category: "بقالة", rating: 4.5, deliveryTime: "30-45 د", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80", tagline: "كل احتياجات منزلك" },
  { id: "r6", name: "مشاوي أبو علي", category: "مشاوي", rating: 4.8, deliveryTime: "35-45 د", image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80", tagline: "مشاوي على الفحم" },
];

const initialCategories: Category[] = [
  { id: "c1", name: "وجبات سريعة", icon: "UtensilsCrossed" },
  { id: "c2", name: "إيطالي", icon: "Pizza" },
  { id: "c3", name: "حلويات", icon: "IceCream" },
  { id: "c4", name: "بقالة", icon: "ShoppingBasket" },
  { id: "c5", name: "مشاوي", icon: "Flame" },
  { id: "c6", name: "شامي", icon: "Coffee" },
];

const initialProducts: Product[] = [
  { id: "p1", restaurantId: "r1", name: "شاورما دجاج", description: "خبز صاج مع دجاج متبل وصلصة الثوم", price: 25000, image: "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=600&q=80" },
  { id: "p2", restaurantId: "r1", name: "فتة حمص", description: "فتة حمص بالطحينة واللبن والصنوبر", price: 22000, image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600&q=80" },
  { id: "p3", restaurantId: "r1", name: "كبة مقلية", description: "كبة لحمة مقرمشة - 4 حبات", price: 30000, image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=600&q=80" },
  { id: "p4", restaurantId: "r2", name: "برغر لحم كلاسيك", description: "لحم بقري مشوي، جبنة شيدر، خس، طماطم", price: 35000, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80" },
  { id: "p5", restaurantId: "r2", name: "دجاج مقرمش", description: "قطع دجاج مقرمشة مع صلصة خاصة", price: 28000, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=80" },
  { id: "p6", restaurantId: "r3", name: "بيتزا مارغريتا", description: "صلصة طماطم، موزاريلا، ريحان طازج", price: 45000, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80" },
  { id: "p7", restaurantId: "r3", name: "بيتزا بيبروني", description: "صلصة طماطم، جبنة، شرائح بيبروني", price: 50000, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80" },
  { id: "p8", restaurantId: "r4", name: "كنافة بالجبنة", description: "كنافة ناعمة بالجبنة والقطر", price: 18000, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80" },
  { id: "p9", restaurantId: "r4", name: "بقلاوة فستق", description: "بقلاوة محشوة بالفستق الحلبي", price: 32000, image: "https://images.unsplash.com/photo-1583243567239-3727b9f3f5fc?w=600&q=80" },
  { id: "p10", restaurantId: "r5", name: "زيت زيتون 1 لتر", description: "زيت زيتون بكر ممتاز", price: 60000, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80" },
  { id: "p11", restaurantId: "r5", name: "أرز بسمتي 5 كغ", description: "أرز بسمتي طويل الحبة", price: 75000, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80" },
  { id: "p12", restaurantId: "r6", name: "مشكل مشاوي", description: "كباب، شيش طاووق، ريش، خضار مشوية", price: 95000, image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80" },
];

const initialOrders: Order[] = [];

// ---------- Supabase row <-> app type mappers ----------
type RestaurantRow = { id: string; name: string; category: string; rating: number; delivery_time: string; image: string; tagline: string };
type ProductRow = { id: string; restaurant_id: string; name: string; description: string; price: number; image: string };
type OrderRow = { id: string; customer: string; phone: string; address: string; items: CartItem[]; total: number; status: OrderStatus; created_at: string };
type ChatRow = { id: string; from_role: "customer" | "support"; text: string; created_at: string };
type SettingRow = { key: string; value: unknown };

const toRestaurant = (r: RestaurantRow): Restaurant => ({
  id: r.id, name: r.name, category: r.category, rating: Number(r.rating),
  deliveryTime: r.delivery_time, image: r.image, tagline: r.tagline,
});
const toProduct = (p: ProductRow): Product => ({
  id: p.id, restaurantId: p.restaurant_id, name: p.name,
  description: p.description, price: Number(p.price), image: p.image,
});
const toOrder = (o: OrderRow): Order => ({
  id: o.id, customer: o.customer, phone: o.phone, address: o.address,
  items: o.items, total: Number(o.total), status: o.status,
  createdAt: new Date(o.created_at).toLocaleString("ar-SY"),
});
const toChat = (m: ChatRow): ChatMessage => ({
  id: m.id, from: m.from_role, text: m.text,
  at: new Date(m.created_at).toLocaleTimeString("ar-SY", { hour: "2-digit", minute: "2-digit" }),
});

const initialSettings: Settings = {
  adminPassword: "admin123",
  driverPassword: "driver123",
  announcements: [
    "خصم 25% على أول طلب لك من برو ديليفري",
    "توصيل مجاني للطلبات فوق 100,000 ل.س",
    "اطلب وجبتين واحصل على عصير مجاناً",
    "تطبيق برو الآن في كل المحافظات السورية",
  ],
};

type AppState = {
  restaurants: Restaurant[];
  products: Product[];
  orders: Order[];
  categories: Category[];
  settings: Settings;
  chat: ChatMessage[];
  profiles: Profile[];
  currentUser: Profile | null;
  customerWallet: number;
  driverEarnings: number;
  cart: CartItem[];
  role: Role | null;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  addToCart: (p: Product) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: (info: { customer: string; phone: string; address: string }) => void;
  upsertProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  upsertCategory: (c: Category) => void;
  deleteCategory: (id: string) => void;
  updateSettings: (s: Partial<Settings>) => void;
  sendChat: (from: "customer" | "support", text: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  login: (role: Role) => void;
  setRole: (r: Role | null) => void;
  logout: () => void;
  registerCustomer: (data: { name: string; phone: string; password: string; address: string }) => Promise<{ ok: boolean; message: string }>;
  loginCustomer: (phone: string, password: string) => Promise<{ ok: boolean; message: string }>;
  setProfileStatus: (id: string, status: ProfileStatus) => void;
  deleteProfile: (id: string) => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [categories, setCategories] = useState(initialCategories);
  const [settings, setSettings] = useState(initialSettings);
  const [chat, setChat] = useState<ChatMessage[]>([
    { id: "m1", from: "support", text: "أهلاً بك في دعم BROO! كيف يمكننا مساعدتك؟", at: "الآن" },
  ]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [role, setRole] = useState<Role | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem("broo_current_user");
      return raw ? (JSON.parse(raw) as Profile) : null;
    } catch { return null; }
  });

  // Persist current user session across reloads
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (currentUser) window.localStorage.setItem("broo_current_user", JSON.stringify(currentUser));
    else window.localStorage.removeItem("broo_current_user");
  }, [currentUser]);

  // ---------- Initial fetch + realtime sync ----------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [r, c, p, o, s, m, pr] = await Promise.all([
        supabase.from("restaurants").select("*"),
        supabase.from("categories").select("*"),
        supabase.from("products").select("*"),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("settings").select("*"),
        supabase.from("chat_messages").select("*").order("created_at", { ascending: true }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      ]);
      if (cancelled) return;
      if (r.data && r.data.length) setRestaurants(r.data.map(toRestaurant));
      if (c.data && c.data.length) setCategories(c.data as Category[]);
      if (p.data && p.data.length) setProducts(p.data.map(toProduct));
      if (o.data) setOrders(o.data.map(toOrder));
      if (s.data && s.data.length) {
        const map = Object.fromEntries((s.data as SettingRow[]).map((row) => [row.key, row.value]));
        setSettings({
          adminPassword: (map.admin_password as string) ?? initialSettings.adminPassword,
          driverPassword: (map.driver_password as string) ?? initialSettings.driverPassword,
          announcements: (map.announcements as string[]) ?? initialSettings.announcements,
        });
      }
      if (m.data && m.data.length) setChat(m.data.map(toChat));
      if (pr.data) setProfiles(pr.data.map(toProfile));
    })();

    const refetch = {
      restaurants: async () => {
        const { data } = await supabase.from("restaurants").select("*");
        if (data) setRestaurants(data.map(toRestaurant));
      },
      categories: async () => {
        const { data } = await supabase.from("categories").select("*");
        if (data) setCategories(data as Category[]);
      },
      products: async () => {
        const { data } = await supabase.from("products").select("*");
        if (data) setProducts(data.map(toProduct));
      },
      orders: async () => {
        const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
        if (data) setOrders(data.map(toOrder));
      },
      settings: async () => {
        const { data } = await supabase.from("settings").select("*");
        if (data) {
          const map = Object.fromEntries((data as SettingRow[]).map((row) => [row.key, row.value]));
          setSettings((cur) => ({
            adminPassword: (map.admin_password as string) ?? cur.adminPassword,
            driverPassword: (map.driver_password as string) ?? cur.driverPassword,
            announcements: (map.announcements as string[]) ?? cur.announcements,
          }));
        }
      },
      chat: async () => {
        const { data } = await supabase.from("chat_messages").select("*").order("created_at", { ascending: true });
        if (data) setChat(data.map(toChat));
      },
      profiles: async () => {
        const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
        if (data) setProfiles(data.map(toProfile));
      },
    };

    const channel = supabase
      .channel("broo-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "restaurants" }, refetch.restaurants)
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, refetch.categories)
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, refetch.products)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, refetch.orders)
      .on("postgres_changes", { event: "*", schema: "public", table: "settings" }, refetch.settings)
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_messages" }, refetch.chat)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "profiles" }, (payload) => {
        refetch.profiles();
        const row = payload.new as ProfileRow | undefined;
        if (row) {
          toast.info(`🔔 طلب تسجيل جديد: ${row.name} (${row.phone})`, { duration: 8000 });
        }
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles" }, (payload) => {
        refetch.profiles();
        const row = payload.new as ProfileRow | undefined;
        // If the currently logged-in customer was approved/rejected, sync local session
        setCurrentUser((cur) => (cur && row && cur.id === row.id ? toProfile(row) : cur));
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "profiles" }, refetch.profiles)
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  const customerWallet = 0; // يبدأ من صفر — يتحدث مع كل عملية شحن لاحقاً
  const driverEarnings = orders
    .filter((o) => o.status === "تم التسليم")
    .reduce((s, o) => s + Math.round(o.total * 0.1), 0);

  const value = useMemo<AppState>(() => ({
    restaurants, products, orders, categories, settings, chat,
    profiles, currentUser,
    customerWallet, driverEarnings,
    cart, role, cartOpen, setCartOpen,
    addToCart: (p) => setCart((c) => {
      const found = c.find((i) => i.product.id === p.id);
      if (found) return c.map((i) => i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { product: p, qty: 1 }];
    }),
    updateQty: (id, qty) => setCart((c) => qty <= 0 ? c.filter((i) => i.product.id !== id) : c.map((i) => i.product.id === id ? { ...i, qty } : i)),
    removeFromCart: (id) => setCart((c) => c.filter((i) => i.product.id !== id)),
    clearCart: () => setCart([]),
    placeOrder: (info) => {
      const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
      const order: Order = {
        id: "o" + Math.floor(Math.random() * 9000 + 1000),
        ...info,
        items: cart,
        total,
        status: "جديد",
        createdAt: "الآن",
      };
      setOrders((o) => [order, ...o]);
      setCart([]);
      void supabase.from("orders").insert({
        id: order.id, customer: order.customer, phone: order.phone, address: order.address,
        items: order.items, total: order.total, status: order.status,
      });
    },
    upsertProduct: (p) => {
      setProducts((arr) => {
        const exists = arr.find((x) => x.id === p.id);
        return exists ? arr.map((x) => x.id === p.id ? p : x) : [...arr, p];
      });
      void supabase.from("products").upsert({
        id: p.id, restaurant_id: p.restaurantId, name: p.name,
        description: p.description, price: p.price, image: p.image,
      });
    },
    deleteProduct: (id) => {
      setProducts((arr) => arr.filter((p) => p.id !== id));
      void supabase.from("products").delete().eq("id", id);
    },
    upsertCategory: (c) => {
      setCategories((arr) => {
        const exists = arr.find((x) => x.id === c.id);
        return exists ? arr.map((x) => x.id === c.id ? c : x) : [...arr, c];
      });
      void supabase.from("categories").upsert({ id: c.id, name: c.name, icon: c.icon });
    },
    deleteCategory: (id) => {
      setCategories((arr) => arr.filter((c) => c.id !== id));
      void supabase.from("categories").delete().eq("id", id);
    },
    updateSettings: (s) => {
      setSettings((cur) => ({ ...cur, ...s }));
      const rows: { key: string; value: unknown }[] = [];
      if (s.adminPassword !== undefined) rows.push({ key: "admin_password", value: s.adminPassword });
      if (s.driverPassword !== undefined) rows.push({ key: "driver_password", value: s.driverPassword });
      if (s.announcements !== undefined) rows.push({ key: "announcements", value: s.announcements });
      if (rows.length) void supabase.from("settings").upsert(rows);
    },
    sendChat: (from, text) => {
      const msg: ChatMessage = { id: "m" + Date.now(), from, text, at: "الآن" };
      setChat((c) => [...c, msg]);
      void supabase.from("chat_messages").insert({ from_role: from, text });
    },
    updateOrderStatus: (id, status) => {
      setOrders((arr) => arr.map((o) => o.id === id ? { ...o, status } : o));
      void supabase.from("orders").update({ status }).eq("id", id);
    },
    login: (r) => setRole(r),
    setRole: (r) => setRole(r),
    logout: () => { setRole(null); setCurrentUser(null); },
    registerCustomer: async ({ name, phone, password, address }) => {
      const cleanPhone = phone.trim();
      if (!/^09\d{8}$/.test(cleanPhone)) return { ok: false, message: "رقم الموبايل يجب أن يبدأ بـ 09 ويتكوّن من 10 أرقام" };
      if (password.length < 4) return { ok: false, message: "كلمة المرور قصيرة جداً" };
      if (!name.trim()) return { ok: false, message: "أدخل الاسم الكامل" };
      const existing = profiles.find((p) => p.phone === cleanPhone);
      if (existing) return { ok: false, message: "هذا الرقم مسجّل مسبقاً" };
      const { data, error } = await supabase.from("profiles").insert({
        name: name.trim(), phone: cleanPhone, password, address: address.trim(), status: "pending",
      }).select().single();
      if (error || !data) return { ok: false, message: "تعذّر إنشاء الحساب — تحقّق من تشغيل سكربت قاعدة البيانات" };
      const created = toProfile(data as ProfileRow);
      setProfiles((arr) => [created, ...arr.filter((x) => x.id !== created.id)]);
      setCurrentUser(created);
      return { ok: true, message: "تم إرسال طلبك! بانتظار موافقة الإدارة." };
    },
    loginCustomer: async (phone, password) => {
      const cleanPhone = phone.trim();
      const { data } = await supabase.from("profiles").select("*").eq("phone", cleanPhone).maybeSingle();
      const found = data ? toProfile(data as ProfileRow) : profiles.find((p) => p.phone === cleanPhone);
      if (!found) return { ok: false, message: "هذا الرقم غير مسجّل" };
      if (found.password !== password) return { ok: false, message: "كلمة المرور غير صحيحة" };
      setCurrentUser(found);
      if (found.status === "pending") return { ok: true, message: "حسابك بانتظار موافقة الإدارة" };
      if (found.status === "rejected") return { ok: false, message: "تم رفض حسابك — تواصل مع الدعم" };
      setRole("customer");
      return { ok: true, message: `أهلاً ${found.name}` };
    },
    setProfileStatus: (id, status) => {
      setProfiles((arr) => arr.map((p) => p.id === id ? { ...p, status } : p));
      void supabase.from("profiles").update({ status }).eq("id", id);
    },
    deleteProfile: (id) => {
      setProfiles((arr) => arr.filter((p) => p.id !== id));
      void supabase.from("profiles").delete().eq("id", id);
    },
  }), [restaurants, products, orders, categories, settings, chat, profiles, currentUser, customerWallet, driverEarnings, cart, role, cartOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export const formatSYP = (n: number) =>
  new Intl.NumberFormat("ar-SY").format(n) + " ل.س";