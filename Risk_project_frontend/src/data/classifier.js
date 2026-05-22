/**
 * Naive Bayes NC Classifier
 * Trained on real construction site NC data (ODS + XLSX)
 * Runs 100% client-side — no API, no backend
 */
import modelData from './model.json';
import knowledgeBase from './knowledgeBase.json';

const STOPWORDS = new Set([
  'le','la','les','l','de','du','des','d','un','une','et','en','est','a','au','aux',
  'ce','ces','cette','il','ne','pas','par','pour','que','qui','se','son','sa','ses',
  'sur','avec','dans','mais','ou','on','nous','vous','ils','elles','être','avoir',
  'été','sont','fait','plus','tout','très','non','oui','null','voir','ras','ok',
  'na','le','la','ii','er'
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .trim()
    .split(/[^a-zàâäéèêëïîôùûüÿçœæ0-9]+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t));
}

function softmax(scores) {
  const maxScore = Math.max(...scores);
  const exps = scores.map(s => Math.exp(s - maxScore));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sum);
}

/**
 * Classify NC text using Naive Bayes
 * @param {string} text - NC description in French
 * @returns {{ categoryKey: string, confidence: number, topCategories: Array }}
 */
export function classifyNC(text) {
  const tokens = tokenize(text);

  if (tokens.length === 0) {
    return {
      categoryKey: "Fiche d'amélioration",
      confidence: 30,
      topCategories: [],
    };
  }

  const { categories, priors, wordProbs, defaultProb } = modelData;

  const scores = categories.map(cat => {
    let score = priors[cat];
    for (const token of tokens) {
      score += (wordProbs[cat]?.[token] ?? defaultProb[cat]);
    }
    return score;
  });

  // Find best category
  let bestIdx = 0;
  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > scores[bestIdx]) bestIdx = i;
  }

  // Compute confidence via softmax
  const probs = softmax(scores);
  const confidence = Math.round(probs[bestIdx] * 100);

  // Top 5 categories
  const topCategories = categories
    .map((cat, i) => ({ category: cat, probability: Math.round(probs[i] * 100) }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5);

  return {
    categoryKey: categories[bestIdx],
    confidence: Math.max(25, Math.min(99, confidence)),
    topCategories,
  };
}

/**
 * Get knowledge base entry for a category
 */
export function getKBEntry(categoryKey) {
  return knowledgeBase[categoryKey] || knowledgeBase["Fiche d'amélioration"] || {
    category: "Général",
    subcategory: "Non classifié",
    lot: "Général",
    criticality: "medium",
    actions: [
      "Documenter la non-conformité avec photos et description précise",
      "Identifier le responsable d'exécution et notifier par fiche NC",
      "Définir le délai de levée et programmer une contre-visite",
      "Enregistrer dans le registre qualité du chantier"
    ],
    norm: "ISO 9001:2015 §8.7",
    delay: "À définir"
  };
}

/**
 * Classify text and return KB entry (backward-compatible with old classify())
 */
export function classify(text) {
  const { categoryKey } = classifyNC(text);
  return getKBEntry(categoryKey);
}

/**
 * Get confidence score for a text (backward-compatible with old getConfidence())
 */
export function getConfidence(text, _kb) {
  return classifyNC(text).confidence;
}

/**
 * Full analysis — returns KB entry + confidence + top categories
 */
export function analyzeNC(text) {
  const { categoryKey, confidence, topCategories } = classifyNC(text);
  const kb = getKBEntry(categoryKey);
  return { kb, confidence, topCategories, categoryKey };
}

export { knowledgeBase };
