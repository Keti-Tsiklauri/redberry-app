import Link from "next/link";
import Button from "../button/Button";
import InputField from "./InputField";
import PasswordField from "./PasswordField";

export default function AuthForm({
  username,
  email,
  password,
  repeatPassword,
  onChange,
  onSubmit,
  errors,
  isLoading,
}: any) {
  return (
    <form className="flex flex-col gap-6 mt-6" onSubmit={onSubmit}>
      <InputField
        value={username}
        onChange={(e) => onChange("username", e.target.value)}
        placeholder="Username"
        required
        disabled={isLoading}
        errors={errors.username}
      />
      <InputField
        type="email"
        value={email}
        onChange={(e) => onChange("email", e.target.value)}
        placeholder="Email"
        required
        disabled={isLoading}
        errors={errors.email}
      />
      <PasswordField
        value={password}
        onChange={(e) => onChange("password", e.target.value)}
        placeholder="Password"
        required
        disabled={isLoading}
        errors={errors.password}
      />
      <PasswordField
        value={repeatPassword}
        onChange={(e) => onChange("password_confirmation", e.target.value)}
        placeholder="Repeat Password"
        required
        disabled={isLoading}
        errors={errors.password_confirmation}
      />

      <div className="mt-[45px]">
        <Button text="Register" width="554px" height="41px" type="submit" />
        <div className="flex justify-center mt-3 gap-x-2">
          <p className="font-poppins text-sm text-[#3E424A]">Already member?</p>
          <Link
            href="/login"
            className="font-poppins font-medium text-sm text-[#FF4000] hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </form>
  );
}
