"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface GlobalContextType {
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  checkout: boolean;
  setCheckout: (show: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [showCart, setShowCart] = useState(false);
  const [checkout, setCheckout] = useState(false);
  return (
    <GlobalContext.Provider
      value={{ showCart, setShowCart, checkout, setCheckout }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
}
