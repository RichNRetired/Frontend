"use client";

import { Provider } from "react-redux";
import { store } from "../store";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import BottomNav from "../components/layout/BottomNav";
import { WhatsAppFloatingIcon } from "../components/ui/WhatsAppFloatingIcon";
import { useEffect } from "react";
import initAuth from "../services/auth-bootstrap";
import { usePathname } from "next/navigation";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isCheckoutRoute = pathname?.startsWith("/checkout");

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <Provider store={store}>
      {!isCheckoutRoute && <Header />}
      <main>{children}</main>
      <Footer />
      <BottomNav />
      <WhatsAppFloatingIcon />
    </Provider>
  );
}
