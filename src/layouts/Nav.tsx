import type React from "react";
import "../styles/global.css";
import { ThemeProvider } from "../components/theme-provider";

interface LayoutProps {
  children: React.ReactNode;
}
interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
