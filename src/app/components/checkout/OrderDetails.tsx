"use client";

import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import InputField from "./InputField";
import { useGlobal } from "../context/globalcontext";

export default function OrderDetails() {
  const { user } = useUser();
  const { checkout, setCheckout, showSuccessModal } = useGlobal();
  const email = user?.email || "";

  // local state for inputs
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: email,
    address: "",
    zip: "",
  });

  // check if all fields are filled
  useEffect(() => {
    const allFilled = Object.values(formData).every(
      (field) => field.trim() !== ""
    );
    setCheckout(allFilled);
  }, [formData, setCheckout]);

  // reset fields when success modal is shown
  useEffect(() => {
    if (showSuccessModal) {
      setFormData({
        name: "",
        surname: "",
        email: "", // reset email too (can keep `email` if you want prefilled)
        address: "",
        zip: "",
      });
    }
  }, [showSuccessModal]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-[1129px] h-[635px] bg-[#F8F6F7] rounded-[16px] p-[80px_47px]">
      <p className="w-[144px] h-[33px] font-poppins font-medium text-[22px] leading-[33px] text-[#3E424A]">
        Order details
      </p>

      <div className="flex flex-col gap-6 mt-[40px]">
        <div className="flex flex-row gap-5">
          <InputField
            label="Name"
            value={formData.name}
            onChange={(val) => handleChange("name", val)}
          />
          <InputField
            label="Surname"
            value={formData.surname}
            onChange={(val) => handleChange("surname", val)}
          />
        </div>

        {/* email */}
        <InputField
          width="578px"
          imageSrc="/mail.svg"
          value={formData.email}
          onChange={(val) => handleChange("email", val)}
        />

        <div className="flex flex-row gap-5">
          <InputField
            label="Address"
            value={formData.address}
            onChange={(val) => handleChange("address", val)}
          />
          <InputField
            label="Zip code"
            value={formData.zip}
            onChange={(val) => handleChange("zip", val)}
          />
        </div>
      </div>
    </div>
  );
}
