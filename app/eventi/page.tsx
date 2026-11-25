'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface EventoRaw {
  id: number;
  titolo: string;
  data: string;
  endDate: string; // Formato YYYY-MM-DD (data di fine evento per passaggio automatico nello storico)
  luogo: string;
  postiTotali: number;
  postiOccupati: number;
  prezzo: string;
  immagine: string;
  descrizioneLunga: string;
  albumUrl?: string; // Link opzionale a foto/racconto per gli eventi conclusi
}

export default function EventiSpeciali() {
  const eventiDataRaw: EventoRaw[] = [
    {
      id: 1,
      titolo: 'Capodanno in Rifugio',
      data: '31 Dic - 1 Gen',
      endDate: '2027-01-01',
      luogo: 'Rifugio Fuciade (Trentino)',
      postiTotali: 20,
      postiOccupati: 16,
      prezzo: '80€',
      immagine: 'https://images.unsplash.com/photo-1542662565-7e4fd8a4369e?q=80&w=1000&auto=format&fit=crop',
      descrizioneLunga: `Due giorni sulla neve in Val di Fassa per salutare l'anno vecchio e iniziare quello nuovo in quota, circondati dalle Pale di San Martino.

Come ce la immaginiamo?
• 31 dicembre: salita pomeridiana a piedi o con ciaspole da Passo San Pellegrino, sistemazione in camerata, cenone in rifugio e brindisi di mezzanotte sotto le stelle.
• 1 gennaio: colazione con calma e prima escursione dell'anno sulla neve prima del rientro.

Quota indicativa: 80 € a persona a copertura delle spese vive (mezza pensione in rifugio e cenone).`
    },
    {
      id: 2,
      titolo: 'Halloween in Casera: Cena con Delitto',
      data: '31 Ott - 1 Nov',
      endDate: '2026-11-01',
      luogo: 'Casera Val Montina (Veneto)',
      postiTotali: 16,
      postiOccupati: 16,
      prezzo: '50€',
      immagine: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?q=80&w=1000&auto=format&fit=crop',
      descrizioneLunga: `Salita a Casera Val Montina passando per il ponte tibetano, serata in compagnia con cena con delitto autogestita, pernottamento in casera e trekking autunnale il giorno successivo.

Grazie a tutti i 16 partecipanti che hanno reso indimenticabile il weekend!`,
      albumUrl: 'https://www.instagram.com/ripido.official/'
    }
  ];

  const [todayIso, setTodayIso] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'programma' | 'storico'>('programma');

  useEffect(() => {
    const oggi = new Date();
    const anno = oggi.getFullYear();
    const mese = String(oggi.getMonth() + 1).padStart(2, '0');
    const giorno = String(oggi.getDate()).padStart(2, '0');
    setTodayIso(`${anno}-${mese}-${giorno}`);
  }, []);

  const eventiData = eventiDataRaw.map(evento => ({
    ...evento,
    past: todayIso ? evento.endDate < todayIso : false
  }));

  const [selectedEvento, setSelectedEvento] = useState<typeof eventiData[0] | null>(null);

  useEffect(() => {
    if (!selectedEvento) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEvento(null);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedEvento]);

  const countProgramma = todayIso ? eventiData.filter(e => !e.past).length : 0;
  const countStorico = todayIso ? eventiData.filter(e => e.past).length : 0;

  const eventiVisualizzati = todayIso
    ? eventiData
        .filter(e => (activeTab === 'programma' ? !e.past : e.past))
        .sort((a, b) =>
          activeTab === 'programma'
            ? a.endDate.localeCompare(b.endDate)
            : b.endDate.localeCompare(a.endDate)
        )
    : [];

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
        .controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
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
        .progress-slim-bg {
          background-color: rgba(255, 255, 255, 0.14);
          border-radius: 99px;
          height: 5px;
          width: 100%;
          overflow: hidden;
        }
        .progress-slim-fill {
          height: 100%;
          border-radius: 99px;
        }
        .stats-strip-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
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
            aspect-ratio: 4 / 4.8;
          }
          .controls-bar {
            flex-direction: column;
            align-items: flex-start;
            padding: 16px;
          }
          .stats-strip-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Navigazione */}
      <div style={{ maxWidth: '1080px', margin: '0 auto', marginBottom: '36px' }}>
        <Link href="/" style={{ color: 'rgb(223, 254, 2)', textDecoration: 'none', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          &larr; Torna alla Home
        </Link>
      </div>

      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        {/* Header Editoriale */}
        <div style={{ marginBottom: '36px', maxWidth: '680px' }}>
          <div style={{ color: 'rgb(223, 254, 2)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '10px' }}>
            Esperienze di più giorni
          </div>
          <h1 style={{ fontSize: 'clamp(2.3rem, 5.5vw, 3.6rem)', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
            Eventi <span style={{ color: 'rgb(223, 254, 2)' }}>Speciali</span>
          </h1>
          <p style={{ color: '#999', margin: 0, fontSize: '1.05rem', lineHeight: 1.6 }}>
            Non solo escursioni. Weekend nei rifugi, cene in casera ed esperienze organizzate dalla community.
          </p>
        </div>

        {/* Barra Tab (In Programma / Eventi Passati) */}
        <div className="controls-bar">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className={`filter-btn ${activeTab === 'programma' ? 'active' : ''}`}
              onClick={() => setActiveTab('programma')}
            >
              In Programma {todayIso ? `(${countProgramma})` : ''}
            </button>
            <button
              className={`filter-btn ${activeTab === 'storico' ? 'active' : ''}`}
              onClick={() => setActiveTab('storico')}
            >
              Eventi Passati {todayIso ? `(${countStorico})` : ''}
            </button>
          </div>

          <div style={{ fontSize: '12px', color: '#888' }}>
            {activeTab === 'programma'
              ? 'Prenotazione posti a rimborso spese vive'
              : 'Archivio dei weekend e delle serate vissute insieme'}
          </div>
        </div>

        {/* Griglia Lookbook 4:5 */}
        {!todayIso ? (
          <div style={{ minHeight: '300px' }} />
        ) : eventiVisualizzati.length === 0 ? (
          <p style={{ color: '#aaa', fontSize: '1rem', padding: '40px 0' }}>
            {activeTab === 'programma'
              ? 'Nessun evento speciale in programma al momento. Nuove date in arrivo!'
              : 'Nessun evento passato in archivio.'}
          </p>
        ) : (
          <div className="lookbook-grid">
            {eventiVisualizzati.map(evento => {
              const postiDisponibili = evento.postiTotali - evento.postiOccupati;
              const percentualeOccupata = Math.min(100, (evento.postiOccupati / evento.postiTotali) * 100);
              const esaurito = postiDisponibili <= 0;

              return (
                <article
                  key={evento.id}
                  className="lookbook-card"
                  onClick={() => setSelectedEvento(evento)}
                >
                  <img
                    src={evento.immagine}
                    alt={evento.titolo}
                    className="lookbook-img"
                    style={{ filter: evento.past ? 'saturate(0.75)' : 'none' }}
                  />

                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.58) 42%, rgba(5,5,5,0.08) 72%, rgba(5,5,5,0.35) 100%)'
                  }} />

                  <div style={{ position: 'relative', zIndex: 2, height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {/* Riga superiore: Data + Stato + Freccia */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.55)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          padding: '6px 12px',
                          borderRadius: '99px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'white'
                        }}>
                          {evento.data}
                        </span>

                        {evento.past ? (
                          <span style={{
                            backgroundColor: evento.albumUrl ? 'rgba(223, 254, 2, 0.15)' : 'rgba(15, 15, 15, 0.8)',
                            backdropFilter: 'blur(8px)',
                            border: evento.albumUrl ? '1px solid rgba(223, 254, 2, 0.45)' : '1px solid rgba(255, 255, 255, 0.25)',
                            padding: '6px 12px',
                            borderRadius: '99px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: evento.albumUrl ? 'rgb(223, 254, 2)' : '#bbb'
                          }}>
                            {evento.albumUrl ? 'Foto disponibili' : 'Concluso'}
                          </span>
                        ) : (
                          <span style={{
                            backgroundColor: esaurito ? 'rgba(255, 77, 77, 0.18)' : 'rgba(223, 254, 2, 0.15)',
                            backdropFilter: 'blur(8px)',
                            border: esaurito ? '1px solid rgba(255, 77, 77, 0.5)' : '1px solid rgba(223, 254, 2, 0.45)',
                            padding: '6px 12px',
                            borderRadius: '99px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: esaurito ? '#ff6b6b' : 'rgb(223, 254, 2)'
                          }}>
                            {esaurito ? 'Sold Out' : `${postiDisponibili} posti rimasti`}
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

                    {/* Riga inferiore */}
                    <div>
                      <div style={{ color: 'rgb(223, 254, 2)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>
                        {evento.luogo}
                      </div>

                      <h2 style={{ margin: 0, fontSize: 'clamp(1.45rem, 2.3vw, 1.85rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.01em', color: 'white' }}>
                        {evento.titolo}
                      </h2>

                      {!evento.past && (
                        <div style={{ marginTop: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#bbb', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '6px' }}>
                            <span>Posti confermati</span>
                            <span>{evento.postiOccupati} / {evento.postiTotali}</span>
                          </div>
                          <div className="progress-slim-bg">
                            <div
                              className="progress-slim-fill"
                              style={{ width: `${percentualeOccupata}%`, backgroundColor: esaurito ? '#ff4d4d' : 'rgb(223, 254, 2)' }}
                            />
                          </div>
                        </div>
                      )}

                      <div style={{
                        marginTop: '16px',
                        paddingTop: '14px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        {!evento.past ? (
                          <div>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{evento.prezzo}</span>
                            <span style={{ fontSize: '12px', color: '#999', marginLeft: '6px' }}>/ persona</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#aaa', fontWeight: 600 }}>
                            {evento.postiOccupati} partecipanti
                          </span>
                        )}

                        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: evento.past && evento.albumUrl ? 'rgb(223, 254, 2)' : '#ccc' }}>
                          {evento.past ? (evento.albumUrl ? 'Foto e racconto' : 'Rivedi scheda') : 'Dettagli'}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* MODALE DETTAGLIO "CINEMATIC" */}
      {selectedEvento && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
            zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedEvento(null)}
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
              onClick={() => setSelectedEvento(null)}
              style={{
                position: 'absolute', top: '18px', right: '18px', zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
                color: 'white', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%', width: '38px', height: '38px',
                fontSize: '16px', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}
            >✕</button>

            <div style={{ position: 'relative', width: '100%', height: '320px', backgroundColor: '#1a1a1a' }}>
              <img src={selectedEvento.immagine} alt={selectedEvento.titolo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, #0f0f0f 0%, rgba(15,15,15,0.55) 45%, rgba(0,0,0,0.15) 100%)'
              }} />

              <div style={{ position: 'absolute', bottom: '20px', left: '30px', right: '30px' }}>
                <div style={{ color: 'rgb(223, 254, 2)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: '8px' }}>
                  {selectedEvento.data} • {selectedEvento.luogo}
                </div>
                <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.3rem)', fontWeight: 800, margin: 0, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
                  {selectedEvento.titolo}
                </h2>
              </div>
            </div>

            <div style={{ padding: '10px 30px 30px' }}>
              <div className="stats-strip-3">
                <div className="stat-box">
                  <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Quota spese</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'rgb(223, 254, 2)' }}>{selectedEvento.prezzo}</div>
                </div>
                <div className="stat-box">
                  <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Partecipanti</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white' }}>{selectedEvento.postiOccupati} / {selectedEvento.postiTotali}</div>
                </div>
                <div className="stat-box">
                  <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Stato</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: selectedEvento.past ? '#999' : (selectedEvento.postiTotali - selectedEvento.postiOccupati <= 0 ? '#ff6b6b' : 'white') }}>
                    {selectedEvento.past ? 'Concluso' : (selectedEvento.postiTotali - selectedEvento.postiOccupati <= 0 ? 'Sold Out' : `${selectedEvento.postiTotali - selectedEvento.postiOccupati} liberi`)}
                  </div>
                </div>
              </div>

              <div style={{
                whiteSpace: 'pre-wrap',
                color: '#ccc',
                lineHeight: 1.7,
                fontSize: '0.95rem',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '22px',
                borderRadius: '16px',
                marginBottom: '28px'
              }}>
                {selectedEvento.descrizioneLunga}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                {!selectedEvento.past ? (
                  <>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                      {selectedEvento.prezzo} <span style={{ fontSize: '0.9rem', color: '#888', fontWeight: 400 }}>/ persona</span>
                    </div>

                    {(selectedEvento.postiTotali - selectedEvento.postiOccupati) > 0 ? (
                      <button style={{ backgroundColor: 'rgb(223, 254, 2)', color: 'black', border: 'none', padding: '14px 28px', borderRadius: '99px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer' }}>
                        Prenota il tuo posto
                      </button>
                    ) : (
                      <button style={{ backgroundColor: 'transparent', color: 'rgb(223, 254, 2)', border: '1px solid rgba(223, 254, 2, 0.5)', padding: '14px 28px', borderRadius: '99px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer' }}>
                        Lista d&apos;attesa
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '13px', color: '#888' }}>
                      Evento archiviato • {selectedEvento.postiOccupati} partecipanti
                    </span>

                    {selectedEvento.albumUrl ? (
                      <a
                        href={selectedEvento.albumUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ backgroundColor: 'rgb(223, 254, 2)', color: 'black', textDecoration: 'none', padding: '13px 24px', borderRadius: '99px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'inline-block' }}
                      >
                        Guarda foto e racconto &rarr;
                      </a>
                    ) : (
                      <button disabled style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#666', border: 'none', padding: '13px 24px', borderRadius: '99px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', cursor: 'not-allowed' }}>
                        Evento Concluso
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
