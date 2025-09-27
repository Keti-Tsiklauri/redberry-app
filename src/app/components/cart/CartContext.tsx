"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  total_price: number;

  // Core operations
  addToCart: (item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    color?: string;
    size?: string;
    image?: string;
  }) => Promise<void>;
  updateQuantity: (
    id: string,
    quantity: number,
    color?: string,
    size?: string
  ) => Promise<void>;
  removeFromCart: (id: string, color?: string, size?: string) => Promise<void>;
  removeAllItems: (id: string, color?: string, size?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;

  // Utility functions
  getCartItemCount: () => number;
  isItemInCart: (id: string, color?: string, size?: string) => boolean;
  getItemQuantity: (id: string, color?: string, size?: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = "https://api.redseam.redberryinternship.ge/api";

  const getToken = () => {
    // Check both possible token keys
    return localStorage.getItem("token") || localStorage.getItem("authToken");
  };
  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      refreshCart();
    } else {
      setIsAuthenticated(false);
      setCart([]);
    }
  }, []);

  // Calculate total price
  const total_price = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Utility to handle API calls with loading and error states
  const handleApiCall = async (
    apiCall: () => Promise<void>,
    operation: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiCall();
    } catch (err: any) {
      const errorMessage = err.message || `${operation} failed`;
      setError(errorMessage);
      console.error(`❌ ${operation} failed:`, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 🔄 Fetch cart from API
  const refreshCart = async () => {
    try {
      const token = getToken();
      if (!token) {
        setCart([]);
        setIsAuthenticated(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch cart");

      const data = await res.json();

      const cartItems =
        data.products || data.cart?.products || data.items || data || [];
      setCart(cartItems);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("❌ refreshCart failed:", err);
      setCart([]);
      setIsAuthenticated(false);
    }
  };

  // ➕ Add item to cart via API
  const addToCart = async (item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    color?: string;
    size?: string;
    image?: string;
  }) => {
    await handleApiCall(async () => {
      const token = getToken();

      if (!token) throw new Error("No token found");

      // Check if item already exists in cart
      const existingItem = cart.find(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.color === item.color &&
          cartItem.size === item.size
      );

      const body = {
        quantity: existingItem
          ? existingItem.quantity + item.quantity
          : item.quantity,
        color: item.color,
        size: item.size,
      };

      const method = existingItem ? "PATCH" : "POST";

      const res = await fetch(`${API_BASE_URL}/cart/products/${item.id}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ AddToCart - Error response:", errorText);
        throw new Error(
          `Failed to add item to cart: ${res.status} ${errorText}`
        );
      }

      await refreshCart();
    }, "Add to cart");
  };

  // 📝 Update item quantity
  const updateQuantity = async (
    id: string,
    quantity: number,
    color?: string,
    size?: string
  ) => {
    if (quantity <= 0) {
      await removeFromCart(id, color, size);
      return;
    }

    await handleApiCall(async () => {
      const token = getToken();
      if (!token) throw new Error("No token found");

      const body = { quantity, color, size };

      const res = await fetch(`${API_BASE_URL}/cart/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Failed to update quantity: ${res.status} ${errorText}`
        );
      }

      await refreshCart();
    }, "Update quantity");
  };
  // 🗑️ Remove all items one by one (like removeFromCart)
  const removeAllItems = async () => {
    await handleApiCall(async () => {
      const token = getToken();
      if (!token) throw new Error("No token found");

      // Loop through all items in the cart
      for (const item of cart) {
        await fetch(`${API_BASE_URL}/cart/products/${item.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            color: item.color,
            size: item.size,
          }),
        });
      }

      // Refresh cart after all items removed
      await refreshCart();
    }, "Remove all items");
  };

  // 🗑️ Remove item from cart
  const removeFromCart = async (id: string, color?: string, size?: string) => {
    await handleApiCall(async () => {
      const token = getToken();
      if (!token) throw new Error("No token found");

      const body = { color, size };

      const res = await fetch(`${API_BASE_URL}/cart/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to remove item: ${res.status} ${errorText}`);
      }

      await refreshCart();
    }, "Remove from cart");
  };

  // 🧹 Clear entire cart
  const clearCart = async () => {
    await handleApiCall(async () => {
      const token = getToken();
      if (!token) throw new Error("No token found");

      // Try multiple possible clear endpoints
      const endpoints = [
        `${API_BASE_URL}/cart/clear`,
        `${API_BASE_URL}/cart`,
        `${API_BASE_URL}/cart/empty`,
      ];

      let success = false;
      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            success = true;
            break;
          }
        } catch (err) {
          continue;
        }
      }

      if (!success) {
        throw new Error("Could not clear cart - no valid endpoint found");
      }

      await refreshCart();
    }, "Clear cart");
  };

  // 📊 Get total number of items in cart
  const getCartItemCount = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // 🔍 Check if specific item variant is in cart
  const isItemInCart = (id: string, color?: string, size?: string): boolean => {
    return cart.some(
      (item) => item.id === id && item.color === color && item.size === size
    );
  };

  // 🔢 Get quantity of specific item variant
  const getItemQuantity = (
    id: string,
    color?: string,
    size?: string
  ): number => {
    const item = cart.find(
      (item) => item.id === id && item.color === color && item.size === size
    );
    return item ? item.quantity : 0;
  };

  // Initialize cart on mount
  useEffect(() => {
    const token = getToken();

    if (token) {
      setIsAuthenticated(true);

      refreshCart();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Listen for storage changes (token updates)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "authToken") {
        const token = getToken();
        if (token) {
          setIsAuthenticated(true);
          refreshCart();
        } else {
          setIsAuthenticated(false);
          setCart([]);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Debug functions (development only)
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      (window as any).cartDebug = {
        cart,
        total_price,
        isAuthenticated,
        isLoading,
        error,
        refreshCart,
        clearCart,
        getCartItemCount,
        addTestItem: () =>
          addToCart({
            id: "test",
            name: "Test Item",
            price: 10,
            quantity: 1,
            color: "red",
            size: "M",
            image: "test.jpg",
          }),
      };
    }
  }, [cart, total_price, isAuthenticated, isLoading, error]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isAuthenticated,
        isLoading,
        error,
        total_price,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        getCartItemCount,
        isItemInCart,
        getItemQuantity,
        removeAllItems,
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
