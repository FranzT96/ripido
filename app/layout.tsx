import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Usiamo un font pulito e geometrico
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ripido | La montagna tra sconosciuti",
  description: "Solo per chi ama la fatica e la condivisione.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      {/* Sfondo bianco sporco (stile carta/roccia) e testo quasi nero per massimo contrasto */}
      <body className={`${inter.className} bg-[#F9F9F6] text-[#111827] antialiased selection:bg-slate-900 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}