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

interface AddToCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  total_price: number;

  addToCart: (item: AddToCartItem) => Promise<void>;
  updateQuantity: (
    id: string,
    quantity: number,
    color?: string,
    size?: string
  ) => Promise<void>;
  removeFromCart: (id: string, color?: string, size?: string) => Promise<void>;
  removeAllItems: () => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;

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

  const getToken = () =>
    localStorage.getItem("token") || localStorage.getItem("authToken");

  // Calculate total price
  const total_price = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleApiCall = async (
    apiCall: () => Promise<void>,
    operation: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiCall();
    } catch (err: unknown) {
      let errorMessage = `${operation} failed`;

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      setError(errorMessage);
      console.error(`❌ ${operation} failed:`, err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

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
      const cartItems: CartItem[] =
        data.products || data.cart?.products || data.items || data || [];
      setCart(cartItems);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("❌ refreshCart failed:", err);
      setCart([]);
      setIsAuthenticated(false);
    }
  };

  const addToCart = async (item: AddToCartItem) => {
    await handleApiCall(async () => {
      const token = getToken();
      if (!token) throw new Error("No token found");

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
        throw new Error(
          `Failed to add item to cart: ${res.status} ${errorText}`
        );
      }

      await refreshCart();
    }, "Add to cart");
  };

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

  const removeFromCart = async (id: string, color?: string, size?: string) => {
    await handleApiCall(async () => {
      const token = getToken();
      if (!token) throw new Error("No token found");

      const res = await fetch(`${API_BASE_URL}/cart/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ color, size }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to remove item: ${res.status} ${errorText}`);
      }

      await refreshCart();
    }, "Remove from cart");
  };

  const removeAllItems = async () => {
    await handleApiCall(async () => {
      const token = getToken();
      if (!token) throw new Error("No token found");

      for (const item of cart) {
        await fetch(`${API_BASE_URL}/cart/products/${item.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ color: item.color, size: item.size }),
        });
      }

      await refreshCart();
    }, "Remove all items");
  };

  const clearCart = async () => {
    await handleApiCall(async () => {
      const token = getToken();
      if (!token) throw new Error("No token found");

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
        } catch {
          continue;
        }
      }

      if (!success) throw new Error("Could not clear cart");
      await refreshCart();
    }, "Clear cart");
  };

  const getCartItemCount = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const isItemInCart = (id: string, color?: string, size?: string) =>
    cart.some(
      (item) => item.id === id && item.color === color && item.size === size
    );

  const getItemQuantity = (id: string, color?: string, size?: string) => {
    const item = cart.find(
      (item) => item.id === id && item.color === color && item.size === size
    );
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      refreshCart();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

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
        removeAllItems,
        clearCart,
        refreshCart,
        getCartItemCount,
        isItemInCart,
        getItemQuantity,
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
