import { Trash2, ChevronUp, ChevronDown, Upload } from 'lucide-react';
import EditorialFrame from '../../components/EditorialFrame';
import { Field, TextInput, TextArea, UploadButton, cardCls, MEDIA_ACCEPT } from '../adminUi';

export default function OrganizationTab({ draft, setDraft, isDark, notify }) {
  const org = draft.organizations;
  const setOrg = (patch) => setDraft({ ...draft, organizations: { ...org, ...patch } });
  const gallery = org.gallery || [];
  const setGallery = (g) => setOrg({ gallery: g });
  const swap = (idx, dir) => { const n = [...gallery]; [n[idx + dir], n[idx]] = [n[idx], n[idx + dir]]; setGallery(n); };

  return (
    <div className="space-y-6">
      <h4 className="font-editorial text-2xl font-semibold">Organisasi, Kepemimpinan & Galeri Kegiatan</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`${cardCls(isDark)} space-y-3`}>
          <span className="text-xs font-bold uppercase">HIMMA</span>
          <Field label="Nama Organisasi"><TextInput isDark={isDark} inner value={org.himma.name} onChange={(v) => setOrg({ himma: { ...org.himma, name: v } })} /></Field>
          <Field label="Peran / Divisi"><TextInput isDark={isDark} inner value={org.himma.role} onChange={(v) => setOrg({ himma: { ...org.himma, role: v } })} /></Field>
          <Field label="Deskripsi"><TextArea isDark={isDark} inner value={org.himma.description} onChange={(v) => setOrg({ himma: { ...org.himma, description: v } })} /></Field>
        </div>

        <div className={`${cardCls(isDark, 'bg-[#F3DDE3]/50 border-[#EBCFD8]')} space-y-3`}>
          <span className="text-xs font-bold uppercase">Leadership (PKKMB)</span>
          <Field label="Jabatan"><TextInput isDark={isDark} inner value={org.leadership.title} onChange={(v) => setOrg({ leadership: { ...org.leadership, title: v } })} /></Field>
          <Field label="Tema Kegiatan"><TextInput isDark={isDark} inner value={org.leadership.theme} onChange={(v) => setOrg({ leadership: { ...org.leadership, theme: v } })} /></Field>
          <Field label="Deskripsi"><TextArea isDark={isDark} inner value={org.leadership.description} onChange={(v) => setOrg({ leadership: { ...org.leadership, description: v } })} /></Field>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">Galeri Dokumentasi Kegiatan (Multi-Upload)</span>
          <UploadButton folder="organization" multiple accept={MEDIA_ACCEPT} icon={Upload} notify={notify} className="rounded-full px-4 bg-[#DCEAF4] text-[#2C2520]"
            onUploaded={(res) => {
              setGallery([...gallery, ...res.map((r) => ({ id: `org-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, url: r.url, path: r.path, type: r.type, title: r.name, caption: 'Dokumentasi Kegiatan Organisasi' }))]);
              notify(`${res.length} media ditambahkan ke galeri.`);
            }}>
            Unggah Beberapa Foto
          </UploadButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {gallery.map((item, idx) => (
            <div key={item.id || idx} className={`p-3 rounded-2xl border space-y-2 ${isDark ? 'bg-[#202F46] border-[#293A52]' : 'bg-white border-[#CFE3F2]'}`}>
              <EditorialFrame src={item.url} mediaType={item.type} isDark={isDark} aspectClass="aspect-[4/3]" className="rounded-xl" />
              <input
                type="text" value={item.title || ''} placeholder="Judul Foto"
                onChange={(e) => setGallery(gallery.map((g, i) => (i === idx ? { ...g, title: e.target.value } : g)))}
                className={`w-full px-2.5 py-1.5 rounded-lg border text-xs ${isDark ? 'bg-[#17243A] border-[#293A52]' : 'bg-[#FFF9F0] border-[#CFE3F2]'}`}
              />
              <div className="flex items-center justify-between pt-1">
                <div className="flex gap-1">
                  <button disabled={idx === 0} onClick={() => swap(idx, -1)} className="p-1 rounded border border-current/20 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                  <button disabled={idx === gallery.length - 1} onClick={() => swap(idx, 1)} className="p-1 rounded border border-current/20 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                </div>
                <button onClick={() => setGallery(gallery.filter((_, i) => i !== idx))} className="text-xs text-rose-500 flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
