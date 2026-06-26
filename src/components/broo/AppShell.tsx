import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AnnouncementBar } from "./AnnouncementBar";
import { Navbar } from "./Navbar";
import { Home } from "./Home";
import { RestaurantMenu } from "./RestaurantMenu";
import { CartSidebar } from "./CartSidebar";
import { Footer } from "./Footer";
import { LoginDialog } from "./LoginDialog";
import { DriverDashboard } from "./DriverDashboard";
import { AdminDashboard } from "./AdminDashboard";
import { ChatWidget } from "./ChatWidget";
import { RoleSwitcher } from "./RoleSwitcher";
import { SplashScreen } from "./SplashScreen";
import { Toaster } from "@/components/ui/sonner";

export function AppShell() {
  const { role } = useApp();
  const [activeRestaurant, setActiveRestaurant] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [splash, setSplash] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.sessionStorage.getItem("broo_splash_seen");
  });

  if (splash) {
    return (
      <SplashScreen
        onDone={() => {
          window.sessionStorage.setItem("broo_splash_seen", "1");
          setSplash(false);
        }}
      />
    );
  }

  if (role === "driver") return (<><DriverDashboard /><RoleSwitcher /><Toaster position="top-center" richColors /></>);
  if (role === "admin") return (<><AdminDashboard /><RoleSwitcher /><Toaster position="top-center" richColors /></>);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <Navbar onLogin={() => setLoginOpen(true)} onHome={() => setActiveRestaurant(null)} />
      <main className="flex-1">
        {activeRestaurant ? (
          <RestaurantMenu restaurantId={activeRestaurant} onBack={() => setActiveRestaurant(null)} />
        ) : (
          <Home onOpenRestaurant={(id) => setActiveRestaurant(id)} />
        )}
      </main>
      <Footer />
      <CartSidebar />
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <ChatWidget />
      <RoleSwitcher />
      <Toaster position="top-center" richColors />
    </div>
  );
}