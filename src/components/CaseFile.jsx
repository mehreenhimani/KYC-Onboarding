import { buildReasoningTrace, ROUTING_LABELS } from "../lib/reasoningEngine";
import { ROUTING_META } from "./ApplicantLedger";

export default function CaseFile({ applicant }) {
  if (!applicant) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--color-slate)] text-sm">
        Select an applicant from the ledger to view the case file.
      </div>
    );
  }

  const trace = buildReasoningTrace(applicant);
  const meta = ROUTING_META[applicant.routing];

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-start justify-between gap-4 mb-1">
        <div>
          <div className="font-mono text-xs text-[var(--color-slate)]">
            {applicant.id}
          </div>
          <h2 className="font-display text-3xl">{applicant.name}</h2>
          <div className="text-sm text-[var(--color-slate)] mt-1">
            {applicant.country.name} ({applicant.country.region}) · Age{" "}
            {applicant.age} · {applicant.docType}
          </div>
        </div>
        <div
          className="stamp"
          style={{ color: meta.color }}
          aria-label={`Decision: ${ROUTING_LABELS[applicant.routing]}`}
        >
          {ROUTING_LABELS[applicant.routing]}
        </div>
      </div>

      <div className="flex items-center gap-6 mt-4 mb-6 text-sm font-mono">
        <div>
          <span className="text-[var(--color-slate)]">Risk score </span>
          <span className="text-lg">{applicant.riskScore}/100</span>
        </div>
        <div>
          <span className="text-[var(--color-slate)]">Channel </span>
          {applicant.verificationMethod}
        </div>
        <div>
          <span className="text-[var(--color-slate)]">Stage reached </span>
          {applicant.funnelStage}
        </div>
      </div>

      <div className="border-t border-[var(--color-line)] pt-4">
        <h3 className="font-display text-lg mb-3">Agent reasoning trace</h3>
        <ol className="space-y-4">
          {trace.map((step, i) => (
            <li key={i} className="flex gap-3">
              <div className="font-mono text-xs text-[var(--color-slate)] w-6 pt-0.5 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="font-display text-base">{step.title}</div>
                <p className="text-sm text-[var(--color-ink)]/80 mt-0.5 leading-relaxed">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {applicant.factors.length > 0 && (
        <div className="border-t border-[var(--color-line)] mt-6 pt-4">
          <h3 className="font-display text-lg mb-3">Contributing factors</h3>
          <div className="space-y-1.5">
            {applicant.factors
              .slice()
              .sort((a, b) => b.weight - a.weight)
              .map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm border border-[var(--color-line)] rounded px-3 py-2 bg-white/50"
                >
                  <span>{f.signal}</span>
                  <span className="font-mono text-xs text-[var(--color-slate)]">
                    +{f.weight.toFixed(1)} pts
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
