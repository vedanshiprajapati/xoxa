import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    icon: "text-gray-500 hover:text-gray-700",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const baseClass =
    variant === "icon"
      ? ""
      : `${sizeClasses[size]} rounded focus:outline-none transition-colors`;

  return (
    <button
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
