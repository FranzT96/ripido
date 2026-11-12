'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ProssimeUscite() {
  // Dati di esempio
  const usciteData = [
    // --- IN PROGRAMMA ---
    { 
      id: 1, data: 'Domenica 15 Novembre', titolo: 'Bosco degli Eroi', regione: 'Veneto', 
      dPlus: '400m', km: '10km', livello: 'E', guide: 'Andrea', past: false, 
      immagine: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=300&auto=format&fit=crop',
      maxPartecipanti: 15, pernottamento: 'No', puntoPartenza: 'Rifugio Bocchette, Seren del Grappa', puntoArrivo: 'Rifugio Bocchette', tipologia: 'Anello', tempoStimato: '3 h'
    },
    { 
      id: 2, data: 'Domenica 15 Novembre', titolo: 'Lago di Sorapis via sentiero 215', regione: 'Veneto', 
      dPlus: '400m', km: '10km', livello: 'E', guide: 'Giada', past: false, 
      immagine: 'https://images.unsplash.com/photo-1522616238699-a9314455acdb?q=80&w=300&auto=format&fit=crop',
      maxPartecipanti: null, pernottamento: 'No', puntoPartenza: 'Passo Tre Croci', puntoArrivo: 'Passo Tre Croci', tipologia: 'Andata e ritorno', tempoStimato: '4.5 h'
    },
    { id: 3, data: 'Sabato 21 Novembre', titolo: 'Rifugio Tuckett e Casinei', regione: 'Trentino', dPlus: '800m', km: '14km', livello: 'E', guide: 'Matteo', past: false, immagine: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=300&auto=format&fit=crop' },
    { id: 4, data: 'Sabato 21 Novembre', titolo: 'Cima Carega dal Rifugio Revolto', regione: 'Veneto', dPlus: '1100m', km: '15km', livello: 'EE', guide: 'Andrea', past: false, immagine: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=300&auto=format&fit=crop' },
    { id: 5, data: 'Domenica 22 Novembre', titolo: 'Rocciamelone (3538m)', regione: 'Piemonte', dPlus: '1500m', km: '9km', livello: 'EE', guide: 'Matteo', past: false, immagine: 'https://images.unsplash.com/photo-1602852260645-0e3636f0a3cc?q=80&w=300&auto=format&fit=crop' },
    // --- STORICO ---
    { id: 6, data: 'Domenica 8 Novembre', titolo: 'Resegone via Canalone Bobbio', regione: 'Lombardia', dPlus: '1000m', km: '11km', livello: 'EE', guide: 'Matteo', past: true, immagine: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=300&auto=format&fit=crop' },
    { id: 7, data: 'Venerdì 30 Ottobre', titolo: 'Laghi di Fusine e Rifugio Zacchi', regione: 'FVG', dPlus: '500m', km: '10km', livello: 'E', guide: 'Giada', past: true, immagine: 'https://images.unsplash.com/photo-1542224566-6e85f2e10696?q=80&w=300&auto=format&fit=crop' }
  ];

  const [activeTab, setActiveTab] = useState('programma'); 
  const [activeRegion, setActiveRegion] = useState('Tutte');
  const [selectedUscita, setSelectedUscita] = useState<typeof usciteData[0] | null>(null);

  const filteredByTab = usciteData.filter(u => activeTab === 'programma' ? !u.past : u.past);
  const regioniDisponibili = ['Tutte', ...Array.from(new Set(filteredByTab.map(u => u.regione)))];
  const usciteVisualizzate = filteredByTab.filter(u => activeRegion === 'Tutte' || u.regione === activeRegion);

  const usciteRaggruppate = usciteVisualizzate.reduce((acc, uscita) => {
    if (!acc[uscita.data]) acc[uscita.data] = [];
    acc[uscita.data].push(uscita);
    return acc;
  }, {} as Record<string, typeof usciteData>);

  return (
    <main style={{ position: 'relative', width: '100%', minHeight: '100dvh', color: 'white', padding: '40px 20px', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      {/* BACKGROUND VERE LINEE TOPOGRAFICHE (File Locale) */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1,
        backgroundImage: 'url("/topografia.png")', 
        backgroundSize: '400px', /* Valore fisso in pixel per non sgranare l'immagine (alzalo o abbassalo per ingrandire/rimpicciolire le curve) */
        backgroundRepeat: 'repeat', /* Ripete l'immagine come una mattonella mantenendola nitidissima */
        opacity: 0.2 
      }} />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#0a0a0a', zIndex: -2 }} />

      <style>{`
        /* Stile per i filtri a pillola */
        .filter-btn {
          padding: 8px 16px;
          border-radius: 99px;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: bold;
          letter-spacing: 0.05em;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.3);
          background: transparent;
          color: white;
          transition: all 0.2s;
        }
        .filter-btn.active {
          background: rgb(223, 254, 2);
          color: black;
          border-color: rgb(223, 254, 2);
        }

        /* Nuovo Layout Riga compatta stile App */
        .uscita-row {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 15px;
          border-radius: 12px;
          cursor: pointer;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background-color 0.2s ease;
        }
        .uscita-row:hover {
          background-color: rgba(255,255,255,0.05);
        }
        .uscita-row h3 {
          transition: color 0.2s ease;
        }
        .uscita-row:hover h3 {
          color: rgb(223, 254, 2);
        }
        
        /* Freccia laterale */
        .arrow-icon {
          margin-left: auto;
          color: rgb(223, 254, 2);
          transition: transform 0.2s ease, opacity 0.2s ease;
          opacity: 0.5;
        }
        .uscita-row:hover .arrow-icon {
          transform: translate(3px, -3px);
          opacity: 1;
        }

        @media (max-width: 768px) {
          .uscita-row { gap: 15px; padding: 15px 5px; }
          .arrow-icon { display: none; /* Nasconde la freccia su mobile per fare spazio */ }
        }
      `}</style>

      {/* Navigazione */}
      <div style={{ maxWidth: '900px', margin: '0 auto', marginBottom: '40px' }}>
        <Link href="/" style={{ color: 'rgb(223, 254, 2)', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          &larr; Torna alla Home
        </Link>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Titolo e Sottotitolo */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 'bold', margin: '0 0 10px 0', letterSpacing: '0.05em' }}>
            Bacheca <span style={{ color: 'rgb(223, 254, 2)' }}>Uscite</span>
          </h1>
          <p style={{ color: '#aaa', margin: 0, fontSize: '1rem' }}>
            Scopri le prossime escursioni e trova la tua prossima avventura.
          </p>
        </div>
          
        {/* Tab In Programma / Passate */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button className={`filter-btn ${activeTab === 'programma' ? 'active' : ''}`} onClick={() => { setActiveTab('programma'); setActiveRegion('Tutte'); }}>
            In Programma
          </button>
          <button className={`filter-btn ${activeTab === 'storico' ? 'active' : ''}`} onClick={() => { setActiveTab('storico'); setActiveRegion('Tutte'); }}>
            Uscite Passate
          </button>
        </div>

        {/* Filtri Regione Testuali */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '50px', paddingBottom: '20px', borderBottom: '2px solid rgba(255,255,255,0.25)' }}>
          {regioniDisponibili.map(regione => (
            <button 
              key={regione}
              style={{ 
                background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.1em',
                color: activeRegion === regione ? 'rgb(223, 254, 2)' : '#888',
                transition: 'color 0.2s'
              }}
              onClick={() => setActiveRegion(regione)}
            >
              {regione}
            </button>
          ))}
        </div>

        {/* Lista Uscite */}
        {Object.keys(usciteRaggruppate).length === 0 ? (
          <p style={{ color: '#aaa' }}>Nessuna uscita trovata per questa selezione.</p>
        ) : (
          Object.entries(usciteRaggruppate).map(([data, uscite]) => (
            <div key={data} style={{ marginBottom: '50px' }}>
              
              {/* Intestazione Data Fluo */}
              <h2 style={{ fontSize: '1rem', color: 'rgb(223, 254, 2)', paddingBottom: '10px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>
                {data}
              </h2>
              
              {/* Righe delle uscite per quella data */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {uscite.map(uscita => (
                  // L'intera riga è cliccabile e apre la modale
                  <div key={uscita.id} className="uscita-row" onClick={() => setSelectedUscita(uscita)}>
                    
                    {/* Miniatura quadrata (circa 80px) */}
                    <img 
                      src={uscita.immagine} 
                      alt={uscita.titolo} 
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', flexShrink: 0 }} 
                    />

                    {/* Contenuto Testuale */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', lineHeight: '1.1' }}>
                        {uscita.titolo}
                      </h3>
                      <div style={{ fontSize: '13px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {uscita.regione} • D+ {uscita.dPlus} • {uscita.km}
                      </div>
                      <div style={{ fontSize: '13px', color: '#777' }}>
                        Livello {uscita.livello} • {uscita.guide}
                      </div>
                    </div>

                    {/* Freccia diagonale a destra */}
                    <div className="arrow-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODALE DI DETTAGLIO */}
      {selectedUscita && (
        <div 
          style={{ 
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', 
            zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center', 
            padding: '20px' 
          }}
          onClick={() => setSelectedUscita(null)} 
        >
          <div 
            style={{ 
              backgroundColor: '#111', width: '100%', maxWidth: '600px', 
              maxHeight: '90vh', overflowY: 'auto', 
              borderRadius: '16px', position: 'relative',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
            onClick={e => e.stopPropagation()} 
          >
            <button 
              onClick={() => setSelectedUscita(null)}
              style={{
                position: 'absolute', top: '15px', right: '15px', zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', 
                borderRadius: '50%', width: '36px', height: '36px', 
                fontSize: '18px', cursor: 'pointer', display: 'flex', 
                alignItems: 'center', justifyContent: 'center'
              }}
            >✕</button>

            <div style={{ width: '100%', height: '180px', backgroundColor: '#222' }}>
              <img src={selectedUscita.immagine} alt={selectedUscita.titolo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ padding: '30px' }}>
              <div style={{ color: 'rgb(223, 254, 2)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', marginBottom: '10px' }}>
                {selectedUscita.regione} • {selectedUscita.data}
              </div>
              <h2 style={{ fontSize: '2rem', margin: '0 0 20px 0', lineHeight: '1.1' }}>
                {selectedUscita.titolo}
              </h2>
              
              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '14px', color: 'rgb(223, 254, 2)', marginTop: 0, marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Dettagli Escursione
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.95rem', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  {selectedUscita.puntoPartenza && (
                    <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                      <span style={{ color: '#888' }}>Punto di partenza:</span>
                      <span style={{ color: 'white', textAlign: 'right', maxWidth: '60%' }}>{selectedUscita.puntoPartenza}</span>
                    </li>
                  )}
                  {selectedUscita.puntoArrivo && (
                    <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                      <span style={{ color: '#888' }}>Punto di arrivo:</span>
                      <span style={{ color: 'white', textAlign: 'right', maxWidth: '60%' }}>{selectedUscita.puntoArrivo}</span>
                    </li>
                  )}
                  {selectedUscita.tipologia && (
                    <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                      <span style={{ color: '#888' }}>Tipologia:</span>
                      <span style={{ color: 'white', textAlign: 'right' }}>{selectedUscita.tipologia}</span>
                    </li>
                  )}
                  {selectedUscita.km && (
                    <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                      <span style={{ color: '#888' }}>Lunghezza:</span>
                      <span style={{ color: 'white', textAlign: 'right' }}>{selectedUscita.km}</span>
                    </li>
                  )}
                  {selectedUscita.dPlus && (
                    <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                      <span style={{ color: '#888' }}>Dislivello positivo:</span>
                      <span style={{ color: 'white', textAlign: 'right' }}>{selectedUscita.dPlus}</span>
                    </li>
                  )}
                  {selectedUscita.tempoStimato && (
                    <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                      <span style={{ color: '#888' }}>Tempo stimato:</span>
                      <span style={{ color: 'white', textAlign: 'right' }}>{selectedUscita.tempoStimato}</span>
                    </li>
                  )}
                  {selectedUscita.livello && (
                    <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                      <span style={{ color: '#888' }}>Difficoltà:</span>
                      <span style={{ color: 'white', textAlign: 'right' }}>{selectedUscita.livello}</span>
                    </li>
                  )}
                  {selectedUscita.maxPartecipanti && (
                    <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                      <span style={{ color: '#888' }}>Max partecipanti:</span>
                      <span style={{ color: 'white', textAlign: 'right' }}>{selectedUscita.maxPartecipanti}</span>
                    </li>
                  )}
                  {selectedUscita.pernottamento && (
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#888' }}>Pernottamento:</span>
                      <span style={{ color: 'white', textAlign: 'right' }}>{selectedUscita.pernottamento}</span>
                    </li>
                  )}
                </ul>
              </div>
              
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#888' }}>
                  Admin dell'uscita: <strong style={{ color: 'white' }}>{selectedUscita.guide}</strong>
                </span>
                {!selectedUscita.past ? (
                  <button style={{ backgroundColor: 'rgb(223, 254, 2)', color: 'black', border: 'none', padding: '12px 24px', borderRadius: '99px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer' }}>
                    Entra nel gruppo
                  </button>
                ) : (
                  <button style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.5)', padding: '12px 24px', borderRadius: '99px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer' }}>
                    Scarica GPX
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}