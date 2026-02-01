"use client";

import { Provider } from "react-redux";
import { store } from "../store";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import BottomNav from "../components/layout/BottomNav";
import { useEffect } from "react";
import initAuth from "../services/auth-bootstrap";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  useEffect(() => {
    // initialize sticky session: try refreshing tokens on app start
    initAuth();
  }, []);

  return (
    <Provider store={store}>
      <Header />
      <main>{children}</main>
      <Footer />
      <BottomNav />
    </Provider>
  );
}
