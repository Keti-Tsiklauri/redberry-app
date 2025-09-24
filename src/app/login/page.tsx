"use client";
import { useState, FormEvent } from "react";
import Logo from "../components/logo/Logo";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "../components/button/Button";

export default function Login() {
  const [show, setShow] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backendErrors, setBackendErrors] = useState<string[]>([]);

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

      if (response.ok) {
        // Save token
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          document.cookie = `authToken=${data.token}; path=/;`;
          console.log("Saved token:", data.token);
        }

        // Save user info
        if (data.user) {
          localStorage.setItem("userData", JSON.stringify(data.user));
          localStorage.setItem("userId", data.user.id.toString());
          localStorage.setItem("userEmail", data.user.email);
          localStorage.setItem("username", data.user.username);
          console.log("Saved user data:", data.user);
        }

        // Reset fields
        setEmail("");
        setPassword("");
        setBackendErrors([]);

        router.push("/");
      } else {
        // Show API errors
        if (data.errors) {
          // backend returns multiple errors
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
      {/* Login Header */}
      <div className="flex flex-row justify-between items-center mx-auto py-[10px] w-[1920px] h-[80px] bg-white">
        <Logo />
        <div className="flex items-center gap-2.5 cursor-pointer">
          <Image
            alt="person"
            src="/person-placeholder.svg"
            width={20}
            height={20}
          />
          <Link
            className="w-[50px] h-[18px] font-poppins not-italic font-medium text-[12px] leading-[18px] text-[#10151F]"
            href="/registration"
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
          <div className="w-[554px] mx-auto flex flex-col items-start mt-[240px] ">
            <p className="w-[124px] h-[63px] font-poppins font-semibold text-[42px] leading-[63px] text-[#10151F] whitespace-nowrap">
              Log In
            </p>

            {/* Error Message */}
            {/* Error Messages */}
            {backendErrors.length > 0 && (
              <div className="w-[554px] mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <ul className="list-disc pl-5 space-y-1">
                  {backendErrors.map((err, idx) => (
                    <li key={idx} className="text-red-600 text-sm font-poppins">
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              {/* Email Input */}
              <div className="relative w-[554px] h-[42px] flex items-center mt-[40px] px-3 border border-[#E1DFE1] rounded-lg bg-white">
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
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="absolute w-full h-full left-0 top-0 px-3 bg-transparent outline-none font-poppins text-sm text-[#3E424A] disabled:opacity-50"
                />
              </div>

              {/* Password Input */}
              <div className="relative w-[554px] h-[42px] flex items-center px-3 border border-[#E1DFE1] rounded-lg bg-white">
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
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="absolute w-full h-full left-0 top-0 px-3 bg-transparent outline-none font-poppins text-sm text-[#3E424A] disabled:opacity-50"
                />
                <Image
                  src={show ? "/show-password.svg" : "/hide-password.svg"}
                  alt="eye"
                  width={20}
                  height={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShow((prev) => !prev)}
                />
              </div>

              {/* Login Button */}
              <div className="mt-[45px]">
                <Button
                  type="submit"
                  text="Log In"
                  width="554px"
                  height="41px"
                  onClick={async () => {
                    await handleLogin(new Event("submit") as any);
                  }}
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
