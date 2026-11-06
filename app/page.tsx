'use client';

export default function RipidoHome() {
  return (
    <main style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', margin: 0, padding: 0, backgroundColor: 'black' }}>
      
      {/* 1. SFONDO e OVERLAY SCURO */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
          alt="Montagne maestose" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}></div>
      </div>

      {/* 2. LOGO: Lime rgb(223, 254, 2) con contorno nero netto */}
      <div style={{ position: 'absolute', top: '-25px', left: '2px', zIndex: 10, width: '240px', aspectRatio: '1 / 1' }}>
        
        {/* Contorno nero (layer originali neri sfalsati di 1.5px) */}
        {[-1.5, 0, 1.5].map((x) =>
          [-1.5, 0, 1.5].map((y) => {
            if (x === 0 && y === 0) return null;
            return (
              <img
                key={`${x}-${y}`}
                src="/logo-ripido.png"
                alt=""
                style={{
                  position: 'absolute',
                  top: `${y}px`,
                  left: `${x}px`,
                  width: '100%',
                  height: 'auto',
                  pointerEvents: 'none'
                }}
              />
            );
          })
        )}

        {/* Sagoma superiore in lime fluo */}
        <div 
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%', 
            height: '100%', 
            backgroundColor: 'rgb(223, 254, 2)',
            WebkitMaskImage: 'url(/logo-ripido.png)',
            maskImage: 'url(/logo-ripido.png)',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'left top',
            maskPosition: 'left top'
          }}
        />
      </div>

      {/* 3. TESTO: INVARIATO (Bloccato nella sua posizione perfetta) */}
      <div style={{ position: 'absolute', bottom: '150px', left: '40px', zIndex: 10, maxWidth: '50vw' }}>
        <h1 style={{ color: 'white', fontSize: 'clamp(1.5rem, 3.5vw, 3.5rem)', fontWeight: 'bold', lineHeight: '1.2', margin: 0, textShadow: '2px 4px 15px rgba(0,0,0,0.9)', whiteSpace: 'nowrap' }}>
          The mountains are calling.<br />
          <span style={{ fontStyle: 'italic', fontWeight: '300' }}>Your friends aren't.</span><br />
          Find your people.
        </h1>
      </div>

    </main>
  );
}