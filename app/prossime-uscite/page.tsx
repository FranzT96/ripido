'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UscitaRaw {
  id: number;
  data: string;
  isoDate: string;
  titolo: string;
  regione: string;
  dPlus: string;
  km: string;
  livello: string;
  guide: string;
  immagine: string;
  maxPartecipanti?: number | null;
  pernottamento?: string;
  puntoPartenza?: string;
  puntoArrivo?: string;
  tipologia?: string;
  tempoStimato?: string;
}

export default function ProssimeUscite() {
  // Dati ad alta risoluzione (w=1000) per il layout editoriale 4:5
  const usciteDataRaw: UscitaRaw[] = [
    { 
      id: 1, data: 'Sabato 5 Dicembre', isoDate: '2026-12-05', titolo: 'Rifugio Tuckett e Casinei', regione: 'Trentino', 
      dPlus: '800m', km: '14km', livello: 'E', guide: 'Matteo', 
      immagine: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1000&auto=format&fit=crop',
      maxPartecipanti: 18, pernottamento: 'No', puntoPartenza: 'Vallesinella, Madonna di Campiglio', puntoArrivo: 'Vallesinella', tipologia: 'Anello', tempoStimato: '4.5 h'
    },
    { 
      id: 2, data: 'Sabato 5 Dicembre', isoDate: '2026-12-05', titolo: 'Cima Carega dal Rifugio Revolto', regione: 'Veneto', 
      dPlus: '1100m', km: '15km', livello: 'EE', guide: 'Andrea', 
      immagine: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop',
      maxPartecipanti: 12, pernottamento: 'No', puntoPartenza: 'Rifugio Revolto (1336m)', puntoArrivo: 'Rifugio Revolto', tipologia: 'Andata e ritorno', tempoStimato: '5.5 h'
    },
    { 
      id: 3, data: 'Domenica 13 Dicembre', isoDate: '2026-12-13', titolo: 'Rocciamelone (3538m)', regione: 'Piemonte', 
      dPlus: '1500m', km: '9km', livello: 'EE', guide: 'Matteo', 
      immagine: 'https://images.unsplash.com/photo-1602852260645-0e3636f0a3cc?q=80&w=1000&auto=format&fit=crop',
      maxPartecipanti: 10, pernottamento: 'Sì (Rif. Ca\' d\'Asti)', puntoPartenza: 'La Riposa, Mompantero', puntoArrivo: 'La Riposa', tipologia: 'Andata e ritorno', tempoStimato: '6 h'
    },
    { 
      id: 4, data: 'Domenica 15 Novembre', isoDate: '2026-11-15', titolo: 'Bosco degli Eroi', regione: 'Veneto', 
      dPlus: '400m', km: '10km', livello: 'E', guide: 'Andrea', 
      immagine: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop',
      maxPartecipanti: 15, pernottamento: 'No', puntoPartenza: 'Rifugio Bocchette, Seren del Grappa', puntoArrivo: 'Rifugio Bocchette', tipologia: 'Anello', tempoStimato: '3 h'
    },
    { 
      id: 5, data: 'Domenica 15 Novembre', isoDate: '2026-11-15', titolo: 'Lago di Sorapis via sentiero 215', regione: 'Veneto', 
      dPlus: '400m', km: '10km', livello: 'E', guide: 'Giada', 
      immagine: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000&auto=format&fit=crop',
      maxPartecipanti: null, pernottamento: 'No', puntoPartenza: 'Passo Tre Croci', puntoArrivo: 'Passo Tre Croci', tipologia: 'Andata e ritorno', tempoStimato: '4.5 h'
    },
    { 
      id: 6, data: 'Domenica 8 Novembre', isoDate: '2026-11-08', titolo: 'Resegone via Canalone Bobbio', regione: 'Lombardia', 
      dPlus: '1000m', km: '11km', livello: 'EE', guide: 'Matteo', 
      immagine: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=1000&auto=format&fit=crop' 
    },
    { 
      id: 7, data: 'Venerdì 30 Ottobre', isoDate: '2026-10-30', titolo: 'Laghi di Fusine e Rifugio Zacchi', regione: 'FVG', 
      dPlus: '500m', km: '10km', livello: 'E', guide: 'Giada', 
      immagine: 'https://images.unsplash.com/photo-1542224566-6e85f2e10696?q=80&w=1000&auto=format&fit=crop' 
    }
  ];

  const [todayIso, setTodayIso] = useState<string | null>(null);

  useEffect(() => {
    const oggi = new Date();
    const anno = oggi.getFullYear();
    const mese = String(oggi.getMonth() + 1).padStart(2, '0');
    const giorno = String(oggi.getDate()).padStart(2, '0');
    setTodayIso(`${anno}-${mese}-${giorno}`);
  }, []);

  const usciteData = usciteDataRaw.map(uscita => ({
    ...uscita,
    past: todayIso ? uscita.isoDate < todayIso : false
  }));

  const [activeTab, setActiveTab] = useState('programma'); 
  const [activeRegion, setActiveRegion] = useState('Tutte');
  const [selectedUscita, setSelectedUscita] = useState<typeof usciteData[0] | null>(null);

  useEffect(() => {
    if (!selectedUscita) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedUscita(null);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedUscita]);

  const filteredByTab = todayIso
    ? usciteData
        .filter(u => (activeTab === 'programma' ? !u.past : u.past))
        .sort((a, b) =>
          activeTab === 'programma'
            ? a.isoDate.localeCompare(b.isoDate)
            : b.isoDate.localeCompare(a.isoDate)
        )
    : [];
  const regioniDisponibili = ['Tutte', ...Array.from(new Set(filteredByTab.map(u => u.regione)))];
  const usciteVisualizzate = filteredByTab.filter(u => activeRegion === 'Tutte' || u.regione === activeRegion);

  return (
    <main style={{ position: 'relative', width: '100%', minHeight: '100dvh', color: 'white', padding: '40px 20px 80px', overflow: 'hidden' }}>
      
      {/* BACKGROUND LINEE TOPOGRAFICHE */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1,
        backgroundImage: 'url("/topografia.png")', 
        backgroundSize: '400px',
        backgroundRepeat: 'repeat',
        opacity: 0.16 
      }} />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#0a0a0a', zIndex: -2 }} />

      <style>{`
        /* Barra controlli stile editoriale */
        .controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          padding: 16px 20px;
          margin-bottom: 45px;
          border-radius: 18px;
          background: rgba(20, 20, 20, 0.65);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .filter-btn {
          padding: 9px 18px;
          border-radius: 99px;
          font-size: 11px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.2);
          background: transparent;
          color: #ccc;
          transition: all 0.2s ease;
        }
        .filter-btn:hover {
          border-color: rgba(255,255,255,0.5);
          color: white;
        }
        .filter-btn.active {
          background: rgb(223, 254, 2);
          color: black;
          border-color: rgb(223, 254, 2);
        }

        .region-pill {
          background: none;
          border: none;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #777;
          transition: color 0.2s ease;
        }
        .region-pill:hover {
          color: #ddd;
        }
        .region-pill.active {
          color: rgb(223, 254, 2);
        }

        /* Griglia Lookbook 4:5 stile Pampero */
        .lookbook-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 32px;
        }

        .lookbook-card {
          position: relative;
          aspect-ratio: 4 / 5;
          border-radius: 22px;
          overflow: hidden;
          cursor: pointer;
          background-color: #141414;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: border-color 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease;
        }
        .lookbook-card:hover {
          border-color: rgba(223, 254, 2, 0.5);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        }

        .lookbook-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .lookbook-card:hover .lookbook-img {
          transform: scale(1.06);
        }

        .lookbook-arrow {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
          flex-shrink: 0;
        }
        .lookbook-card:hover .lookbook-arrow {
          background: rgb(223, 254, 2);
          border-color: rgb(223, 254, 2);
          color: black;
          transform: translate(2px, -2px);
        }

        /* Griglia metriche nella modale */
        .stats-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }
        .stat-box {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          padding: 14px 12px;
          text-align: center;
        }

        @media (max-width: 768px) {
          .lookbook-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .lookbook-card {
            aspect-ratio: 4 / 4.7;
          }
          .controls-bar {
            flex-direction: column;
            align-items: flex-start;
            padding: 16px;
          }
          .stats-strip {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      {/* Navigazione */}
      <div style={{ maxWidth: '1080px', margin: '0 auto', marginBottom: '36px' }}>
        <Link href="/" style={{ color: 'rgb(223, 254, 2)', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          &larr; Torna alla Home
        </Link>
      </div>

      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        
        {/* Header Editoriale */}
        <div style={{ marginBottom: '36px', maxWidth: '680px' }}>
          <div style={{ color: 'rgb(223, 254, 2)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '10px' }}>
            Esplora il calendario
          </div>
          <h1 style={{ fontSize: 'clamp(2.3rem, 5.5vw, 3.6rem)', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
            Prossime <span style={{ color: 'rgb(223, 254, 2)' }}>Uscite</span>
          </h1>
          <p style={{ color: '#999', margin: 0, fontSize: '1.05rem', lineHeight: 1.6 }}>
            Scegli la vetta, controlla il dislivello e unisciti al gruppo. Ogni weekend una traccia diversa in alta quota.
          </p>
        </div>
          
        {/* Barra Filtri Unificata (Tab + Regioni) */}
        <div className="controls-bar">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className={`filter-btn ${activeTab === 'programma' ? 'active' : ''}`} onClick={() => { setActiveTab('programma'); setActiveRegion('Tutte'); }}>
              In Programma
            </button>
            <button className={`filter-btn ${activeTab === 'storico' ? 'active' : ''}`} onClick={() => { setActiveTab('storico'); setActiveRegion('Tutte'); }}>
              Uscite Passate
            </button>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            {regioniDisponibili.map(regione => (
              <button 
                key={regione}
                className={`region-pill ${activeRegion === regione ? 'active' : ''}`}
                onClick={() => setActiveRegion(regione)}
              >
                {regione}
              </button>
            ))}
          </div>
        </div>

        {/* Griglia Lookbook 4:5 */}
        {!todayIso ? (
          <div style={{ minHeight: '300px' }} />
        ) : usciteVisualizzate.length === 0 ? (
          <p style={{ color: '#aaa', fontSize: '1rem', padding: '40px 0' }}>Nessuna uscita trovata per questa selezione.</p>
        ) : (
          <div className="lookbook-grid">
            {usciteVisualizzate.map(uscita => (
              <article key={uscita.id} className="lookbook-card" onClick={() => setSelectedUscita(uscita)}>
                
                {/* Immagine a tutto formato */}
                <img 
                  src={uscita.immagine} 
                  alt={uscita.titolo} 
                  className="lookbook-img"
                  style={{ filter: uscita.past ? 'saturate(0.75)' : 'none' }}
                />

                {/* Sfumatura editoriale per garantire leggibilità */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.52) 38%, rgba(5,5,5,0.08) 70%, rgba(5,5,5,0.3) 100%)'
                }} />

                {/* Contenuto sovrapposto (Top + Bottom) */}
                <div style={{ position: 'relative', zIndex: 2, height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  
                  {/* Riga superiore: Badge Regione/Livello + Freccia */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        padding: '6px 12px',
                        borderRadius: '99px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'white'
                      }}>
                        {uscita.regione} • Liv. {uscita.livello}
                      </span>

                      {!uscita.past && uscita.maxPartecipanti && (
                        <span style={{
                          backgroundColor: 'rgba(223, 254, 2, 0.15)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(223, 254, 2, 0.4)',
                          padding: '6px 12px',
                          borderRadius: '99px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: 'rgb(223, 254, 2)'
                        }}>
                          Max {uscita.maxPartecipanti}
                        </span>
                      )}
                    </div>

                    <div className="lookbook-arrow">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </div>
                  </div>

                  {/* Riga inferiore: Data, Titolo grande e Dati tecnici */}
                  <div>
                    <div style={{
                      color: 'rgb(223, 254, 2)',
                      fontSize: '12px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      marginBottom: '8px'
                    }}>
                      {uscita.data}
                    </div>

                    <h2 style={{
                      margin: 0,
                      fontSize: 'clamp(1.45rem, 2.3vw, 1.85rem)',
                      fontWeight: 800,
                      lineHeight: 1.15,
                      letterSpacing: '-0.01em',
                      color: 'white'
                    }}>
                      {uscita.titolo}
                    </h2>

                    <div style={{
                      marginTop: '16px',
                      paddingTop: '14px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12px',
                      color: '#ccc',
                      letterSpacing: '0.04em'
                    }}>
                      <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>
                        D+ {uscita.dPlus} &nbsp;•&nbsp; {uscita.km}{uscita.tempoStimato ? `  •  ${uscita.tempoStimato}` : ''}
                      </span>
                      <span style={{ color: '#999' }}>
                        Con <strong style={{ color: 'white' }}>{uscita.guide}</strong>
                      </span>
                    </div>
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* MODALE DETTAGLIO "CINEMATIC" */}
      {selectedUscita && (
        <div 
          style={{ 
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', 
            zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center', 
            padding: '20px' 
          }}
          onClick={() => setSelectedUscita(null)} 
        >
          <div 
            style={{ 
              backgroundColor: '#0f0f0f', width: '100%', maxWidth: '660px', 
              maxHeight: '90vh', overflowY: 'auto', 
              borderRadius: '24px', position: 'relative',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
            }}
            onClick={e => e.stopPropagation()} 
          >
            <button 
              onClick={() => setSelectedUscita(null)}
              style={{
                position: 'absolute', top: '18px', right: '18px', zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
                color: 'white', border: '1px solid rgba(255,255,255,0.2)', 
                borderRadius: '50%', width: '38px', height: '38px', 
                fontSize: '16px', cursor: 'pointer', display: 'flex', 
                alignItems: 'center', justifyContent: 'center'
              }}
            >✕</button>

            {/* Immagine Copertina Alta che sfuma nella scheda */}
            <div style={{ position: 'relative', width: '100%', height: '320px', backgroundColor: '#1a1a1a' }}>
              <img 
                src={selectedUscita.immagine} 
                alt={selectedUscita.titolo} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, #0f0f0f 0%, rgba(15,15,15,0.55) 45%, rgba(0,0,0,0.15) 100%)'
              }} />

              <div style={{ position: 'absolute', bottom: '20px', left: '30px', right: '30px' }}>
                <div style={{ color: 'rgb(223, 254, 2)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: '8px' }}>
                  {selectedUscita.regione} • {selectedUscita.data}
                </div>
                <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.3rem)', fontWeight: 800, margin: 0, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
                  {selectedUscita.titolo}
                </h2>
              </div>
            </div>

            <div style={{ padding: '10px 30px 30px' }}>
              
              {/* Striscia Metriche Principali */}
              <div className="stats-strip">
                <div className="stat-box">
                  <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Dislivello</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'rgb(223, 254, 2)' }}>+{selectedUscita.dPlus}</div>
                </div>
                <div className="stat-box">
                  <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Lunghezza</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white' }}>{selectedUscita.km}</div>
                </div>
                <div className="stat-box">
                  <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Difficoltà</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white' }}>{selectedUscita.livello}</div>
                </div>
                <div className="stat-box">
                  <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Durata</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white' }}>{selectedUscita.tempoStimato || '—'}</div>
                </div>
              </div>

              {/* Logistica aggiuntiva (mostrata solo se presente) */}
              {Boolean(
                selectedUscita.puntoPartenza ||
                selectedUscita.puntoArrivo ||
                selectedUscita.tipologia ||
                selectedUscita.maxPartecipanti ||
                selectedUscita.pernottamento
              ) && (
                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: '16px', marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '12px', color: 'rgb(223, 254, 2)', marginTop: 0, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Logistica e Ritrovo
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.92rem', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedUscita.puntoPartenza && (
                      <li style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                        <span style={{ color: '#888' }}>Punto di partenza</span>
                        <span style={{ color: 'white', textAlign: 'right', fontWeight: 500 }}>{selectedUscita.puntoPartenza}</span>
                      </li>
                    )}
                    {selectedUscita.puntoArrivo && (
                      <li style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                        <span style={{ color: '#888' }}>Punto di arrivo</span>
                        <span style={{ color: 'white', textAlign: 'right', fontWeight: 500 }}>{selectedUscita.puntoArrivo}</span>
                      </li>
                    )}
                    {selectedUscita.tipologia && (
                      <li style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                        <span style={{ color: '#888' }}>Tipologia percorso</span>
                        <span style={{ color: 'white', textAlign: 'right', fontWeight: 500 }}>{selectedUscita.tipologia}</span>
                      </li>
                    )}
                    {selectedUscita.maxPartecipanti && (
                      <li style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                        <span style={{ color: '#888' }}>Max partecipanti</span>
                        <span style={{ color: 'white', textAlign: 'right', fontWeight: 500 }}>{selectedUscita.maxPartecipanti}</span>
                      </li>
                    )}
                    {selectedUscita.pernottamento && (
                      <li style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                        <span style={{ color: '#888' }}>Pernottamento</span>
                        <span style={{ color: 'white', textAlign: 'right', fontWeight: 500 }}>{selectedUscita.pernottamento}</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Footer Modale */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                <span style={{ fontSize: '14px', color: '#888' }}>
                  Admin dell&apos;uscita: <strong style={{ color: 'white' }}>{selectedUscita.guide}</strong>
                </span>
                {!selectedUscita.past ? (
                  <button style={{ backgroundColor: 'rgb(223, 254, 2)', color: 'black', border: 'none', padding: '12px 24px', borderRadius: '99px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer' }}>
                    Entra nel gruppo
                  </button>
                ) : (
                  <button style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '12px 24px', borderRadius: '99px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer' }}>
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