import { useState } from 'react';
import { Upload } from 'lucide-react';
import { uploadMedia } from '../lib/media';

export const inputCls = (isDark, inner = false) =>
  `w-full px-3.5 py-2.5 rounded-xl border text-sm ${isDark ? `${inner ? 'bg-[#17243A]' : 'bg-[#202F46]'} border-[#293A52]` : 'bg-white border-[#CFE3F2]'}`;
export const cardCls = (isDark, tint = 'bg-[#FFF9F0] border-[#CFE3F2]') => `p-5 rounded-2xl border ${isDark ? 'bg-[#202F46] border-[#293A52]' : tint}`;

export const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold mb-1">{label}</label>
    {children}
  </div>
);

export const TextInput = ({ isDark, inner, value, onChange, ...rest }) => (
  <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls(isDark, inner)} {...rest} />
);

export const TextArea = ({ isDark, inner, value, onChange, rows = 3, ...rest }) => (
  <textarea rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls(isDark, inner)} {...rest} />
);

/**
 * Tombol unggah: memilih file -> upload ke Supabase Storage -> panggil onUploaded(daftar hasil).
 * Hasil: [{ url, path, type, name }]
 */
export function UploadButton({ children, folder, multiple = false, accept, onUploaded, notify, className = '', icon: Icon = Upload }) {
  const [busy, setBusy] = useState(false);
  return (
    <label className={`cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold ${busy ? 'opacity-60 pointer-events-none' : ''} ${className}`}>
      <Icon className="w-3.5 h-3.5" /> {busy ? 'Mengunggah...' : children}
      <input
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        onChange={async (e) => {
          const files = Array.from(e.target.files || []);
          e.target.value = '';
          if (!files.length) return;
          setBusy(true);
          const results = [];
          for (const f of files) {
            try {
              results.push({ ...(await uploadMedia(f, folder)), name: f.name.replace(/\.[^/.]+$/, '') });
            } catch (err) {
              notify(err.message);
            }
          }
          setBusy(false);
          if (results.length) onUploaded(results);
        }}
      />
    </label>
  );
}

export const IMG_ACCEPT = 'image/jpeg,image/png,image/webp';
export const MEDIA_ACCEPT = 'image/jpeg,image/png,image/webp,video/mp4,video/webm';
