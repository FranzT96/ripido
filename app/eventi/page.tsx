'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function EventiSpeciali() {
  // Dati di esempio basati sul tuo messaggio di Halloween
  const eventiData = [
    {
      id: 1,
      titolo: 'Halloween in Casera: Cena con Delitto',
      data: '31 Ott - 1 Nov',
      luogo: 'Casera Val Montina (Veneto)',
      postiTotali: 16,
      postiOccupati: 12,
      prezzo: '50€',
      immagine: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?q=80&w=800&auto=format&fit=crop', // Immagine d'atmosfera autunnale/baita
      descrizioneLunga: `L'idea è salire a Casera Val Montina con circa 15 minuti di camminata, passando anche per un ponte tibetano. L'obiettivo è passare insieme una serata e una giornata in compagnia, in pieno stile Ripido: senza troppe formalità, collaborando e divertendoci come un gruppo di amici.

Come ce la immaginiamo?
• 31 ottobre: salita alla casera, arrivo per l'ora dell'aperitivo e della cena, e poi... una cena con delitto tutti insieme! L'idea è trascorrere la serata lì e pernottare insieme.
• 1 novembre: colazione tutti insieme e poi si riparte per un trekking!

Costo indicativo: circa 50 € a persona, comprensivi di cena, pernottamento e colazione. Ci teniamo a precisare che non è un evento organizzato per guadagnarci qualcosa, il costo servirà a coprire le spese vive.`,
      chiuso: false // Se true, l'evento è concluso o i posti sono esauriti
    },
    // Evento passato come esempio
    {
       id: 2,
       titolo: 'Capodanno in Rifugio',
       data: '31 Dic - 1 Gen',
       luogo: 'Rifugio Fuciade (Trentino)',
       postiTotali: 20,
       postiOccupati: 20,
       prezzo: '80€',
       immagine: 'https://images.unsplash.com/photo-1542662565-7e4fd8a4369e?q=80&w=800&auto=format&fit=crop',
       descrizioneLunga: 'Evento concluso. Grazie a tutti per aver festeggiato l\'inizio dell\'anno con noi!',
       chiuso: true
    }
  ];

  const [selectedEvento, setSelectedEvento] = useState<typeof eventiData[0] | null>(null);

  return (
    <main style={{ position: 'relative', width: '100%', minHeight: '100dvh', color: 'white', padding: '40px 20px', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      {/* BACKGROUND VERE LINEE TOPOGRAFICHE (File Locale) */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1,
        backgroundImage: 'url("/topografia.png")', 
        backgroundSize: '400px',
        backgroundRepeat: 'repeat', 
        opacity: 0.2 
      }} />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#0a0a0a', zIndex: -2 }} />

      <style>{`
        .evento-card {
          background-color: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.2s, border-color 0.2s;
          display: flex;
          flex-direction: column;
        }
        .evento-card:hover {
          transform: translateY(-5px);
          border-color: rgba(223, 254, 2, 0.5);
        }
        .evento-img-container {
          height: 200px;
          position: relative;
        }
        .evento-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .evento-content {
          padding: 25px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .progress-bar-bg {
          background-color: rgba(255,255,255,0.1);
          border-radius: 99px;
          height: 8px;
          width: 100%;
          margin: 10px 0;
          overflow: hidden;
        }
        .progress-bar-fill {
          background-color: rgb(223, 254, 2);
          height: 100%;
          border-radius: 99px;
        }
        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 30px;
        }
        @media (max-width: 768px) {
          .grid-container { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Navigazione */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', marginBottom: '40px' }}>
        <Link href="/" style={{ color: 'rgb(223, 254, 2)', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          &larr; Torna alla Home
        </Link>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 'bold', margin: '0 0 10px 0', letterSpacing: '0.05em' }}>
            Eventi <span style={{ color: 'rgb(223, 254, 2)' }}>Speciali</span>
          </h1>
          <p style={{ color: '#aaa', margin: 0, fontSize: '1rem', maxWidth: '600px', lineHeight: '1.5' }}>
            Non solo escursioni. Weekend nei rifugi, cene in casera ed esperienze di più giorni organizzate dalla community.
          </p>
        </div>

        <div className="grid-container">
          {eventiData.map(evento => {
            const postiDisponibili = evento.postiTotali - evento.postiOccupati;
            const percentualeOccupata = (evento.postiOccupati / evento.postiTotali) * 100;
            const esaurito = postiDisponibili <= 0;

            return (
              <div key={evento.id} className="evento-card">
                <div className="evento-img-container">
                  <img src={evento.immagine} alt={evento.titolo} className="evento-img" />
                  <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', padding: '6px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 'bold', color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {evento.data}
                  </div>
                </div>
                
                <div className="evento-content">
                  <h2 style={{ fontSize: '1.4rem', margin: '0 0 10px 0', lineHeight: '1.2' }}>{evento.titolo}</h2>
                  <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '20px' }}>📍 {evento.luogo}</div>
                  
                  {/* Gestione Posti */}
                  {!evento.chiuso && (
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#ccc', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                        <span>Posti occupati</span>
                        <span>{evento.postiOccupati} / {evento.postiTotali}</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${percentualeOccupata}%`, backgroundColor: esaurito ? '#ff4d4d' : 'rgb(223, 254, 2)' }}></div>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '0.85rem', color: esaurito ? '#ff4d4d' : 'rgb(223, 254, 2)' }}>
                        {esaurito ? 'Sold Out' : `${postiDisponibili} posti rimanenti`}
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{evento.prezzo}</div>
                    <button 
                      onClick={() => setSelectedEvento(evento)}
                      style={{ 
                        backgroundColor: 'white', color: 'black', border: 'none', 
                        padding: '10px 20px', borderRadius: '99px', fontSize: '12px', 
                        fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer' 
                      }}
                    >
                      Dettagli
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* MODALE DI DETTAGLIO EVENTO */}
      {selectedEvento && (
        <div 
          style={{ 
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', 
            zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center', 
            padding: '20px' 
          }}
          onClick={() => setSelectedEvento(null)} 
        >
          <div 
            style={{ 
              backgroundColor: '#111', width: '100%', maxWidth: '650px', 
              maxHeight: '90vh', overflowY: 'auto', 
              borderRadius: '16px', position: 'relative',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
            onClick={e => e.stopPropagation()} 
          >
            <button 
              onClick={() => setSelectedEvento(null)}
              style={{
                position: 'absolute', top: '15px', right: '15px', zIndex: 10,
                backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', 
                borderRadius: '50%', width: '36px', height: '36px', 
                fontSize: '18px', cursor: 'pointer', display: 'flex', 
                alignItems: 'center', justifyContent: 'center'
              }}
            >✕</button>

            <div style={{ width: '100%', height: '250px', backgroundColor: '#222' }}>
              <img src={selectedEvento.immagine} alt={selectedEvento.titolo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ padding: '30px' }}>
              <div style={{ color: 'rgb(223, 254, 2)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', marginBottom: '10px' }}>
                {selectedEvento.data} • {selectedEvento.luogo}
              </div>
              <h2 style={{ fontSize: '2rem', margin: '0 0 20px 0', lineHeight: '1.1' }}>
                {selectedEvento.titolo}
              </h2>
              
              <div style={{ whiteSpace: 'pre-wrap', color: '#ccc', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '30px' }}>
                {selectedEvento.descrizioneLunga}
              </div>
              
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {selectedEvento.prezzo} <span style={{ fontSize: '0.9rem', color: '#888', fontWeight: 'normal' }}>/ persona</span>
                </div>

                {/* Tasto Iscrizione/Pagamento nella Modale */}
                {!selectedEvento.chiuso && (selectedEvento.postiTotali - selectedEvento.postiOccupati) > 0 ? (
                  <button style={{ backgroundColor: 'rgb(223, 254, 2)', color: 'black', border: 'none', padding: '14px 28px', borderRadius: '99px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer' }}>
                    Prenota il tuo posto
                  </button>
                ) : (
                  <button disabled style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#666', border: 'none', padding: '14px 28px', borderRadius: '99px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'not-allowed' }}>
                    Posti Esauriti
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