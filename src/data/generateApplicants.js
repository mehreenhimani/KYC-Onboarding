// Synthetic KYC applicant data generator
// Risk signals modeled on real-world onboarding patterns: document quality,
// PEP/sanctions screening, device/behavioral signals, address verification,
// and cross-border complexity factors used in EU digital banking onboarding.

const FIRST_NAMES = [
  "Lena", "Mateo", "Aisha", "Tomasz", "Sofia", "Pierre", "Noor", "Lukas",
  "Elena", "Andrei", "Mira", "Diego", "Yara", "Felix", "Priya", "Hassan",
  "Klara", "Marco", "Fatima", "Jonas", "Ines", "Rahul", "Greta", "Omar",
  "Anna", "Stefan", "Lucia", "Karim", "Nadia", "Erik"
];

const LAST_NAMES = [
  "Müller", "Garcia", "Kowalski", "Schmidt", "Rossi", "Dubois", "Khan",
  "Novak", "Andersson", "Popescu", "Weber", "Fischer", "Lopez", "Nowak",
  "Bauer", "Petrov", "Hoffmann", "Martin", "Wagner", "Becker"
];

const COUNTRIES = [
  { code: "DE", name: "Germany", region: "EEA", baseRisk: 0.05 },
  { code: "FR", name: "France", region: "EEA", baseRisk: 0.06 },
  { code: "ES", name: "Spain", region: "EEA", baseRisk: 0.07 },
  { code: "IT", name: "Italy", region: "EEA", baseRisk: 0.08 },
  { code: "PL", name: "Poland", region: "EEA", baseRisk: 0.09 },
  { code: "RO", name: "Romania", region: "EEA", baseRisk: 0.14 },
  { code: "NG", name: "Nigeria", region: "Non-EEA", baseRisk: 0.22 },
  { code: "TR", name: "Turkey", region: "Non-EEA", baseRisk: 0.16 },
  { code: "AE", name: "UAE", region: "Non-EEA", baseRisk: 0.18 },
  { code: "GB", name: "United Kingdom", region: "Non-EEA", baseRisk: 0.10 },
  { code: "IN", name: "India", region: "Non-EEA", baseRisk: 0.15 },
  { code: "BR", name: "Brazil", region: "Non-EEA", baseRisk: 0.17 },
];

const DOC_TYPES = ["Passport", "National ID Card", "Driving Licence", "Residence Permit"];
const VERIFICATION_METHODS = ["Video Selfie + NFC", "Photo ID Upload", "Bank Redirect (eIDAS)", "In-Branch (Partner)"];
const DEVICE_TYPES = ["iOS - Mobile App", "Android - Mobile App", "Web - Desktop", "Web - Mobile"];
const FUNNEL_STAGES = [
  "Registration Started",
  "Personal Details",
  "Document Upload",
  "Liveness Check",
  "Address Verification",
  "Risk Screening",
  "Account Activated",
];

// Seeded RNG for reproducible demo data
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), seed | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20260612);

