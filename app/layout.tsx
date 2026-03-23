// app/layout.tsx
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Provider as RadixTooltipProvider } from "@radix-ui/react-tooltip";
import AppProvider from "./_components/AppProvider"; // <- relative import

export const metadata: Metadata = {
  title: "AI Website Builder — Build Websites with AI in Seconds",
  description: "Generate, edit, and export full websites using AI. No coding required. From idea to live website in under 60 seconds.",
};

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={outfit.className}>
          <RadixTooltipProvider>
            <AppProvider>{children}</AppProvider>
          </RadixTooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
