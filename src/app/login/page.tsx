"use client";
import { useState } from "react";
import Header from "../components/Header";
import Image from "next/image";

export default function Login() {
  const [show, setShow] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      {/* login header */}
      <div className="flex flex-row justify-between items-center mx-auto py-[10px] w-[1920px] h-[80px] bg-white">
        <Header />
        <div className="flex items-center gap-2.5 cursor-pointer">
          <Image
            alt="person"
            src="/person-placeholder.svg"
            width={20}
            height={20}
          />
          <p className="w-[36px] h-[18px] font-poppins not-italic font-medium text-[12px] leading-[18px] text-[#10151F]">
            Log In
          </p>
        </div>
      </div>

      {/* main div */}
      <div className="flex flex-row">
        {/* Left side */}
        <div className="flex-1">
          <Image
            src="/main-image.svg"
            alt="people"
            width={948}
            height={1000}
            className="w-full h-auto"
          />
        </div>

        {/* Right side */}
        <div className="flex-1">
          <div className="w-[554px] mx-auto flex flex-col items-start mt-[240px] ">
            {/* Log In title */}
            <p className="w-[124px] h-[63px] font-poppins not-italic font-semibold text-[42px] leading-[63px] text-[#10151F] whitespace-nowrap">
              Log In
            </p>
            <div className="flex flex-col gap-6">
              {/* Email input */}
              <div className="relative w-[554px] h-[42px] flex items-center mt-[40px] px-3 border border-[#E1DFE1] rounded-lg bg-white">
                {/* Placeholder & red * */}
                {email === "" && (
                  <div className="flex items-center gap-1 pointer-events-none">
                    <p className="font-poppins font-normal text-sm leading-[21px] text-[#3E424A]">
                      Email
                    </p>
                    <span className="font-poppins font-normal text-sm leading-[21px] text-[#FF4000]">
                      *
                    </span>
                  </div>
                )}
                {/* Actual input */}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="absolute w-full h-full left-0 top-0 px-3 bg-transparent outline-none font-poppins text-sm text-[#3E424A]"
                />
              </div>

              {/* Password input */}
              <div className="relative w-[554px] h-[42px] flex items-center px-3 border border-[#E1DFE1] rounded-lg bg-white">
                {/* Placeholder & red * */}
                {password === "" && (
                  <div className="flex items-center gap-1 pointer-events-none">
                    <p className="font-poppins font-normal text-sm leading-[21px] text-[#3E424A]">
                      Password
                    </p>
                    <span className="font-poppins font-normal text-sm leading-[21px] text-[#FF4000]">
                      *
                    </span>
                  </div>
                )}
                {/* Actual input */}
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="absolute w-full h-full left-0 top-0 px-3 bg-transparent outline-none font-poppins text-sm text-[#3E424A]"
                />
                {/* Eye icon */}
                <Image
                  src={show ? "/show-password.svg" : "/hide-password.svg"}
                  alt="eye"
                  width={20}
                  height={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShow((prev) => !prev)}
                />
              </div>
            </div>
            {/* login button  */}

            <div className="mt-[45px]">
              {/* Log In Button */}
              <button className="flex justify-center items-center w-[554px] h-[41px] px-5 py-2.5 gap-2.5 bg-[#FF4000] rounded-[10px] cursor-pointer">
                <p className="w-[41px] h-[21px] font-poppins font-normal text-[14px] leading-[21px] text-white">
                  Log In
                </p>
              </button>

              {/* Register Link */}
              <div className="flex justify-center mt-3 gap-x-2">
                <p className="font-poppins font-normal text-[14px] leading-[21px] text-[#3E424A]">
                  Not a member?
                </p>
                <p className="font-poppins font-medium text-[14px] leading-[21px] text-[#FF4000] cursor-pointer">
                  Register
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
