import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { NextResponse } from "next/server"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "-")
}

export function respondError(error: Error, message?: string, status?: number) {
  return NextResponse.json({ data: null, error: error.message, message: message ?? "An error occurred" }, { status: status ?? 400 });
}

export function respondSuccess(data: unknown, message?: string, status?: number) {
  return NextResponse.json({ data, error: null, message: message ?? "Successful" }, { status: status ?? 200 });
}