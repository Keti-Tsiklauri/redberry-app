export default function GeneralError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="w-full mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
      {/* Icon */}
      <div className="flex items-start">
        <span className="flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
          !
        </span>
      </div>

      {/* Errors List */}
      <div className="flex flex-col gap-1">
        {errors.map((error, index) => (
          <p
            key={index}
            className="text-red-700 text-sm font-poppins leading-[20px]"
          >
            {error}
          </p>
        ))}
      </div>
    </div>
  );
}
