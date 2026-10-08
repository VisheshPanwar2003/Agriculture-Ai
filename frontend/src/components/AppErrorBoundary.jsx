import { Component } from "react";
import { translate } from "../services/i18n";

export default class AppErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("AgriSense UI crashed:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    const t = (text) => translate(text);

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07130f] px-5 py-10 text-white">
        <section className="w-full max-w-xl rounded-3xl border border-rose-300/20 bg-[#0b1b13] p-6 shadow-2xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">AgriSense AI</p>
          <h1 className="mt-3 text-xl font-semibold">{t("The page hit an error")}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            {t("Reload the page. If it happens again, copy the error details below and share them with support.")}
          </p>
          <details className="mt-5 rounded-xl border border-white/10 bg-black/20 p-3">
            <summary className="cursor-pointer text-sm text-slate-200">{t("Error details")}</summary>
            <pre className="mt-3 overflow-auto whitespace-pre-wrap break-words text-xs text-rose-200">{this.state.error?.stack || this.state.error?.message || String(this.state.error)}</pre>
          </details>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 min-h-11 rounded-xl bg-emerald-300 px-4 py-2 text-sm font-semibold text-[#082016] hover:bg-emerald-200"
          >
            {t("Reload page")}
          </button>
        </section>
      </main>
    );
  }
}
