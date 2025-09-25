import Image from "next/image";

export default function AvatarUpload({
  avatar,
  onChange,
  onRemove,
  errors,
}: {
  avatar: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  errors?: string[];
}) {
  return (
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
            src="/person-placeholder.svg"
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
            className="cursor-pointer h-[21px] font-poppins text-[14px] text-[#3E424A] hover:underline"
          >
            Upload new
          </label>
          {avatar && (
            <button
              type="button"
              onClick={onRemove}
              className="cursor-pointer h-[21px] font-poppins text-[14px] text-[#3E424A] hover:underline"
            >
              Remove
            </button>
          )}
          <input
            type="file"
            id="avatar"
            accept="image/png, image/jpeg, image/jpg, image/svg+xml"
            className="hidden"
            onChange={onChange}
          />
        </div>

        {errors && (
          <div className="text-red-600 text-sm font-poppins">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
