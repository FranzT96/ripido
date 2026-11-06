'use client';

export default function RipidoHome() {
  return (
    <main className="w-full min-h-screen">
      
      {/* NAVBAR MINIMALE (Testo sempre bianco, senza strani effetti di fusione) */}
      <nav className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 text-white">
        <div className="font-black text-3xl tracking-tighter uppercase">Ripido</div>
        <div className="hidden md:flex gap-8 text-xs font-bold tracking-widest uppercase">
          <a href="#giri" className="hover:opacity-80 transition">I Giri</a>
          <a href="#filosofia" className="hover:opacity-80 transition">Filosofia</a>
          <a href="#guide" className="hover:opacity-80 transition">Admin</a>
        </div>
      </nav>

      {/* HERO SECTION STILE DOCUSERIE */}
      <section 
        className="relative w-full h-[100svh] flex flex-col justify-end p-6 md:p-12 pb-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop')" }}
      >
        {/* Doppio overlay scuro: uno in alto per la navbar, uno in basso per il testo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent z-0 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0 pointer-events-none"></div>

        <div className="relative z-10 text-white max-w-4xl">
          <p className="font-mono text-xs md:text-sm tracking-widest uppercase mb-4 text-slate-300">
            46° 11' 33" N — 7° 52' 12" E
          </p>
          <h1 className="text-6xl md:text-[7rem] font-black tracking-tighter leading-[0.85] mb-8">
            La montagna <br /> tra sconosciuti.
          </h1>
          <p className="text-lg md:text-xl font-medium max-w-lg mb-10 opacity-90 leading-relaxed">
            Niente turisti. Solo gente che ha voglia di fare fatica, condividere il passo e scoprire storie inesplorate. 
          </p>
          <a href="#giri" className="inline-block bg-white text-black font-black uppercase tracking-widest text-xs px-10 py-5 rounded-full hover:scale-105 transition-transform duration-300 shadow-xl">
            Unisciti alla cordata
          </a>
        </div>
      </section>

      {/* SEZIONE GIRI (Griglia asimmetrica) */}
      <section id="giri" className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Prossime Uscite</h2>
            <p className="text-xl text-slate-500 max-w-lg font-medium leading-relaxed">
              Decidiamo la meta, il meteo fa il resto. Seleziona un giro, controlla la difficoltà e prenota il tuo posto in auto.
            </p>
          </div>
        </div>

        {/* CARD SINGOLO GIRO */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
          
          <div className="md:col-span-7 h-[50vh] md:h-[70vh] w-full bg-slate-200 overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1522346513757-54c552451fdc?q=80&w=1200&auto=format&fit=crop" 
              alt="Dolomiti"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1.5s]"
            />
          </div>
          
          <div className="md:col-span-5 flex flex-col justify-center">
            <div className="flex gap-3 mb-6">
              <span className="border border-slate-800 text-slate-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full">EE (Esperti)</span>
              <span className="bg-slate-800 text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full">12 Ottobre</span>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-none">Traversata <br/>del Sella</h3>
            
            <p className="text-slate-600 mb-10 text-lg leading-relaxed font-medium">
              Un percorso che attraversa il cuore delle Dolomiti. Richiede passo sicuro e assenza di vertigini. Portare acqua a sufficienza, non ci sono rifugi intermedi.
            </p>
            
            <div className="grid grid-cols-2 gap-y-8 gap-x-8 border-l-2 border-slate-800 pl-6 mb-12">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Dislivello</p>
                <p className="font-bold text-2xl">+ 1.200m</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Durata</p>
                <p className="font-bold text-2xl">7 Ore</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Partenza</p>
                <p className="font-bold text-2xl">06:00 AM</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Posti Rimasti</p>
                <p className="font-bold text-2xl">3 / 8</p>
              </div>
            </div>

            <button className="w-full bg-[#111827] text-white py-5 font-black uppercase tracking-widest text-xs hover:bg-slate-700 transition-colors">
              Partecipa al giro
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}