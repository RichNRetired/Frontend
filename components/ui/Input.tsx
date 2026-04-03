import React from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  maxLength?: number;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  id,
  name,
  autoComplete,
  required,
  className = "",
  disabled = false,
  maxLength,
}) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      autoComplete={autoComplete}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      maxLength={maxLength}
      className={`border p-2 rounded w-full ${className}`}
    />
  );
};
