import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

// Font Sans-serif pulito per i testi piccoli e i menu
const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-montserrat' });
// Font Serif elegante per i titoli grandi stile Pampero
const playfair = Playfair_Display({ subsets: ["latin"], style: ['normal', 'italic'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "Ripido | The mountains are calling",
  description: "Find your people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="m-0 p-0 w-full h-full scroll-smooth">
      <body className={`${montserrat.className} ${montserrat.variable} ${playfair.variable} bg-[#111827] text-white m-0 p-0 w-full h-full overflow-x-hidden antialiased`}>
        {children}
      </body>
    </html>
  );
}