import { Trash2, Upload } from 'lucide-react';
import EditorialFrame from '../../components/EditorialFrame';
import { VERTICAL_CATEGORIES } from '../../data/defaultData';
import { TextInput, UploadButton, cardCls, MEDIA_ACCEPT } from '../adminUi';

export default function VerticalTab({ draft, setDraft, isDark, notify }) {
  const setCat = (cat, patch) =>
    setDraft({ ...draft, verticalShowcase: { ...draft.verticalShowcase, [cat]: { ...(draft.verticalShowcase[cat] || { caption: '', items: [] }), ...patch } } });

  return (
    <div className="space-y-6">
      <h4 className="font-editorial text-2xl font-semibold">Kelola Foto Pada Interactive Vertical Typography</h4>
      {VERTICAL_CATEGORIES.map((cat) => {
        const catData = draft.verticalShowcase[cat] || { caption: '', items: [] };
        return (
          <div key={cat} className={`${cardCls(isDark)} space-y-4`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-display-accent text-sm font-bold tracking-wider">{cat}</span>
              <UploadButton folder={`vertical/${cat.toLowerCase().replace(/\s+/g, '-')}`} multiple accept={MEDIA_ACCEPT} icon={Upload} notify={notify} className="rounded-full bg-[#DCEAF4] text-[#2C2520]"
                onUploaded={(res) => {
                  setCat(cat, { items: [...(catData.items || []), ...res.map((r) => ({ id: `vt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, url: r.url, path: r.path, type: r.type, title: r.name }))] });
                  notify(`${res.length} media ditambahkan ke ${cat}.`);
                }}>
                Unggah Foto / Video
              </UploadButton>
            </div>

            <TextInput isDark={isDark} inner value={catData.caption} placeholder="Caption kategori..." onChange={(v) => setCat(cat, { caption: v })} />

            {catData.items?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {catData.items.map((m, mIdx) => (
                  <div key={m.id || mIdx} className="relative group rounded-xl overflow-hidden border border-current/15">
                    <EditorialFrame src={m.url} mediaType={m.type} isDark={isDark} aspectClass="aspect-square" />
                    <button onClick={() => setCat(cat, { items: catData.items.filter((_, i) => i !== mIdx) })} aria-label="Hapus media" className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-rose-600 text-white"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
