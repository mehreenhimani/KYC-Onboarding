import { FUNNEL_STAGES } from "../data/generateApplicants";

export default function FunnelAnalytics({ applicants }) {
  const total = applicants.length;

  const stageCounts = FUNNEL_STAGES.map((stage, i) => {
    const count = applicants.filter((a) => {
      const reachedIndex = FUNNEL_STAGES.indexOf(a.funnelStage);
      return reachedIndex >= i;
    }).length;
    return { stage, count, pct: (count / total) * 100 };
  });

  const regions = ["EEA", "Non-EEA"];
  const regionStats = regions.map((region) => {
    const subset = applicants.filter((a) => a.country.region === region);
    const completed = subset.filter((a) => a.completed).length;
    return {
      region,
      total: subset.length,
      completed,
      rate: subset.length ? (completed / subset.length) * 100 : 0,
    };
  });

  const methods = [...new Set(applicants.map((a) => a.verificationMethod))];
  const methodStats = methods.map((method) => {
    const subset = applicants.filter((a) => a.verificationMethod === method);
    const completed = subset.filter((a) => a.completed).length;
    return {
      method,
      total: subset.length,
      completed,
      rate: subset.length ? (completed / subset.length) * 100 : 0,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl mb-1">Onboarding funnel</h2>
        <p className="text-sm text-[var(--color-slate)]">
          Applicants reaching each stage, out of {total} total starts in the
          sample window.
        </p>
      </div>

      <div className="space-y-2">
        {stageCounts.map((s) => (
          <div key={s.stage} className="flex items-center gap-3">
            <div className="w-40 text-sm font-mono text-right shrink-0">
              {s.stage}
            </div>
            <div className="flex-1 h-8 bg-[var(--color-paper-warm)] border border-[var(--color-line)] rounded relative overflow-hidden">
              <div
                className="h-full bg-[var(--color-ink)] transition-all"
                style={{ width: `${s.pct}%` }}
              />
            </div>
            <div className="w-24 text-sm font-mono shrink-0">
              {s.count} ({s.pct.toFixed(0)}%)
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div>
          <h3 className="font-display text-lg mb-3">
            Completion by jurisdiction tier
          </h3>
          <div className="space-y-2">
            {regionStats.map((r) => (
              <div
                key={r.region}
                className="flex items-center justify-between border border-[var(--color-line)] rounded px-3 py-2 bg-white/50"
              >
                <span className="text-sm">{r.region}</span>
                <span className="font-mono text-sm">
                  {r.completed}/{r.total} ({r.rate.toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--color-slate)] mt-2">
            Non-EEA applicants fall under enhanced due diligence and complete
            onboarding at a lower rate — a candidate for friction reduction
            without weakening controls.
          </p>
        </div>

        <div>
          <h3 className="font-display text-lg mb-3">
            Completion by verification channel
          </h3>
          <div className="space-y-2">
            {methodStats.map((m) => (
              <div
                key={m.method}
                className="flex items-center justify-between border border-[var(--color-line)] rounded px-3 py-2 bg-white/50"
              >
                <span className="text-sm">{m.method}</span>
                <span className="font-mono text-sm">
                  {m.completed}/{m.total} ({m.rate.toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--color-slate)] mt-2">
            Channel choice strongly predicts completion — useful for steering
            applicants toward higher-conversion channels at the right moment.
          </p>
        </div>
      </div>
    </div>
  );
}
