"use client";

import Image from "next/image";
import Logo from "../components/logo/Logo";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "../components/auth/AuthForm";
import AvatarUpload from "../components/auth/AvatarUpload";
import GeneralError from "../components/auth/GeneralError";
import Link from "next/link";
import { useUser } from "../components/context/userContext";

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

export default function Registration() {
  const router = useRouter();
  const { setUser, logout } = useUser(); // useUser for context management

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backendErrors, setBackendErrors] = useState<BackendErrors>({});

  // Clear user state and localStorage on initial load
  useEffect(() => {
    logout();
  }, [logout]);

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
    if (fileInput) fileInput.value = "";
    if (backendErrors.avatar) {
      setBackendErrors((prev) => ({ ...prev, avatar: undefined }));
    }
  };

  const handleInputChange = (field: keyof BackendErrors, value: string) => {
    if (backendErrors[field])
      setBackendErrors((prev) => ({ ...prev, [field]: undefined }));
    if (backendErrors.general)
      setBackendErrors((prev) => ({ ...prev, general: undefined }));

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
      let data: any = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      if (response.ok && data.user && data.token) {
        // Save user in context
        setUser(data.user, data.token);

        // Save in localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user.id.toString());
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("userEmail", data.user.email);

        document.cookie = `authToken=${data.token}; path=/;`;

        // Reset form
        setUsername("");
        setEmail("");
        setPassword("");
        setRepeatPassword("");
        setAvatar(null);
        setBackendErrors({});

        router.push("/"); // redirect home
        return;
      }

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
      if (err instanceof Error) errorMessage = err.message;
      setBackendErrors({ general: [errorMessage] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
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
            href="./login"
            className="font-poppins font-medium text-[12px] leading-[18px] text-[#10151F] cursor-pointer"
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
            <p className="font-poppins font-semibold text-[42px] text-[#10151F]">
              Registration
            </p>

            <GeneralError errors={backendErrors.general} />

            <AvatarUpload
              avatar={avatar}
              onChange={handleAvatarChange}
              onRemove={handleAvatarRemove}
              errors={backendErrors.avatar}
            />

            <AuthForm
              username={username}
              email={email}
              password={password}
              repeatPassword={repeatPassword}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              errors={backendErrors}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
