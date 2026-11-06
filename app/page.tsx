'use client';
import Link from 'next/link';

export default function RipidoHome() {
  return (
    <main className="w-full h-screen m-0 p-0 overflow-hidden bg-[#111827]">
      
      <section className="relative w-full h-full flex flex-col">
        
        {/* SFONDO E OVERLAY SCURO */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
            alt="Montagne maestose" 
            className="w-full h-full object-cover object-center"
          />
          {/* Scuriamo un po' di più per far letteralmente esplodere il bianco del testo */}
          <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
        </div>

        {/* NAVBAR - Inchiodata in alto a sinistra */}
        <nav className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-start z-30">
          
          {/* LOGO: Più piccolo e spinto nell'angolo in alto a sx */}
          <div className="w-16 md:w-24 mt-2 ml-2 md:mt-4 md:ml-4 flex-shrink-0">
            <img 
              src="/logo-ripido.png" 
              alt="Logo Ripido" 
              className="w-full h-auto object-contain brightness-0 invert drop-shadow-md"
            />
          </div>

          {/* PULSANTI: In alto, leggermente spostati verso destra */}
          <div className="hidden md:flex gap-8 lg:gap-12 text-[12px] font-bold tracking-[0.2em] uppercase mt-6 md:mt-8 md:pr-12">
            <Link href="/prossime-uscite" className="text-white hover:text-slate-300 transition-colors drop-shadow-md">Prossime Uscite</Link>
            <Link href="/uscite-passate" className="text-white hover:text-slate-300 transition-colors drop-shadow-md">Uscite Passate</Link>
            <Link href="/filosofia" className="text-white hover:text-slate-300 transition-colors drop-shadow-md">La Filosofia</Link>
            <Link href="/admin" className="text-white hover:text-slate-300 transition-colors drop-shadow-md">Admin</Link>
          </div>
        </nav>

        {/* MOTTO IG: Gigantesco, Bianco e centrato nel riquadro in basso */}
        <div className="relative z-30 flex-1 flex flex-col justify-end items-center w-full px-4 pb-20 md:pb-32">
          <h1 className="font-[family-name:var(--font-playfair)] text-[2.5rem] sm:text-5xl md:text-[5.5rem] lg:text-[7.5rem] xl:text-[8.5rem] tracking-tight leading-[1] text-white text-center drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
            The mountains are calling.<br />
            <span className="italic font-light text-white">Your friends aren’t.</span><br />
            Find your people.
          </h1>
        </div>

      </section>
    </main>
  );
}