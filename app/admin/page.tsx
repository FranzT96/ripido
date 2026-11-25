'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';

interface UscitaDB {
  id: number;
  titolo: string;
  data_testo: string;
  iso_date: string;
  regione: string;
  d_plus: string;
  km: string;
  livello: string;
  guide: string;
  immagine_url: string;
  max_partecipanti: number | null;
  pernottamento: string | null;
  punto_partenza: string | null;
  punto_arrivo: string | null;
  tipologia: string | null;
  tempo_stimato: string | null;
  whatsapp_url: string | null;
  gpx_url: string | null;
}

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

interface IscrizioneDB {
  id: number;
  evento_id: number;
  nome: string;
  cognome: string;
  telefono: string;
  stato: 'inviato' | 'confermato' | 'ritirato';
  created_at: string;
}

const REGIONI_ITALIA = [
  'Veneto', 'Trentino', 'FVG', 'Lombardia', 'Piemonte', 'Valle d\'Aosta',
  'Emilia-Romagna', 'Liguria', 'Toscana', 'Marche', 'Umbria', 'Lazio',
  'Abruzzo', 'Molise', 'Campania', 'Puglia', 'Basilicata', 'Calabria',
  'Sicilia', 'Sardegna'
];

const EMPTY_USCITA = {
  titolo: '',
  iso_date: '',
  data_testo: '',
  regione: 'Veneto',
  livello: 'E',
  d_plus: '',
  km: '',
  tempo_stimato: '',
  guide: '',
  max_partecipanti: '',
  pernottamento: 'No',
  tipologia: 'Anello',
  punto_partenza: '',
  punto_arrivo: '',
  whatsapp_url: '',
  gpx_url: '',
  immagine_url: ''
};

const EMPTY_EVENTO = {
  titolo: '',
  data_testo: '',
  data_fine: '',
  luogo: '',
  prezzo: '',
  posti_reali: '15',
  capienza_gruppo: '20',
  stato_iscrizioni: 'aperte' as 'aperte' | 'sold_out' | 'chiuso',
  whatsapp_invite_url: '',
  album_url: '',
  immagine_url: '',
  descrizione: ''
};

// Formatta YYYY-MM-DD in es. "Sabato 5 Dicembre"
function formatIsoToItalian(iso: string): string {
  if (!iso) return '';
  const parts = iso.split('-').map(Number);
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return '';
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  const raw = new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(d);
  return raw
    .split(' ')
    .map(w => (w.length > 2 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ');
}

// Prepara link wa.me pulito per contattare al volo un iscritto
function buildWaMeUrl(phone: string): string {
  let digits = phone.replace(/[^0-9+]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith('3')) digits = '39' + digits;
  return `https://wa.me/${digits}`;
}

// Ridimensiona (max 1400px) e comprime la foto prima dell'upload su Supabase Storage
async function compressImageFile(file: File, maxDim = 1400, quality = 0.84): Promise<{ blob: Blob; ext: string; contentType: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ blob: file, ext: file.name.split('.').pop() || 'jpg', contentType: file.type || 'image/jpeg' });
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (webpBlob) => {
          if (webpBlob && webpBlob.type === 'image/webp') {
            resolve({ blob: webpBlob, ext: 'webp', contentType: 'image/webp' });
          } else {
            canvas.toBlob(
              (jpgBlob) => {
                if (jpgBlob) {
                  resolve({ blob: jpgBlob, ext: 'jpg', contentType: 'image/jpeg' });
                } else {
                  resolve({ blob: file, ext: file.name.split('.').pop() || 'jpg', contentType: file.type || 'image/jpeg' });
                }
              },
              'image/jpeg',
              quality
            );
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ blob: file, ext: file.name.split('.').pop() || 'jpg', contentType: file.type || 'image/jpeg' });
    };

    img.src = objectUrl;
  });
}

