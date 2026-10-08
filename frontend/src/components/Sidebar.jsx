import { useEffect, useState } from "react";
import {
  CalendarDays,
  Eye,
  Image,
  Leaf,
  MessageCircle,
  Store,
  Landmark,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import WeatherCard from "./WeatherCard";
import { getPreferences } from "../services/preferences";
import { useTranslation } from "../services/i18n";

const menu = [
  { icon: Image, label: "Crop analysis", path: "/" },
  { icon: MessageCircle, label: "AI assistant", path: "/chatbot" },
  { icon: Eye, label: "Plant vision", path: "/vision" },
  { icon: CalendarDays, label: "Farm almanac", path: "/almanac" },
  { icon: Store, label: "Mandi prices", path: "/market" },
  { icon: Landmark, label: "Govt schemes", path: "/schemes" },
];

export default function Sidebar({ isOpen = false, onNavigate = () => {} }) {
  const [location, setLocation] = useState(() => getPreferences().location);
  const { t } = useTranslation();

  useEffect(() => {
    const updateLocation = () => setLocation(getPreferences().location);
    window.addEventListener("preferences-updated", updateLocation);
    window.addEventListener("storage", updateLocation);
    return () => {
      window.removeEventListener("preferences-updated", updateLocation);
      window.removeEventListener("storage", updateLocation);
    };
  }, []);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[min(82vw,290px)] shrink-0 flex-col overflow-y-auto border-r border-white/[0.07] bg-[#091811] shadow-2xl transition-transform duration-300 md:static md:z-auto md:w-[258px] md:translate-x-0 md:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5 md:px-6 md:py-7">
        <NavLink to="/" onClick={onNavigate} className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-[#082016] shadow-lg shadow-emerald-950/40">
            <Leaf size={22} strokeWidth={2.4} />
          </span>
          <span>
            <span className="block text-base font-semibold tracking-tight text-white">AgriSense</span>
            <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-300/70">{t("Field intelligence")}</span>
          </span>
        </NavLink>
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onNavigate}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white md:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-4 pt-7">
        <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{t("Workspace")}</p>
        <nav className="space-y-1.5">
          {menu.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-medium transition ${
                  isActive
                    ? "bg-emerald-400 text-[#092016] shadow-md shadow-emerald-950/30"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                }`
              }
            >
              <Icon size={18} strokeWidth={1.9} />
              <span>{t(label)}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-3 md:p-4">
        <div className="mb-3 hidden rounded-xl border border-emerald-300/10 bg-emerald-300/[0.06] px-3.5 py-3 md:block">
          <p className="text-xs font-medium text-emerald-100">{t("Grow with confidence")}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{t("Your tools for healthier crops and better decisions.")}</p>
        </div>
        <WeatherCard city={location} onSettingsClick={onNavigate} />
        <p className="px-3 pb-2 pt-3 text-[10px] text-slate-600">AGRISENSE AI <span className="float-right">v1.0</span></p>
      </div>
    </aside>
  );
}
