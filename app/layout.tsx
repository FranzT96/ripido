import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

// Montserrat è perfetto per i titoli giganti in stile Pampero
const montserrat = Montserrat({ subsets: ["latin"] });

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
      <body className={`${montserrat.className} bg-[#F9F9F6] text-[#111827] antialiased m-0 p-0 overflow-x-hidden selection:bg-slate-900 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}