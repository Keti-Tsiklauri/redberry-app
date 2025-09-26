"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartContext";

export default function CartItems() {
  const { cart, setCart, isLoading, error } = useCart();
  const [loadingItems, setLoadingItems] = useState<string[]>([]);
  const API_BASE_URL = "https://api.redseam.redberryinternship.ge/api";

  // Generate unique key for each cart item (id+color+size combo)
  const getItemKey = (id: number, color?: string, size?: string) =>
    `${id}-${color || ""}-${size || ""}`;

  // ✅ Increase quantity
  const increaseQty = async (
    id: number,
    color: string | undefined,
    size: string | undefined,
    quantity: number
  ) => {
    const newQty = quantity + 1;
    const itemKey = getItemKey(id, color, size);
    setLoadingItems((prev) => [...prev, itemKey]);

    try {
      const res = await fetch(`${API_BASE_URL}/cart/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: newQty,
          color,
          size,
        }),
      });

      if (!res.ok) throw new Error("Failed to update quantity");
      const updatedCart = await res.json();

      setCart(updatedCart);
    } catch (err) {
      console.error("Failed to increase quantity:", err);
    } finally {
      setLoadingItems((prev) => prev.filter((key) => key !== itemKey));
    }
  };

  // ✅ Decrease quantity
  const decreaseQty = async (
    id: number,
    color: string | undefined,
    size: string | undefined,
    quantity: number
  ) => {
    if (quantity <= 1) return;
    const newQty = quantity - 1;
    const itemKey = getItemKey(id, color, size);
    setLoadingItems((prev) => [...prev, itemKey]);

    try {
      const res = await fetch(`${API_BASE_URL}/cart/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: newQty,
          color,
          size,
        }),
      });

      if (!res.ok) throw new Error("Failed to update quantity");
      const updatedCart = await res.json();

      setCart(updatedCart);
    } catch (err) {
      console.error("Failed to decrease quantity:", err);
    } finally {
      setLoadingItems((prev) => prev.filter((key) => key !== itemKey));
    }
  };

  // ✅ Remove item
  const removeItem = async (
    id: number,
    color: string | undefined,
    size: string | undefined
  ) => {
    const itemKey = getItemKey(id, color, size);
    setLoadingItems((prev) => [...prev, itemKey]);

    try {
      const res = await fetch(`${API_BASE_URL}/cart/products/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          color,
          size,
        }),
      });

      if (!res.ok) throw new Error("Failed to remove item");
      const updatedCart = await res.json();

      setCart(updatedCart);
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setLoadingItems((prev) => prev.filter((key) => key !== itemKey));
    }
  };

  // ✅ Error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-poppins text-sm">Error: {error}</p>
      </div>
    );
  }

  // ✅ Loading cart
  if (isLoading && cart.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500 font-poppins text-sm">Loading cart...</p>
      </div>
    );
  }

  // ✅ Empty cart
  if (cart.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500 font-poppins text-sm">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cart.map((elem) => {
        const itemKey = getItemKey(elem.id, elem.color, elem.size);
        const isItemLoading = loadingItems.includes(itemKey);

        return (
          <div
            key={itemKey}
            className={`flex flex-row items-center gap-[17px] w-[460px] h-[134px] mt-[36px] ${
              isItemLoading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {/* Product Image */}
            <div
              className="w-[100px] h-[134px] rounded-[10px] border border-[#E1DFE1] bg-cover bg-center"
              style={{
                backgroundImage: `url(${
                  elem.image ||
                  elem.cover_image ||
                  elem.images?.[0] ||
                  "/image.png"
                })`,
              }}
            />

            {/* Product Details */}
            <div className="flex flex-col items-start gap-[13px] w-[343px] h-[117px]">
              <div className="flex flex-row justify-between w-full h-[78px] gap-[60px]">
                <div className="flex flex-col justify-center items-start gap-[8px] w-[285px] h-[78px]">
                  <p className="font-poppins font-medium text-[14px] leading-[21px] text-[#10151F]">
                    {elem.name}
                  </p>
                  {elem.color && (
                    <p className="font-poppins text-[12px] text-[#3E424A]">
                      Color: {elem.color}
                    </p>
                  )}
                  {elem.size && (
                    <p className="font-poppins text-[12px] text-[#3E424A]">
                      Size: {elem.size}
                    </p>
                  )}
                  {elem.brand?.name && (
                    <p className="font-poppins text-[10px] text-[#3E424A]">
                      {elem.brand.name}
                    </p>
                  )}
                </div>
                <div className="flex justify-center items-center">
                  <p className="font-poppins font-medium text-[18px] text-[#10151F]">
                    ${elem.total_price || elem.price * elem.quantity}
                  </p>
                </div>
              </div>

              {/* Quantity + Remove */}
              <div className="flex flex-row justify-between items-center w-full h-[26px] gap-[13px]">
                <div className="flex items-center gap-[2px] w-[70px] h-[26px] border border-[#E1DFE1] rounded-full px-2">
                  <button
                    onClick={() =>
                      decreaseQty(elem.id, elem.color, elem.size, elem.quantity)
                    }
                    disabled={isItemLoading || elem.quantity <= 1}
                    className="w-4 h-4 text-[#3E424A] hover:text-[#10151F] disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="font-poppins text-[12px] text-[#3E424A] min-w-[20px] text-center">
                    {elem.quantity}
                  </span>
                  <button
                    onClick={() =>
                      increaseQty(elem.id, elem.color, elem.size, elem.quantity)
                    }
                    disabled={isItemLoading}
                    className="w-4 h-4 text-[#3E424A] hover:text-[#10151F] disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(elem.id, elem.color, elem.size)}
                  disabled={isItemLoading}
                  className="text-[#3E424A] text-[12px] hover:text-red-500"
                >
                  {isItemLoading ? "..." : "Remove"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
