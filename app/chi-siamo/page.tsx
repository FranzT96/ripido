'use client';
import Link from 'next/link';

export default function ChiSiamo() {
  const founders = [
    {
      name: 'Matteo Strippoli',
      role: 'Co-Founder',
      desc: 'Appassionato di alta quota e fotografia. È la mente organizzativa dietro le spedizioni più ambiziose di Ripido, sempre alla ricerca della traccia perfetta per il gruppo.',
      align: 'left',
      avatar: '/matteo.jpg'
    },
    {
      name: 'Giada Tinazzi',
      role: 'Co-Founder',
      desc: 'L\'anima creativa e comunicativa del progetto. Trasforma ogni escursione in un racconto unico, unendo la fatica della salita alla bellezza dei paesaggi d\'alta quota.',
      align: 'right',
      avatar: '/giada.jpg'
    },
    {
      name: 'Andrea Bosco',
      role: 'Co-Founder',
      desc: 'Esperto di percorsi tecnici e sicurezza in montagna. Con lui nessuna cresta è troppo affilata: si assicura che il gruppo arrivi in cima e torni al rifugio col sorriso.',
      align: 'left',
      avatar: '/andrea.jpg'
    }
  ];

  return (
    <main style={{ position: 'relative', width: '100%', minHeight: '100dvh', backgroundColor: 'black', color: 'white', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      
      {/* Regole responsive per impaginare su smartphone */}
      <style>{`
        .founder-row {
          display: flex;
          align-items: center;
          gap: 40px;
        }
        .founder-row.right {
          flex-direction: row-reverse;
        }
        .founder-text {
          max-width: 500px;
        }
        @media (max-width: 768px) {
          .founder-row, .founder-row.right {
            flex-direction: column !important;
            text-align: center !important;
            gap: 20px;
          }
          .founder-text {
            text-align: center !important;
          }
        }
      `}</style>

      {/* Navigazione superiore */}
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
        <Link 
          href="/" 
          style={{ color: 'rgb(223, 254, 2)', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
        >
          &larr; Torna alla Home
        </Link>
      </div>

      {/* Titolo Pagina */}
      <h1 style={{ textAlign: 'center', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 'bold', marginBottom: '80px', letterSpacing: '0.05em' }}>
        Dietro <span style={{ color: 'rgb(223, 254, 2)' }}>Ripido</span>
      </h1>

      {/* Lista Founders */}
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '80px' }}>
        {founders.map((founder, i) => (
          <div key={i} className={`founder-row ${founder.align === 'right' ? 'right' : ''}`}>
            
            {/* Foto (Immagini segnaposto per test grafico) */}
            <div style={{ width: '160px', height: '160px', borderRadius: '50%', backgroundColor: '#1a1a1a', flexShrink: 0, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}>
              <img src={founder.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={founder.name} />
            </div>

            {/* Testo */}
            <div className="founder-text" style={{ textAlign: founder.align === 'left' ? 'left' : 'right' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 5px 0' }}>
                {founder.name}
              </h2>
              <p style={{ color: 'rgb(223, 254, 2)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', margin: '0 0 15px 0' }}>
                {founder.role}
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#b3b3b3', margin: 0, fontWeight: 'normal' }}>
                {founder.desc}
              </p>
            </div>
            
          </div>
        ))}
      </div>

    </main>
  );
}