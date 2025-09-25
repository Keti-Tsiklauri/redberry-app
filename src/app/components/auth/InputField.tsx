export default function InputField({
  value,
  onChange,
  placeholder,
  type = "text",
  errors,
  required,
  disabled,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  errors?: string[];
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="relative w-[554px] flex flex-col">
      <div
        className={`relative flex items-center px-3 border rounded-lg bg-white h-[42px] ${
          errors ? "border-red-500" : "border-[#E1DFE1]"
        }`}
      >
        {value === "" && (
          <div className="flex items-center gap-1 pointer-events-none">
            <p className="font-poppins text-sm text-[#3E424A]">{placeholder}</p>
            {required && <span className="text-sm text-[#FF4000]">*</span>}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="absolute w-full h-full left-0 top-0 px-3 bg-transparent outline-none font-poppins text-sm text-[#3E424A]"
        />
      </div>
      {errors && (
        <div className="text-red-600 text-sm font-poppins mt-1">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
}
