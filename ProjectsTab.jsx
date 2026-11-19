import { Plus, Trash2, MoveUp, MoveDown, Upload, Image as ImageIcon } from 'lucide-react';
import EditorialFrame from '../../components/EditorialFrame';
import { PROJECT_CATEGORIES } from '../../data/defaultData';
import { TextInput, TextArea, UploadButton, cardCls, inputCls, IMG_ACCEPT, MEDIA_ACCEPT } from '../adminUi';

export default function ProjectsTab({ draft, setDraft, isDark, notify }) {
  const list = draft.projects;
  const setList = (projects) => setDraft({ ...draft, projects });
  const patch = (idx, p) => setList(list.map((x, i) => (i === idx ? { ...x, ...p } : x)));
  const move = (idx, dir) => { const n = [...list]; [n[idx + dir], n[idx]] = [n[idx], n[idx + dir]]; setList(n); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="font-editorial text-2xl font-semibold">Kelola Selected Works (Projects)</h4>
        <button
          onClick={() => setList([{ id: `proj-${Date.now()}`, title: 'Judul Project Baru', category: 'Digital Marketing', description: 'Deskripsi singkat project yang dikerjakan.', role: 'Peran Anda', process: 'Langkah atau proses pengerjaan.', coverImage: '', coverPath: '', gallery: [] }, ...list])}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#DCEAF4] text-[#2C2520]"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah Project
        </button>
      </div>

      {list.map((proj, idx) => (
        <div key={proj.id} className={`${cardCls(isDark)} space-y-3`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase">Project #{idx + 1}</span>
            <div className="flex items-center gap-2">
              <button disabled={idx === 0} onClick={() => move(idx, -1)} title="Naikkan Urutan" className="p-1.5 rounded-lg border border-current/20 disabled:opacity-30"><MoveUp className="w-3.5 h-3.5" /></button>
              <button disabled={idx === list.length - 1} onClick={() => move(idx, 1)} title="Turunkan Urutan" className="p-1.5 rounded-lg border border-current/20 disabled:opacity-30"><MoveDown className="w-3.5 h-3.5" /></button>
              <button onClick={() => { if (window.confirm(`Hapus project "${proj.title}"?`)) setList(list.filter((p) => p.id !== proj.id)); }} className="text-xs text-rose-500 flex items-center gap-1 ml-2"><Trash2 className="w-3.5 h-3.5" /> Hapus</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <TextInput isDark={isDark} inner value={proj.title} placeholder="Nama Project" onChange={(v) => patch(idx, { title: v })} />
            <select value={proj.category} onChange={(e) => patch(idx, { category: e.target.value })} className={inputCls(isDark, true)}>
              {PROJECT_CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <TextInput isDark={isDark} inner value={proj.role} placeholder="Peran Saya" onChange={(v) => patch(idx, { role: v })} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextArea rows={2} isDark={isDark} inner value={proj.description} placeholder="Deskripsi Project" onChange={(v) => patch(idx, { description: v })} />
            <TextArea rows={2} isDark={isDark} inner value={proj.process} placeholder="Proses Pengerjaan" onChange={(v) => patch(idx, { process: v })} />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <UploadButton folder="projects" accept={IMG_ACCEPT} icon={ImageIcon} notify={notify} className="bg-[#DCEAF4] text-[#2C2520]"
              onUploaded={([r]) => { patch(idx, { coverImage: r.url, coverPath: r.path }); notify('Cover project diperbarui.'); }}>
              {proj.coverImage ? 'Ganti Cover Image' : 'Unggah Cover Image'}
            </UploadButton>
            {proj.coverImage && <button onClick={() => patch(idx, { coverImage: '', coverPath: '' })} className="text-xs text-rose-500 underline">Hapus Cover</button>}

            <UploadButton folder="projects" multiple accept={MEDIA_ACCEPT} icon={Upload} notify={notify} className="bg-[#F3DDE3] text-[#2C2520]"
              onUploaded={(res) => {
                patch(idx, { gallery: [...(proj.gallery || []), ...res.map((r) => ({ id: `pg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, url: r.url, path: r.path, type: r.type, title: '', caption: r.name }))] });
                notify(`${res.length} dokumentasi ditambahkan.`);
              }}>
              Tambah Dokumentasi ({proj.gallery?.length || 0})
            </UploadButton>
          </div>

          {proj.gallery?.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {proj.gallery.map((g, gi) => (
                <div key={g.id || gi} className="relative rounded-lg overflow-hidden border border-current/15">
                  <EditorialFrame src={g.url} mediaType={g.type} isDark={isDark} aspectClass="aspect-square" />
                  <button onClick={() => patch(idx, { gallery: proj.gallery.filter((_, i) => i !== gi) })} aria-label="Hapus dokumentasi" className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
