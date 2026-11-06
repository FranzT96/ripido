import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700", "900"] });

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
    <html lang="it" className="m-0 p-0 w-full h-full">
      <body className={`${montserrat.className} bg-[#111827] text-white m-0 p-0 w-full h-full overflow-x-hidden antialiased selection:bg-white selection:text-black`}>
        {children}
      </body>
    </html>
  );
}