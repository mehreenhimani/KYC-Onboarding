import { useState, useMemo } from "react";
import { generateApplicants } from "./data/generateApplicants";
import ApplicantLedger from "./components/ApplicantLedger";
import CaseFile from "./components/CaseFile";
import FunnelAnalytics from "./components/FunnelAnalytics";

export default function App() {
  const applicants = useMemo(() => generateApplicants(240), []);
  const [tab, setTab] = useState("triage");
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(applicants[0]?.id);

  const selected = applicants.find((a) => a.id === selectedId);

  const counts = {
    auto_approve: applicants.filter((a) => a.routing === "auto_approve").length,
    fast_track: applicants.filter((a) => a.routing === "fast_track").length,
    manual_review: applicants.filter((a) => a.routing === "manual_review").length,
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="border-b border-[var(--color-line)] px-6 pt-6 pb-5">
        <div className="max-w-6xl mx-auto flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-slate)] mb-2">
              KYC Onboarding Intelligence — Prototype
            </div>
            <h1 className="font-display text-4xl leading-tight">OnboardIQ</h1>
          </div>
          <div className="flex gap-6 font-mono text-sm">
            <Stat label="Approved" value={counts.auto_approve} color="var(--color-verify)" />
            <Stat label="Fast-track" value={counts.fast_track} color="var(--color-review)" />
            <Stat label="Review" value={counts.manual_review} color="var(--color-decline)" />
          </div>
        </div>
      </header>

      <nav className="border-b border-[var(--color-line)] px-6">
        <div className="max-w-6xl mx-auto flex gap-6">
          {[
            { key: "triage", label: "Risk triage" },
            { key: "funnel", label: "Funnel analytics" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`font-mono text-sm py-3 border-b-2 transition-colors ${
                tab === t.key
                  ? "border-[var(--color-ink)]"
                  : "border-transparent text-[var(--color-slate)] hover:text-[var(--color-ink)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-6 min-h-0 overflow-hidden">
        {tab === "triage" ? (
          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6 h-full min-h-[480px]">
            <div className="border border-[var(--color-line)] rounded-lg p-3 bg-white/40 h-full overflow-hidden">
              <ApplicantLedger
                applicants={applicants}
                selectedId={selectedId}
                onSelect={setSelectedId}
                filter={filter}
                onFilterChange={setFilter}
              />
            </div>
            <div className="border border-[var(--color-line)] rounded-lg p-6 bg-white/40 h-full overflow-hidden">
              <CaseFile applicant={selected} />
            </div>
          </div>
        ) : (
          <div className="border border-[var(--color-line)] rounded-lg p-6 bg-white/40 h-full overflow-y-auto">
            <FunnelAnalytics applicants={applicants} />
          </div>
        )}
      </main>

      <footer className="border-t border-[var(--color-line)] px-6 py-3 shrink-0">
        <div className="max-w-6xl mx-auto text-xs text-[var(--color-slate)] font-mono">
          Synthetic data for demonstration. Risk logic models a simplified
          risk-based KYC framework — not affiliated with N26 or any named
          institution.
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="text-right">
      <div className="text-2xl" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-[var(--color-slate)] uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}