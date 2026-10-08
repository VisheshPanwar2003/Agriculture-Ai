import { useState } from "react";
import { ChevronDown, Leaf, LogOut, Menu, Settings2, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "../services/i18n";

const pageConfig = {
  "/": { title: "Crop analysis", subtitle: "Turn a field photo into practical next steps." },
  "/chatbot": { title: "AI assistant", subtitle: "Get clear answers for your day-to-day farming." },
  "/vision": { title: "Plant vision", subtitle: "Explore crop health with an image and a question." },
  "/almanac": { title: "Farm almanac", subtitle: "Plan the season with crop and planting insights." },
  "/settings": { title: "Settings", subtitle: "Manage your location and AI response preferences." },
};

export default function Topbar({ onMenuClick = () => {} }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
  }

  const currentPage = pageConfig[location.pathname] || {
    title: "AgriSense AI",
    subtitle: "Your field intelligence workspace.",
  };

  const initials = user?.name
    ?.trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2) || "U";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-3 border-b border-white/[0.07] bg-[#091711]/95 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] hover:text-white md:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="hidden text-emerald-300 sm:inline-flex"><Leaf size={15} /></span>
          <h1 className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl">{t(currentPage.title)}</h1>
          </div>
          <p className="mt-0.5 hidden truncate text-xs text-slate-400 sm:block">{t(currentPage.subtitle)}</p>
        </div>
      </div>

      <div className="relative shrink-0">
        <button
          type="button"
          aria-label="Open account menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] p-1.5 pr-2.5 text-left transition hover:border-emerald-300/20 hover:bg-white/[0.07] sm:gap-3 sm:pr-3"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-300 text-sm font-semibold text-[#092016]">{initials}</span>
          <span className="hidden min-w-0 sm:block">
            <span className="block max-w-32 truncate text-xs font-medium text-slate-100">{user?.name || "Your account"}</span>
            <span className="mt-0.5 block max-w-36 truncate text-[10px] text-slate-500">{user?.email || "Profile settings"}</span>
          </span>
          <ChevronDown size={15} className={`text-slate-400 transition ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <>
            <button type="button" aria-label="Close account menu" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
            <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#102219] p-1.5 shadow-2xl shadow-black/40">
              <div className="flex items-center gap-3 px-3 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-emerald-300"><UserRound size={17} /></span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-white">{user?.name || "Your account"}</p>
                  <p className="truncate text-[10px] text-slate-400">{user?.email || ""}</p>
                </div>
              </div>
              <div className="my-1 border-t border-white/[0.07]" />
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-slate-200 transition hover:bg-white/[0.06]"
              >
                <Settings2 size={15} className="text-emerald-300" /> {t("Settings")}
              </button>
              <button type="button" onClick={logout} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-rose-300 transition hover:bg-rose-400/10">
                <LogOut size={15} /> {t("Sign out")}
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
