"use client";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "./ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider enableSystem>
        <Toaster richColors theme="system" />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
