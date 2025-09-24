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
        <CartSummary subtotal={totalPrice} />
        <button
          className="
        absolute left-[40px] top-[981px] 
        w-[460px] h-[59px] 
        flex justify-center items-center gap-[10px] 
        px-[60px] py-[16px] 
        bg-[#FF4000] rounded-[10px]
      "
        >
          {/* Icon (hidden per spec, but kept for future use) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="hidden w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0L6.75 15.75h10.5l1.644-7.478a1.125 1.125 0 00-1.098-1.372H5.616m-.51-2.63L5.616 7.5m0 0h13.635M9 21h.008v.008H9V21zm6 0h.008v.008H15V21z"
            />
          </svg>

          {/* Button text */}
          <span className="font-poppins font-medium text-[18px] leading-[27px] text-white cursor-pointer">
            Add to cart
          </span>
        </button>
      </div>
    </div>
  ));
}
