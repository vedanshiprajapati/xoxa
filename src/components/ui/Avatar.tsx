import React from "react";
import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({
  src,
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const sizeClass = sizes[size];

  return (
    <div className={`relative ${sizeClass} ${className}`}>
      {src ? (
        <div
          className={`${sizeClass} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center`}
        >
          <img src={src} alt={name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div
          className={`${sizeClass} rounded-full bg-gray-300 flex items-center justify-center text-white`}
        >
          {name.toUpperCase().charAt(0)}
        </div>
      )}
    </div>
  );
}
