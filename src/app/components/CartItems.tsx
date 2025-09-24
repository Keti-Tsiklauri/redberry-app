import { useEffect } from "react";
import { useCart } from "./CartContext";
import CartSummary from "./CartSummary";

export default function CartItems() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  useEffect(() => {
    console.log("🛒 Cart updated:", cart);
  }, [cart]);

  // ✅ Increase quantity
  const increaseQty = (
    id: number,
    color: string,
    size: string,
    quantity: number
  ) => {
    updateQuantity(id, color, size, quantity + 1);
  };

  // ✅ Decrease quantity
  const decreaseQty = (
    id: number,
    color: string,
    size: string,
    quantity: number
  ) => {
    updateQuantity(id, color, size, Math.max(quantity - 1, 1));
  };
  return cart.map((elem, index) => (
    <div
      key={`${elem.id}-${elem.size}-${index}`}
      className="flex flex-row items-center gap-[17px] w-[460px] h-[134px] mt-[36px]"
    >
      {/* Product Image */}
      <div
        className="w-[100px] h-[134px] rounded-[10px] border border-[#E1DFE1] bg-cover bg-center"
        style={{ backgroundImage: `url(${elem.image || "/image.png"})` }}
      />

      {/* Product Details */}
      <div className="flex flex-col items-start gap-[13px] w-[343px] h-[117px]">
        {/* Title + Price */}
        <div className="flex flex-row justify-between w-full h-[78px] gap-[60px]">
          <div className="flex flex-col justify-center items-start gap-[8px] w-[285px] h-[78px]">
            <p className="font-poppins font-medium text-[14px] leading-[21px] text-[#10151F]">
              {elem.name}
            </p>
            <p className="font-poppins font-normal text-[12px] leading-[18px] text-[#3E424A]">
              {elem.color}
            </p>
            <p className="font-poppins font-normal text-[12px] leading-[18px] text-[#3E424A]">
              {elem.size}
            </p>
          </div>

          {/* Price */}
          <div className="flex justify-center items-center w-[39px] h-[26px]">
            <div className="flex justify-center items-center w-[60px] h-[26px]">
              <p className="font-poppins font-medium text-[18px] leading-[27px] text-right text-[#10151F]">
                ${elem.price * elem.quantity}
              </p>
            </div>
          </div>
        </div>

        {/* Quantity + Remove */}
        <div className="flex flex-row justify-between items-center w-full h-[26px] gap-[13px]">
          <div className="flex items-center gap-[2px] w-[70px] h-[26px] border border-[#E1DFE1] rounded-full px-2">
            <button
              onClick={() =>
                decreaseQty(elem.id, elem.color, elem.size, elem.quantity)
              }
              className="w-4 h-4 text-[#3E424A] flex items-center justify-center cursor-pointer"
            >
              -
            </button>
            <span className="font-poppins font-normal text-[12px] leading-[18px] text-[#3E424A]">
              {elem.quantity}
            </span>
            <button
              onClick={() =>
                increaseQty(elem.id, elem.color, elem.size, elem.quantity)
              }
              className="w-4 h-4 text-[#3E424A] flex items-center justify-center cursor-pointer"
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeFromCart(elem.id, elem.color, elem.size)}
            className="w-[49px] h-[18px] font-poppins font-normal text-[12px] leading-[18px] text-[#3E424A] opacity-80 cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  ));
}
