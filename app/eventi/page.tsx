'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

interface EventoDB {
  id: number;
  titolo: string;
  data_testo: string;
  data_fine: string;
  luogo: string;
  prezzo: string;
  immagine_url: string;
  descrizione: string;
  posti_reali: number;
  capienza_gruppo: number;
  iscritti_attivi: number;
  stato_iscrizioni: 'aperte' | 'sold_out' | 'chiuso';
  whatsapp_invite_url: string | null;
  album_url: string | null;
}

interface EventoView extends EventoDB {
  past: boolean;
}

export default function EventiSpeciali() {
  const [eventiRaw, setEventiRaw] = useState<EventoDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayIso, setTodayIso] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'programma' | 'storico'>('programma');
  const [selectedEvento, setSelectedEvento] = useState<EventoView | null>(null);

  // Stati del modulo di iscrizione
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [telefono, setTelefono] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    const oggi = new Date();
    const anno = oggi.getFullYear();
    const mese = String(oggi.getMonth() + 1).padStart(2, '0');
    const giorno = String(oggi.getDate()).padStart(2, '0');
    setTodayIso(`${anno}-${mese}-${giorno}`);

    async function fetchEventi() {
      const { data, error } = await supabase
        .from('eventi_speciali')
        .select('*');

      if (!error && data) {
        setEventiRaw(data as EventoDB[]);
      }
      setLoading(false);
    }

    fetchEventi();
  }, []);

  const eventiData: EventoView[] = eventiRaw.map(evento => ({
    ...evento,
    past: todayIso ? evento.data_fine < todayIso : false
  }));

  // Reset del modulo ogni volta che si cambia o si chiude la modale
  useEffect(() => {
    setShowForm(false);
    setNome('');
    setCognome('');
    setTelefono('');
    setSubmitting(false);
    setFormError(null);
    setRedirectUrl(null);

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
  }, [selectedEvento?.id]);

  // Helper per calcolare colore ed etichetta della barra a 20 trattini
  function getBarMeta(evento: EventoView) {
    const totalTicks = Math.max(1, evento.capienza_gruppo || 20);

    if (evento.stato_iscrizioni === 'sold_out') {
      return {
        totalTicks,
        filledTicks: totalTicks,
        color: '#ef4444',
        statusLabel: 'Sold Out',
        isWaitlist: false
      };
    }

    if (evento.stato_iscrizioni === 'chiuso') {
      return {
        totalTicks,
        filledTicks: Math.min(totalTicks, evento.iscritti_attivi),
        color: '#666666',
        statusLabel: 'Iscrizioni chiuse',
        isWaitlist: false
      };
    }

    const filledTicks = Math.min(totalTicks, Math.max(0, evento.iscritti_attivi));
    const ratio = filledTicks / totalTicks;
    const isWaitlist = evento.iscritti_attivi >= totalTicks;

    let color = '#22c55e'; // Verde (<= 50%)
    if (ratio > 0.85) {
      color = '#ef4444'; // Rosso (> 85%)
    } else if (ratio > 0.5) {
      color = '#eab308'; // Giallo (51% - 85%)
    }

    let statusLabel = 'Posti disponibili';
    if (isWaitlist) {
      statusLabel = 'Gruppo pieno • Lista d\'attesa';
    } else if (ratio > 0.75) {
      statusLabel = 'Ultimi posti nel gruppo';
    } else if (ratio > 0.4) {
      statusLabel = 'Buona disponibilità';
    }

    return { totalTicks, filledTicks, color, statusLabel, isWaitlist };
  }

  async function handleIscrizione(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedEvento) return;

    const cleanNome = nome.trim();
    const cleanCognome = cognome.trim();
    const cleanTelefono = telefono.trim();

    if (!cleanNome || !cleanCognome || cleanTelefono.length < 6) {
      setFormError('Compila nome, cognome e un numero di telefono valido.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    // IMPORTANTE: non concatenare .select() perché per GDPR gli utenti anonimi hanno solo permesso INSERT
    const { error } = await supabase
      .from('iscrizioni_eventi')
      .insert([
        {
          evento_id: selectedEvento.id,
          nome: cleanNome,
          cognome: cleanCognome,
          telefono: cleanTelefono,
          stato: 'inviato'
        }
      ]);

    if (error) {
      setSubmitting(false);
      setFormError('Impossibile registrare la richiesta (le iscrizioni potrebbero essere state chiuse). Riprova.');
      return;
    }

    // Aggiorna subito la barra di +1 tacca lato client
    setEventiRaw(prev =>
      prev.map(ev =>
        ev.id === selectedEvento.id
          ? { ...ev, iscritti_attivi: ev.iscritti_attivi + 1 }
          : ev
      )
    );
    setSelectedEvento(prev =>
      prev ? { ...prev, iscritti_attivi: prev.iscritti_attivi + 1 } : null
    );

    setSubmitting(false);

    const targetWhatsapp = selectedEvento.whatsapp_invite_url || '/social';
    setRedirectUrl(targetWhatsapp);

    // Reindirizza direttamente al gruppo WhatsApp
    window.location.href = targetWhatsapp;
  }

  const countProgramma = todayIso ? eventiData.filter(e => !e.past).length : 0;
  const countStorico = todayIso ? eventiData.filter(e => e.past).length : 0;

  const eventiVisualizzati = todayIso
    ? eventiData
        .filter(e => (activeTab === 'programma' ? !e.past : e.past))
        .sort((a, b) =>
          activeTab === 'programma'
            ? a.data_fine.localeCompare(b.data_fine)
            : b.data_fine.localeCompare(a.data_fine)
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
        /* Barra segmentata a 20 trattini */
        .ticks-row {
          display: flex;
          gap: 3px;
          width: 100%;
          align-items: center;
        }
        .tick-dash {
          flex: 1;
          height: 6px;
          border-radius: 2px;
          transition: background-color 0.3s ease;
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
        .ripido-input {
          width: 100%;
          box-sizing: border-box;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 12px;
          padding: 12px 14px;
          color: white;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .ripido-input:focus {
          border-color: rgb(223, 254, 2);
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

        {/* Barra Tab */}
        <div className="controls-bar">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className={`filter-btn ${activeTab === 'programma' ? 'active' : ''}`}
              onClick={() => setActiveTab('programma')}
            >
              In Programma {!loading && todayIso ? `(${countProgramma})` : ''}
            </button>
            <button
              className={`filter-btn ${activeTab === 'storico' ? 'active' : ''}`}
              onClick={() => setActiveTab('storico')}
            >
              Eventi Passati {!loading && todayIso ? `(${countStorico})` : ''}
            </button>
          </div>

          <div style={{ fontSize: '12px', color: '#888' }}>
            {activeTab === 'programma'
              ? 'Adesione tramite gruppo dedicato a rimborso spese vive'
              : 'Archivio dei weekend e delle serate vissute insieme'}
          </div>
        </div>

        {/* Griglia Lookbook 4:5 */}
        {loading || !todayIso ? (
          <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', color: '#777', fontSize: '0.95rem' }}>
            Caricamento eventi...
          </div>
        ) : eventiVisualizzati.length === 0 ? (
          <p style={{ color: '#aaa', fontSize: '1rem', padding: '40px 0' }}>
            {activeTab === 'programma'
              ? 'Nessun evento speciale in programma al momento. Nuove date in arrivo!'
              : 'Nessun evento passato in archivio.'}
          </p>
        ) : (
          <div className="lookbook-grid">
            {eventiVisualizzati.map(evento => {
              const bar = getBarMeta(evento);

              return (
                <article
                  key={evento.id}
                  className="lookbook-card"
                  onClick={() => setSelectedEvento(evento)}
                >
                  <img
                    src={evento.immagine_url}
                    alt={evento.titolo}
                    className="lookbook-img"
                    style={{ filter: evento.past ? 'saturate(0.75)' : 'none' }}
                  />

                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.58) 44%, rgba(5,5,5,0.08) 72%, rgba(5,5,5,0.35) 100%)'
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
                          {evento.data_testo}
                        </span>

                        {evento.past ? (
                          <span style={{
                            backgroundColor: evento.album_url ? 'rgba(223, 254, 2, 0.15)' : 'rgba(15, 15, 15, 0.8)',
                            backdropFilter: 'blur(8px)',
                            border: evento.album_url ? '1px solid rgba(223, 254, 2, 0.45)' : '1px solid rgba(255, 255, 255, 0.25)',
                            padding: '6px 12px',
                            borderRadius: '99px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: evento.album_url ? 'rgb(223, 254, 2)' : '#bbb'
                          }}>
                            {evento.album_url ? 'Foto disponibili' : 'Concluso'}
                          </span>
                        ) : evento.stato_iscrizioni === 'sold_out' ? (
                          <span style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.2)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(239, 68, 68, 0.55)',
                            padding: '6px 12px',
                            borderRadius: '99px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: '#ff6b6b'
                          }}>
                            Sold Out
                          </span>
                        ) : evento.stato_iscrizioni === 'chiuso' ? (
                          <span style={{
                            backgroundColor: 'rgba(20, 20, 20, 0.8)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.25)',
                            padding: '6px 12px',
                            borderRadius: '99px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: '#aaa'
                          }}>
                            Iscrizioni Chiuse
                          </span>
                        ) : bar.isWaitlist ? (
                          <span style={{
                            backgroundColor: 'rgba(234, 179, 8, 0.18)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(234, 179, 8, 0.5)',
                            padding: '6px 12px',
                            borderRadius: '99px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: '#facc15'
                          }}>
                            Lista d&apos;attesa
                          </span>
                        ) : (
                          <span style={{
                            backgroundColor: 'rgba(223, 254, 2, 0.15)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(223, 254, 2, 0.45)',
                            padding: '6px 12px',
                            borderRadius: '99px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: 'rgb(223, 254, 2)'
                          }}>
                            Iscrizioni Aperte
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

                      {/* Barra Semaforo a 20 Trattini (senza numeri esposti) */}
                      {!evento.past && (
                        <div style={{ marginTop: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#bbb', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '7px' }}>
                            <span>Stato adesioni</span>
                            <span style={{ color: bar.color }}>{bar.statusLabel}</span>
                          </div>
                          <div className="ticks-row">
                            {Array.from({ length: bar.totalTicks }).map((_, idx) => (
                              <span
                                key={idx}
                                className="tick-dash"
                                style={{
                                  backgroundColor: idx < bar.filledTicks ? bar.color : 'rgba(255, 255, 255, 0.14)'
                                }}
                              />
                            ))}
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
                            Evento concluso
                          </span>
                        )}

                        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: evento.past && evento.album_url ? 'rgb(223, 254, 2)' : '#ccc' }}>
                          {evento.past ? (evento.album_url ? 'Foto e racconto' : 'Rivedi scheda') : 'Dettagli'}
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

      {/* MODALE DETTAGLIO "CINEMATIC" + MODULO ISCRIZIONE */}
      {selectedEvento && (() => {
        const modalBar = getBarMeta(selectedEvento);

        return (
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

              <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#1a1a1a' }}>
                <img src={selectedEvento.immagine_url} alt={selectedEvento.titolo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, #0f0f0f 0%, rgba(15,15,15,0.55) 45%, rgba(0,0,0,0.15) 100%)'
                }} />

                <div style={{ position: 'absolute', bottom: '20px', left: '30px', right: '30px' }}>
                  <div style={{ color: 'rgb(223, 254, 2)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: '8px' }}>
                    {selectedEvento.data_testo} • {selectedEvento.luogo}
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
                    <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Posti struttura</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white' }}>{selectedEvento.posti_reali} posti</div>
                  </div>
                  <div className="stat-box">
                    <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Stato</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: selectedEvento.past ? '#999' : modalBar.color }}>
                      {selectedEvento.past ? 'Concluso' : modalBar.statusLabel}
                    </div>
                  </div>
                </div>

                {/* Barra 20 trattini nella modale */}
                {!selectedEvento.past && (
                  <div style={{ marginBottom: '22px' }}>
                    <div className="ticks-row">
                      {Array.from({ length: modalBar.totalTicks }).map((_, idx) => (
                        <span
                          key={idx}
                          className="tick-dash"
                          style={{
                            height: '7px',
                            backgroundColor: idx < modalBar.filledTicks ? modalBar.color : 'rgba(255, 255, 255, 0.12)'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div style={{
                  whiteSpace: 'pre-wrap',
                  color: '#ccc',
                  lineHeight: 1.7,
                  fontSize: '0.95rem',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  padding: '22px',
                  borderRadius: '16px',
                  marginBottom: '24px'
                }}>
                  {selectedEvento.descrizione}
                </div>

                {/* SEZIONE AZIONE / MODULO DI ISCRIZIONE */}
                {!selectedEvento.past ? (
                  selectedEvento.stato_iscrizioni === 'sold_out' ? (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                      <div style={{ fontSize: '0.95rem', color: '#ff6b6b', fontWeight: 600 }}>
                        Tutti i posti disponibili sono stati confermati.
                      </div>
                      <button disabled style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ff6b6b', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '14px 28px', borderRadius: '99px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'not-allowed' }}>
                        Sold Out
                      </button>
                    </div>
                  ) : selectedEvento.stato_iscrizioni === 'chiuso' ? (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                      <div style={{ fontSize: '0.95rem', color: '#888' }}>
                        Le adesioni per questo evento sono chiuse.
                      </div>
                      <button disabled style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#666', border: 'none', padding: '14px 28px', borderRadius: '99px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'not-allowed' }}>
                        Iscrizioni Chiuse
                      </button>
                    </div>
                  ) : redirectUrl ? (
                    <div style={{ backgroundColor: 'rgba(223, 254, 2, 0.08)', border: '1px solid rgba(223, 254, 2, 0.35)', borderRadius: '16px', padding: '22px', textAlign: 'center' }}>
                      <div style={{ color: 'rgb(223, 254, 2)', fontWeight: 800, fontSize: '1.05rem', marginBottom: '8px' }}>
                        Richiesta registrata!
                      </div>
                      <p style={{ color: '#ccc', fontSize: '0.9rem', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                        Ti stiamo reindirizzando al gruppo WhatsApp dell&apos;evento per l&apos;approvazione da parte degli admin.
                      </p>
                      <a
                        href={redirectUrl}
                        style={{ backgroundColor: 'rgb(223, 254, 2)', color: 'black', textDecoration: 'none', padding: '12px 24px', borderRadius: '99px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'inline-block' }}
                      >
                        Apri WhatsApp manualmente &rarr;
                      </a>
                    </div>
                  ) : !showForm ? (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                      {modalBar.isWaitlist && (
                        <div style={{
                          backgroundColor: 'rgba(234, 179, 8, 0.1)',
                          border: '1px solid rgba(234, 179, 8, 0.35)',
                          color: '#fde047',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          fontSize: '0.88rem',
                          lineHeight: 1.5,
                          marginBottom: '16px'
                        }}>
                          Numero massimo raggiunto: puoi comunque iscriverti per restare in coda di approvazione su WhatsApp (lista d&apos;attesa) nel caso si liberino posti.
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                          {selectedEvento.prezzo} <span style={{ fontSize: '0.9rem', color: '#888', fontWeight: 400 }}>/ persona</span>
                        </div>
                        <button
                          onClick={() => setShowForm(true)}
                          style={{
                            backgroundColor: 'rgb(223, 254, 2)',
                            color: 'black',
                            border: 'none',
                            padding: '14px 28px',
                            borderRadius: '99px',
                            fontSize: '13px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            cursor: 'pointer'
                          }}
                        >
                          {modalBar.isWaitlist ? 'Entra in lista d\'attesa' : 'Prenota il tuo posto'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleIscrizione}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(223, 254, 2, 0.3)',
                        borderRadius: '18px',
                        padding: '22px'
                      }}
                    >
                      <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>
                        {modalBar.isWaitlist ? 'Richiedi ingresso in lista d\'attesa' : 'Iscriviti all\'evento'}
                      </h3>
                      <p style={{ margin: '0 0 18px 0', fontSize: '0.85rem', color: '#aaa', lineHeight: 1.5 }}>
                        {modalBar.isWaitlist
                          ? 'Numero massimo raggiunto: invia i tuoi dati e richiedi l\'accesso al gruppo WhatsApp, resterai in attesa di approvazione se si liberano posti.'
                          : 'Inserisci i tuoi dati per richiedere l\'ingresso nel gruppo WhatsApp operativo dell\'evento (i dettagli sulla quota spese verranno gestiti nella chat).'}
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', marginBottom: '6px', fontWeight: 700 }}>
                            Nome *
                          </label>
                          <input
                            type="text"
                            required
                            className="ripido-input"
                            placeholder="Es. Marco"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', marginBottom: '6px', fontWeight: 700 }}>
                            Cognome *
                          </label>
                          <input
                            type="text"
                            required
                            className="ripido-input"
                            placeholder="Es. Rossi"
                            value={cognome}
                            onChange={e => setCognome(e.target.value)}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#aaa', marginBottom: '6px', fontWeight: 700 }}>
                          Numero di Telefono (WhatsApp) *
                        </label>
                        <input
                          type="tel"
                          required
                          className="ripido-input"
                          placeholder="+39 333 1234567"
                          value={telefono}
                          onChange={e => setTelefono(e.target.value)}
                        />
                      </div>

                      <p style={{ fontSize: '11px', color: '#777', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                        Usiamo il numero esclusivamente per associare la tua richiesta su WhatsApp (anche in caso di nickname) e coordinare l&apos;uscita, nel rispetto della <Link href="/privacy" style={{ color: '#aaa', textDecoration: 'underline' }}>Privacy Policy</Link>.
                      </p>

                      {formError && (
                        <div style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '14px', fontWeight: 600 }}>
                          {formError}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => { setShowForm(false); setFormError(null); }}
                          style={{
                            backgroundColor: 'transparent',
                            color: '#ccc',
                            border: '1px solid rgba(255,255,255,0.25)',
                            padding: '12px 20px',
                            borderRadius: '99px',
                            fontSize: '12px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            cursor: 'pointer'
                          }}
                        >
                          Annulla
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          style={{
                            backgroundColor: 'rgb(223, 254, 2)',
                            color: 'black',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '99px',
                            fontSize: '12px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            cursor: submitting ? 'wait' : 'pointer',
                            opacity: submitting ? 0.7 : 1
                          }}
                        >
                          {submitting ? 'Invio...' : 'Iscriviti ed entra nel gruppo'}
                        </button>
                      </div>
                    </form>
                  )
                ) : (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                    <span style={{ fontSize: '13px', color: '#888' }}>
                      Evento archiviato
                    </span>

                    {selectedEvento.album_url ? (
                      <a
                        href={selectedEvento.album_url}
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
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </main>
  );
}
