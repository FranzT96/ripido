'use client';
import Link from 'next/link';

export default function RipidoHome() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black m-0 p-0">
      
      {/* 1. FOTO DI SFONDO E OVERLAY (Gradiente da sinistra a destra per far spiccare il testo) */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
          alt="Montagne maestose" 
          className="w-full h-full object-cover object-center"
        />
        {/* Sfondo scuro che parte forte a sinistra (dove c'è il testo) e sfuma a destra */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
      </div>

      {/* 2. HEADER: LOGO A SINISTRA E MENU AL CENTRO */}
      <header className="absolute top-0 left-0 w-full z-40 flex justify-between items-start p-6 md:p-12">
        
        {/* LOGO: Piegato nell'angolo in alto a sx, sopra l'albero */}
        <div className="w-24 md:w-32 flex-shrink-0">
          <img 
            src="/logo-ripido.png" 
            alt="Logo Ripido" 
            className="w-full h-auto object-contain brightness-0 invert drop-shadow-xl"
          />
        </div>

        {/* MENU: In alto al centro, stile Pampero */}
        <nav className="hidden md:flex gap-10 text-[10px] text-white font-bold tracking-[0.2em] uppercase mt-4 mr-auto ml-12 lg:ml-24">
          <Link href="/prossime-uscite" className="hover:text-slate-300 transition-colors drop-shadow-md">Prossime Uscite</Link>
          <Link href="/uscite-passate" className="hover:text-slate-300 transition-colors drop-shadow-md">Uscite Passate</Link>
          <Link href="/filosofia" className="hover:text-slate-300 transition-colors drop-shadow-md">La Filosofia</Link>
          <Link href="/admin" className="hover:text-slate-300 transition-colors drop-shadow-md">Admin</Link>
        </nav>
      </header>

      {/* 3. TESTO PRINCIPALE E PULSANTI: Rigorosamente a sinistra */}
      <div className="absolute inset-0 z-30 flex flex-col justify-center items-start px-6 md:px-12 lg:px-24 w-full max-w-6xl mt-16 md:mt-0">
        
        {/* MOTTO IG: Bianco, grande, allineato a sinistra */}
        <h1 className="font-[family-name:var(--font-playfair)] text-white text-left text-5xl md:text-7xl lg:text-[6.5rem] tracking-tight leading-[1.05] drop-shadow-2xl mb-12">
          The mountains are calling.<br />
          <span className="italic font-light text-white/90">Your friends aren’t.</span><br />
          Find your people.
        </h1>

        {/* PULSANTI: Sotto il testo, allineati a sinistra come in Pampero */}
        <div className="flex flex-wrap gap-4 md:gap-6">
          <Link 
            href="/prossime-uscite" 
            className="inline-block bg-white text-black font-bold uppercase tracking-[0.15em] text-[10px] px-8 py-4 hover:bg-slate-200 transition-all duration-300 shadow-xl rounded-full"
          >
            Unisciti alla cordata
          </Link>
          
          <Link 
            href="/filosofia" 
            className="inline-block border border-white text-white font-bold uppercase tracking-[0.15em] text-[10px] px-8 py-4 hover:bg-white/10 hover:border-white transition-all duration-300 shadow-xl rounded-full backdrop-blur-sm"
          >
            Scopri di più
          </Link>
        </div>
        
      </div>

    </main>
  );
}