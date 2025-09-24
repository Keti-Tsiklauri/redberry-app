"use client";

import Image from "next/image";
import { useCart } from "./CartContext";

import { useGlobal } from "./context/globalcontext";
import CartItems from "./CartItems";

export default function Cart() {
  const { setShowCart } = useGlobal();
  const { cart } = useCart();
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
        <CartItems />
      )}
    </div>
  );
}
