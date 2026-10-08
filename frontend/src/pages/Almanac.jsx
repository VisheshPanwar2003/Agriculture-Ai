import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CloudSun,
  Droplets,
  Leaf,
  MapPin,
  Sprout,
  Sun,
  ThermometerSun,
  Wind,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { getPreferences } from "../services/preferences";
import { useTranslation } from "../services/i18n";

const SEASONS = [
  { key: "Kharif", period: "June – October", color: "text-sky-300", surface: "bg-sky-300/10" },
  { key: "Rabi", period: "October – March", color: "text-amber-200", surface: "bg-amber-200/10" },
  { key: "Summer", period: "March – June", color: "text-orange-200", surface: "bg-orange-200/10" },
];

function currentSeason(date = new Date()) {
  const month = date.getMonth();
  if (month >= 5 && month <= 8) return "Kharif";
  if (month >= 9 || month <= 1) return "Rabi";
  return "Summer";
}

const LANGUAGE_LOCALES = {
  English: "en-IN", Hindi: "hi-IN", Bengali: "bn-IN", Marathi: "mr-IN",
  Punjabi: "pa-IN", Tamil: "ta-IN", Telugu: "te-IN",
};

function localDate(date, language) {
  return date.toLocaleDateString(LANGUAGE_LOCALES[language] || "en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date;
}

function Panel({ children, className = "" }) {
  return (
    <section className={`rounded-3xl border border-white/[0.07] bg-[#0b1b13] p-5 shadow-xl shadow-black/10 sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

function SectionTitle({ icon: Icon, eyebrow, title, children }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-300"><Icon size={19} /></span>
        <div className="min-w-0">
          {eyebrow && <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-emerald-300/75">{eyebrow}</p>}
          <h2 className="mt-1 text-base font-semibold tracking-tight text-white sm:text-lg">{title}</h2>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function FarmerAlmanac() {
  const [preferences, setPreferences] = useState(getPreferences);
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState("Rice");
  const [plantingDate, setPlantingDate] = useState("");
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [daily, setDaily] = useState(null);
  const [dailyError, setDailyError] = useState("");
  const [seasonal, setSeasonal] = useState(null);
  const [seasonalError, setSeasonalError] = useState("");
  const [cropData, setCropData] = useState(null);
  const [cropError, setCropError] = useState(null);
  const [loading, setLoading] = useState({ weather: true, daily: true, seasonal: true });

  const season = useMemo(() => currentSeason(), []);

  useEffect(() => {
    const updatePreferences = () => setPreferences(getPreferences());
    window.addEventListener("preferences-updated", updatePreferences);
    window.addEventListener("storage", updatePreferences);
    return () => {
      window.removeEventListener("preferences-updated", updatePreferences);
      window.removeEventListener("storage", updatePreferences);
    };
  }, []);

  const setSectionLoaded = useCallback((section) => {
    setLoading((current) => ({ ...current, [section]: false }));
  }, []);

  useEffect(() => {
    let active = true;
    api.get(`/weather/${encodeURIComponent(preferences.location)}`)
      .then(({ data }) => { if (active) setWeather(data); })
      .catch((error) => {
        if (active) {
          setWeatherError(error.response?.status === 404
            ? "We couldn’t find this city. Update your location in Settings."
            : "Weather is temporarily unavailable.");
        }
      })
      .finally(() => { if (active) setSectionLoaded("weather"); });

    api.get("/almanac/daily")
      .then(({ data }) => { if (active) setDaily(data); })
      .catch(() => { if (active) setDailyError("Today’s field brief is unavailable."); })
      .finally(() => { if (active) setSectionLoaded("daily"); });

    api.get(`/almanac/seasonal/${encodeURIComponent(preferences.location)}`)
      .then(({ data }) => { if (active) setSeasonal(data); })
      .catch(() => { if (active) setSeasonalError("Seasonal crop information is unavailable."); })
      .finally(() => { if (active) setSectionLoaded("seasonal"); });

    return () => { active = false; };
  }, [preferences.location, setSectionLoaded]);

  useEffect(() => {
    let active = true;

    api.get(`/almanac/crop-ai/${encodeURIComponent(selectedCrop)}?language=${encodeURIComponent(preferences.language)}`)
      .then(({ data }) => {
        if (active) {
          if (data.error) setCropError({ crop: selectedCrop, message: data.error });
          else {
            setCropData({ crop: selectedCrop, data });
            setCropError(null);
          }
        }
      })
      .catch(() => { if (active) setCropError({ crop: selectedCrop, message: "Crop guidance is temporarily unavailable." }); });

    return () => { active = false; };
  }, [selectedCrop, preferences.language, setSectionLoaded]);

  const activeCropData = cropData?.crop === selectedCrop ? cropData.data : null;
  const activeCropError = cropError?.crop === selectedCrop ? cropError.message : "";
  const cropLoading = !activeCropData && !activeCropError;
  const maturityDays = activeCropData?.crop_data?.days_to_maturity;
  const harvestDate = plantingDate && maturityDays
    ? addDays(plantingDate, maturityDays)
    : null;
  const daysSincePlanting = plantingDate
    ? Math.floor((new Date().setHours(12, 0, 0, 0) - new Date(`${plantingDate}T12:00:00`).getTime()) / 86400000)
    : null;
  const progress = maturityDays && daysSincePlanting !== null
    ? Math.max(0, Math.min(100, Math.round((daysSincePlanting / maturityDays) * 100)))
    : 0;
  const fieldTasks = [
    t("Review today’s field activity"),
    t("Check soil moisture before irrigating") + ` ${t(selectedCrop).toLowerCase()}`,
    t("Inspect plants for early signs of pests or disease"),
  ];

  return (
    <div className="mx-auto max-w-[1450px] space-y-5 pb-8 sm:space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-emerald-200/10 bg-gradient-to-br from-[#183322] via-[#102419] to-[#0b1b13] p-5 sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-emerald-300/[0.07] blur-3xl" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/15 bg-emerald-200/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
              <Sprout size={13} /> {t("Seasonal field planner")}
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{t("Your farm, in season.")}</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">{t("A practical view of local conditions, crop milestones, and the next things to check in the field.")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-3 py-2"><MapPin size={14} className="text-emerald-300" />{preferences.location}</span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-3 py-2"><CalendarDays size={14} className="text-emerald-300" />{new Date().toLocaleDateString(LANGUAGE_LOCALES[preferences.language] || "en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
            <Link to="/settings" className="inline-flex min-h-9 items-center gap-1 rounded-xl px-3 py-2 font-medium text-emerald-200 transition hover:bg-white/[0.06]">{t("Edit location")} <ArrowRight size={13} /></Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Panel className="min-h-[148px] p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium text-slate-400">{t("Local weather")}</p>
            <CloudSun size={17} className="text-sky-300" />
          </div>
          {loading.weather ? <p className="mt-6 text-xs text-slate-500">{t("Checking local conditions…")}</p> : weatherError ? (
            <p className="mt-4 text-xs leading-relaxed text-amber-200">{t(weatherError)} <Link to="/settings" className="underline underline-offset-2">{t("Edit location")}</Link></p>
          ) : (
            <div className="mt-4 flex items-end justify-between gap-3">
              <div><p className="text-3xl font-semibold tracking-tight text-white">{Math.round(weather?.temperature)}°</p><p className="mt-1 text-xs capitalize text-slate-400">{t(weather?.weather)}</p></div>
              <span className="mb-1 text-right text-[11px] text-slate-500">{weather?.city}<br />{weather?.humidity}% {t("Humidity")}</span>
            </div>
          )}
        </Panel>

        <Panel className="min-h-[148px] p-4 sm:p-5">
          <div className="flex items-start justify-between"><p className="text-xs font-medium text-slate-400">{t("Current season")}</p><Sun size={17} className="text-amber-200" /></div>
          <p className="mt-4 text-2xl font-semibold tracking-tight text-white">{t(season)}</p>
          <p className="mt-1 text-xs text-slate-500">{t("General India crop calendar")}</p>
        </Panel>

        <Panel className="min-h-[148px] p-4 sm:p-5">
          <div className="flex items-start justify-between"><p className="text-xs font-medium text-slate-400">{t("Crop in focus")}</p><Leaf size={17} className="text-emerald-300" /></div>
          <p className="mt-4 text-2xl font-semibold tracking-tight text-white">{selectedCrop}</p>
          <p className="mt-1 text-xs text-slate-500">{cropLoading ? t("Loading crop data…") : maturityDays ? `${maturityDays} ${t("days to maturity")}` : t("Crop duration unavailable")}</p>
        </Panel>

        <Panel className="min-h-[148px] p-4 sm:p-5">
          <div className="flex items-start justify-between"><p className="text-xs font-medium text-slate-400">{t("Wind")}</p><Wind size={17} className="text-violet-300" /></div>
          <p className="mt-4 text-2xl font-semibold tracking-tight text-white">{loading.weather ? "—" : weatherError ? "—" : `${weather?.wind_speed} km/h`}</p>
          <p className="mt-1 text-xs text-slate-500">{weather?.city || preferences.location}</p>
        </Panel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel>
          <SectionTitle icon={CalendarDays} eyebrow={t("Crop calendar")} title={t("Plan a crop timeline")}>
            <label className="sr-only" htmlFor="almanac-crop">{t("Select crop")}</label>
            <select id="almanac-crop" value={selectedCrop} onChange={(event) => setSelectedCrop(event.target.value)} className="max-w-32 rounded-xl border border-white/10 bg-[#07140f] px-3 py-2 text-xs text-white outline-none focus:border-emerald-300/50">
              <option value="Rice">{t("Rice")}</option><option value="Wheat">{t("Wheat")}</option>
            </select>
          </SectionTitle>

          <label className="block max-w-sm">
            <span className="mb-2 block text-xs font-medium text-slate-400">{t("Planting date")}</span>
            <input type="date" value={plantingDate} onChange={(event) => setPlantingDate(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#07140f] px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-300/50" />
          </label>

          {plantingDate && maturityDays ? (
            <div className="mt-6">
              <div className="flex items-end justify-between gap-3">
                <div><p className="text-sm font-medium text-white">{daysSincePlanting < 0 ? t("Sowing is coming up") : `${daysSincePlanting} ${t("days since planting")}`}</p><p className="mt-1 text-xs text-slate-500">{t("Estimated harvest")}: {localDate(harvestDate, preferences.language)}</p></div>
                <p className="text-xs font-semibold text-emerald-300">{progress}%</p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-300 transition-all" style={{ width: `${progress}%` }} /></div>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: "Planting", date: new Date(`${plantingDate}T12:00:00`) },
                  { label: t("Mid-season check"), date: addDays(plantingDate, Math.floor(maturityDays / 2)) },
                  { label: t("Estimated harvest"), date: harvestDate },
                ].map((milestone, index) => (
                  <div key={milestone.label} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <span className={`mt-0.5 ${daysSincePlanting >= (index === 0 ? 0 : index === 1 ? Math.floor(maturityDays / 2) : maturityDays) ? "text-emerald-300" : "text-slate-600"}`}><CheckCircle2 size={16} /></span>
                    <div><p className="text-xs font-medium text-slate-200">{milestone.label}</p><p className="mt-1 text-[11px] text-slate-500">{localDate(milestone.date, preferences.language)}</p></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-400">{t("Choose a planting date to estimate the mid-season check and harvest window.")}</div>
          )}
          <p className="mt-4 text-[11px] leading-relaxed text-slate-600">{t("Harvest dates are estimates based on the crop duration in the app. Actual timing depends on variety, weather, and local conditions.")}</p>
        </Panel>

        <Panel>
          <SectionTitle icon={Sun} eyebrow={t("Field brief")} title={t("Today’s focus")} />
          {loading.daily ? <p className="text-sm text-slate-500">{t("Loading today’s brief…")}</p> : dailyError ? <p className="text-sm text-slate-400">{t(dailyError)}</p> : (
            <>
              <div className="rounded-2xl border border-emerald-200/10 bg-emerald-200/[0.045] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-emerald-300">{t("Suggested activity")}</p>
                <p className="mt-2 text-lg font-medium text-white">{t(daily?.activity)}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{t("Use this as a general prompt and adapt it to your crop stage and field conditions.")}</p>
              </div>
              <div className="mt-5">
                <p className="text-xs font-medium text-slate-400">{t("Good to review")}</p>
                <div className="mt-3 flex flex-wrap gap-2">{(daily?.best_for || []).map((crop) => <span key={crop} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300">{t(crop)}</span>)}</div>
              </div>
              <div className="mt-5 border-t border-white/[0.07] pt-4">
                <p className="text-xs font-medium text-slate-400">{t("Field checklist")}</p>
                <div className="mt-2 space-y-1">
                  {fieldTasks.map((task, index) => (
                    <label key={task} className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2.5 text-xs leading-relaxed text-slate-300 transition hover:bg-white/[0.03]">
                      <input
                        type="checkbox"
                        checked={checkedTasks.includes(index)}
                        onChange={() => setCheckedTasks((current) => current.includes(index)
                          ? current.filter((item) => item !== index)
                          : [...current, index])}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-400"
                      />
                      <span className={checkedTasks.includes(index) ? "text-slate-500 line-through" : ""}>{task}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </Panel>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Panel>
          <SectionTitle icon={Sprout} eyebrow={`${t(season)} ${t("season · general guide")}`} title={t("Crops to explore")} />
          {loading.seasonal ? <p className="text-sm text-slate-500">{t("Loading seasonal crops…")}</p> : seasonalError ? <p className="text-sm text-slate-400">{t(seasonalError)}</p> : (
            <>
              <p className="mb-4 text-xs leading-relaxed text-slate-500">{t("Broad seasonal suggestions for")} {preferences.location}. {t("Check local sowing dates and water availability before planting.")}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {SEASONS.map(({ key, period, color, surface }) => (
                  <div key={key} className={`rounded-2xl border border-white/[0.06] p-4 ${key === season ? "bg-emerald-300/[0.06] ring-1 ring-emerald-300/20" : "bg-white/[0.02]"}`}>
                    <div className="flex items-center justify-between gap-2"><div><p className={`text-sm font-semibold ${key === season ? "text-emerald-200" : "text-slate-200"}`}>{t(key)}</p><p className="mt-1 text-[10px] text-slate-500">{t(period)}</p></div><span className={`rounded-lg p-2 ${surface} ${color}`}><Sun size={15} /></span></div>
                    <div className="mt-3 flex flex-wrap gap-1.5">{(seasonal?.[key] || []).map((crop) => <span key={crop} className="rounded-lg bg-black/15 px-2 py-1 text-[11px] text-slate-300">{t(crop)}</span>)}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[10px] text-slate-600">{t("Season windows vary across India. These are broad planning references, not local advisories.")}</p>
            </>
          )}
        </Panel>

        <Panel>
          <SectionTitle icon={AlertTriangle} eyebrow={t("Crop watch")} title={`${t(selectedCrop)} ${t("pest watch")}`} />
          {cropLoading ? <p className="text-sm text-slate-500">{t("Loading crop notes…")}</p> : activeCropError ? <p className="text-sm text-slate-400">{t(activeCropError)}</p> : (
            <>
              <p className="text-sm leading-relaxed text-slate-300">{t("Keep an eye out for these pests or issues listed for")} {t(selectedCrop).toLowerCase()}:</p>
              <div className="mt-4 flex flex-wrap gap-2">{(activeCropData?.crop_data?.pests || []).map((pest) => <span key={pest} className="inline-flex items-center gap-2 rounded-xl border border-amber-200/10 bg-amber-200/[0.05] px-3 py-2 text-xs text-amber-100"><AlertTriangle size={13} className="text-amber-300" />{t(pest)}</span>)}</div>
              <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="text-xs font-medium text-slate-200">{t("Field check")}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{t("Inspect several plants across the field and compare symptoms before treating. Ask an agricultural expert if damage is spreading.")}</p>
              </div>
            </>
          )}
        </Panel>
      </section>

      <Panel>
        <SectionTitle icon={Droplets} eyebrow={t("Water & soil")} title={t("Before your next irrigation")} />
        {cropLoading ? <p className="text-sm text-slate-500">{t("Loading crop requirements…")}</p> : activeCropError ? <p className="text-sm text-slate-400">{t(activeCropError)}</p> : (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-sky-200/10 bg-sky-200/[0.04] p-4">
              <p className="text-sm font-medium text-sky-100">{t("Water requirement")}: {t(activeCropData?.crop_data?.watering || "Not available")}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{t("Check field moisture and recent rainfall before watering. Avoid relying on a fixed schedule when field conditions differ.")}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-sm font-medium text-slate-200">{t("Soil check")}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{t("Review soil moisture around the active root zone and use a recent soil test for nutrient decisions. Soil and water needs vary by field.")}</p>
            </div>
          </div>
        )}
      </Panel>

      <Panel>
        <SectionTitle icon={ThermometerSun} eyebrow={t("Crop guidance")} title={`${t(selectedCrop)} ${t("growing notes")}`} />
        {cropLoading ? <p className="text-sm text-slate-500">{t("Preparing crop guidance…")}</p> : activeCropError ? <p className="text-sm text-slate-400">{t(activeCropError)}</p> : (
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm leading-relaxed text-slate-300">{activeCropData?.ai_data?.summary || t("No summary is available yet.")}</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"><p className="text-[10px] uppercase tracking-wider text-slate-500">{t("Water need")}</p><p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-200"><Droplets size={14} className="text-sky-300" />{t(activeCropData?.crop_data?.watering || "—")}</p></div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"><p className="text-[10px] uppercase tracking-wider text-slate-500">{t("Maturity")}</p><p className="mt-1.5 text-sm font-medium text-slate-200">{maturityDays ? `${maturityDays} ${t("days")}` : "—"}</p></div>
              </div>
              {activeCropData?.crop_data?.harvest_time && <p className="mt-3 text-xs text-slate-500">{t("Typical harvest window")}: {t(activeCropData.crop_data.harvest_time)}</p>}
            </div>
            <div>
              <p className="mb-3 text-xs font-medium text-slate-400">{t("Recommendations")}</p>
              <ul className="space-y-2.5">
                {(activeCropData?.ai_data?.recommendations || []).map((recommendation, index) => (
                  <li key={`${index}-${recommendation}`} className="flex items-start gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-xs leading-relaxed text-slate-300"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-300" />{recommendation}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Panel>

      <p className="px-1 text-[10px] leading-relaxed text-slate-600">{t("Almanac dates and crop suggestions are planning aids. Confirm local weather, soil, seed variety, and regional agricultural guidance before making field decisions.")}</p>
    </div>
  );
}
