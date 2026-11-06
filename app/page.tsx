'use client';
import Link from 'next/link';

export default function RipidoHome() {
  return (
    <main className="w-full h-screen m-0 p-0 overflow-hidden bg-[#111827]">
      
      {/* HOMEPAGE STATICA A TUTTO SCHERMO (Zero Scroll) */}
      <section className="relative w-full h-full flex flex-col justify-between">
        
        {/* FOTO DI SFONDO (Unsplash Alta Risoluzione) */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
            alt="Montagne maestose" 
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay scuri calibrati per staccare il testo bianco */}
          <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-black/40 to-transparent z-20 pointer-events-none"></div>
        </div>

        {/* NAVBAR SUPERIORE */}
        <nav className="relative z-30 w-full p-8 md:p-12 flex justify-between items-center text-white">
          <div className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl tracking-wider uppercase cursor-pointer drop-shadow-lg">
            Ripido
          </div>
          <div className="hidden md:flex gap-10 text-[10px] font-bold tracking-[0.2em] uppercase drop-shadow-md">
            <Link href="/prossime-uscite" className="hover:text-slate-300 transition-colors">I Giri</Link>
            <Link href="/filosofia" className="hover:text-slate-300 transition-colors">Filosofia</Link>
            <Link href="/admin" className="hover:text-slate-300 transition-colors">Admin</Link>
          </div>
        </nav>

        {/* CONTENUTO CENTRALE E PULSANTIERA */}
        <div className="relative z-30 w-full px-8 md:px-12 pb-16 md:pb-24 max-w-6xl self-start flex flex-col justify-end h-full">
          
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-[5.5rem] lg:text-[6.5rem] tracking-tight leading-[1.1] mb-10 text-white drop-shadow-2xl">
            The mountains are calling.<br />
            <span className="italic font-light text-slate-300">Your friends aren’t.</span><br />
            Find your people.
          </h1>
          
          {/* PULSANTI PER PAGINE DEDICATE */}
          <div className="flex flex-wrap gap-4 md:gap-6 self-start">
            <Link 
              href="/prossime-uscite" 
              className="inline-block border border-white text-white font-bold uppercase tracking-[0.15em] text-[10px] px-8 py-4 hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-sm shadow-xl"
            >
              Prossime Uscite
            </Link>
            
            <Link 
              href="/uscite-passate" 
              className="inline-block border border-white/30 text-white/90 font-bold uppercase tracking-[0.15em] text-[10px] px-8 py-4 hover:bg-white/10 hover:border-white/60 transition-all duration-500 backdrop-blur-sm"
            >
              Uscite Passate
            </Link>
            
            <Link 
              href="/filosofia" 
              className="inline-block border border-white/30 text-white/90 font-bold uppercase tracking-[0.15em] text-[10px] px-8 py-4 hover:bg-white/10 hover:border-white/60 transition-all duration-500 backdrop-blur-sm"
            >
              La Filosofia
            </Link>
          </div>
        </div>

      </section>
    </main>
  );
}