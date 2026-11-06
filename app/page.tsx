'use client';
import Link from 'next/link';

export default function RipidoHome() {
  return (
    <main className="w-full h-screen m-0 p-0 overflow-hidden bg-[#111827]">
      
      {/* HOMEPAGE STATICA A TUTTO SCHERMO */}
      <section className="relative w-full h-full flex flex-col items-center">
        
        {/* FOTO DI SFONDO (Unsplash Alta Risoluzione - Forziamo lo z-index per tenerla dietro) */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
            alt="Montagne maestose" 
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay scuro per far risaltare TUTTO il testo bianco */}
          <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
        </div>

        {/* HEADER SUPERIORE: Logo a sx, Pulsanti al centro */}
        <nav className="relative z-30 w-full pt-8 px-8 md:px-12 flex justify-between items-start text-white h-32">
          
          {/* LOGO (Invertito a bianco tramite CSS filter) */}
          <div className="w-32 md:w-40 flex-shrink-0">
            <img 
              src="/logo-ripido.png" 
              alt="Logo Ripido" 
              className="w-full h-auto object-contain brightness-0 invert drop-shadow-md"
            />
          </div>

          {/* PULSANTIERA CENTRALE STILE PAMPERO (Testo bianco puro) */}
          <div className="hidden md:flex gap-10 text-[11px] font-bold tracking-[0.2em] uppercase pt-4">
            <Link href="/prossime-uscite" className="text-white hover:text-slate-300 transition-colors drop-shadow-md">Prossime Uscite</Link>
            <Link href="/uscite-passate" className="text-white hover:text-slate-300 transition-colors drop-shadow-md">Uscite Passate</Link>
            <Link href="/filosofia" className="text-white hover:text-slate-300 transition-colors drop-shadow-md">La Filosofia</Link>
            <Link href="/admin" className="text-white hover:text-slate-300 transition-colors drop-shadow-md">Admin</Link>
          </div>

          {/* Div vuoto per bilanciare il flexbox a destra */}
          <div className="w-32 md:w-40 hidden md:block"></div>
        </nav>

        {/* CONTENUTO CENTRALE (Motto IG) */}
        <div className="relative z-30 flex-1 flex flex-col justify-center items-center w-full px-4 text-center pb-20">
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl lg:text-[7rem] tracking-tight leading-[1.1] text-white drop-shadow-2xl">
            The mountains are calling.<br />
            <span className="italic font-light text-white/90">Your friends aren’t.</span><br />
            Find your people.
          </h1>
        </div>

      </section>
    </main>
  );
}