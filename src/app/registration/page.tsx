"use client";

import Image from "next/image";
import Logo from "../components/logo/Logo";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "../components/button/Button";
const API_BASE_URL = "https://api.redseam.redberryinternship.ge/api";
const REGISTER_ENDPOINT = "/register";
const API_KEY = process.env.NEXT_PUBLIC_REDBERRY_API_KEY;

type BackendErrors = {
  username?: string[];
  email?: string[];
  password?: string[];
  password_confirmation?: string[];
  avatar?: string[];
  general?: string[];
};

type ApiResponse = {
  message?: string;
  errors?: BackendErrors;
  success?: boolean;
  token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
  };
  [key: string]: unknown;
};

export default function Registration() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [show, setShow] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [backendErrors, setBackendErrors] = useState<BackendErrors>({});

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (png, jpeg, jpg, svg)");
      e.target.value = "";
      return;
    }

    if (backendErrors.avatar) {
      setBackendErrors((prev) => ({ ...prev, avatar: undefined }));
    }

    setAvatar(file);
  };

  const handleAvatarRemove = () => {
    setAvatar(null);
    const fileInput = document.getElementById("avatar") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    if (backendErrors.avatar) {
      setBackendErrors((prev) => ({ ...prev, avatar: undefined }));
    }
  };

  const handleInputChange = (field: keyof BackendErrors, value: string) => {
    if (backendErrors[field]) {
      setBackendErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    if (backendErrors.general) {
      setBackendErrors((prev) => ({ ...prev, general: undefined }));
    }

    switch (field) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        if (backendErrors.password_confirmation) {
          setBackendErrors((prev) => ({
            ...prev,
            password_confirmation: undefined,
          }));
        }
        break;
      case "password_confirmation":
        setRepeatPassword(value);
        break;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBackendErrors({});
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("password_confirmation", repeatPassword);
      if (avatar) formData.append("avatar", avatar);

      const headers: HeadersInit = {
        Accept: "application/json",
        ...(API_KEY ? { "X-API-Key": API_KEY } : {}),
      };

      const response = await fetch(API_BASE_URL + REGISTER_ENDPOINT, {
        method: "POST",
        headers,
        body: formData,
      });

      const contentType = response.headers.get("Content-Type") || "";
      let data: ApiResponse = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      if (response.ok) {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          document.cookie = `authToken=${data.token}; path=/;`;
        }

        if (data.user) {
          localStorage.setItem("userData", JSON.stringify(data.user));
          if (data.user.id) {
            localStorage.setItem("userId", data.user.id.toString());
          }
          if (data.user.email) {
            localStorage.setItem("userEmail", data.user.email);
          }
          if (data.user.username) {
            localStorage.setItem("username", data.user.username);
          }
        }

        setUsername("");
        setEmail("");
        setPassword("");
        setRepeatPassword("");
        setAvatar(null);
        setBackendErrors({});

        router.push("/");
        return;
      }

      // Always rely on backend messages
      if (data.errors) {
        setBackendErrors(data.errors);
      } else if (data.message) {
        setBackendErrors({ general: [data.message] });
      } else {
        setBackendErrors({
          general: [
            `Registration failed (${response.status}). Please try again.`,
          ],
        });
      }
    } catch (err: unknown) {
      let errorMessage = "Network error. Please try again.";

      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = "Request timeout. Please try again.";
        } else if (err.message.includes("Failed to fetch")) {
          errorMessage =
            "Cannot connect to server. Please check your internet connection.";
        } else if (err.message.includes("NetworkError")) {
          errorMessage = "Network error. Please check your connection.";
        }
      }

      setBackendErrors({
        general: [errorMessage],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
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
            href="/login"
            className="w-[36px] h-[18px] font-poppins not-italic font-medium text-[12px] leading-[18px] text-[#10151F]"
          >
            Log in
          </Link>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-row">
        {/* Left */}
        <div className="flex-1">
          <Image
            src="/main-image.svg"
            alt="people"
            width={948}
            height={1000}
            className="w-full h-auto"
          />
        </div>

        {/* Right */}
        <div className="flex-1">
          <div className="w-[554px] mx-auto flex flex-col items-start mt-[240px]">
            <p className="w-[124px] h-[63px] font-poppins font-semibold text-[42px] leading-[63px] text-[#10151F] whitespace-nowrap">
              Registration
            </p>

            {/* General errors */}
            {backendErrors.general && (
              <div className="w-full mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div>
                    {backendErrors.general.map((error, index) => (
                      <p
                        key={index}
                        className="text-red-700 text-sm font-poppins"
                      >
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Avatar */}
            <div className="flex gap-5 mt-[40px] items-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
                {avatar ? (
                  <Image
                    src={URL.createObjectURL(avatar)}
                    alt="avatar"
                    width={100}
                    height={100}
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <Image
                    src="./person-placeholder.svg"
                    alt="person placeholder"
                    width={100}
                    height={100}
                    className="object-cover w-full h-full rounded-full"
                  />
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-5">
                  <label
                    htmlFor="avatar"
                    className="cursor-pointer h-[21px] font-poppins font-normal text-[14px] leading-[21px] text-center text-[#3E424A] hover:underline"
                  >
                    Upload new
                  </label>
                  {avatar && (
                    <button
                      type="button"
                      onClick={handleAvatarRemove}
                      className="cursor-pointer h-[21px] font-poppins font-normal text-[14px] leading-[21px] text-center text-[#3E424A] hover:underline"
                    >
                      Remove
                    </button>
                  )}
                  <input
                    type="file"
                    id="avatar"
                    accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                {backendErrors.avatar && (
                  <div className="text-red-600 text-sm font-poppins">
                    {backendErrors.avatar.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form */}
            <form className="flex flex-col gap-6 mt-6" onSubmit={handleSubmit}>
              {/* Username */}
              <div className="relative w-[554px] flex flex-col">
                <div
                  className={`relative flex items-center px-3 border rounded-lg bg-white h-[42px] ${
                    backendErrors.username
                      ? "border-red-500"
                      : "border-[#E1DFE1]"
                  }`}
                >
                  {username === "" && (
                    <div className="flex items-center gap-1 pointer-events-none">
                      <p className="font-poppins font-normal text-sm text-[#3E424A]">
                        Username
                      </p>
                      <span className="text-sm text-[#FF4000]">*</span>
                    </div>
                  )}
                  <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    disabled={isLoading}
                    className="absolute w-full h-full left-0 top-0 px-3 bg-transparent outline-none font-poppins text-sm text-[#3E424A]"
                  />
                </div>
                {backendErrors.username && (
                  <div className="text-red-600 text-sm font-poppins mt-1">
                    {backendErrors.username.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="relative w-[554px] flex flex-col">
                <div
                  className={`relative flex items-center px-3 border rounded-lg bg-white h-[42px] ${
                    backendErrors.email ? "border-red-500" : "border-[#E1DFE1]"
                  }`}
                >
                  {email === "" && (
                    <div className="flex items-center gap-1 pointer-events-none">
                      <p className="font-poppins font-normal text-sm text-[#3E424A]">
                        Email
                      </p>
                      <span className="text-sm text-[#FF4000]">*</span>
                    </div>
                  )}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isLoading}
                    className="absolute w-full h-full left-0 top-0 px-3 bg-transparent outline-none font-poppins text-sm text-[#3E424A]"
                  />
                </div>
                {backendErrors.email && (
                  <div className="text-red-600 text-sm font-poppins mt-1">
                    {backendErrors.email.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="relative w-[554px] flex flex-col">
                <div
                  className={`relative flex items-center px-3 border rounded-lg bg-white h-[42px] ${
                    backendErrors.password
                      ? "border-red-500"
                      : "border-[#E1DFE1]"
                  }`}
                >
                  {password === "" && (
                    <div className="flex items-center gap-1 pointer-events-none">
                      <p className="font-poppins font-normal text-sm text-[#3E424A]">
                        Password
                      </p>
                      <span className="text-sm text-[#FF4000]">*</span>
                    </div>
                  )}
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    disabled={isLoading}
                    className="absolute w-full h-full left-0 top-0 px-3 bg-transparent outline-none font-poppins text-sm text-[#3E424A]"
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
                {backendErrors.password && (
                  <div className="text-red-600 text-sm font-poppins mt-1">
                    {backendErrors.password.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Repeat Password */}
              <div className="relative w-[554px] flex flex-col">
                <div
                  className={`relative flex items-center px-3 border rounded-lg bg-white h-[42px] ${
                    backendErrors.password_confirmation
                      ? "border-red-500"
                      : "border-[#E1DFE1]"
                  }`}
                >
                  {repeatPassword === "" && (
                    <div className="flex items-center gap-1 pointer-events-none">
                      <p className="font-poppins font-normal text-sm text-[#3E424A]">
                        Repeat Password
                      </p>
                      <span className="text-sm text-[#FF4000]">*</span>
                    </div>
                  )}
                  <input
                    type={show ? "text" : "password"}
                    value={repeatPassword}
                    onChange={(e) => {
                      handleInputChange(
                        "password_confirmation",
                        e.target.value
                      );
                    }}
                    disabled={isLoading}
                    className="absolute w-full h-full left-0 top-0 px-3 bg-transparent outline-none font-poppins text-sm text-[#3E424A]"
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
                {backendErrors.password_confirmation && (
                  <div className="text-red-600 text-sm font-poppins mt-1">
                    {backendErrors.password_confirmation.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Register Button */}
              <div className="mt-[45px]">
                <Button
                  text="Register"
                  width="554px"
                  height="41px"
                  type="submit"
                />
                {/* Already member */}
                <div className="flex justify-center mt-3 gap-x-2">
                  <p className="font-poppins text-sm text-[#3E424A]">
                    Already member?
                  </p>
                  <Link
                    href="/login"
                    className="font-poppins font-medium text-sm text-[#FF4000] cursor-pointer hover:underline"
                  >
                    Log in
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
