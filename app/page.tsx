'use client';

export default function RipidoHome() {
  return (
    <main className="w-full min-h-screen m-0 p-0 bg-[#F9F9F6]">
      
      {/* HERO SECTION A TUTTO SCHERMO */}
      <section className="relative w-full h-screen m-0 p-0 overflow-hidden flex flex-col">
        
        {/* FOTO DI SFONDO (Unsplash alta risoluzione, aspect-ratio perfetto) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
            alt="Montagne" 
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay scuro per garantire il contrasto del testo in ogni condizione */}
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent z-20"></div>
        </div>

        {/* NAVBAR SUPERIORE */}
        <nav className="relative z-30 w-full p-6 md:p-12 flex justify-between items-center text-white">
          <div className="font-black text-2xl md:text-3xl tracking-tighter uppercase cursor-pointer drop-shadow-md">
            Ripido
          </div>
          <div className="hidden md:flex gap-8 text-xs font-black tracking-widest uppercase drop-shadow-md">
            <a href="#giri" className="hover:text-slate-300 transition-colors">I Giri</a>
            <a href="#filosofia" className="hover:text-slate-300 transition-colors">Filosofia</a>
            <a href="#guide" className="hover:text-slate-300 transition-colors">Admin</a>
          </div>
        </nav>

        {/* CONTENUTO CENTRALE (Allineato verticalmente al centro per non finire sul bordo) */}
        <div className="relative z-30 w-full px-6 md:px-12 flex-1 flex flex-col justify-center max-w-6xl">
          
          <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-black tracking-tighter leading-[1.1] mb-10 text-white drop-shadow-xl">
            The mountains are calling.<br />
            <span className="text-slate-300">Your friends aren’t.</span><br />
            Find your people.
          </h1>
          
          <div className="self-start">
            <a 
              href="#giri" 
              className="inline-block bg-white hover:bg-slate-200 text-[#111827] font-black uppercase tracking-widest text-[11px] px-10 py-5 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl"
            >
              Unisciti alla cordata
            </a>
          </div>
        </div>

      </section>

      {/* SEZIONE GIRI (Invariata) */}
      <section id="giri" className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto bg-[#F9F9F6] text-[#111827]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase">Prossime Uscite</h2>
            <p className="text-xl text-slate-600 max-w-lg font-medium leading-relaxed">
              Decidiamo la meta, il meteo fa il resto. Seleziona un giro, controlla la difficoltà e prenota il tuo posto in auto.
            </p>
          </div>
        </div>

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