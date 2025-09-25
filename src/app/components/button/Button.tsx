import Image from "next/image";

interface ButtonProps {
  text: string;
  width?: string;
  height?: string;
  imageSrc?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({
  text,
  width = "704px",
  height = "59px",
  imageSrc,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        flex justify-center items-center gap-[10px]
        px-[60px] py-[16px]
        bg-[#FF4000] rounded-[10px]
        ${
          disabled || loading
            ? "opacity-70 cursor-not-allowed"
            : "cursor-pointer"
        }
      `}
      style={{ width, height }}
    >
      {loading ? (
        <span className="font-poppins font-medium text-[18px] leading-[27px] text-white">
          Loading...
        </span>
      ) : (
        <>
          {imageSrc && (
            <Image
              src={imageSrc}
              alt="icon"
              width={24}
              height={24}
              className="cursor-pointer"
            />
          )}
          <span className="font-poppins font-medium text-[18px] leading-[27px] text-white cursor-pointer">
            {text}
          </span>
        </>
      )}
    </button>
  );
}
