import { Trash2 } from 'lucide-react';
import EditorialFrame from '../../components/EditorialFrame';
import { Field, TextInput, TextArea, UploadButton, cardCls, IMG_ACCEPT } from '../adminUi';

export default function ProfileTab({ draft, setDraft, isDark, notify }) {
  const setHero = (patch) => setDraft({ ...draft, hero: { ...draft.hero, ...patch } });
  const setAbout = (patch) => setDraft({ ...draft, about: { ...draft.about, ...patch } });
  const setEdu = (patch) => setAbout({ education: { ...draft.about.education, ...patch } });

  const photoCard = (title, src, color, folder, onUploaded, onRemove, okMsg) => (
    <div className={cardCls(isDark, 'bg-[#FFF9F0] border-[#CFE3F2]')}>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">{title}</label>
      <div className="mb-3 rounded-xl overflow-hidden h-44"><EditorialFrame src={src} isDark={isDark} aspectClass="h-full" /></div>
      <div className="flex items-center gap-2">
        <UploadButton folder={folder} accept={IMG_ACCEPT} notify={notify} className={`flex-1 justify-center ${color} text-[#2C2520]`} onUploaded={([r]) => { onUploaded(r); notify(okMsg); }}>
          Unggah / Ganti Foto
        </UploadButton>
        {src && <button onClick={onRemove} aria-label="Hapus foto" className="p-2 rounded-xl bg-rose-500/15 text-rose-500"><Trash2 className="w-4 h-4" /></button>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h4 className="font-editorial text-2xl font-semibold">Profil Utama, Tentang Saya & Pendidikan</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {photoCard('Foto Profil Utama (Hero)', draft.hero.profileImage, 'bg-[#DCEAF4]', 'profile',
          (r) => setHero({ profileImage: r.url, profileImagePath: r.path }),
          () => setHero({ profileImage: '', profileImagePath: '' }),
          'Foto profil terunggah. Klik Simpan Semua Perubahan.')}
        {photoCard('Foto Section About Me', draft.about.aboutImage, 'bg-[#F3DDE3]', 'about',
          (r) => setAbout({ aboutImage: r.url, aboutImagePath: r.path }),
          () => setAbout({ aboutImage: '', aboutImagePath: '' }),
          'Foto About Me terunggah. Klik Simpan Semua Perubahan.')}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nama Lengkap"><TextInput isDark={isDark} value={draft.hero.name} onChange={(v) => setHero({ name: v })} /></Field>
        <Field label="Caption Foto Profil"><TextInput isDark={isDark} value={draft.hero.profileCaption} onChange={(v) => setHero({ profileCaption: v })} /></Field>
      </div>
      <Field label="Headline Hero"><TextInput isDark={isDark} value={draft.hero.headline} onChange={(v) => setHero({ headline: v })} /></Field>
      <Field label="Deskripsi Hero"><TextArea rows={2} isDark={isDark} value={draft.hero.description} onChange={(v) => setHero({ description: v })} /></Field>
      <Field label="Deskripsi About Me"><TextArea rows={4} isDark={isDark} value={draft.about.description} onChange={(v) => setAbout({ description: v })} /></Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Field label="Universitas"><TextInput isDark={isDark} value={draft.about.education.university} onChange={(v) => setEdu({ university: v })} /></Field>
        <Field label="Program Studi"><TextInput isDark={isDark} value={draft.about.education.major} onChange={(v) => setEdu({ major: v })} /></Field>
        <Field label="Periode Studi"><TextInput isDark={isDark} value={draft.about.education.period} onChange={(v) => setEdu({ period: v })} /></Field>
      </div>
    </div>
  );
}
