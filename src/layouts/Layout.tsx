import type React from "react";
import "../styles/global.css";
import { ThemeProvider } from "../components/theme-provider";

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
      <div className="min-h-screen font-sans antialiased">{children}</div>
    </ThemeProvider>
  );
}
