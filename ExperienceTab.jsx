import { Plus, Trash2, Camera, MoveUp, MoveDown } from 'lucide-react';
import { TextInput, TextArea, UploadButton, cardCls, MEDIA_ACCEPT } from '../adminUi';

export default function ExperienceTab({ draft, setDraft, isDark, notify }) {
  const list = draft.experiences;
  const setList = (experiences) => setDraft({ ...draft, experiences });
  const patch = (idx, p) => setList(list.map((e, i) => (i === idx ? { ...e, ...p } : e)));
  const move = (idx, dir) => {
    const next = [...list];
    [next[idx + dir], next[idx]] = [next[idx], next[idx + dir]];
    setList(next);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="font-editorial text-2xl font-semibold">Kelola Pengalaman Kerja</h4>
        <button
          onClick={() => setList([{ id: `exp-${Date.now()}`, role: 'Posisi Baru', company: '[Nama Perusahaan / Brand]', period: '[Periode]', description: 'Deskripsi peran dan tanggung jawab.', mediaUrl: '', mediaPath: '', mediaType: 'image' }, ...list])}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#DCEAF4] text-[#2C2520]"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah Pengalaman
        </button>
      </div>

      {list.map((exp, idx) => (
        <div key={exp.id} className={`${cardCls(isDark)} space-y-3`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Pengalaman #{idx + 1}</span>
            <div className="flex items-center gap-2">
              <button disabled={idx === 0} onClick={() => move(idx, -1)} title="Naikkan Urutan" className="p-1.5 rounded-lg border border-current/20 disabled:opacity-30"><MoveUp className="w-3.5 h-3.5" /></button>
              <button disabled={idx === list.length - 1} onClick={() => move(idx, 1)} title="Turunkan Urutan" className="p-1.5 rounded-lg border border-current/20 disabled:opacity-30"><MoveDown className="w-3.5 h-3.5" /></button>
              <button onClick={() => setList(list.filter((e) => e.id !== exp.id))} className="text-xs text-rose-500 flex items-center gap-1 ml-2"><Trash2 className="w-3.5 h-3.5" /> Hapus</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <TextInput isDark={isDark} inner value={exp.role} placeholder="Posisi" onChange={(v) => patch(idx, { role: v })} />
            <TextInput isDark={isDark} inner value={exp.company} placeholder="Nama Perusahaan / Brand" onChange={(v) => patch(idx, { company: v })} />
            <TextInput isDark={isDark} inner value={exp.period} placeholder="Periode" onChange={(v) => patch(idx, { period: v })} />
          </div>
          <TextArea rows={2} isDark={isDark} inner value={exp.description} onChange={(v) => patch(idx, { description: v })} />

          <div className="flex flex-wrap items-center gap-3">
            <UploadButton folder="experience" accept={MEDIA_ACCEPT} icon={Camera} notify={notify} className="bg-[#F3DDE3] text-[#2C2520]"
              onUploaded={([r]) => { patch(idx, { mediaUrl: r.url, mediaPath: r.path, mediaType: r.type }); notify('Foto dokumentasi pengalaman terunggah.'); }}>
              {exp.mediaUrl ? 'Ganti Foto Dokumentasi' : 'Unggah Foto Dokumentasi'}
            </UploadButton>
            {exp.mediaUrl && <button onClick={() => patch(idx, { mediaUrl: '', mediaPath: '' })} className="text-xs text-rose-500 underline">Hapus Foto</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
