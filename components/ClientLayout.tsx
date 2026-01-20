"use client";

import { Provider } from "react-redux";
import { store } from "../store";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <Provider store={store}>
      <Header />
      <main>{children}</main>
      <Footer />
    </Provider>
  );
}
