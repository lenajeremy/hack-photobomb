import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider enableSystem>{children}</ThemeProvider>;
}
