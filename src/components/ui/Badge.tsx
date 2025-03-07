import React from "react";

interface BadgeProps {
  label: string;
  variant?:
    | "demo"
    | "internal"
    | "signup"
    | "content"
    | "dont-send"
    | "default";
  className?: string;
}

export function Badge({
  label,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variantClasses = {
    demo: "bg-orange-100 text-orange-600",
    internal: "bg-green-100 text-green-600",
    signup: "bg-green-500 text-white",
    content: "bg-green-200 text-green-700",
    "dont-send": "bg-red-100 text-red-600",
    default: "bg-gray-100 text-gray-600",
  };

  const variantClass = variantClasses[variant] || variantClasses.default;

  return (
    <span
      className={`text-xs px-1.5 py-0.5 rounded mr-1 ${variantClass} ${className}`}
    >
      {label}
    </span>
  );
}
