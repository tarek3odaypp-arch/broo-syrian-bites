import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

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

const initialOrders: Order[] = [
  {
    id: "o1001",
    customer: "أحمد العلي",
    phone: "0994815815",
    address: "دمشق - المزة - شارع الجلاء",
    items: [{ product: initialProducts[0], qty: 2 }, { product: initialProducts[1], qty: 1 }],
    total: 72000,
    status: "قيد التحضير",
    createdAt: "منذ 5 دقائق",
  },
  {
    id: "o1002",
    customer: "ليلى حسن",
    phone: "0952203148",
    address: "حلب - الفرقان - شارع نيسان",
    items: [{ product: initialProducts[5], qty: 1 }],
    total: 45000,
    status: "جاري التوصيل",
    createdAt: "منذ 20 دقيقة",
  },
];

type AppState = {
  restaurants: Restaurant[];
  products: Product[];
  orders: Order[];
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
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  login: (role: Role) => void;
  logout: () => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [restaurants] = useState(initialRestaurants);
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [role, setRole] = useState<Role | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const value = useMemo<AppState>(() => ({
    restaurants, products, orders, cart, role, cartOpen, setCartOpen,
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
    },
    upsertProduct: (p) => setProducts((arr) => {
      const exists = arr.find((x) => x.id === p.id);
      if (exists) return arr.map((x) => x.id === p.id ? p : x);
      return [...arr, p];
    }),
    deleteProduct: (id) => setProducts((arr) => arr.filter((p) => p.id !== id)),
    updateOrderStatus: (id, status) => setOrders((arr) => arr.map((o) => o.id === id ? { ...o, status } : o)),
    login: (r) => setRole(r),
    logout: () => setRole(null),
  }), [restaurants, products, orders, cart, role, cartOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export const formatSYP = (n: number) =>
  new Intl.NumberFormat("ar-SY").format(n) + " ل.س";