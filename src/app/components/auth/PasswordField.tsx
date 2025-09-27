import { useState } from "react";
import Image from "next/image";
import InputField from "./InputField";
interface PasswordFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  show: boolean; // must exist
  onToggleShow: () => void; // must exist
}

export default function PasswordField(props: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-[554px] flex flex-col">
      <InputField {...props} type={show ? "text" : "password"} />
      <Image
        src={show ? "/show-password.svg" : "/hide-password.svg"}
        alt="eye"
        width={20}
        height={20}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
        onClick={() => setShow((prev) => !prev)}
      />
    </div>
  );
}
