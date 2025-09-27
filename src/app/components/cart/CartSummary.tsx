import { useCart } from "./CartContext";

export default function CartSummary() {
  const { cart } = useCart();
  const delivery = 5; // fixed delivery fee

  // Sum all items' total_price
  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.total_price || 0),
    0
  );

  // Total including delivery
  const total = cartTotal + delivery;

  return (
    <div className=" w-[460px] h-[110px]  flex flex-col gap-4">
      {/* Subtotal */}
      <div className="flex justify-between items-center w-[460px] h-6">
        <span className="font-poppins font-normal text-[16px] leading-6 text-[#3E424A]">
          Items subtotal
        </span>
        <span className="font-poppins font-normal text-[16px] leading-6 text-[#3E424A] text-right">
          ${total.toFixed(2)}
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
