"use client";

interface SortByDropdownProps {
  onSelect: (option: string) => void;
  selected: string;
}

export default function SortByDropdown({
  onSelect,
  selected,
}: SortByDropdownProps) {
  const options = [
    "New products first",
    "Price: Low to High",
    "Price: High to Low",
  ];

  return (
    <div className="w-[223px] bg-white border border-[#E1DFE1] rounded-lg shadow">
      <p className="px-4 py-2 font-poppins font-semibold text-[16px] leading-[24px] text-[#10151F]">
        Sort by
      </p>
      <div className="flex flex-col">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(option)}
            className={`flex items-center px-4 py-2 text-left w-full text-[16px] leading-[24px] font-poppins hover:bg-gray-100 ${
              selected === option
                ? "text-red-500 font-semibold"
                : "text-[#10151F] font-normal"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
