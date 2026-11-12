'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ProssimeUscite() {
  // Dati di esempio (in futuro potrai collegarli a un database o Google Sheets)
  const usciteData = [
    // --- IN PROGRAMMA ---
    { id: 1, data: 'Sabato 14 Novembre', titolo: 'Monte Lussari e Cima Cacciatore', regione: 'FVG', dPlus: '900m', km: '12km', livello: 'E', guide: 'Andrea', past: false },
    { id: 2, data: 'Sabato 14 Novembre', titolo: 'Lago di Sorapis via sentiero 215', regione: 'Veneto', dPlus: '400m', km: '10km', livello: 'E', guide: 'Giada', past: false },
    { id: 3, data: 'Sabato 14 Novembre', titolo: 'Rifugio Tuckett e Casinei', regione: 'Trentino', dPlus: '800m', km: '14km', livello: 'E', guide: 'Matteo', past: false },
    { id: 4, data: 'Sabato 21 Novembre', titolo: 'Cima Carega dal Rifugio Revolto', regione: 'Veneto', dPlus: '1100m', km: '15km', livello: 'EE', guide: 'Andrea', past: false },
    { id: 5, data: 'Sabato 21 Novembre', titolo: 'Rocciamelone (3538m)', regione: 'Piemonte', dPlus: '1500m', km: '9km', livello: 'EE', guide: 'Matteo', past: false },
    // --- STORICO ---
    { id: 6, data: 'Domenica 8 Novembre', titolo: 'Resegone via Canalone Bobbio', regione: 'Lombardia', dPlus: '1000m', km: '11km', livello: 'EE', guide: 'Matteo', past: true },
    { id: 7, data: 'Domenica 8 Novembre', titolo: 'Cinque Torri e Nuvolau', regione: 'Veneto', dPlus: '600m', km: '9km', livello: 'E', guide: 'Giada', past: true },
    { id: 8, data: 'Venerdì 30 Ottobre', titolo: 'Baita Segantini al tramonto', regione: 'Trentino', dPlus: '450m', km: '8km', livello: 'E', guide: 'Andrea', past: true },
    { id: 9, data: 'Venerdì 30 Ottobre', titolo: 'Laghi di Fusine e Rifugio Zacchi', regione: 'FVG', dPlus: '500m', km: '10km', livello: 'E', guide: 'Giada', past: true }
  ];

  // Stati per i filtri
  const [activeTab, setActiveTab] = useState('programma'); // 'programma' o 'storico'
  const [activeRegion, setActiveRegion] = useState('Tutte');

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
              Storico Passate
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

                    {/* 4. Azione (Solo se in programma) */}
                    <div>
                      {!uscita.past ? (
                        <button className="action-btn" style={{ backgroundColor: 'white', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '99px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer' }}>
                          Vedi Dettagli
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold' }}>
                          Conclusa
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

      </div>
    </main>
  );
}