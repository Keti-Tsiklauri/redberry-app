"use client";
import Link from "next/link";
import Button from "../components/button/Button";
import { useCart } from "../components/cart/CartContext";
import CartItems from "../components/cart/CartItems";
import CartSummary from "../components/cart/CartSummary";
import EmptyCart from "../components/cart/EmptyCart";

import OrderDetails from "../components/checkout/OrderDetails";
export default function Checkout() {
  const { cart } = useCart();
  return (
    <div>
      <p
        className=" top-[152px] mx-auto py-[10px] w-[1920px]
         h-[63px] 
           font-poppins font-semibold text-[42px] leading-[63px] 
           text-[#10151F]"
      >
        Checkout
      </p>
      <div className="w-[1920px] flex flex-row justify-between mx-auto mt-[50px]">
        <OrderDetails />
        <div>
          <div className="flex flex-col items-center justify-center ">
            {cart.length === 0 ? (
              <>
                <p className="text-gray-500 text-lg font-medium mb-4">
                  Oops... your cart is empty
                </p>
                <Link
                  href="/"
                  className="text-white bg-[#ab7360] px-6 py-2 mb-4 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                >
                  Start Shopping
                </Link>
              </>
            ) : (
              <CartItems />
            )}
          </div>

          <div className="flex flex-col justify-between h-[250px]">
            <CartSummary />
            <Button text="Pay" width="460px" />
          </div>
        </div>
      </div>
    </div>
  );
}
