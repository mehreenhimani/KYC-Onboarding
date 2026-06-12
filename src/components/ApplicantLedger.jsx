const ROUTING_META = {
  auto_approve: { label: "Approved", color: "var(--color-verify)" },
  fast_track: { label: "Fast-track", color: "var(--color-review)" },
  manual_review: { label: "Review", color: "var(--color-decline)" },
};

export default function ApplicantLedger({ applicants, selectedId, onSelect, filter, onFilterChange }) {
  const filtered = applicants.filter((a) => {
    if (filter === "all") return true;
    return a.routing === filter;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 mb-3 flex-wrap">
        {[
          { key: "all", label: "All" },
          { key: "manual_review", label: "Review" },
          { key: "fast_track", label: "Fast-track" },
          { key: "auto_approve", label: "Approved" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`text-xs font-mono px-2.5 py-1 rounded border transition-colors ${
              filter === f.key
                ? "bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]"
                : "border-[var(--color-line)] hover:border-[var(--color-ink)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-y-auto flex-1 -mx-1">
        {filtered.map((a) => {
          const meta = ROUTING_META[a.routing];
          const selected = a.id === selectedId;
          return (
            <button
              key={a.id}
              onClick={() => onSelect(a.id)}
              className={`w-full text-left px-3 py-2.5 mx-1 mb-1 rounded border transition-colors ${
                selected
                  ? "bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]"
                  : "border-transparent hover:border-[var(--color-line)] hover:bg-white/60"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs opacity-70">{a.id}</span>
                <span
                  className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{
                    color: selected ? "var(--color-paper)" : meta.color,
                    border: `1px solid ${selected ? "var(--color-paper)" : meta.color}`,
                  }}
                >
                  {meta.label}
                </span>
              </div>
              <div className="font-display text-base mt-0.5">{a.name}</div>
              <div
                className={`text-xs mt-0.5 ${
                  selected ? "opacity-80" : "text-[var(--color-slate)]"
                }`}
              >
                {a.country.name} · Risk {a.riskScore}/100
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { ROUTING_META };
