"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface CartContextType {
  cart: any[];
  isAuthenticated: boolean;
  setCart;
  removeFromCart: (productId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }

    const handleAuthChange = () => {
      const newToken = localStorage.getItem("authToken");
      setToken(newToken);
    };

    window.addEventListener("authStateChanged", handleAuthChange);
    return () =>
      window.removeEventListener("authStateChanged", handleAuthChange);
  }, []);

  const refreshCart = async () => {
    if (!token) {
      console.log("🔐 No token, cart reset to empty");
      setCart([]);
      return;
    }

    try {
      const res = await fetch(
        "https://api.redseam.redberryinternship.ge/api/cart",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch cart: ${res.status}`);
      }

      const data = await res.json();
      console.log("🛒 API cart response:", data);
      setCart(data.products || []);

      // log final state after update
      console.log("🛍️ Cart state updated:", data.products || []);
    } catch (err) {
      console.error("❌ refreshCart failed:", err);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!token) return;

    try {
      const res = await fetch(
        `https://api.redseam.redberryinternship.ge/api/cart/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Remove from cart failed: ${res.status}`);
      }

      console.log(`🗑️ Removed product ${productId}`);
      await refreshCart();
    } catch (err) {
      console.error("❌ removeFromCart error:", err);
    }
  };

  useEffect(() => {
    console.log("🛒 Cart updated:", cart);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isAuthenticated: !!token,
        setCart,
        removeFromCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
