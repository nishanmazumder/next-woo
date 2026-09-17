"use client";

import type { ReactNode } from "react";
import posthog from "posthog-js";

import { isPostHogConfigured } from "@/instrumentation-client";

interface ButtonProps {
  children?: ReactNode;
}

export default function Button({ children = "Click" }: ButtonProps) {
  function handleClick() {
    console.log("click");

    if (isPostHogConfigured) {
      posthog.capture("test_interaction_clicked");
    }
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
