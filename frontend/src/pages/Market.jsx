import { useState } from "react";
import { ArrowDownToLine, ArrowUpRight, ChartNoAxesColumnIncreasing, MapPin, Search, Store } from "lucide-react";
import api from "../services/api";
import { useTranslation } from "../services/i18n";

const STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"];
const panel = "rounded-3xl border border-white/[0.07] bg-[#0b1b13] shadow-xl shadow-black/10";
const inputClass = "min-h-12 w-full rounded-xl border border-white/10 bg-[#10251a] px-3.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-300/50 focus:outline-none";
const LANGUAGE_LOCALES = { English: "en-IN", Hindi: "hi-IN", Bengali: "bn-IN", Marathi: "mr-IN", Punjabi: "pa-IN", Tamil: "ta-IN", Telugu: "te-IN" };
const money = (value) => Number.isFinite(Number(value)) ? `₹${Number(value).toLocaleString("en-IN")}` : "—";

export default function Market() {
  const { t, language } = useTranslation();
  const [form, setForm] = useState({ state: "", commodity: "", district: "", market: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  const search = async (nextOffset = 0, append = false) => {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.get("/market/prices", { params: { ...form, offset: nextOffset, limit: 10 } });
      setResult((current) => append && current ? { ...data, records: [...current.records, ...data.records] } : data);
      setOffset(nextOffset);
    } catch (requestError) {
      setError(t(requestError.response?.data?.error || "Could not load mandi prices. Please try again."));
      if (!append) setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.state || !form.commodity.trim()) {
      setError(t("Choose a state and enter a commodity to search."));
      return;
    }
    search(0);
  };

  return (
    <main className="mx-auto max-w-[1450px] space-y-5 pb-8 sm:space-y-6">
      <section className={`${panel} relative overflow-hidden bg-gradient-to-br from-[#183322] via-[#102419] to-[#0b1b13] p-5 sm:p-7 lg:p-8`}>
        <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-emerald-300/[0.07] blur-3xl" />
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/15 bg-emerald-200/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200"><ChartNoAxesColumnIncreasing size={14} /> {t("Market intelligence")}</span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{t("Mandi prices, at a glance.")}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{t("Compare reported wholesale prices by state, commodity, and local market using the latest available AGMARKNET records.")}</p>
        </div>
      </section>

      <section className={`${panel} p-4 sm:p-6`}>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2 text-xs font-medium text-slate-300">{t("State")} <select className={inputClass} value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })}><option value="">{t("Select state / UT")}</option>{STATES.map((state) => <option key={state}>{state}</option>)}</select></label>
          <label className="space-y-2 text-xs font-medium text-slate-300">{t("Commodity")} <input className={inputClass} value={form.commodity} onChange={(event) => setForm({ ...form, commodity: event.target.value })} placeholder={t("e.g. Wheat, Tomato")} maxLength={80} /></label>
          <label className="space-y-2 text-xs font-medium text-slate-300">{t("District")} <input className={inputClass} value={form.district} onChange={(event) => setForm({ ...form, district: event.target.value })} placeholder={t("Optional")} maxLength={80} /></label>
          <label className="space-y-2 text-xs font-medium text-slate-300">{t("Market / mandi")} <input className={inputClass} value={form.market} onChange={(event) => setForm({ ...form, market: event.target.value })} placeholder={t("Optional")} maxLength={80} /></label>
          <div className="sm:col-span-2 xl:col-span-4"><button type="submit" disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 text-sm font-semibold text-[#092016] transition hover:bg-emerald-200 disabled:cursor-wait disabled:opacity-60 sm:w-auto"><Search size={17} />{loading ? t("Searching…") : t("Find mandi prices")}</button></div>
        </form>
      </section>

      {error && <div role="alert" className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.07] px-4 py-3 text-sm text-rose-200">{t(error)}</div>}

      {result && <>
        <section className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div><h2 className="text-lg font-semibold text-white">{t("Price reports")}</h2><p className="mt-1 text-xs text-slate-400">{result.total.toLocaleString("en-IN")} {t("records available · Prices shown per quintal")}</p></div>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400"><MapPin size={14} className="text-emerald-300" />{form.state}</span>
        </section>
        {result.records.length === 0 ? <div className={`${panel} p-8 text-center`}><Store size={26} className="mx-auto text-slate-500" /><h3 className="mt-3 font-medium text-white">{t("No matching records")}</h3><p className="mt-1 text-sm text-slate-400">{t("Try another spelling or remove the district and market filters.")}</p></div> : <div className="grid gap-4 lg:grid-cols-2">
          {result.records.map((record, index) => <article key={`${record.market}-${record.commodity}-${record.arrival_date}-${index}`} className={`${panel} p-4 sm:p-5`}>
            <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-base font-semibold text-white">{record.commodity}</h3><p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400"><MapPin size={13} className="text-emerald-300" />{[record.market, record.district, record.state].filter(Boolean).join(", ")}</p></div><span className="rounded-lg bg-white/[0.05] px-2.5 py-1.5 text-[11px] text-slate-300">{record.arrival_date || t("Date unavailable")}</span></div>
            <div className="mt-5 grid grid-cols-3 gap-2"><div className="rounded-xl bg-white/[0.035] p-3"><p className="text-[10px] uppercase tracking-wide text-slate-500">{t("Min")}</p><p className="mt-1 text-sm font-semibold text-slate-200">{money(record.min_price)}</p></div><div className="rounded-xl border border-emerald-300/15 bg-emerald-300/[0.07] p-3"><p className="text-[10px] uppercase tracking-wide text-emerald-200/70">{t("Modal")}</p><p className="mt-1 text-sm font-semibold text-emerald-200">{money(record.modal_price)}</p></div><div className="rounded-xl bg-white/[0.035] p-3"><p className="text-[10px] uppercase tracking-wide text-slate-500">{t("Max")}</p><p className="mt-1 text-sm font-semibold text-slate-200">{money(record.max_price)}</p></div></div>
            <div className="mt-3 flex flex-wrap justify-between gap-2 text-[11px] text-slate-500"><span>{[record.variety, record.grade].filter(Boolean).join(" · ") || "Variety / grade not specified"}</span><span>Reported arrival: {record.arrival_date || "—"}</span></div>
          </article>)}
        </div>}
        {result.records.length < result.total && <div className="text-center"><button type="button" disabled={loading} onClick={() => search(offset + 10, true)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm text-slate-200 transition hover:bg-white/[0.05] disabled:opacity-50"><ArrowDownToLine size={16} />{loading ? t("Loading…") : t("Load more")}</button></div>}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="max-w-4xl text-xs leading-relaxed text-slate-500">
            {t("Indicative reported wholesale prices, not a guaranteed sale price or MSP quote. Records can lag and vary by quality, quantity, and transaction.")}
            {result.freshness && <> {t(result.freshness)}</>}
            {result.sourceCredit && <> {t(result.sourceCredit)}</>}
            {" "}{t("Source:")} <a className="inline-flex items-center gap-1 text-emerald-200 hover:underline" href={result.sourceUrl} target="_blank" rel="noreferrer">{result.source}<ArrowUpRight size={12} /></a>
            {result.fetchedAt && ` · ${t("Retrieved")} ${new Date(result.fetchedAt).toLocaleString(LANGUAGE_LOCALES[language] || "en-IN")}`}
          </p>
          {result.sourceProvider === "ceda" && (
            <a href="https://ceda.ashoka.edu.in/agmarknet/" target="_blank" rel="noreferrer" aria-label="CEDA Agri Market Data source">
              <img src="https://viz.ceda.ashoka.edu.in/assets/logo.png" alt="CEDA" className="h-8 w-20 object-contain object-right" />
            </a>
          )}
        </div>
      </>}
      {!result && !error && <div className={`${panel} px-5 py-8 text-center`}><Store size={28} className="mx-auto text-emerald-300/70" /><p className="mt-3 text-sm text-slate-400">{t("Choose a location and commodity to see reported mandi prices.")}</p></div>}
    </main>
  );
}
