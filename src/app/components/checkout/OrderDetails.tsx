import { useUser } from "../context/userContext";
import InputField from "./InputField";

export default function OrderDetails() {
  const { user } = useUser();
  console.log("user", user);
  return (
    <div className="w-[1129px] h-[635px] bg-[#F8F6F7] rounded-[16px] p-[80px_47px] ">
      <p className="w-[144px] h-[33px] font-poppins font-medium text-[22px] leading-[33px] text-[#3E424A]">
        Order details
      </p>
      <div className="flex flex-col gap-6 mt-[40px]">
        <div className="flex flex-row gap-5 ">
          <InputField label="Name" />
          <InputField label="Surname" />
        </div>

        {/* email */}

        <InputField label="Email" width="578px" imageSrc="/mail.svg" />
        <div className="flex flex-row gap-5 ">
          <InputField label="Address" />
          <InputField label="Zip code" />
        </div>
      </div>
    </div>
  );
}
