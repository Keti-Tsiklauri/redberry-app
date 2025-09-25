"use client";
import Button from "../button/Button";
import CartItems from "../cart/CartItems";
import CartSummary from "../cart/CartSummary";

import OrderDetails from "./OrderDetails";
export default function Checkout() {
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
          <div>
            <CartItems />
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
