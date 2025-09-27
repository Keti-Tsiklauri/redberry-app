"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "./CartContext";

export default function CartItems() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    isLoading: cartLoading,
  } = useCart();
  const [loadingItems, setLoadingItems] = useState<string[]>([]);

  const getItemKey = (id: string | number, color?: string, size?: string) =>
    `${id}-${color || ""}-${size || ""}`;

  // Get image based on selected color index
  const getImageForColor = (item: any) => {
    if (!item.images || !item.images.length)
      return item.cover_image || "/image.png";
    if (!item.available_colors || !item.color)
      return item.images[0] || item.cover_image;

    const colorIndex = item.available_colors.findIndex(
      (c: string) => c.toLowerCase() === item.color.toLowerCase()
    );

    return item.images[colorIndex] || item.cover_image || item.images[0];
  };

  const increaseQty = async (id: string, color?: string, size?: string) => {
    const key = getItemKey(id, color, size);
    setLoadingItems((prev) => [...prev, key]);
    try {
      const current = cart.find(
        (i) => i.id === id && i.color === color && i.size === size
      );
      if (current) await updateQuantity(id, current.quantity + 1, color, size);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItems((prev) => prev.filter((k) => k !== key));
    }
  };

  const decreaseQty = async (id: string, color?: string, size?: string) => {
    const key = getItemKey(id, color, size);
    setLoadingItems((prev) => [...prev, key]);
    try {
      const current = cart.find(
        (i) => i.id === id && i.color === color && i.size === size
      );
      if (current) {
        if (current.quantity <= 1) await removeFromCart(id, color, size);
        else await updateQuantity(id, current.quantity - 1, color, size);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItems((prev) => prev.filter((k) => k !== key));
    }
  };

  const removeItem = async (id: string, color?: string, size?: string) => {
    const key = getItemKey(id, color, size);
    setLoadingItems((prev) => [...prev, key]);
    try {
      await removeFromCart(id, color, size);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItems((prev) => prev.filter((k) => k !== key));
    }
  };

  if (!cart || !cart.length)
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500 font-poppins text-sm">Your cart is empty</p>
      </div>
    );

  return (
    <div className="space-y-4">
      {cart.map((item) => {
        const itemKey = getItemKey(item.id, item.color, item.size);
        const isItemLoading = loadingItems.includes(itemKey) || cartLoading;
        const displayImage = getImageForColor(item);

        return (
          <div
            key={itemKey}
            className={`flex items-center gap-4 w-[460px] h-[134px] mt-6 ${
              isItemLoading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="w-[100px] h-[134px] rounded-[10px] border border-[#E1DFE1] overflow-hidden flex-shrink-0">
              <Image
                src={displayImage}
                alt={item.name}
                width={100}
                height={134}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex flex-col justify-between w-[343px] h-[117px]">
              <div className="flex justify-between">
                <div>
                  <p className="font-poppins font-medium text-[14px] text-[#10151F]">
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
                <p className="font-poppins font-medium text-[18px] text-[#10151F]">
                  ${item.total_price || item.price * item.quantity}
                </p>
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2 w-[70px] h-[26px] border border-[#E1DFE1] rounded-full px-2">
                  <button
                    onClick={() => decreaseQty(item.id, item.color, item.size)}
                    disabled={isItemLoading}
                    className="w-4 h-4 text-[#3E424A] hover:text-[#10151F] flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="font-poppins text-[12px] text-center text-[#3E424A] min-w-[20px]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQty(item.id, item.color, item.size)}
                    disabled={isItemLoading}
                    className="w-4 h-4 text-[#3E424A] hover:text-[#10151F] flex items-center justify-center"
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
