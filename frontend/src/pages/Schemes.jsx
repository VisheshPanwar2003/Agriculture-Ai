import { useEffect, useState } from "react";
import { ArrowUpRight, BadgeIndianRupee, Landmark, Search, ShieldCheck } from "lucide-react";
import api from "../services/api";
import { useTranslation } from "../services/i18n";

const panel = "rounded-3xl border border-white/[0.07] bg-[#0b1b13] shadow-xl shadow-black/10";
const categories = ["All categories", "Credit and finance", "Pension and social security"];

export default function Schemes() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/schemes", { params: { search, category } })
      .then(({ data: response }) => { if (active) { setData(response); setError(""); } })
      .catch((requestError) => { if (active) setError(t(requestError.response?.data?.error || "Scheme information is temporarily unavailable.")); });
    return () => { active = false; };
  }, [search, category, t]);

  return (
    <main className="mx-auto max-w-[1450px] space-y-5 pb-8 sm:space-y-6">
      <section className={`${panel} relative overflow-hidden bg-gradient-to-br from-[#183322] via-[#102419] to-[#0b1b13] p-5 sm:p-7 lg:p-8`}>
        <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-emerald-300/[0.07] blur-3xl" />
        <div className="relative max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/15 bg-emerald-200/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200"><Landmark size={14} /> {t("Farmer support")}</span><h1 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{t("Government schemes for farmers.")}</h1><p className="mt-2 text-sm leading-relaxed text-slate-300">{t("Explore a starting list of central programmes and check the official source for current rules, documents, and applications.")}</p></div>
      </section>

      <section className={`${panel} grid gap-3 p-4 sm:grid-cols-[1fr_260px] sm:p-5`}>
        <label className="relative block"><span className="sr-only">{t("Search schemes")}</span><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/10 bg-[#10251a] pl-10 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-300/50 focus:outline-none" placeholder={t("Search scheme or support type")} /></label>
        <label><span className="sr-only">{t("Filter by category")}</span><select value={category} onChange={(event) => setCategory(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/10 bg-[#10251a] px-3.5 text-sm text-white focus:border-emerald-300/50 focus:outline-none">{categories.map((item) => <option key={item} value={item === "All categories" ? "" : item}>{t(item)}</option>)}</select></label>
      </section>

      {error && <div role="alert" className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.07] px-4 py-3 text-sm text-rose-200">{error}</div>}
      {!data && !error && <div className={`${panel} p-8 text-center text-sm text-slate-400`}>{t("Loading scheme directory…")}</div>}
      {data && data.schemes.length === 0 && <div className={`${panel} p-8 text-center text-sm text-slate-400`}>{t("No schemes match that search. Try a different keyword.")}</div>}
      {data?.schemes?.length > 0 && <div className="grid gap-4 xl:grid-cols-2">{data.schemes.map((scheme) => <article key={scheme.id} className={`${panel} flex flex-col p-5 sm:p-6`}>
        <div className="flex items-start justify-between gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-300"><BadgeIndianRupee size={21} /></span><span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-medium text-slate-300">{t(scheme.level)} {t("scheme")}</span></div>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-300/75">{t(scheme.category)}</p><h2 className="mt-1 text-lg font-semibold tracking-tight text-white">{t(scheme.name)}</h2><p className="mt-2 text-sm leading-relaxed text-slate-300">{t(scheme.summary)}</p>
        <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"><p className="flex items-center gap-2 text-xs font-semibold text-slate-200"><ShieldCheck size={15} className="text-emerald-300" />{t("Eligibility to check")}</p><p className="mt-2 text-xs leading-relaxed text-slate-400">{t(scheme.eligibility)}</p></div>
        <a href={scheme.officialUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] px-4 text-sm font-medium text-emerald-200 transition hover:bg-emerald-300/[0.12]">{t("View official scheme details")} <ArrowUpRight size={15} /></a>
      </article>)}</div>}
      {data && <p className="text-xs leading-relaxed text-slate-500">{t(data.note)} {t("Directory checked")} {data.lastReviewed}. {t("Source: myScheme, Government of India. This page does not determine eligibility or submit applications.")}</p>}
    </main>
  );
}
