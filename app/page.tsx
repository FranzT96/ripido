'use client';

export default function RipidoHome() {
  return (
    <main className="relative w-full h-screen overflow-hidden m-0 p-0 bg-black">
      
      {/* 1. SFONDO E OVERLAY */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
          alt="Montagne maestose" 
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay per staccare il testo bianco */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
      </div>

      {/* 2. LOGO: Piccolo e nell'angolo in alto a sinistra */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10 w-20 md:w-28">
        <img 
          src="/logo-ripido.png" 
          alt="Logo Ripido" 
          className="w-full h-auto object-contain brightness-0 invert drop-shadow-md"
        />
      </div>

      {/* 3. TESTO: In basso a sinistra, distanziato dai bordi e BIANCO */}
      <div className="absolute bottom-16 left-8 md:bottom-24 md:left-12 z-10 max-w-4xl">
        <h1 className="font-[family-name:var(--font-playfair)] text-white text-5xl md:text-6xl lg:text-[5.5rem] tracking-tight leading-[1.1] drop-shadow-xl">
          The mountains are calling.<br />
          <span className="italic font-light">Your friends aren’t.</span><br />
          Find your people.
        </h1>
      </div>

    </main>
  );
}