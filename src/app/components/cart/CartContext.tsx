"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image?: string;
  total_price: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  updateQuantity: (
    id: string,
    quantity: number,
    color?: string,
    size?: string
  ) => Promise<void>;
  removeFromCart: (id: string, color?: string, size?: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  total_price: number;
  isAuthenticated: boolean;
  refreshAuth: () => void; // Added for manual refresh
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const API_BASE_URL = "https://api.redseam.redberryinternship.ge/api";

  const total_price = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Manual auth refresh function
  const refreshAuth = () => {
    const token = localStorage.getItem("authToken");
    console.log("🔄 Refreshing auth, token:", token ? "EXISTS" : "MISSING");
    setIsAuthenticated(!!token);
  };

  const getHeaders = () => {
    const token = localStorage.getItem("authToken");
    console.log("🔑 Getting headers, token:", token ? "EXISTS" : "MISSING");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return { headers, token };
  };

  // Check authentication status
  useEffect(() => {
    console.log("🏗️ CartProvider initializing...");
    const token = localStorage.getItem("authToken");
    console.log("🔐 Initial auth check, token:", token ? "EXISTS" : "MISSING");
    setIsAuthenticated(!!token);

    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      console.log("💾 Storage changed:", e.key, e.newValue ? "SET" : "REMOVED");
      if (e.key === "authToken") {
        setIsAuthenticated(!!e.newValue);
      }
    };

    // Listen for custom auth events (for same-tab login)
    const handleAuthChange = (e: CustomEvent) => {
      console.log("🔄 Auth event received:", e.detail);
      const token = localStorage.getItem("authToken");
      setIsAuthenticated(!!token);
    };

    // Listen for focus events to check auth when returning to the page
    const handleFocus = () => {
      console.log("👀 Window focused, checking auth...");
      const token = localStorage.getItem("authToken");
      const currentlyAuth = !!token;
      if (currentlyAuth !== isAuthenticated) {
        console.log("🔄 Auth state mismatch, updating:", currentlyAuth);
        setIsAuthenticated(currentlyAuth);
      }
    };

    // Listen for visibility change (when tab becomes visible)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("👁️ Page became visible, checking auth...");
        const token = localStorage.getItem("authToken");
        const currentlyAuth = !!token;
        if (currentlyAuth !== isAuthenticated) {
          console.log(
            "🔄 Auth state mismatch on visibility, updating:",
            currentlyAuth
          );
          setIsAuthenticated(currentlyAuth);
        }
      }
    };

    // Periodic check for auth changes (fallback)
    const authCheckInterval = setInterval(() => {
      const token = localStorage.getItem("authToken");
      const currentlyAuth = !!token;
      if (currentlyAuth !== isAuthenticated) {
        console.log(
          "⏰ Periodic auth check - state mismatch, updating:",
          currentlyAuth
        );
        setIsAuthenticated(currentlyAuth);
      }
    }, 2000); // Check every 2 seconds

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleAuthChange as EventListener);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "authChange",
        handleAuthChange as EventListener
      );
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(authCheckInterval);
    };
  }, [isAuthenticated]); // Add isAuthenticated to dependency array

  // Log auth state changes
  useEffect(() => {
    console.log("🔐 Auth state changed:", isAuthenticated);
  }, [isAuthenticated]);

  // Refresh cart from server
  const refreshCart = async () => {
    const { headers, token } = getHeaders();
    console.log("🛒 Refreshing cart, authenticated:", !!token);

    if (!token) {
      console.log("❌ No token, clearing cart");
      setCart([]);
      return;
    }

    try {
      console.log("🌐 Fetching cart from API...");
      const res = await fetch(`${API_BASE_URL}/cart`, { headers });
      console.log("📡 Cart API response:", res.status, res.statusText);

      if (!res.ok) {
        console.error("❌ Failed to fetch cart:", res.status, res.statusText);
        throw new Error("Failed to fetch cart");
      }

      const data = await res.json();
      console.log("📦 Cart data received:", data);
      setCart(data.products || []);
    } catch (err) {
      console.error("💥 Error fetching cart:", err);
      setCart([]);
    }
  };

  // Add item to cart (POST if new, PATCH if exists)
  const addToCart = async (item: CartItem) => {
    console.log("➕ Adding to cart:", item);
    const { headers, token } = getHeaders();

    if (!token) {
      console.error("❌ No auth token for addToCart");
      throw new Error("No auth token");
    }

    const existingItem = cart.find(
      (i) => i.id === item.id && i.color === item.color && i.size === item.size
    );
    console.log("🔍 Existing item:", existingItem ? "FOUND" : "NOT_FOUND");

    try {
      if (existingItem) {
        console.log("🔄 Updating existing item quantity...");
        const response = await fetch(
          `${API_BASE_URL}/cart/products/${item.id}`,
          {
            method: "PATCH",
            headers,
            body: JSON.stringify({
              quantity: existingItem.quantity + item.quantity,
            }),
          }
        );
        console.log("📡 PATCH response:", response.status, response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ PATCH failed:", response.status, errorText);
          throw new Error(`PATCH failed: ${response.status}`);
        }
      } else {
        console.log("🆕 Adding new item...");
        const response = await fetch(
          `${API_BASE_URL}/cart/products/${item.id}`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              quantity: item.quantity,
              color: item.color,
              size: item.size,
            }),
          }
        );
        console.log("📡 POST response:", response.status, response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ POST failed:", response.status, errorText);
          throw new Error(`POST failed: ${response.status} - ${errorText}`);
        }
      }

      console.log("✅ API call successful, refreshing cart...");
      await refreshCart();
    } catch (err) {
      console.error("💥 Error adding to cart:", err);
      throw err;
    }
  };

  // Update quantity of a cart item
  const updateQuantity = async (
    id: string,
    quantity: number,
    color?: string,
    size?: string
  ) => {
    console.log("🔄 Updating quantity:", { id, quantity, color, size });
    const { headers, token } = getHeaders();
    if (!token) throw new Error("No auth token");

    try {
      const response = await fetch(`${API_BASE_URL}/cart/products/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ quantity, color, size }),
      });
      console.log("📡 Update quantity response:", response.status);

      if (!response.ok) {
        throw new Error(`Update failed: ${response.status}`);
      }

      setCart((prev) =>
        prev.map((item) =>
          item.id === id && item.color === color && item.size === size
            ? { ...item, quantity, total_price: item.price * quantity }
            : item
        )
      );
    } catch (err) {
      console.error("💥 Error updating quantity:", err);
      throw err;
    }
  };

  // Remove item from cart
  const removeFromCart = async (id: string, color?: string, size?: string) => {
    console.log("🗑️ Removing from cart:", { id, color, size });
    const { headers, token } = getHeaders();
    if (!token) throw new Error("No auth token");

    try {
      const response = await fetch(`${API_BASE_URL}/cart/products/${id}`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ color, size }),
      });
      console.log("📡 Delete response:", response.status);

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      setCart((prev) =>
        prev.filter(
          (item) =>
            !(item.id === id && item.color === color && item.size === size)
        )
      );
    } catch (err) {
      console.error("💥 Error removing item:", err);
      throw err;
    }
  };

  // Load cart on mount and when auth changes
  useEffect(() => {
    if (isAuthenticated) {
      console.log("🔄 Auth changed to true, refreshing cart...");
      refreshCart();
    } else {
      console.log("🔄 Auth changed to false, clearing cart...");
      setCart([]);
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart,
        total_price,
        isAuthenticated,
        refreshAuth,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
