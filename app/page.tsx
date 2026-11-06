'use client';

export default function RipidoHome() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-900">
      
      {/* 1. SFONDO (Senza zoom strani) e OSCURAMENTO */}
      <img 
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
        alt="Sfondo" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30"></div>

      {/* 2. LOGO: Piccolo (w-24), in alto a sinistra (top-8 left-8) */}
      <img 
        src="/logo-ripido.png" 
        alt="Logo" 
        className="absolute top-8 left-8 w-24 md:w-32 brightness-0 invert drop-shadow-md z-10"
      />

      {/* 3. TESTO: Bianco (text-white), in basso a sx (bottom-16 left-8), distanziato */}
      <div className="absolute bottom-16 left-8 md:bottom-24 md:left-16 z-10">
        <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-xl leading-tight">
          The mountains are calling.<br />
          <span className="italic font-light">Your friends aren't.</span><br />
          Find your people.
        </h1>
      </div>

    </main>
  );
}