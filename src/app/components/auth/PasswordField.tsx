interface PasswordFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  show?: boolean; // if using toggle show
  onToggleShow?: () => void;
  errors?: string[]; // <-- add this
}

export default function PasswordField({
  value,
  onChange,
  placeholder,
  required,
  disabled,
  show,
  onToggleShow,
  errors,
}: PasswordFieldProps) {
  return (
    <div className="flex flex-col">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="border rounded px-2 py-1"
      />
      {errors && errors.length > 0 && (
        <p className="text-red-500 text-sm mt-1">{errors[0]}</p>
      )}
    </div>
  );
}
