import { useEffect, useState } from 'react';
import { Lock, Save, LogOut, X } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { savePortfolio } from '../lib/portfolioService';
import ProfileTab from './tabs/ProfileTab';
import ExperienceTab from './tabs/ExperienceTab';
import OrganizationTab from './tabs/OrganizationTab';
import ProjectsTab from './tabs/ProjectsTab';
import VerticalTab from './tabs/VerticalTab';
import ContactTab from './tabs/ContactTab';

const TABS = [
  { id: 'profile', label: 'Profil & Pendidikan', Comp: ProfileTab },
  { id: 'experience', label: 'Pengalaman Kerja', Comp: ExperienceTab },
  { id: 'organization', label: 'Organisasi & Galeri', Comp: OrganizationTab },
  { id: 'projects', label: 'Projects & Dokumentasi', Comp: ProjectsTab },
  { id: 'vertical', label: 'Vertical Typography', Comp: VerticalTab },
  { id: 'contact', label: 'Kontak & Link', Comp: ContactTab },
];

function LoginGate({ isDark, auth, session }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const field = `w-full px-4 py-3.5 rounded-2xl border text-sm focus:outline-none ${isDark ? 'bg-[#202F46] border-[#293A52] text-[#E1E5EB]' : 'bg-[#FFF9F0] border-[#CFE3F2] text-[#2C2520]'}`;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try { await auth.signIn(email.trim(), password); } catch (err) { setError(err.message); }
    setBusy(false);
  };

  return (
    <div className="p-8 sm:p-14 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${isDark ? 'bg-[#202F46] text-[#C5A56A]' : 'bg-[#F3DDE3] text-[#2C2520]'}`}><Lock className="w-7 h-7" /></div>
      <h4 className="font-editorial text-3xl font-semibold mb-2">Admin Studio Login</h4>

      {!isSupabaseConfigured ? (
        <p className="text-sm text-rose-500">Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env.local (lihat README).</p>
      ) : session && !auth.isAdmin ? (
        <>
          <p className="text-sm text-rose-500 mb-4">Akun ini berhasil login, tetapi belum terdaftar sebagai admin di tabel admin_users.</p>
          <button onClick={auth.signOut} className="text-sm underline">Keluar</button>
        </>
      ) : (
        <>
          <p className={`text-sm mb-6 ${isDark ? 'text-[#C7CED8]' : 'text-[#5A514B]'}`}>Masuk dengan akun admin untuk mengelola foto profil, pengalaman kerja, organisasi, project, dan galeri vertikal.</p>
          <form onSubmit={submit} className="w-full space-y-4">
            <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email admin" className={field} />
            <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={field} />
            {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
            <button type="submit" disabled={busy} className={`w-full py-3.5 rounded-full text-sm font-semibold transition-all disabled:opacity-60 ${isDark ? 'bg-[#C5A56A] text-[#17243A]' : 'bg-[#2C2520] text-[#FFF9F0]'}`}>
              {busy ? 'Memeriksa...' : 'Masuk ke Dashboard Admin'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default function AdminDashboard({ data, seeded, isDark, auth, initialTab = 'profile', onClose, onSaved, notify }) {
  const [tab, setTab] = useState(initialTab);
  const [draft, setDraft] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => setTab(initialTab), [initialTab]);
  // Draft diambil sekali saat admin terautentikasi (agar update realtime tidak menimpa editan)
  useEffect(() => { if (!auth.isAdmin) setDraft(null); }, [auth.isAdmin]);

  const save = async () => {
    setIsSaving(true);
    try {
      await savePortfolio(draft, seeded ? data : null);
      await onSaved();
      setDraft(null); // dimuat ulang dari database (id baru, dsb.)
      notify('Seluruh perubahan berhasil disimpan dan tersinkron ke website!');
    } catch (err) {
      console.error(err);
      notify(`Gagal menyimpan: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  // Draft diisi dari data terbaru saat admin masuk / setelah simpan
  useEffect(() => { if (auth.isAdmin && !draft) setDraft(JSON.parse(JSON.stringify(data))); }, [data, draft, auth.isAdmin]);

  const ActiveTab = TABS.find((t) => t.id === tab)?.Comp ?? ProfileTab;

  return (
    <div className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className={`w-full max-w-5xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${isDark ? 'bg-[#17243A] border-[#C5A56A]/50 text-[#E1E5EB]' : 'bg-[#FFFCF8] border-[#CFE3F2] text-[#2C2520]'}`}>
        <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'bg-[#202F46] border-[#293A52]' : 'bg-[#DCEAF4] border-[#CFE3F2]'}`}>
          <div className="flex items-center gap-3">
            <Lock className={`w-5 h-5 ${isDark ? 'text-[#C5A56A]' : 'text-[#2C2520]'}`} />
            <div>
              <h3 className="font-editorial text-xl font-bold leading-none">Studio Content & Media Manager</h3>
              <span className="text-[11px] opacity-75">Sabila Alifia Sundawa — Supabase Cloud Sync</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {auth.isAdmin && (
              <>
                <button onClick={save} disabled={isSaving || !draft} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all disabled:opacity-60 ${isDark ? 'bg-[#C5A56A] text-[#17243A] hover:bg-[#D8C49A]' : 'bg-[#2C2520] text-[#FFF9F0] hover:opacity-90'}`}>
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}</span>
                </button>
                <button onClick={auth.signOut} title="Keluar" aria-label="Keluar" className="p-2 rounded-full border border-current/20 hover:bg-black/10"><LogOut className="w-4 h-4" /></button>
              </>
            )}
            <button onClick={onClose} aria-label="Tutup dashboard" className="p-2 rounded-full border border-current/20 hover:bg-black/10"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {!auth.isAdmin || !draft ? (
          auth.checking ? <p className="p-10 text-center text-sm">Memeriksa sesi...</p> : <LoginGate isDark={isDark} auth={auth} session={auth.session} />
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <div className={`w-full md:w-56 p-3 border-b md:border-b-0 md:border-r flex md:flex-col gap-1.5 overflow-x-auto shrink-0 ${isDark ? 'bg-[#202F46]/60 border-[#293A52]' : 'bg-[#FFF9F0] border-[#CFE3F2]'}`}>
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2.5 rounded-xl text-xs font-semibold text-left whitespace-nowrap transition-colors ${tab === t.id ? (isDark ? 'bg-[#C5A56A] text-[#17243A]' : 'bg-[#DCEAF4] text-[#2C2520]') : 'hover:bg-black/5 opacity-80'}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-6">
              {!seeded && (
                <p className={`text-xs p-3 rounded-xl border ${isDark ? 'border-[#C5A56A]/40 text-[#D8C49A]' : 'border-[#F5E9BE] bg-[#FAF0D8]'}`}>
                  Database masih kosong — yang tampil adalah konten awal. Klik “Simpan Semua Perubahan” untuk menyimpannya ke Supabase.
                </p>
              )}
              <ActiveTab draft={draft} setDraft={setDraft} isDark={isDark} notify={notify} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
