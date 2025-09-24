import Image from "next/image";
export default function EmptyCart() {
  return (
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
  );
}
