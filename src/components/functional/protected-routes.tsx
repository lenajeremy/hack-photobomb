"use client";
import * as React from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ProtectedRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          data-testid="loader"
          className="h-auto w-[22px] text-current scale-95"
        >
          <g>
            <path d="M11 1h2v5h-2z" opacity="0.14"></path>
            <path
              d="m16.634 1.974 1.732 1-2.5 4.33-1.732-1z"
              opacity="0.29"
            ></path>
            <path
              d="m21.026 5.634 1 1.732-4.33 2.5-1-1.732z"
              opacity="0.43"
            ></path>
            <path d="M23 11v2h-5v-2z" opacity="0.57"></path>
            <path
              d="m22.026 16.634-1 1.732-4.33-2.5 1-1.732z"
              opacity="0.71"
            ></path>
            <path
              d="m18.366 21.026-1.732 1-2.5-4.33 1.732-1z"
              opacity="0.86"
            ></path>
            <path d="M13 23h-2v-5h2z"></path>
            <animateTransform
              attributeName="transform"
              calcMode="discrete"
              dur="0.75s"
              repeatCount="indefinite"
              type="rotate"
              values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"
            ></animateTransform>
          </g>
        </svg>
        <p className="text-sm opacity-60">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return redirect("/auth/login");
  }

  return <div>{children}</div>;
}
