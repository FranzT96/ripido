import type { Metadata } from "next";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import "./globals.css";

// Font Sans-serif pulito per tutto il sito
const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-montserrat' });

export const metadata: Metadata = {
  metadataBase: new URL("https://ripido.vercel.app"),
  title: "Ripido | The mountains are calling",
  description: "Community per appassionati di montagna. Escursioni, weekend in rifugio e cene in casera. Find your people.",
  openGraph: {
    title: 'Ripido | Find your people',
    description: 'Unisciti alla nostra community per scoprire le prossime uscite in montagna ed eventi.',
    url: 'https://ripido.vercel.app', 
    siteName: 'Ripido',
    images: [
      {
        url: '/og-image.jpg', /* Ricordati di caricare un file chiamato og-image.jpg nella cartella public! */
        width: 1200,
        height: 630,
        alt: 'Ripido Community',
      },
    ],
    locale: 'it_IT',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="m-0 p-0 w-full h-full scroll-smooth">
      <body className={`${montserrat.className} ${montserrat.variable} bg-[#0a0a0a] text-white m-0 p-0 w-full h-full overflow-x-hidden antialiased`}>
        
        {/* IL CONTENUTO DELLE PAGINE */}
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>
            {children}
          </div>
          
          {/* FOOTER GLOBALE (Appare su tutte le pagine) */}
          <footer style={{ backgroundColor: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 20px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>&copy; 2026 Ripido. Tutti i diritti riservati.</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '25px' }}>
                <a href="#" style={{ color: '#888', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Privacy Policy</a>
                <Link href="/social" style={{ color: '#888', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Entra nel gruppo</Link>
              </div>
            </div>
          </footer>
        </div>

      </body>
    </html>
  );
}