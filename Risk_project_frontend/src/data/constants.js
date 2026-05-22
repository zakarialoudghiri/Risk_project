export const EXAMPLES = [
  "La porte du coffret non mise à la terre",
  "Tubage non conforme fiche technique validée",
  "Cable non attaché sur chemin de câble CDC",
  "La référence de la plaque non conforme",
  "Référence des luminaires R25 non conformes",
  "Manque des recettes F.O et Cat7 dossier TQC",
];

// Re-export ML classifier functions (Naive Bayes trained on real NC data)
export { classify, getConfidence, analyzeNC, knowledgeBase } from './classifier';

export const CRIT_LABELS = { critical: "CRITIQUE", high: "ÉLEVÉE", medium: "MOYENNE", low: "FAIBLE" };
export const CRIT_CLASSES = { critical: "crit-critical", high: "crit-high", medium: "crit-medium", low: "crit-low" };
export const CRIT_ICONS = { critical: "🔴", high: "🟠", medium: "🟡", low: "🟢" };
export const CRIT_COLORS = { critical: "#ff4444", high: "#ff8c42", medium: "#ffd166", low: "#06d6a0" };
