"use client";

import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import InputField from "../components/auth/InputField";
import PasswordField from "../components/auth/PasswordField";
import Button from "../components/button/Button";
import GeneralError from "../components/auth/GeneralError";
import Logo from "../components/logo/Logo";
import { useCart } from "../components/cart/CartContext";
import { useUser } from "../components/context/UserContext";

export default function Login() {
  const [show, setShow] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backendErrors, setBackendErrors] = useState<string[]>([]);

  const { refreshCart } = useCart();
  const { setUser } = useUser();
  const router = useRouter();

  const API_BASE_URL = "https://api.redseam.redberryinternship.ge/api";
  const LOGIN_ENDPOINT = "/login";
  const API_KEY = process.env.NEXT_PUBLIC_REDBERRY_API_KEY;

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBackendErrors([]);
    setIsLoading(true);

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(API_KEY ? { "X-API-Key": API_KEY } : {}),
      };

      const response = await fetch(API_BASE_URL + LOGIN_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get("Content-Type") || "";
      let data: any = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      if (response.ok && data.user && data.token) {
        // Save user in UserContext
        setUser(data.user, data.token);

        // Refresh cart
        await refreshCart();

        // Optional cookie backup
        document.cookie = `authToken=${data.token}; path=/;`;

        // Clear form and errors
        setEmail("");
        setPassword("");
        setBackendErrors([]);

        // Redirect home
        router.push("/");
      } else {
        if (data.errors) {
          const allErrors = Object.values(data.errors).flat() as string[];
          setBackendErrors(allErrors);
        } else if (data.message) {
          setBackendErrors([data.message]);
        } else {
          setBackendErrors([`Login failed (${response.status})`]);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setBackendErrors([err.message]);
      } else {
        setBackendErrors(["Unexpected error occurred"]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* header */}
      <div className="flex w-[1920px] h-[80px] justify-between mx-auto">
        <Logo />
        <div className="flex flex-row gap-3 items-center">
          <Image
            src="/person-placeholder.svg"
            width={20}
            height={20}
            alt="placeholder avatar"
          />
          <Link
            href="./registration"
            className="font-poppins font-medium text-[12px] leading-[18px] text-[#10151F] cursor-pointer"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Main Div */}
      <div className="flex flex-row">
        {/* Left Side */}
        <div className="flex-1">
          <Image
            src="/main-image.svg"
            alt="people"
            width={948}
            height={1000}
            className="w-full h-auto"
          />
        </div>

        {/* Right Side */}
        <div className="flex-1">
          <div className="w-[554px] mx-auto flex flex-col items-start mt-[240px] gap-8">
            <p className="w-[124px] h-[63px] font-poppins font-semibold text-[42px] leading-[63px] text-[#10151F] whitespace-nowrap">
              Log In
            </p>

            {/* Error Messages */}
            <GeneralError errors={backendErrors} />

            <form
              onSubmit={handleLogin}
              noValidate
              className="flex flex-col gap-6"
            >
              <InputField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                disabled={isLoading}
              />

              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                disabled={isLoading}
                show={show}
                onToggleShow={() => setShow((prev) => !prev)}
              />

              <div className="mt-[45px]">
                <Button
                  type="submit"
                  text={isLoading ? "Logging in..." : "Log In"}
                  width="554px"
                  height="41px"
                  disabled={isLoading}
                  loading={isLoading}
                />

                {/* Register Link */}
                <div className="flex justify-center mt-3 gap-x-2">
                  <p className="font-poppins font-normal text-[14px] leading-[21px] text-[#3E424A]">
                    Not a member?
                  </p>
                  <Link
                    href="/registration"
                    className="font-poppins font-medium text-[14px] leading-[21px] text-[#FF4000] cursor-pointer hover:underline"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
