"use client";

import Image from "next/image";
import Button from "../button/Button";
import { useRouter } from "next/navigation";
import { useGlobal } from "../context/globalcontext";

export default function SuccessModal() {
  const router = useRouter();
  const { setShowSuccessModal } = useGlobal();

  const handleContinue = () => {
    router.push("/"); // navigate to homepage
  };
  return (
    <div className="flex flex-col p-[30px]">
      <div className="float-right">
        <Image
          src="/x-mark.svg"
          width={40}
          height={40}
          alt="close"
          className="float-right cursor-pointer"
          onClick={() => setShowSuccessModal(false)}
        />
      </div>
      <div className="w-[233px] h-[256px] gap-[40px] flex flex-col mx-auto mt-[114px] items-center">
        <div className="flex mx-auto">
          <Image src="/success.svg" width={76} height={76} alt="success" />
        </div>
        <div className="flex flex-col items-center p-0 gap-4 w-[233px] h-[100px]">
          <h1 className="w-[233px] h-[63px] font-poppins font-semibold text-[42px] leading-[63px] text-center text-[#10151F]">
            Congrats!
          </h1>

          <p className="w-[233px] h-[21px] font-poppins font-normal text-[14px] leading-[21px] text-center text-[#3E424A]">
            Your order is placed successfully!
          </p>
        </div>
        <div className="mt-[40px]">
          <Button
            text="Continue Shopping"
            width="214px"
            height="41px"
            onClick={handleContinue}
          />
        </div>
      </div>
    </div>
  );
}
