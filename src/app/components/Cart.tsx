"use client";

import Image from "next/image";
import { useCart } from "./CartContext";
import { useEffect } from "react";
import { useGlobal } from "./context/globalcontext";

export default function Cart() {
  const { showCart, setShowCart } = useGlobal();
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

  return (
    <div className="z-[100] absolute right-0 bottom-0 w-[540px] h-[1080px] bg-[#F8F6F7] border-l border-[#E1DFE1] box-border p-[40px] overflow-y-auto">
      {/* header */}
      <div className="flex justify-between">
        <p className="top-[41px] w-[181px] h-[30px] font-poppins font-medium text-[20px] leading-[30px] text-[#10151F]">
          Shopping cart ({cart.length})
        </p>
        <Image
          src="/x-mark.svg"
          width={32}
          height={32}
          alt="close icon"
          className="cursor-pointer"
          onClick={() => setShowCart(false)}
        />
      </div>

      {cart.length === 0 ? (
        <div>
          <Image
            src="/cart.svg"
            alt="cart"
            width={170}
            height={135}
            className="mt-[150px] mx-auto"
          />
          <p className="absolute w-[88px] h-[36px] left-1/2 top-[381px] -translate-x-1/2 font-poppins font-semibold text-[24px] leading-[36px] text-[#10151F]">
            Ooops!
          </p>
          <p className="absolute w-[277px] h-[21px] left-1/2 top-[427px] -translate-x-1/2 font-poppins font-normal text-[14px] leading-[21px] text-center text-[#3E424A]">
            You’ve got nothing in your cart just yet...
          </p>

          <button className="absolute left-1/2 top-[506px] flex flex-row justify-center items-center gap-[10px] px-[20px] py-[10px] w-[214px] h-[41px] -translate-x-1/2 bg-[#FF4000] rounded-[10px]">
            <span className="w-[103px] h-[21px] font-poppins font-normal text-[14px] leading-[21px] text-white cursor-pointer">
              Start Shopping
            </span>
          </button>
        </div>
      ) : (
        cart.map((elem, index) => (
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
        ))
      )}
    </div>
  );
}

function CartSummary({ subtotal }: { subtotal: number }) {
  const delivery = 5; // fixed fee
  const total = subtotal + delivery;

  return (
    <div className="absolute w-[460px] h-[110px] left-1/2 -translate-x-1/2 top-[769px] flex flex-col gap-4">
      {/* Subtotal */}
      <div className="flex justify-between items-center w-[460px] h-6">
        <span className="font-poppins font-normal text-[16px] leading-6 text-[#3E424A]">
          Items subtotal
        </span>
        <span className="font-poppins font-normal text-[16px] leading-6 text-[#3E424A] text-right">
          ${subtotal.toFixed(2)}
        </span>
      </div>

      {/* Delivery */}
      <div className="flex justify-between items-center w-[460px] h-6">
        <span className="font-poppins font-normal text-[16px] leading-6 text-[#3E424A]">
          Delivery
        </span>
        <span className="font-poppins font-normal text-[16px] leading-6 text-[#3E424A] text-right">
          ${delivery.toFixed(2)}
        </span>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center w-[460px] h-[30px]">
        <span className="font-poppins font-medium text-[20px] leading-[30px] text-[#10151F]">
          Total
        </span>
        <span className="font-poppins font-medium text-[20px] leading-[30px] text-[#10151F] text-right">
          ${total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
