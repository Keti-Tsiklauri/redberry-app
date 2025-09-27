"use client";
import Link from "next/link";
import Button from "../components/button/Button";
import { useCart } from "../components/cart/CartContext";
import CartItems from "../components/cart/CartItems";
import CartSummary from "../components/cart/CartSummary";
import Header from "../components/auth/Header";
import OrderDetails from "../components/checkout/OrderDetails";
import { useUser } from "../components/context/userContext";
import { useGlobal } from "../components/context/globalcontext";
import SuccessModal from "../components/modal/SuccessModal";

export default function Checkout() {
  const { cart, removeAllItems } = useCart();
  const { checkout, showSuccessModal, setShowSuccessModal } = useGlobal(); // include showSuccessModal ✅

  function handlePay() {
    if (checkout) {
      removeAllItems();

      setShowSuccessModal(true);
    } else {
      return;
    }
  }

  return (
    <div className="relative">
      {/* ✅ Show modal on top */}
      {showSuccessModal && (
        <div className="absolute inset-0  bg-white bg-opacity-50 z-50">
          <SuccessModal />
        </div>
      )}

      <Header />
      <p className=" top-[152px] mx-auto py-[10px] w-[1920px] h-[63px] font-poppins font-semibold text-[42px] leading-[63px] text-[#10151F]">
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
            <Button text="Pay" width="460px" onClick={handlePay} />
          </div>
        </div>
      </div>
    </div>
  );
}