function pick(arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function randRange(min, max) {
  return min + rng() * (max - min);
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

// Core risk scoring logic — mirrors a simplified version of real
// risk-based KYC frameworks (RBA under AMLD/GwG): combines document
// confidence, geographic risk, behavioral signals, and screening hits.
function computeRiskScore(applicant) {
  let score = 0;
  const factors = [];

  const docPenalty = (1 - applicant.docConfidence) * 35;
  score += docPenalty;
  if (applicant.docConfidence < 0.75) {
    factors.push({
      signal: "Document image quality",
      detail: `OCR confidence ${(applicant.docConfidence * 100).toFixed(0)}% — below the 75% auto-pass threshold`,
      weight: docPenalty,
      type: "document",
    });
  }

  const geoPenalty = applicant.country.baseRisk * 100;
  score += geoPenalty;
  if (applicant.country.region === "Non-EEA") {
    factors.push({
      signal: "Cross-border jurisdiction",
      detail: `Applicant resident in ${applicant.country.name} (non-EEA) — enhanced due diligence tier applies`,
      weight: geoPenalty,
      type: "geography",
    });
  }

  if (applicant.pepHit) {
    score += 28;
    factors.push({
      signal: "PEP screening match",
      detail: "Potential name match against politically exposed persons list — requires manual disambiguation",
      weight: 28,
      type: "screening",
    });
  }
  if (applicant.sanctionsHit) {
    score += 40;
    factors.push({
      signal: "Sanctions list match",
      detail: "Fuzzy match against EU consolidated sanctions list — mandatory manual review before activation",
      weight: 40,
      type: "screening",
    });
  }

  if (applicant.addressMismatch) {
    score += 15;
    factors.push({
      signal: "Address mismatch",
      detail: "Submitted address does not match document-issuing registry record",
      weight: 15,
      type: "address",
    });
  }

  if (applicant.velocityFlag) {
    score += 12;
    factors.push({
      signal: "Application velocity",
      detail: "Multiple onboarding attempts detected from this device fingerprint within 24h",
      weight: 12,
      type: "behavioral",
    });
  }
  if (applicant.vpnDetected) {
    score += 8;
    factors.push({
      signal: "VPN / proxy detected",
      detail: "IP geolocation inconsistent with declared residence — masking service detected",
      weight: 8,
      type: "behavioral",
    });
  }

  if (applicant.livenessScore < 0.7) {
    const livenessPenalty = (1 - applicant.livenessScore) * 20;
    score += livenessPenalty;
    factors.push({
      signal: "Liveness check confidence",
      detail: `Selfie-to-document match score ${(applicant.livenessScore * 100).toFixed(0)}% — below 70% threshold`,
      weight: livenessPenalty,
      type: "biometric",
    });
  }

  if (applicant.docExpiryMonths < 3) {
    score += 6;
    factors.push({
      signal: "Document nearing expiry",
      detail: `ID document expires in ${applicant.docExpiryMonths} month(s) — may require re-verification soon`,
      weight: 6,
      type: "document",
    });
  }

  score = clamp01(score / 100) * 100;

  let routing;
  if (score < 25) routing = "auto_approve";
  else if (score < 55) routing = "fast_track";
  else routing = "manual_review";

  return { score: Math.round(score), factors, routing };
}

function generateApplicant(id) {
  const country = pick(COUNTRIES);
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);

  const docConfidence = clamp01(randRange(0.55, 0.99));
  const livenessScore = clamp01(randRange(0.55, 0.99));
  const pepHit = rng() < 0.025;
  const sanctionsHit = rng() < 0.008;
  const addressMismatch = rng() < 0.10;
  const velocityFlag = rng() < 0.06;
  const vpnDetected = rng() < 0.08;
  const docExpiryMonths = Math.floor(randRange(0, 36));

  const applicant = {
    id,
    name: `${firstName} ${lastName}`,
    country,
    age: Math.floor(randRange(18, 72)),
    docType: pick(DOC_TYPES),
    verificationMethod: pick(VERIFICATION_METHODS),
    device: pick(DEVICE_TYPES),
    docConfidence,
    livenessScore,
    pepHit,
    sanctionsHit,
    addressMismatch,
    velocityFlag,
    vpnDetected,
    docExpiryMonths,
    timestamp: new Date(Date.now() - Math.floor(randRange(0, 72)) * 3600 * 1000).toISOString(),
  };

  const risk = computeRiskScore(applicant);
  applicant.riskScore = risk.score;
  applicant.factors = risk.factors;
  applicant.routing = risk.routing;

  const dropoffChance = risk.score / 100;
  let stageIndex = FUNNEL_STAGES.length - 1;
  for (let i = 0; i < FUNNEL_STAGES.length - 1; i++) {
    if (rng() < dropoffChance * 0.35) {
      stageIndex = i;
      break;
    }
  }
  applicant.funnelStage = FUNNEL_STAGES[stageIndex];
  applicant.completed = stageIndex === FUNNEL_STAGES.length - 1;

  return applicant;
}

export function generateApplicants(count = 240) {
  const applicants = [];
  for (let i = 1; i <= count; i++) {
    applicants.push(generateApplicant(`APP-${10000 + i}`));
  }
  return applicants;
}

export { FUNNEL_STAGES, COUNTRIES };
