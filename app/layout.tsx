import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProviderReducer from "@/components/providers/ProviderReducer";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";

const primarySans = Raleway({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const secondarySans = Raleway({
  variable: "--font-secondary",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SENAI Gestão de Atestados",
  description: "Gerencie atestados de forma eficiente e organizada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${primarySans.variable} ${secondarySans.variable} antialiased bg-[#f7f8fa]`}
      >
        <ProviderReducer providers={[QueryProvider, TooltipProvider]}>
          {children}
        </ProviderReducer>
        <Toaster />
        <Sonner />
      </body>
    </html>
  );
}
