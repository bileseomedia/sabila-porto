import { Field, TextInput } from '../adminUi';

export default function ContactTab({ draft, setDraft, isDark }) {
  const set = (patch) => setDraft({ ...draft, contact: { ...draft.contact, ...patch } });
  const c = draft.contact;
  return (
    <div className="space-y-4 max-w-xl">
      <h4 className="font-editorial text-2xl font-semibold">Informasi Kontak & Tautan Sosial</h4>
      <Field label="Headline Penutup"><TextInput isDark={isDark} value={c.headline} onChange={(v) => set({ headline: v })} /></Field>
      <Field label="Alamat Email"><TextInput type="sabilatgr06@gmail.com" isDark={isDark} value={c.email} onChange={(v) => set({ email: v })} /></Field>
      <Field label="URL WhatsApp (contoh: https://wa.me/6282249803252)"><TextInput type="url" isDark={isDark} value={c.whatsapp} placeholder="https://wa.me/6282249803252" onChange={(v) => set({ whatsapp: v })} /></Field>
      <Field label="URL LinkedIn"><TextInput type="https://www.linkedin.com/in/sabila-alifia-sundawa-982aa7360?utm_source=share_via&utm_content=profile&utm_medium=member_ios" isDark={isDark} value={c.linkedin} onChange={(v) => set({ linkedin: v })} /></Field>
      <Field label="URL Instagram"><TextInput type="https://www.instagram.com/sbilalifia_?evlk=NnFzZ3d3aGp4MzN6" isDark={isDark} value={c.instagram} onChange={(v) => set({ instagram: v })} /></Field>
    </div>
  );
}
