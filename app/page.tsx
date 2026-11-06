'use client';

export default function RipidoHome() {
  return (
    <main className="w-full min-h-screen m-0 p-0 bg-[#F9F9F6]">
      
      {/* HERO SECTION A TUTTO SCHERMO */}
      <section className="relative w-full h-screen m-0 p-0 overflow-hidden flex flex-col justify-between">
        
        {/* FOTO DI SFONDO (Inquadratura naturale e a fuoco) */}
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
          <img 
            src="/3Cime.jpg" 
            alt="Tre Cime di Lavaredo" 
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay protettivo per i testi (Gradiente scuro profondo dal basso e leggera ombra dall'alto) */}
          <div className="absolute inset-0 bg-black/25 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30 z-20"></div>
        </div>

        {/* NAVBAR SUPERIORE BEN VISIBILE */}
        <nav className="relative z-30 w-full p-6 md:p-10 flex justify-between items-center text-white">
          <div className="font-black text-2xl md:text-3xl tracking-tighter uppercase cursor-pointer drop-shadow-md">
            Ripido
          </div>
          <div className="hidden md:flex gap-8 text-[11px] font-black tracking-widest uppercase drop-shadow-md">
            <a href="#giri" className="hover:text-slate-300 transition-colors">I Giri</a>
            <a href="#filosofia" className="hover:text-slate-300 transition-colors">Filosofia</a>
            <a href="#guide" className="hover:text-slate-300 transition-colors">Admin</a>
          </div>
        </nav>

        {/* CONTENUTO CENTRALE / BASSO (Rialzato e con forte contrasto) */}
        <div className="relative z-30 w-full px-6 md:px-12 pb-20 md:pb-32 max-w-5xl self-start flex flex-col justify-end h-full">
          {/* Coordinate GPS: rialzate e ad alto contrasto */}
          <p className="font-mono text-xs md:text-sm tracking-widest uppercase mb-3 text-[#00a0b0] font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            46° 11' 33" N — 7° 52' 12" E
          </p>
          
          {/* Titolo principale: gigantesco e d'impatto */}
          <h1 className="text-4xl md:text-7xl lg:text-[6.5rem] font-black tracking-tighter leading-[0.9] mb-5 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
            La montagna <br /> tra sconosciuti.
          </h1>
          
          {/* Sottotitolo descrittivo: spostato più su e chiaramente leggibile */}
          <p className="text-sm md:text-lg font-bold max-w-xl mb-8 text-slate-200 leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            Niente turisti. Solo gente che ha voglia di fare fatica, condividere il passo e scoprire storie inesplorate nelle terre alte.
          </p>
          
          {/* Bottone: rialzato dai limiti inferiori per evitare che venga tagliato */}
          <div className="self-start">
            <a 
              href="#giri" 
              className="inline-block bg-white hover:bg-slate-100 text-[#111827] font-black uppercase tracking-widest text-[11px] px-10 py-5 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl"
            >
              Unisciti alla cordata
            </a>
          </div>
        </div>

      </section>

      {/* SEZIONE GIRI (Invariata, con il suo contrasto naturale pietra/panna) */}
      <section id="giri" className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto bg-[#F9F9F6] text-[#111827]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase">Prossime Uscite</h2>
            <p className="text-xl text-slate-600 max-w-lg font-medium leading-relaxed">
              Decidiamo la meta, il meteo fa il resto. Seleziona un giro, controlla la difficoltà e prenota il tuo posto in auto.
            </p>
          </div>
        </div>

        {/* CARD GIRO */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
          
          <div className="md:col-span-7 h-[45vh] md:h-[65vh] w-full bg-slate-200 overflow-hidden relative rounded-xl md:rounded-3xl shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1522346513757-54c552451fdc?q=80&w=1200&auto=format&fit=crop" 
              alt="Dolomiti"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1.5s]"
            />
          </div>
          
          <div className="md:col-span-5 flex flex-col justify-center py-4">
            <div className="flex gap-3 mb-6">
              <span className="border border-slate-800 text-slate-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full">EE (Esperti)</span>
              <span className="bg-slate-800 text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full">12 Ottobre</span>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-none">Traversata <br/>del Sella</h3>
            
            <p className="text-slate-600 mb-10 text-base md:text-lg leading-relaxed font-medium">
              Un percorso che attraversa il cuore delle Dolomiti. Richiede passo sicuro e assenza di vertigini. Portare acqua a sufficienza, non ci sono rifugi intermedi.
            </p>
            
            <div className="grid grid-cols-2 gap-y-8 gap-x-8 border-l-2 border-slate-800 pl-6 mb-12">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-1">Dislivello</p>
                <p className="font-black text-2xl">+ 1.200m</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Durata</p>
                <p className="font-black text-2xl">7 Ore</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Partenza</p>
                <p className="font-black text-2xl">06:00 AM</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Posti Rimasti</p>
                <p className="font-black text-2xl">3 / 8</p>
              </div>
            </div>

            <button className="w-full bg-[#111827] hover:bg-slate-800 text-white py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-md active:scale-[0.98]">
              Partecipa al giro
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}