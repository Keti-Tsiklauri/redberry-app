"use client";

import Image from "next/image";
import { useCart } from "./CartContext";

import { useGlobal } from "../context/globalcontext";
import CartItems from "./CartItems";
import Button from "../button/Button";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";

import { useRouter } from "next/navigation";

export default function Cart() {
  const { setShowCart } = useGlobal();
  const { cart } = useCart();
  const router = useRouter();

  const goToCheckout = () => {
    router.push("/checkout"); // navigate to checkout page
    setShowCart(false);
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
        <EmptyCart />
      ) : (
        <div className="flex flex-col justify-between h-[920px]">
          <div>
            <CartItems />
          </div>
          <div className="flex flex-col justify-between h-[250px]">
            <CartSummary />
            <Button
              text="Go to checkout"
              width="460px"
              onClick={goToCheckout}
            />
          </div>
        </div>
      )}
    </div>
  );
}
