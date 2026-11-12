'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ProssimeUscite() {
  // Dati di esempio arricchiti con immagini e descrizioni
  const usciteData = [
    // --- IN PROGRAMMA ---
    { 
      id: 1, data: 'Domenica 15 Novembre', titolo: 'Bosco degli Eroi', regione: 'Veneto', 
      dPlus: '400m', km: '10km', livello: 'E (Escursionistico)', guide: 'Andrea', past: false, 
      immagine: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
      // Nuovi campi tecnici stile WhatsApp (al posto della descrizione discorsiva)
      maxPartecipanti: 15,
      pernottamento: 'No',
      puntoPartenza: 'Rifugio Bocchette, Seren del Grappa',
      puntoArrivo: 'Rifugio Bocchette',
      tipologia: 'Anello',
      tempoStimato: '3 h'
    },
    { id: 2, data: 'Sabato 14 Novembre', titolo: 'Lago di Sorapis via sentiero 215', regione: 'Veneto', dPlus: '400m', km: '10km', livello: 'E', guide: 'Giada', past: false, immagine: 'https://images.unsplash.com/photo-1522616238699-a9314455acdb?q=80&w=800&auto=format&fit=crop', descrizione: 'Trekking fotografico verso uno dei laghi più iconici delle Dolomiti. Il sentiero presenta alcuni tratti esposti attrezzati con cordino metallico, ma tecnicamente semplici.' },
    { id: 3, data: 'Sabato 14 Novembre', titolo: 'Rifugio Tuckett e Casinei', regione: 'Trentino', dPlus: '800m', km: '14km', livello: 'E', guide: 'Matteo', past: false, immagine: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=800&auto=format&fit=crop', descrizione: 'Immersione nel cuore delle Dolomiti di Brenta. Un giro ad anello spettacolare passando ai piedi di pareti verticali impressionanti.' },
    { id: 4, data: 'Sabato 21 Novembre', titolo: 'Cima Carega dal Rifugio Revolto', regione: 'Veneto', dPlus: '1100m', km: '15km', livello: 'EE', guide: 'Andrea', past: false, immagine: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=800&auto=format&fit=crop', descrizione: 'Un\'escursione impegnativa nel gruppo delle Piccole Dolomiti. L\'ambiente roccioso e severo ci accompagnerà fino alla cima a quota 2.259m.' },
    { id: 5, data: 'Sabato 21 Novembre', titolo: 'Rocciamelone (3538m)', regione: 'Piemonte', dPlus: '1500m', km: '9km', livello: 'EE', guide: 'Matteo', past: false, immagine: 'https://images.unsplash.com/photo-1602852260645-0e3636f0a3cc?q=80&w=800&auto=format&fit=crop', descrizione: 'Salita per gambe allenate alla cima santuario più alta d\'Europa. Quota elevata e panorama che spazia dal Monviso al Monte Rosa.' },
    // --- STORICO ---
    { id: 6, data: 'Domenica 8 Novembre', titolo: 'Resegone via Canalone Bobbio', regione: 'Lombardia', dPlus: '1000m', km: '11km', livello: 'EE', guide: 'Matteo', past: true, immagine: 'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=800&auto=format&fit=crop', descrizione: 'Salita tecnica sulla montagna simbolo di Lecco. Giornata tersa e gruppo fantastico, la cresta finale ci ha regalato emozioni.' },
    { id: 7, data: 'Domenica 8 Novembre', titolo: 'Cinque Torri e Nuvolau', regione: 'Veneto', dPlus: '600m', km: '9km', livello: 'E', guide: 'Giada', past: true, immagine: 'https://images.unsplash.com/photo-1533471018593-9c884577af1c?q=80&w=800&auto=format&fit=crop', descrizione: 'Giro esplorativo tra i monoliti delle Cinque Torri e salita al rifugio più antico delle Dolomiti per un pranzo con vista.' },
    { id: 8, data: 'Venerdì 30 Ottobre', titolo: 'Baita Segantini al tramonto', regione: 'Trentino', dPlus: '450m', km: '8km', livello: 'E', guide: 'Andrea', past: true, immagine: 'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=800&auto=format&fit=crop', descrizione: 'Uscita serale per goderci l\'Enrosadira sulle Pale di San Martino. Freddo pungente ma ripagato dai colori del cielo.' },
    { id: 9, data: 'Venerdì 30 Ottobre', titolo: 'Laghi di Fusine e Rifugio Zacchi', regione: 'FVG', dPlus: '500m', km: '10km', livello: 'E', guide: 'Giada', past: true, immagine: 'https://images.unsplash.com/photo-1542224566-6e85f2e10696?q=80&w=800&auto=format&fit=crop', descrizione: 'Foliage autunnale spettacolare attorno ai due laghi glaciali. Sentiero bagnato ma l\'atmosfera della foresta millenaria era magica.' }
  ];

  // Stati per i filtri e per il popup (modale)
  const [activeTab, setActiveTab] = useState('programma'); // 'programma' o 'storico'
  const [activeRegion, setActiveRegion] = useState('Tutte');
  const [selectedUscita, setSelectedUscita] = useState<typeof usciteData[0] | null>(null);

  // Estrai regioni uniche in base al tab attivo
  const filteredByTab = usciteData.filter(u => activeTab === 'programma' ? !u.past : u.past);
  const regioniDisponibili = ['Tutte', ...Array.from(new Set(filteredByTab.map(u => u.regione)))];

  // Filtro finale (Tab + Regione)
  const usciteVisualizzate = filteredByTab.filter(u => activeRegion === 'Tutte' || u.regione === activeRegion);

  // Raggruppa per data
  const usciteRaggruppate = usciteVisualizzate.reduce((acc, uscita) => {
    if (!acc[uscita.data]) acc[uscita.data] = [];
    acc[uscita.data].push(uscita);
    return acc;
  }, {} as Record<string, typeof usciteData>);

  return (
    <main style={{ position: 'relative', width: '100%', minHeight: '100dvh', backgroundColor: 'black', color: 'white', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      
      <style>{`
        .uscita-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr auto;
          align-items: center;
          gap: 20px;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          transition: background-color 0.2s;
        }
        .uscita-row:hover {
          background-color: rgba(255,255,255,0.03);
        }
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
        .tech-specs {
          display: flex;
          gap: 15px;
          font-size: 14px;
          color: #aaa;
        }
        .action-btn {
          padding: 10px 20px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-btn.primary {
          background-color: white;
          color: black;
          border: none;
        }
        .action-btn.secondary {
          background-color: transparent;
          color: white;
          border: 1px solid rgba(255,255,255,0.4);
        }
        .action-btn:hover {
          transform: scale(1.02);
        }
        @media (max-width: 768px) {
          .uscita-row {
            grid-template-columns: 1fr;
            gap: 10px;
            padding: 25px 0;
          }
          .tech-specs {
            margin: 10px 0;
          }
          .action-btn {
            width: 100%;
            text-align: center;
            margin-top: 10px;
          }
        }
      `}</style>

      {/* Navigazione superiore */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', marginBottom: '40px' }}>
        <Link href="/" style={{ color: 'rgb(223, 254, 2)', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          &larr; Torna alla Home
        </Link>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Titolo e Tab */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginBottom: '40px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 'bold', margin: 0, letterSpacing: '0.05em' }}>
            Bacheca <span style={{ color: 'rgb(223, 254, 2)' }}>Uscite</span>
          </h1>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className={`filter-btn ${activeTab === 'programma' ? 'active' : ''}`}
              onClick={() => { setActiveTab('programma'); setActiveRegion('Tutte'); }}
            >
              In Programma
            </button>
            <button 
              className={`filter-btn ${activeTab === 'storico' ? 'active' : ''}`}
              onClick={() => { setActiveTab('storico'); setActiveRegion('Tutte'); }}
            >
              Uscite Passate
            </button>
          </div>
        </div>

        {/* Filtri Regione */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '50px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          {regioniDisponibili.map(regione => (
            <button 
              key={regione}
              className={`filter-btn ${activeRegion === regione ? 'active' : ''}`}
              style={{ padding: '6px 14px', fontSize: '11px', borderColor: activeRegion === regione ? 'rgb(223, 254, 2)' : 'rgba(255,255,255,0.15)' }}
              onClick={() => setActiveRegion(regione)}
            >
              {regione}
            </button>
          ))}
        </div>

        {/* Lista Uscite Raggruppate per Data */}
        {Object.keys(usciteRaggruppate).length === 0 ? (
          <p style={{ color: '#aaa' }}>Nessuna uscita trovata per questa selezione.</p>
        ) : (
          Object.entries(usciteRaggruppate).map(([data, uscite]) => (
            <div key={data} style={{ marginBottom: '60px' }}>
              
              {/* Intestazione Data */}
              <h2 style={{ fontSize: '1.2rem', color: 'rgb(223, 254, 2)', borderBottom: '1px solid rgb(223, 254, 2)', paddingBottom: '10px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {data}
              </h2>
              
              {/* Elenco Uscite per quella data */}
              <div>
                {uscite.map(uscita => (
                  <div key={uscita.id} className="uscita-row">
                    
                    {/* 1. Titolo e Regione */}
                    <div>
                      <span style={{ fontSize: '10px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'inline-block' }}>
                        {uscita.regione}
                      </span>
                      <h3 style={{ fontSize: '1.2rem', margin: '0', fontWeight: 'bold' }}>{uscita.titolo}</h3>
                    </div>

                    {/* 2. Dati Tecnici */}
                    <div className="tech-specs">
                      <span><strong>D+</strong> {uscita.dPlus}</span>
                      <span><strong>Km</strong> {uscita.km}</span>
                      <span><strong>Lvl</strong> {uscita.livello}</span>
                    </div>

                    {/* 3. Referente */}
                    <div style={{ fontSize: '14px', color: '#888' }}>
                      Con: <span style={{ color: 'white' }}>{uscita.guide}</span>
                    </div>

                    {/* 4. Azione */}
                    <div>
                      <button 
                        className={`action-btn ${!uscita.past ? 'primary' : 'secondary'}`}
                        onClick={() => setSelectedUscita(uscita)}
                      >
                        Vedi Dettagli
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODALE DI DETTAGLIO (Appare solo se selectedUscita non è nullo) */}
      {selectedUscita && (
        <div 
          style={{ 
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', 
            zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center', 
            padding: '20px' 
          }}
          onClick={() => setSelectedUscita(null)} // Cliccando fuori si chiude
        >
          {/* Contenitore interno della modale */}
          <div 
            style={{ 
              backgroundColor: '#111', width: '100%', maxWidth: '600px', 
              borderRadius: '16px', overflow: 'hidden', position: 'relative',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
            onClick={e => e.stopPropagation()} // Evita che il clic dentro la modale la chiuda
          >
            {/* Tasto Chiudi (X) */}
            <button 
              onClick={() => setSelectedUscita(null)}
              style={{
                position: 'absolute', top: '15px', right: '15px', zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', 
                borderRadius: '50%', width: '36px', height: '36px', 
                fontSize: '18px', cursor: 'pointer', display: 'flex', 
                alignItems: 'center', justifyContent: 'center'
              }}
            >
              ✕
            </button>

            {/* Immagine Copertina (o Mappa GPS finta in futuro) */}
            <div style={{ width: '100%', height: '250px', backgroundColor: '#222' }}>
              <img 
                src={selectedUscita.immagine} 
                alt={selectedUscita.titolo} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Contenuto Modale */}
            <div style={{ padding: '30px' }}>
              <div style={{ color: 'rgb(223, 254, 2)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', marginBottom: '10px' }}>
                {selectedUscita.regione} • {selectedUscita.data}
              </div>
              <h2 style={{ fontSize: '2rem', margin: '0 0 20px 0', lineHeight: '1.1' }}>
                {selectedUscita.titolo}
              </h2>
              
              {/* Dettagli strutturati stile WhatsApp */}
              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
                
                <h3 style={{ fontSize: '14px', color: 'rgb(223, 254, 2)', marginTop: 0, marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Dettagli Escursione
                </h3>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.95rem', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    <span style={{ color: '#888' }}>Punto di partenza:</span>
                    <span style={{ color: 'white', textAlign: 'right', maxWidth: '60%' }}>{selectedUscita.puntoPartenza || 'Da definire'}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    <span style={{ color: '#888' }}>Punto di arrivo:</span>
                    <span style={{ color: 'white', textAlign: 'right', maxWidth: '60%' }}>{selectedUscita.puntoArrivo || 'Da definire'}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    <span style={{ color: '#888' }}>Tipologia:</span>
                    <span style={{ color: 'white', textAlign: 'right' }}>{selectedUscita.tipologia || '-'}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    <span style={{ color: '#888' }}>Lunghezza:</span>
                    <span style={{ color: 'white', textAlign: 'right' }}>{selectedUscita.km}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    <span style={{ color: '#888' }}>Dislivello positivo:</span>
                    <span style={{ color: 'white', textAlign: 'right' }}>{selectedUscita.dPlus}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    <span style={{ color: '#888' }}>Tempo stimato:</span>
                    <span style={{ color: 'white', textAlign: 'right' }}>{selectedUscita.tempoStimato || '-'}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    <span style={{ color: '#888' }}>Difficoltà:</span>
                    <span style={{ color: 'white', textAlign: 'right' }}>{selectedUscita.livello}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                    <span style={{ color: '#888' }}>Max partecipanti:</span>
                    <span style={{ color: 'white', textAlign: 'right' }}>{selectedUscita.maxPartecipanti || 'Nessun limite'}</span>
                  </li>
                </ul>
              </div>
              
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#888' }}>
                  Admin dell'uscita: <strong style={{ color: 'white' }}>{selectedUscita.guide}</strong>
                </span>

                {/* Tasto Azione nella Modale */}
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