export default function AdminDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Navigazione e feedback
  const [activeSection, setActiveSection] = useState<'eventi' | 'iscritti' | 'uscite'>('eventi');
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Dati DB
  const [eventi, setEventi] = useState<EventoDB[]>([]);
  const [uscite, setUscite] = useState<UscitaDB[]>([]);
  const [selectedEventoIdForIscritti, setSelectedEventoIdForIscritti] = useState<number | null>(null);
  const [iscritti, setIscritti] = useState<IscrizioneDB[]>([]);
  const [loadingIscritti, setLoadingIscritti] = useState(false);
  const [searchIscritto, setSearchIscritto] = useState('');

  // Form Evento
  const [showEventoForm, setShowEventoForm] = useState(false);
  const [editingEventoId, setEditingEventoId] = useState<number | null>(null);
  const [eventoForm, setEventoForm] = useState(EMPTY_EVENTO);
  const [savingEvento, setSavingEvento] = useState(false);

  // Form Uscita
  const [showUscitaForm, setShowUscitaForm] = useState(false);
  const [editingUscitaId, setEditingUscitaId] = useState<number | null>(null);
  const [uscitaForm, setUscitaForm] = useState(EMPTY_USCITA);
  const [savingUscita, setSavingUscita] = useState(false);

  // Upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGpx, setUploadingGpx] = useState(false);

  const [todayIso, setTodayIso] = useState('');

  useEffect(() => {
    const oggi = new Date();
    const anno = oggi.getFullYear();
    const mese = String(oggi.getMonth() + 1).padStart(2, '0');
    const giorno = String(oggi.getDate()).padStart(2, '0');
    setTodayIso(`${anno}-${mese}-${giorno}`);
  }, []);

  function notify(type: 'ok' | 'err', text: string) {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  }

  const loadAllData = useCallback(async () => {
    const [evRes, usRes] = await Promise.all([
      supabase.from('eventi_speciali').select('*').order('data_fine', { ascending: false }),
      supabase.from('uscite').select('*').order('iso_date', { ascending: false })
    ]);

    if (evRes.data) {
      const list = evRes.data as EventoDB[];
      setEventi(list);
      setSelectedEventoIdForIscritti(prev => prev ?? (list[0]?.id || null));
    }
    if (usRes.data) {
      setUscite(usRes.data as UscitaDB[]);
    }
  }, []);

  const loadIscritti = useCallback(async (eventoId: number) => {
    setLoadingIscritti(true);
    const { data, error } = await supabase
      .from('iscrizioni_eventi')
      .select('*')
      .eq('evento_id', eventoId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setIscritti(data as IscrizioneDB[]);
    }
    setLoadingIscritti(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      loadAllData();
    }
  }, [session, loadAllData]);

  useEffect(() => {
    if (session && selectedEventoIdForIscritti) {
      loadIscritti(selectedEventoIdForIscritti);
    }
  }, [session, selectedEventoIdForIscritti, loadIscritti]);

  // --- AUTENTICAZIONE ---
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    setLoginLoading(false);
    if (error) {
      setLoginError('Credenziali non valide o utente non autorizzato.');
    } else {
      setPassword('');
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  // --- UPLOAD MEDIA SU SUPABASE STORAGE ---
  async function handleImageUpload(file: File, target: 'evento' | 'uscita') {
    setUploadingImage(true);
    try {
      const { blob, ext, contentType } = await compressImageFile(file);
      const folder = target === 'evento' ? 'eventi' : 'uscite';
      const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from('ripido-media')
        .upload(filePath, blob, { contentType, upsert: false });

      if (upErr) {
        notify('err', `Errore upload foto: ${upErr.message}`);
        setUploadingImage(false);
        return;
      }

      const { data } = supabase.storage.from('ripido-media').getPublicUrl(filePath);
      if (target === 'evento') {
        setEventoForm(prev => ({ ...prev, immagine_url: data.publicUrl }));
      } else {
        setUscitaForm(prev => ({ ...prev, immagine_url: data.publicUrl }));
      }
      notify('ok', 'Foto ottimizzata e caricata!');
    } catch {
      notify('err', 'Impossibile elaborare l\'immagine selezionata.');
    }
    setUploadingImage(false);
  }

  async function handleGpxUpload(file: File) {
    setUploadingGpx(true);
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `gpx/${Date.now()}-${cleanName}`;

    const { error } = await supabase.storage
      .from('ripido-media')
      .upload(filePath, file, { contentType: 'application/gpx+xml', upsert: false });

    if (error) {
      notify('err', `Errore upload GPX: ${error.message}`);
    } else {
      const { data } = supabase.storage.from('ripido-media').getPublicUrl(filePath);
      setUscitaForm(prev => ({ ...prev, gpx_url: data.publicUrl }));
      notify('ok', 'Traccia GPX caricata!');
    }
    setUploadingGpx(false);
  }

  // --- AZIONI EVENTI SPECIALI ---
  function openNewEvento() {
    setEditingEventoId(null);
    setEventoForm(EMPTY_EVENTO);
    setShowEventoForm(true);
  }

  function openEditEvento(ev: EventoDB) {
    setEditingEventoId(ev.id);
    setEventoForm({
      titolo: ev.titolo,
      data_testo: ev.data_testo,
      data_fine: ev.data_fine,
      luogo: ev.luogo,
      prezzo: ev.prezzo,
      posti_reali: String(ev.posti_reali),
      capienza_gruppo: String(ev.capienza_gruppo),
      stato_iscrizioni: ev.stato_iscrizioni,
      whatsapp_invite_url: ev.whatsapp_invite_url || '',
      album_url: ev.album_url || '',
      immagine_url: ev.immagine_url,
      descrizione: ev.descrizione
    });
    setShowEventoForm(true);
  }

  async function handleSaveEvento(e: React.FormEvent) {
    e.preventDefault();
    if (!eventoForm.immagine_url.trim()) {
      notify('err', 'Carica una foto o inserisci un URL immagine per l\'evento.');
      return;
    }
    setSavingEvento(true);

    const payload = {
      titolo: eventoForm.titolo.trim(),
      data_testo: eventoForm.data_testo.trim(),
      data_fine: eventoForm.data_fine,
      luogo: eventoForm.luogo.trim(),
      prezzo: eventoForm.prezzo.trim(),
      posti_reali: Math.max(1, parseInt(eventoForm.posti_reali, 10) || 15),
      capienza_gruppo: Math.max(1, parseInt(eventoForm.capienza_gruppo, 10) || 20),
      stato_iscrizioni: eventoForm.stato_iscrizioni,
      whatsapp_invite_url: eventoForm.whatsapp_invite_url.trim() || null,
      album_url: eventoForm.album_url.trim() || null,
      immagine_url: eventoForm.immagine_url.trim(),
      descrizione: eventoForm.descrizione.trim()
    };

    const { error } = editingEventoId
      ? await supabase.from('eventi_speciali').update(payload).eq('id', editingEventoId)
      : await supabase.from('eventi_speciali').insert([payload]);

    setSavingEvento(false);
    if (error) {
      notify('err', `Errore salvataggio evento: ${error.message}`);
      return;
    }

    setShowEventoForm(false);
    notify('ok', editingEventoId ? 'Evento aggiornato!' : 'Nuovo evento pubblicato!');
    await loadAllData();
  }

  async function handleQuickStatoEvento(eventoId: number, nuovoStato: 'aperte' | 'sold_out' | 'chiuso') {
    const { error } = await supabase
      .from('eventi_speciali')
      .update({ stato_iscrizioni: nuovoStato })
      .eq('id', eventoId);

    if (error) {
      notify('err', 'Impossibile aggiornare lo stato.');
      return;
    }
    setEventi(prev => prev.map(ev => (ev.id === eventoId ? { ...ev, stato_iscrizioni: nuovoStato } : ev)));
    notify('ok', `Stato aggiornato a: ${nuovoStato.replace('_', ' ').toUpperCase()}`);
  }

  async function handleDeleteEvento(ev: EventoDB) {
    if (!window.confirm(`Eliminare definitivamente "${ev.titolo}" e tutta la lista dei suoi iscritti?`)) return;
    const { error } = await supabase.from('eventi_speciali').delete().eq('id', ev.id);
    if (error) {
      notify('err', `Errore eliminazione: ${error.message}`);
    } else {
      notify('ok', 'Evento eliminato.');
      await loadAllData();
    }
  }

  // --- AZIONI ISCRITTI ---
  async function handleStatoIscritto(iscrittoId: number, nuovoStato: 'inviato' | 'confermato' | 'ritirato') {
    const { error } = await supabase
      .from('iscrizioni_eventi')
      .update({ stato: nuovoStato })
      .eq('id', iscrittoId);

    if (error) {
      notify('err', 'Errore aggiornamento stato iscritto.');
      return;
    }

    setIscritti(prev => prev.map(i => (i.id === iscrittoId ? { ...i, stato: nuovoStato } : i)));
    await loadAllData();
  }

  async function handleDeleteIscritto(iscritto: IscrizioneDB) {
    if (!window.confirm(`Rimuovere definitivamente ${iscritto.nome} ${iscritto.cognome} dalla lista?`)) return;
    const { error } = await supabase.from('iscrizioni_eventi').delete().eq('id', iscritto.id);
    if (!error) {
      setIscritti(prev => prev.filter(i => i.id !== iscritto.id));
      await loadAllData();
      notify('ok', 'Iscritto rimosso.');
    }
  }

  // --- AZIONI USCITE ---
  function openNewUscita() {
    setEditingUscitaId(null);
    setUscitaForm(EMPTY_USCITA);
    setShowUscitaForm(true);
  }

  function openEditUscita(u: UscitaDB) {
    setEditingUscitaId(u.id);
    setUscitaForm({
      titolo: u.titolo,
      iso_date: u.iso_date,
      data_testo: u.data_testo,
      regione: u.regione,
      livello: u.livello,
      d_plus: u.d_plus,
      km: u.km,
      tempo_stimato: u.tempo_stimato || '',
      guide: u.guide,
      max_partecipanti: u.max_partecipanti ? String(u.max_partecipanti) : '',
      pernottamento: u.pernottamento || 'No',
      tipologia: u.tipologia || '',
      punto_partenza: u.punto_partenza || '',
      punto_arrivo: u.punto_arrivo || '',
      whatsapp_url: u.whatsapp_url || '',
      gpx_url: u.gpx_url || '',
      immagine_url: u.immagine_url
    });
    setShowUscitaForm(true);
  }

  async function handleSaveUscita(e: React.FormEvent) {
    e.preventDefault();
    if (!uscitaForm.immagine_url.trim()) {
      notify('err', 'Carica una foto o inserisci un URL immagine per l\'uscita.');
      return;
    }
    setSavingUscita(true);

    const payload = {
      titolo: uscitaForm.titolo.trim(),
      iso_date: uscitaForm.iso_date,
      data_testo: uscitaForm.data_testo.trim() || formatIsoToItalian(uscitaForm.iso_date),
      regione: uscitaForm.regione,
      livello: uscitaForm.livello.trim(),
      d_plus: uscitaForm.d_plus.trim(),
      km: uscitaForm.km.trim(),
      tempo_stimato: uscitaForm.tempo_stimato.trim() || null,
      guide: uscitaForm.guide.trim(),
      max_partecipanti: uscitaForm.max_partecipanti ? parseInt(uscitaForm.max_partecipanti, 10) : null,
      pernottamento: uscitaForm.pernottamento.trim() || 'No',
      tipologia: uscitaForm.tipologia.trim() || null,
      punto_partenza: uscitaForm.punto_partenza.trim() || null,
      punto_arrivo: uscitaForm.punto_arrivo.trim() || null,
      whatsapp_url: uscitaForm.whatsapp_url.trim() || null,
      gpx_url: uscitaForm.gpx_url.trim() || null,
      immagine_url: uscitaForm.immagine_url.trim()
    };

    const { error } = editingUscitaId
      ? await supabase.from('uscite').update(payload).eq('id', editingUscitaId)
      : await supabase.from('uscite').insert([payload]);

    setSavingUscita(false);
    if (error) {
      notify('err', `Errore salvataggio uscita: ${error.message}`);
      return;
    }

    setShowUscitaForm(false);
    notify('ok', editingUscitaId ? 'Uscita aggiornata!' : 'Nuova uscita pubblicata!');
    await loadAllData();
  }

  async function handleDeleteUscita(u: UscitaDB) {
    if (!window.confirm(`Eliminare definitivamente l'uscita "${u.titolo}"?`)) return;
    const { error } = await supabase.from('uscite').delete().eq('id', u.id);
    if (!error) {
      notify('ok', 'Uscita eliminata.');
      await loadAllData();
    }
  }

  const activeEventoForIscritti = eventi.find(e => e.id === selectedEventoIdForIscritti) || null;
  const countConfermati = iscritti.filter(i => i.stato === 'confermato').length;
  const countInviati = iscritti.filter(i => i.stato === 'inviato').length;
  const countRitirati = iscritti.filter(i => i.stato === 'ritirato').length;

  const iscrittiFiltrati = iscritti.filter(i => {
    if (!searchIscritto.trim()) return true;
    const q = searchIscritto.toLowerCase();
    return (
      i.nome.toLowerCase().includes(q) ||
      i.cognome.toLowerCase().includes(q) ||
      i.telefono.toLowerCase().includes(q)
    );
  });

  return (
    <main style={{ position: 'relative', width: '100%', minHeight: '100dvh', color: 'white', padding: '32px 20px 80px' }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1,
        backgroundImage: 'url("/topografia.png")', backgroundSize: '400px', backgroundRepeat: 'repeat', opacity: 0.12
      }} />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#0a0a0a', zIndex: -2 }} />

      <style>{`
        .adm-wrap { max-width: 1080px; margin: 0 auto; }
        .adm-card {
          background: rgba(20, 20, 20, 0.78);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 18px;
          padding: 20px;
          margin-bottom: 16px;
        }
        .adm-tabs {
          display: flex; gap: 10px; flex-wrap: wrap;
          padding: 14px; border-radius: 18px; margin-bottom: 28px;
          background: rgba(20, 20, 20, 0.7); border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .adm-tab {
          padding: 10px 18px; border-radius: 99px; font-size: 12px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em; cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.18); background: transparent; color: #ccc;
          transition: all 0.2s;
        }
        .adm-tab.active {
          background: rgb(223, 254, 2); color: black; border-color: rgb(223, 254, 2);
        }
        .adm-btn-primary {
          background: rgb(223, 254, 2); color: black; border: none;
          padding: 11px 22px; border-radius: 99px; font-size: 12px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.06em; cursor: pointer;
        }
        .adm-btn-ghost {
          background: rgba(255, 255, 255, 0.05); color: #ddd;
          border: 1px solid rgba(255, 255, 255, 0.18);
          padding: 9px 16px; border-radius: 99px; font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.06em; cursor: pointer;
        }
        .adm-btn-danger {
          background: rgba(239, 68, 68, 0.12); color: #ff6b6b;
          border: 1px solid rgba(239, 68, 68, 0.35);
          padding: 9px 14px; border-radius: 99px; font-size: 11px; font-weight: 700;
          text-transform: uppercase; cursor: pointer;
        }
        .adm-input, .adm-select, .adm-textarea {
          width: 100%; box-sizing: border-box;
          background: rgba(0, 0, 0, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 12px; padding: 11px 14px; color: white;
          font-size: 0.92rem; outline: none; font-family: inherit;
        }
        .adm-input:focus, .adm-select:focus, .adm-textarea:focus {
          border-color: rgb(223, 254, 2);
        }
        .adm-label {
          display: block; font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: #aaa; margin-bottom: 6px;
        }
        .adm-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .adm-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 14px; }
        .adm-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
        .state-pill {
          padding: 6px 12px; border-radius: 99px; font-size: 11px; font-weight: 700;
          text-transform: uppercase; cursor: pointer; border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.04); color: #999; transition: all 0.15s;
        }
        .state-pill.active-green { background: rgba(34, 197, 94, 0.2); border-color: #22c55e; color: #4ade80; }
        .state-pill.active-yellow { background: rgba(234, 179, 8, 0.2); border-color: #eab308; color: #facc15; }
        .state-pill.active-red { background: rgba(239, 68, 68, 0.2); border-color: #ef4444; color: #ff6b6b; }
        .state-pill.active-gray { background: rgba(255, 255, 255, 0.16); border-color: #aaa; color: white; }

        @media (max-width: 768px) {
          .adm-grid-2, .adm-grid-3 { grid-template-columns: 1fr; }
          .adm-grid-4 { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* Toast di notifica */}
      {feedback && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 2000,
          backgroundColor: feedback.type === 'ok' ? 'rgb(223, 254, 2)' : '#ef4444',
          color: feedback.type === 'ok' ? 'black' : 'white',
          padding: '12px 20px', borderRadius: '14px', fontWeight: 800, fontSize: '0.88rem',
          boxShadow: '0 12px 30px rgba(0,0,0,0.6)'
        }}>
          {feedback.text}
        </div>
      )}

      <div className="adm-wrap">
        {authChecking ? (
          <div style={{ padding: '80px 0', textAlign: 'center', color: '#888' }}>Verifica sessione...</div>
        ) : !session ? (
          /* SCHERMATA LOGIN ADMIN */
          <div style={{ maxWidth: '420px', margin: '60px auto' }}>
            <div style={{ marginBottom: '24px' }}>
              <Link href="/" style={{ color: 'rgb(223, 254, 2)', textDecoration: 'none', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                &larr; Torna al sito
              </Link>
            </div>
            <div className="adm-card" style={{ padding: '30px' }}>
              <div style={{ color: 'rgb(223, 254, 2)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '8px' }}>
                Area Riservata
              </div>
              <h1 style={{ margin: '0 0 22px 0', fontSize: '1.8rem', fontWeight: 800 }}>
                Admin <span style={{ color: 'rgb(223, 254, 2)' }}>Ripido</span>
              </h1>

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '14px' }}>
                  <label className="adm-label">Email Admin</label>
                  <input
                    type="email"
                    required
                    className="adm-input"
                    placeholder="nome@dominio.it"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label className="adm-label">Password</label>
                  <input
                    type="password"
                    required
                    className="adm-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>

                {loginError && (
                  <div style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '14px', fontWeight: 600 }}>
                    {loginError}
                  </div>
                )}

                <button type="submit" disabled={loginLoading} className="adm-btn-primary" style={{ width: '100%', padding: '13px' }}>
                  {loginLoading ? 'Accesso in corso...' : 'Accedi al Pannello'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* PANNELLO OPERATIVO LOGGATO */
          <>
            {/* Topbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '26px' }}>
              <div>
                <Link href="/" style={{ color: 'rgb(223, 254, 2)', textDecoration: 'none', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  &larr; Vedi Sito Pubblico
                </Link>
                <h1 style={{ margin: '6px 0 0 0', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800 }}>
                  Back Office <span style={{ color: 'rgb(223, 254, 2)' }}>Ripido</span>
                </h1>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', color: '#888' }}>{session.user.email}</span>
                <button onClick={handleLogout} className="adm-btn-ghost">Esci</button>
              </div>
            </div>

            {/* Navigazione Tab */}
            <div className="adm-tabs">
              <button
                className={`adm-tab ${activeSection === 'eventi' ? 'active' : ''}`}
                onClick={() => setActiveSection('eventi')}
              >
                Eventi Speciali ({eventi.length})
              </button>
              <button
                className={`adm-tab ${activeSection === 'iscritti' ? 'active' : ''}`}
                onClick={() => setActiveSection('iscritti')}
              >
                Iscritti Eventi
              </button>
              <button
                className={`adm-tab ${activeSection === 'uscite' ? 'active' : ''}`}
                onClick={() => setActiveSection('uscite')}
              >
                Prossime Uscite ({uscite.length})
              </button>
            </div>

            {/* ==================== SEZIONE 1: EVENTI SPECIALI ==================== */}
            {activeSection === 'eventi' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Gestione Eventi Speciali</h2>
                  <button onClick={openNewEvento} className="adm-btn-primary">+ Nuovo Evento</button>
                </div>

                {eventi.map(ev => {
                  const isPast = ev.data_fine < todayIso;
                  return (
                    <div key={ev.id} className="adm-card" style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', minWidth: '260px', flex: 1 }}>
                        <img src={ev.immagine_url} alt={ev.titolo} style={{ width: '68px', height: '85px', objectFit: 'cover', borderRadius: '12px', flexShrink: 0 }} />
                        <div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', color: 'rgb(223, 254, 2)', fontWeight: 700, textTransform: 'uppercase' }}>
                              {ev.data_testo}
                            </span>
                            {isPast && (
                              <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '99px', color: '#aaa', textTransform: 'uppercase' }}>
                                Passato
                              </span>
                            )}
                          </div>
                          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem' }}>{ev.titolo}</h3>
                          <div style={{ fontSize: '12px', color: '#999' }}>
                            {ev.luogo} • {ev.prezzo} • Barra: <strong style={{ color: 'white' }}>{ev.iscritti_attivi}/{ev.capienza_gruppo}</strong> (Posti reali: {ev.posti_reali})
                          </div>
                        </div>
                      </div>

                      {/* Controlli rapidi Stato a 1 Click + Azioni */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button
                            className={`state-pill ${ev.stato_iscrizioni === 'aperte' ? 'active-green' : ''}`}
                            onClick={() => handleQuickStatoEvento(ev.id, 'aperte')}
                          >
                            Aperte
                          </button>
                          <button
                            className={`state-pill ${ev.stato_iscrizioni === 'sold_out' ? 'active-red' : ''}`}
                            onClick={() => handleQuickStatoEvento(ev.id, 'sold_out')}
                          >
                            Sold Out
                          </button>
                          <button
                            className={`state-pill ${ev.stato_iscrizioni === 'chiuso' ? 'active-gray' : ''}`}
                            onClick={() => handleQuickStatoEvento(ev.id, 'chiuso')}
                          >
                            Chiuso
                          </button>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            className="adm-btn-ghost"
                            onClick={() => {
                              setSelectedEventoIdForIscritti(ev.id);
                              setActiveSection('iscritti');
                            }}
                          >
                            Lista Iscritti ({ev.iscritti_attivi}) &rarr;
                          </button>
                          <button className="adm-btn-ghost" onClick={() => openEditEvento(ev)}>Modifica</button>
                          <button className="adm-btn-danger" onClick={() => handleDeleteEvento(ev)}>Elimina</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ==================== SEZIONE 2: ISCRITTI EVENTI ==================== */}
            {activeSection === 'iscritti' && (
              <div>
                <div className="adm-grid-2" style={{ alignItems: 'end', marginBottom: '20px' }}>
                  <div>
                    <label className="adm-label">Seleziona Evento</label>
                    <select
                      className="adm-select"
                      value={selectedEventoIdForIscritti ?? ''}
                      onChange={e => setSelectedEventoIdForIscritti(Number(e.target.value))}
                    >
                      {eventi.map(ev => (
                        <option key={ev.id} value={ev.id} style={{ background: '#111' }}>
                          {ev.titolo} ({ev.data_testo})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="adm-label">Cerca per Nome o Telefono</label>
                    <input
                      type="text"
                      className="adm-input"
                      placeholder="Es. Marco o 340..."
                      value={searchIscritto}
                      onChange={e => setSearchIscritto(e.target.value)}
                    />
                  </div>
                </div>

                {activeEventoForIscritti && (
                  <div className="adm-grid-4">
                    <div className="adm-card" style={{ marginBottom: 0, textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>Confermati (Pagato)</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4ade80', marginTop: '4px' }}>
                        {countConfermati} / {activeEventoForIscritti.posti_reali}
                      </div>
                    </div>
                    <div className="adm-card" style={{ marginBottom: 0, textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>In attesa verifica</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#facc15', marginTop: '4px' }}>
                        {countInviati}
                      </div>
                    </div>
                    <div className="adm-card" style={{ marginBottom: 0, textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>Barra Sito</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'rgb(223, 254, 2)', marginTop: '4px' }}>
                        {countConfermati + countInviati} / {activeEventoForIscritti.capienza_gruppo}
                      </div>
                    </div>
                    <div className="adm-card" style={{ marginBottom: 0, textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>Ritirati / Non entrati</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#888', marginTop: '4px' }}>
                        {countRitirati}
                      </div>
                    </div>
                  </div>
                )}

                {loadingIscritti ? (
                  <div style={{ color: '#888', padding: '30px 0' }}>Caricamento iscritti...</div>
                ) : iscrittiFiltrati.length === 0 ? (
                  <div className="adm-card" style={{ color: '#888', textAlign: 'center', padding: '36px' }}>
                    Nessun iscritto trovato per questa selezione.
                  </div>
                ) : (
                  iscrittiFiltrati.map((iscritto) => {
                    const ordineOriginale = iscritti.findIndex(x => x.id === iscritto.id) + 1;
                    const dataOra = new Date(iscritto.created_at).toLocaleString('it-IT', {
                      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                    });

                    return (
                      <div
                        key={iscritto.id}
                        className="adm-card"
                        style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          flexWrap: 'wrap', gap: '14px', padding: '16px 20px',
                          opacity: iscritto.stato === 'ritirato' ? 0.55 : 1
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: 'rgb(223, 254, 2)', background: 'rgba(223,254,2,0.12)', padding: '2px 8px', borderRadius: '99px' }}>
                              #{ordineOriginale}
                            </span>
                            <strong style={{ fontSize: '1.05rem' }}>{iscritto.nome} {iscritto.cognome}</strong>
                            <span style={{ fontSize: '11px', color: '#777' }}>{dataOra}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.9rem', color: '#ccc' }}>
                            <span>{iscritto.telefono}</span>
                            <a
                              href={buildWaMeUrl(iscritto.telefono)}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'rgb(223, 254, 2)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', textDecoration: 'none' }}
                            >
                              Apri Chat WA &rarr;
                            </a>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <button
                            className={`state-pill ${iscritto.stato === 'inviato' ? 'active-yellow' : ''}`}
                            onClick={() => handleStatoIscritto(iscritto.id, 'inviato')}
                          >
                            Inviato
                          </button>
                          <button
                            className={`state-pill ${iscritto.stato === 'confermato' ? 'active-green' : ''}`}
                            onClick={() => handleStatoIscritto(iscritto.id, 'confermato')}
                          >
                            Confermato
                          </button>
                          <button
                            className={`state-pill ${iscritto.stato === 'ritirato' ? 'active-red' : ''}`}
                            onClick={() => handleStatoIscritto(iscritto.id, 'ritirato')}
                          >
                            Ritirato
                          </button>
                          <button
                            className="adm-btn-danger"
                            style={{ marginLeft: '6px', padding: '6px 10px' }}
                            onClick={() => handleDeleteIscritto(iscritto)}
                            title="Elimina riga"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ==================== SEZIONE 3: PROSSIME USCITE ==================== */}
            {activeSection === 'uscite' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Gestione Uscite</h2>
                  <button onClick={openNewUscita} className="adm-btn-primary">+ Nuova Uscita</button>
                </div>

                {uscite.map(u => {
                  const isPast = u.iso_date < todayIso;
                  return (
                    <div key={u.id} className="adm-card" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, minWidth: '250px' }}>
                        <img src={u.immagine_url} alt={u.titolo} style={{ width: '64px', height: '80px', objectFit: 'cover', borderRadius: '12px', flexShrink: 0 }} />
                        <div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', color: 'rgb(223, 254, 2)', fontWeight: 700, textTransform: 'uppercase' }}>
                              {u.data_testo} • {u.regione}
                            </span>
                            {isPast && (
                              <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '99px', color: '#aaa', textTransform: 'uppercase' }}>
                                Passata
                              </span>
                            )}
                          </div>
                          <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{u.titolo}</h3>
                          <div style={{ fontSize: '12px', color: '#999' }}>
                            Liv. {u.livello} • D+ {u.d_plus} • {u.km} • Admin: {u.guide} {u.gpx_url ? '• GPX ✓' : ''}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="adm-btn-ghost" onClick={() => openEditUscita(u)}>Modifica</button>
                        <button className="adm-btn-danger" onClick={() => handleDeleteUscita(u)}>Elimina</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* ==================== MODALE FORM EVENTO SPECIALE ==================== */}
      {showEventoForm && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1200, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}
          onClick={() => !savingEvento && setShowEventoForm(false)}
        >
          <div
            style={{ backgroundColor: '#121212', width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '22px', padding: '28px', border: '1px solid rgba(255,255,255,0.14)' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.4rem' }}>
              {editingEventoId ? 'Modifica Evento Speciale' : 'Nuovo Evento Speciale'}
            </h2>

            <form onSubmit={handleSaveEvento}>
              <div className="adm-grid-2">
                <div>
                  <label className="adm-label">Titolo Evento *</label>
                  <input type="text" required className="adm-input" placeholder="Es. Capodanno in Rifugio" value={eventoForm.titolo} onChange={e => setEventoForm({ ...eventoForm, titolo: e.target.value })} />
                </div>
                <div>
                  <label className="adm-label">Luogo *</label>
                  <input type="text" required className="adm-input" placeholder="Es. Rifugio Fuciade (Trentino)" value={eventoForm.luogo} onChange={e => setEventoForm({ ...eventoForm, luogo: e.target.value })} />
                </div>
              </div>

              <div className="adm-grid-3">
                <div>
                  <label className="adm-label">Data visibile sulla card *</label>
                  <input type="text" required className="adm-input" placeholder="Es. 31 Dic - 1 Gen" value={eventoForm.data_testo} onChange={e => setEventoForm({ ...eventoForm, data_testo: e.target.value })} />
                </div>
                <div>
                  <label className="adm-label">Data fine evento (archivio auto) *</label>
                  <input type="date" required className="adm-input" value={eventoForm.data_fine} onChange={e => setEventoForm({ ...eventoForm, data_fine: e.target.value })} />
                </div>
                <div>
                  <label className="adm-label">Quota spese *</label>
                  <input type="text" required className="adm-input" placeholder="Es. 80€" value={eventoForm.prezzo} onChange={e => setEventoForm({ ...eventoForm, prezzo: e.target.value })} />
                </div>
              </div>

              <div className="adm-grid-3">
                <div>
                  <label className="adm-label">Posti Reali Struttura *</label>
                  <input type="number" required min="1" className="adm-input" value={eventoForm.posti_reali} onChange={e => setEventoForm({ ...eventoForm, posti_reali: e.target.value })} />
                </div>
                <div>
                  <label className="adm-label">Capienza Gruppo / Barra *</label>
                  <input type="number" required min="1" className="adm-input" value={eventoForm.capienza_gruppo} onChange={e => setEventoForm({ ...eventoForm, capienza_gruppo: e.target.value })} />
                </div>
                <div>
                  <label className="adm-label">Stato Iscrizioni</label>
                  <select className="adm-select" value={eventoForm.stato_iscrizioni} onChange={e => setEventoForm({ ...eventoForm, stato_iscrizioni: e.target.value as 'aperte' | 'sold_out' | 'chiuso' })}>
                    <option value="aperte" style={{ background: '#111' }}>Aperte</option>
                    <option value="sold_out" style={{ background: '#111' }}>Sold Out</option>
                    <option value="chiuso" style={{ background: '#111' }}>Chiuso</option>
                  </select>
                </div>
              </div>

              <div className="adm-grid-2">
                <div>
                  <label className="adm-label">Link Invito Gruppo WhatsApp</label>
                  <input type="url" className="adm-input" placeholder="https://chat.whatsapp.com/..." value={eventoForm.whatsapp_invite_url} onChange={e => setEventoForm({ ...eventoForm, whatsapp_invite_url: e.target.value })} />
                </div>
                <div>
                  <label className="adm-label">Link Foto / Racconto (per eventi conclusi)</label>
                  <input type="url" className="adm-input" placeholder="https://..." value={eventoForm.album_url} onChange={e => setEventoForm({ ...eventoForm, album_url: e.target.value })} />
                </div>
              </div>

              {/* Upload Foto + Anteprima 4:5 */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px', marginBottom: '14px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                {eventoForm.immagine_url && (
                  <img src={eventoForm.immagine_url} alt="Anteprima" style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(223,254,2,0.4)' }} />
                )}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <label className="adm-label">Foto Copertina (ritaglio 4:5 automatico) *</label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    style={{ fontSize: '12px', color: '#ccc', marginBottom: '8px', display: 'block' }}
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) handleImageUpload(f, 'evento');
                    }}
                  />
                  <input
                    type="url"
                    className="adm-input"
                    placeholder="Oppure incolla URL immagine..."
                    value={eventoForm.immagine_url}
                    onChange={e => setEventoForm({ ...eventoForm, immagine_url: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="adm-label">Programma e Descrizione Completa *</label>
                <textarea rows={6} required className="adm-textarea" placeholder="Descrivi il programma dei giorni, cosa comprende la quota..." value={eventoForm.descrizione} onChange={e => setEventoForm({ ...eventoForm, descrizione: e.target.value })} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="adm-btn-ghost" onClick={() => setShowEventoForm(false)}>Annulla</button>
                <button type="submit" disabled={savingEvento || uploadingImage} className="adm-btn-primary">
                  {savingEvento ? 'Salvataggio...' : 'Salva Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODALE FORM USCITA ==================== */}
      {showUscitaForm && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1200, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}
          onClick={() => !savingUscita && setShowUscitaForm(false)}
        >
          <div
            style={{ backgroundColor: '#121212', width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '22px', padding: '28px', border: '1px solid rgba(255,255,255,0.14)' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.4rem' }}>
              {editingUscitaId ? 'Modifica Uscita' : 'Nuova Uscita'}
            </h2>

            <form onSubmit={handleSaveUscita}>
              <div className="adm-grid-2">
                <div>
                  <label className="adm-label">Titolo Escursione *</label>
                  <input type="text" required className="adm-input" placeholder="Es. Rifugio Tuckett e Casinei" value={uscitaForm.titolo} onChange={e => setUscitaForm({ ...uscitaForm, titolo: e.target.value })} />
                </div>
                <div>
                  <label className="adm-label">Regione *</label>
                  <select className="adm-select" value={uscitaForm.regione} onChange={e => setUscitaForm({ ...uscitaForm, regione: e.target.value })}>
                    {REGIONI_ITALIA.map(r => (
                      <option key={r} value={r} style={{ background: '#111' }}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="adm-grid-3">
                <div>
                  <label className="adm-label">Data Calendario *</label>
                  <input
                    type="date"
                    required
                    className="adm-input"
                    value={uscitaForm.iso_date}
                    onChange={e => {
                      const iso = e.target.value;
                      setUscitaForm(prev => ({
                        ...prev,
                        iso_date: iso,
                        data_testo: formatIsoToItalian(iso)
                      }));
                    }}
                  />
                </div>
                <div>
                  <label className="adm-label">Data Testo (modificabile) *</label>
                  <input type="text" required className="adm-input" placeholder="Sabato 5 Dicembre" value={uscitaForm.data_testo} onChange={e => setUscitaForm({ ...uscitaForm, data_testo: e.target.value })} />
                </div>
                <div>
                  <label className="adm-label">Admin / Referente *</label>
                  <input type="text" required className="adm-input" placeholder="Es. Matteo" value={uscitaForm.guide} onChange={e => setUscitaForm({ ...uscitaForm, guide: e.target.value })} />
                </div>
              </div>

              <div className="adm-grid-3">
                <div>
                  <label className="adm-label">Dislivello (D+) *</label>
                  <input type="text" required className="adm-input" placeholder="Es. 800m" value={uscitaForm.d_plus} onChange={e => setUscitaForm({ ...uscitaForm, d_plus: e.target.value })} />
                </div>
                <div>
                  <label className="adm-label">Lunghezza *</label>
                  <input type="text" required className="adm-input" placeholder="Es. 14km" value={uscitaForm.km} onChange={e => setUscitaForm({ ...uscitaForm, km: e.target.value })} />
                </div>
                <div>
                  <label className="adm-label">Difficoltà *</label>
                  <select className="adm-select" value={uscitaForm.livello} onChange={e => setUscitaForm({ ...uscitaForm, livello: e.target.value })}>
                    {['T', 'E', 'EE', 'EEA', 'EAI'].map(liv => (
                      <option key={liv} value={liv} style={{ background: '#111' }}>{liv}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="adm-grid-3">
                <div>
                  <label className="adm-label">Durata stimata</label>
                  <input type="text" className="adm-input" placeholder="Es. 4.5 h" value={uscitaForm.tempo_stimato} onChange={e => setUscitaForm({ ...uscitaForm, tempo_stimato: e.target.value })} />
                </div>
                <div>
                  <label className="adm-label">Max Partecipanti (opz.)</label>
                  <input type="number" min="1" className="adm-input" placeholder="Es. 15" value={uscitaForm.max_partecipanti} onChange={e => setUscitaForm({ ...uscitaForm, max_partecipanti: e.target.value })} />
                </div>
                <div>
                  <label className="adm-label">Tipologia percorso</label>
                  <input type="text" className="adm-input" placeholder="Anello / Andata e ritorno" value={uscitaForm.tipologia} onChange={e => setUscitaForm({ ...uscitaForm, tipologia: e.target.value })} />
                </div>
              </div>

              <div className="adm-grid-3">
                <div>
                  <label className="adm-label">Punto di partenza</label>
                  <input type="text" className="adm-input" placeholder="Es. Vallesinella" value={uscitaForm.punto_partenza} onChange={e => setUscitaForm({ ...uscitaForm, punto_partenza: e.target.value })} />
                </div>
                <div>
                  <label className="adm-label">Punto di arrivo</label>
                  <input type="text" className="adm-input" placeholder="Es. Vallesinella" value={uscitaForm.punto_arrivo} onChange={e => setUscitaForm({ ...uscitaForm, punto_arrivo: e.target.value })} />
                </div>
                <div>
                  <label className="adm-label">Pernottamento</label>
                  <input type="text" className="adm-input" placeholder="No / Sì (Rif. ...)" value={uscitaForm.pernottamento} onChange={e => setUscitaForm({ ...uscitaForm, pernottamento: e.target.value })} />
                </div>
              </div>

              <div className="adm-grid-2">
                <div>
                  <label className="adm-label">Link Gruppo WhatsApp Uscita</label>
                  <input type="url" className="adm-input" placeholder="https://chat.whatsapp.com/..." value={uscitaForm.whatsapp_url} onChange={e => setUscitaForm({ ...uscitaForm, whatsapp_url: e.target.value })} />
                </div>
                <div>
                  <label className="adm-label">Traccia GPX (per uscite passate)</label>
                  <input
                    type="file"
                    accept=".gpx,application/gpx+xml"
                    disabled={uploadingGpx}
                    style={{ fontSize: '11px', color: '#ccc', marginBottom: '6px', display: 'block' }}
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) handleGpxUpload(f);
                    }}
                  />
                  <input type="url" className="adm-input" placeholder="Oppure URL file .gpx" value={uscitaForm.gpx_url} onChange={e => setUscitaForm({ ...uscitaForm, gpx_url: e.target.value })} />
                </div>
              </div>

              {/* Upload Foto + Anteprima 4:5 */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                {uscitaForm.immagine_url && (
                  <img src={uscitaForm.immagine_url} alt="Anteprima" style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(223,254,2,0.4)' }} />
                )}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <label className="adm-label">Foto Copertina (ritaglio 4:5 automatico) *</label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    style={{ fontSize: '12px', color: '#ccc', marginBottom: '8px', display: 'block' }}
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) handleImageUpload(f, 'uscita');
                    }}
                  />
                  <input
                    type="url"
                    className="adm-input"
                    placeholder="Oppure incolla URL immagine..."
                    value={uscitaForm.immagine_url}
                    onChange={e => setUscitaForm({ ...uscitaForm, immagine_url: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="adm-btn-ghost" onClick={() => setShowUscitaForm(false)}>Annulla</button>
                <button type="submit" disabled={savingUscita || uploadingImage || uploadingGpx} className="adm-btn-primary">
                  {savingUscita ? 'Salvataggio...' : 'Salva Uscita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
