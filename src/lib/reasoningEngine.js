// Reasoning engine — produces a step-by-step "case file" trace for each
// applicant, mirroring how an agentic KYC triage assistant would reason
// through a decision: gather signals -> evaluate against policy -> recommend.

const ROUTING_LABELS = {
  auto_approve: "AUTO-APPROVED",
  fast_track: "FAST-TRACKED",
  manual_review: "MANUAL REVIEW",
};

const ROUTING_COPY = {
  auto_approve: "No material risk signals detected. Cleared for immediate account activation under the standard due diligence tier.",
  fast_track: "Minor signals present but within tolerance. Routed for expedited automated re-check rather than full manual queue.",
  manual_review: "One or more signals exceed policy thresholds. Escalated to a compliance analyst before activation can proceed.",
};

export function buildReasoningTrace(applicant) {
  const steps = [];

  steps.push({
    title: "Intake",
    text: `Received application ${applicant.id} — ${applicant.name}, ${applicant.age}, resident of ${applicant.country.name}. Document type: ${applicant.docType}. Verification channel: ${applicant.verificationMethod}.`,
  });

  steps.push({
    title: "Document check",
    text: applicant.docConfidence >= 0.75
      ? `Document scan processed with ${(applicant.docConfidence * 100).toFixed(0)}% OCR confidence — passes the auto-extraction threshold (75%). Fields extracted cleanly.`
      : `Document scan processed with ${(applicant.docConfidence * 100).toFixed(0)}% OCR confidence — below the 75% threshold. Flagging for secondary review of extracted fields.`,
  });

  steps.push({
    title: "Biometric liveness",
    text: applicant.livenessScore >= 0.7
      ? `Selfie-to-document match scored ${(applicant.livenessScore * 100).toFixed(0)}% — comfortably above the 70% liveness threshold.`
      : `Selfie-to-document match scored ${(applicant.livenessScore * 100).toFixed(0)}% — below the 70% threshold. Possible lighting or image quality issue; cannot rule out a spoofing attempt from this signal alone.`,
  });

  steps.push({
    title: "Jurisdiction & screening",
    text: (() => {
      let t = `${applicant.country.name} classified as ${applicant.country.region}.`;
      if (applicant.country.region === "Non-EEA") {
        t += " Enhanced due diligence tier applies per cross-border policy.";
      }
      if (applicant.sanctionsHit) {
        t += " Name screening returned a fuzzy match against the EU consolidated sanctions list — sufficient on its own to require manual disambiguation.";
      } else if (applicant.pepHit) {
        t += " Name screening returned a possible PEP match — requires analyst confirmation before activation.";
      } else {
        t += " No sanctions or PEP matches found.";
      }
      return t;
    })(),
  });

  const behaviorBits = [];
  if (applicant.addressMismatch) behaviorBits.push("submitted address does not reconcile with the document-issuing registry");
  if (applicant.velocityFlag) behaviorBits.push("this device fingerprint has multiple onboarding attempts in the last 24 hours");
  if (applicant.vpnDetected) behaviorBits.push("connection appears to route through a VPN/proxy, inconsistent with declared residence");
  if (applicant.docExpiryMonths < 3) behaviorBits.push(`the submitted document expires in ${applicant.docExpiryMonths} month(s)`);

  steps.push({
    title: "Behavioral & device signals",
    text: behaviorBits.length > 0
      ? `Additional signals noted: ${behaviorBits.join("; ")}.`
      : "No anomalous device, address, or velocity signals detected.",
  });

  steps.push({
    title: "Aggregate risk assessment",
    text: `Combining the signals above produces a composite risk score of ${applicant.riskScore}/100. ${
      applicant.riskScore < 25
        ? "This falls in the low-risk band (under 25)."
        : applicant.riskScore < 55
        ? "This falls in the moderate-risk band (25 to 54)."
        : "This falls in the high-risk band (55 or above)."
    }`,
  });

  steps.push({
    title: "Recommendation",
    text: `${ROUTING_LABELS[applicant.routing]}. ${ROUTING_COPY[applicant.routing]}`,
  });

  return steps;
}

export { ROUTING_LABELS, ROUTING_COPY };
