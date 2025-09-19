"use client";
import { useState, FormEvent } from "react";
import Logo from "../components/Logo";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Login() {
  const [show, setShow] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const API_BASE_URL = "https://api.redseam.redberryinternship.ge/api";
  const LOGIN_ENDPOINT = "/login";
  const API_KEY = process.env.NEXT_PUBLIC_REDBERRY_API_KEY;

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

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

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage and cookie
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          document.cookie = `authToken=${data.token}; path=/;`;
          console.log("Saved token:", data.token); // <-- log token
        }

        // Store user info
        if (data.user) {
          localStorage.setItem("userData", JSON.stringify(data.user));
          localStorage.setItem("userId", data.user.id.toString());
          localStorage.setItem("userEmail", data.user.email);
          localStorage.setItem("username", data.user.username);
          console.log("Saved user data:", data.user); // <-- log user info
        }

        setEmail("");
        setPassword("");
        setError("");

        router.push("/listing"); // redirect after login
      } else {
        setError(
          data.message ||
            data.error ||
            (response.status === 401
              ? "Invalid email or password"
              : "Login failed")
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
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
          <p className="w-[36px] h-[18px] font-poppins not-italic font-medium text-[12px] leading-[18px] text-[#10151F]">
            Log In
          </p>
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
            {error && (
              <div className="w-[554px] mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-poppins">{error}</p>
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
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex justify-center items-center w-[554px] h-[41px] px-5 py-2.5 gap-2.5 bg-[#FF4000] rounded-[10px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e63600] transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <p className="font-poppins font-normal text-[14px] leading-[21px] text-white">
                        Logging in...
                      </p>
                    </div>
                  ) : (
                    <p className="w-[41px] h-[21px] font-poppins font-normal text-[14px] leading-[21px] text-white">
                      Log In
                    </p>
                  )}
                </button>

                {/* Register Link */}
                <div className="flex justify-center mt-3 gap-x-2">
                  <p className="font-poppins font-normal text-[14px] leading-[21px] text-[#3E424A]">
                    Not a member?
                  </p>
                  <p
                    className="font-poppins font-medium text-[14px] leading-[21px] text-[#FF4000] cursor-pointer hover:underline"
                    onClick={() => router.push("/register")}
                  >
                    Register
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
