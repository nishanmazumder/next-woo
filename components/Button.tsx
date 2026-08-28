"use client";

import type { ReactNode } from "react";

interface ButtonProps {
  children?: ReactNode;
}

export default function Button({ children = "Click" }: ButtonProps) {
  function handleClick() {
    console.log("click");
  }

  return (
    <button
      type="button"
      className="rounded bg-yellow-950 px-4 py-2 text-white"
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
