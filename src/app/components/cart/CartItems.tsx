"use client";

import { useState, useEffect } from "react";
import { useCart } from "./CartContext";

export default function CartItems() {
  const { cart, setCart } = useCart();
  const [loadingItems, setLoadingItems] = useState<string[]>([]);

  // Load cart from localStorage on mount if empty
  useEffect(() => {
    if (!cart || cart.length === 0) {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) setCart(JSON.parse(storedCart));
    }
  }, [cart, setCart]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const getItemKey = (id: number, color?: string, size?: string) =>
    `${id}-${color || ""}-${size || ""}`;

  const increaseQty = (id: number, color?: string, size?: string) => {
    const itemKey = getItemKey(id, color, size);
    setLoadingItems((prev) => [...prev, itemKey]);

    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.color === color && item.size === size
          ? {
              ...item,
              quantity: item.quantity + 1,
              total_price: (item.quantity + 1) * item.price,
            }
          : item
      )
    );

    setLoadingItems((prev) => prev.filter((key) => key !== itemKey));
  };

  const decreaseQty = (id: number, color?: string, size?: string) => {
    const itemKey = getItemKey(id, color, size);
    setLoadingItems((prev) => [...prev, itemKey]);

    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.color === color && item.size === size
          ? {
              ...item,
              quantity: item.quantity > 1 ? item.quantity - 1 : 1,
              total_price:
                item.price * (item.quantity > 1 ? item.quantity - 1 : 1),
            }
          : item
      )
    );

    setLoadingItems((prev) => prev.filter((key) => key !== itemKey));
  };

  const removeItem = (id: number, color?: string, size?: string) => {
    const itemKey = getItemKey(id, color, size);
    setLoadingItems((prev) => [...prev, itemKey]);

    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.id === id && item.color === color && item.size === size)
      )
    );

    setLoadingItems((prev) => prev.filter((key) => key !== itemKey));
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500 font-poppins text-sm">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cart.map((item) => {
        const itemKey = getItemKey(item.id, item.color, item.size);
        const isItemLoading = loadingItems.includes(itemKey);

        return (
          <div
            key={itemKey}
            className={`flex flex-row items-center gap-[17px] w-[460px] h-[134px] mt-[36px] ${
              isItemLoading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div
              className="w-[100px] h-[134px] rounded-[10px] border border-[#E1DFE1] bg-cover bg-center"
              style={{ backgroundImage: `url(${item.image || "/image.png"})` }}
            />
            <div className="flex flex-col items-start gap-[13px] w-[343px] h-[117px]">
              <div className="flex flex-row justify-between w-full h-[78px] gap-[60px]">
                <div className="flex flex-col justify-center items-start gap-[8px] w-[285px] h-[78px]">
                  <p className="font-poppins font-medium text-[14px] leading-[21px] text-[#10151F]">
                    {item.name}
                  </p>
                  {item.color && (
                    <p className="font-poppins text-[12px] text-[#3E424A]">
                      Color: {item.color}
                    </p>
                  )}
                  {item.size && (
                    <p className="font-poppins text-[12px] text-[#3E424A]">
                      Size: {item.size}
                    </p>
                  )}
                </div>
                <div className="flex justify-center items-center">
                  <p className="font-poppins font-medium text-[18px] text-[#10151F]">
                    ${item.total_price || item.price * item.quantity}
                  </p>
                </div>
              </div>

              <div className="flex flex-row justify-between items-center w-full h-[26px] gap-[13px]">
                <div className="flex items-center gap-[2px] w-[70px] h-[26px] border border-[#E1DFE1] rounded-full px-2">
                  <button
                    onClick={() => decreaseQty(item.id, item.color, item.size)}
                    disabled={isItemLoading || item.quantity <= 1}
                    className="w-4 h-4 text-[#3E424A] hover:text-[#10151F] disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="font-poppins text-[12px] text-[#3E424A] min-w-[20px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQty(item.id, item.color, item.size)}
                    disabled={isItemLoading}
                    className="w-4 h-4 text-[#3E424A] hover:text-[#10151F] disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id, item.color, item.size)}
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
