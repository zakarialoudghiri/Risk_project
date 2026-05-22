// Knowledge base rebuilt from CFA.xlsx + CFO.xlsx
// Hotel Mixed-Use — CFO/CFA Non-Conformity Expert System

const STOPWORDS = new Set([
  'le','la','les','l','de','du','des','d','un','une','et','en','est','a','au','aux',
  'ce','ces','cette','il','ne','pas','par','pour','que','qui','se','son','sa','ses',
  'sur','avec','dans','mais','ou','on','nous','vous','ils','elles','non','oui','voir',
  'ras','ok','na','sont','fait','plus','tout','tres','bien','avoir','etre','aussi',
  'comme','si','car','donc','leur','leurs','dont','quand','alors','entre','apres',
  'avant','lors','ainsi','cela','cet','quel','quelle','quels','quelles','n','y',
  'moins','fort','moyen','afin','selon','concernant','suivant','rapport','type','fiche',
]);

function removeAccents(t) {
  return t.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Simple French plural stemmer — strips trailing -s/-es so "câbles"→"cable", "passages"→"passage"
function normalize(t) {
  if (t.length > 5 && t.endsWith('es')) return t.slice(0, -2);
  if (t.length > 4 && t.endsWith('s'))  return t.slice(0, -1);
  return t;
}

function tokenize(text) {
  return removeAccents(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t))
    .map(normalize);
}

function jaccard(a, b) {
  const sa = new Set(a);
  const sb = new Set(b);
  const inter = [...sa].filter(x => sb.has(x)).length;
  const union = new Set([...sa, ...sb]).size;
  return union === 0 ? 0 : inter / union;
}

export const NC_CASES = [

  // ══════════════════════════════════════════════════════════════════
  // CFA — TIRAGE DE CÂBLE  (source: CFA.xlsx)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfa-tirage-cable',
    type: 'CFA',
    category: 'Tirage de câble',
    typeFiche: 'TYPE DE NC CFA — Tirage de câble',
    keywords: ['tirage','cable','cfa','cheminement','passage','verification',
               'section','fixation','attache','reperage','mesure','gaine',
               'rebouchage','rayon','courbure','touret','caniveau',
               'longueur','identification','collier','degrade'],
    checkPoints: [
      'Cheminement du câble conforme au plan / Vérification des passages de câbles',
      'Câble — Marque, Type, État',
      'Disponibilité des documents (listes de câbles)',
      'Disponibilité du matériel (tourets, galets, etc.)',
      'Câbles tirés suivant spécifications et listes de câbles',
      'Conformité des rayons de courbure',
      'Fixation & rangement des câbles dans les caniveaux',
      'Attaches de câbles conformes aux spécifications',
      'Repérage / Identification des câbles',
      'Mesure de la longueur tirée',
      'Verticalité de la gaine des câbles',
      'Rebouchage et finition',
      'Section de câble',
    ],
    descriptions: [
      'Câble non attaché ou fixation non conforme sur chemin de câble',
      'Repérage et identification des câbles non conformes',
      'Cheminement câble non conforme au plan d\'exécution',
      'Rayon de courbure câble non conforme',
      'Manque tubage de protection aux traversées',
      'Section de câble non conforme à la liste de câbles',
    ],
    description: 'Non-conformités tirage de câble CFA — fixation, repérage, cheminement, section',
    solutions: [
      'Vérifier la conformité du cheminement câble selon les plans d\'exécution approuvés (PE)',
      'Contrôler les rayons de courbure minimaux conformément à NFC 15-100 §521 et ISO/IEC 11801',
      'Assurer la fixation et l\'attache des câbles tous les 30 cm dans les chemins de câble',
      'Réaliser le repérage complet et lisible sur chaque câble selon le plan de repérage validé',
      'Effectuer le rebouchage des traversées de murs, planchers et cloisons (résistance au feu ITM)',
      'Contrôler les sections de câble par rapport à la liste de câbles et à la NDC BET',
      'Mettre en place le tubage de protection manquant aux traversées et zones exposées',
      'Vérifier la marque, le type et l\'état des câbles posés vs fiche de validation',
      'S\'assurer de l\'absence de câbles posés sur les faux-plafonds sans support agréé',
      'Établir un PV de contrôle du tirage de câbles signé par le CdT et le MOE avant fermeture des goulottes',
    ],
    criticality: 'critical',
    criticité_fr: 'Critique',
    durée_h: 276,
    durée_range: '57 h – 539 h',
    norm: 'ISO/IEC 11801 + NFC 15-100 §521 + ISO 9001:2015 §8.5.1',
    checkPointDetails: [
      { id:1,  item:'Cheminement du câble (conforme au plan) / Vérification des passages de câbles', description:'Manque des recettes F.O et Cat7, et le dossier technique TQC',              correction:'Fournir les documents',                                            criticité:'Élevée',   criticality:'high',    durée_h:205 },
      { id:2,  item:'Câble (Marque, Type, État)',                                                     description:'Manque des recettes F.O et Cat7, et le dossier technique TQC',              correction:'Fournir les documents',                                            criticité:'Élevée',   criticality:'high',    durée_h:205 },
      { id:3,  item:'Disponibilité des documents (listes de câbles)',                                 description:'Manque des recettes F.O et Cat7, et le dossier technique TQC',              correction:'Fournir les documents',                                            criticité:'Élevée',   criticality:'high',    durée_h:205 },
      { id:4,  item:'Disponibilité de matériel (tourets, galets, etc.)',                              description:'Manque des recettes, porte documents et plan TQC',                          correction:'Entamer la mise en service et fournir les documents',               criticité:'Faible',   criticality:'low',     durée_h:539 },
      { id:5,  item:'Câbles tirés suivant spécifications et listes de câbles',                       description:'Manque des recettes, porte documents et plan TQC',                          correction:'Entamer la mise en service et fournir les documents',               criticité:'Moyenne',  criticality:'medium',  durée_h:539 },
      { id:6,  item:'Conformité des rayons de courbure',                                             description:'Manque des recettes, porte documents et plan TQC',                          correction:'Entamer la mise en service et fournir les documents',               criticité:'Critique', criticality:'critical', durée_h:539 },
      { id:7,  item:'Fixation & rangement des câbles dans les caniveaux',                            description:'Manque du dossier technique à jour, Quelque départs sont dégradés',         correction:'Fournir le dossier technique à jour et traiter les dégradations',   criticité:'Moyenne',  criticality:'medium',  durée_h:372 },
      { id:8,  item:'Attaches des câbles conforme aux spécifications',                               description:'Manque du dossier technique à jour, Quelque départs sont dégradés',         correction:'Fournir le dossier technique à jour et traiter les dégradations',   criticité:'Moyenne',  criticality:'medium',  durée_h:372 },
      { id:9,  item:'Repérage / Identification des câbles',                                          description:'Manque du dossier technique à jour, Quelque départs sont dégradés',         correction:'Fournir le dossier technique à jour et traiter les dégradations',   criticité:'Moyenne',  criticality:'medium',  durée_h:372 },
      { id:10, item:'Mesure de la longueur tirée',                                                   description:'Camera N17-TOU-CDI3 non affiché',                                           correction:'changement du pleug de camera',                                    criticité:'Moyenne',  criticality:'medium',  durée_h:57  },
      { id:11, item:'Verticalité de la gaine des câbles',                                            description:'Camera N17-TOU-CDI3 non affiché',                                           correction:'changement du pleug de camera',                                    criticité:'Moyenne',  criticality:'medium',  durée_h:57  },
      { id:12, item:'Rebouchage et finition',                                                        description:'Des coupure sur l\'enregistrement du camera N02-TOU-CDI7',                  correction:'reconfiguration du camera',                                        criticité:'Faible',   criticality:'low',     durée_h:62  },
      { id:13, item:'Section de câble',                                                              description:'Des coupure sur l\'enregistrement du camera N02-TOU-CDI7',                  correction:'reconfiguration du camera',                                        criticité:'Moyenne',  criticality:'medium',  durée_h:62  },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // CFA — TUBAGE  (source: CFA.xlsx)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfa-tubage',
    type: 'CFA',
    category: 'Tubage',
    typeFiche: 'TYPE DE NC CFA — Tubage',
    keywords: ['tubage','tube','cfa','voile','beton','mur','maconnerie','cloison',
               'verre','ba13','sol','boite','foyer','marque','isogris','orange',
               'cotation','altimetrie','diametre','encastrement'],
    checkPoints: [
      'Voiles en béton — Marque des tubes (Isogris / Tube orange)',
      'Voiles en béton — Cotations des foyers par rapport aux murs',
      'Voiles en béton — Altimétrie des foyers par rapport au sol',
      'Voiles en béton — Diamètre de tubage',
      'Murs en maçonnerie — Marque des tubes',
      'Murs en maçonnerie — Cotations des foyers par rapport aux murs',
      'Murs en maçonnerie — Altimétrie des foyers par rapport au sol',
      'Murs en maçonnerie — Diamètre de tubage',
      'Cloisons verre/BA13 — Marque des tubes',
      'Cloisons verre/BA13 — Cotations des foyers par rapport aux murs',
      'Cloisons verre/BA13 — Altimétrie des foyers par rapport au sol',
      'Cloisons verre/BA13 — Diamètre de tubage',
      'Sol (boites au sol) — Marque des tubes',
      'Sol (boites au sol) — Cotations des foyers',
      'Sol (boites au sol) — Altimétrie des foyers',
      'Sol (boites au sol) — Diamètre de tubage',
    ],
    descriptions: [
      'Cotation non conforme par rapport au plan d\'exécution',
      'Marque des tubes non conforme à la fiche de validation',
      'Diamètre de tubage non conforme aux spécifications',
      'Altimétrie des foyers non conforme',
      'Boîte d\'encastrement mal positionnée ou incorrectement cotée',
    ],
    description: 'Non-conformités tubage CFA — cotation, marque, diamètre, altimétrie, boîtes',
    solutions: [
      'Vérifier la marque des tubes (Isogris ou Tube orange selon spécification) pour chaque type de support',
      'Contrôler les cotations des foyers par rapport aux murs selon les plans d\'exécution',
      'Vérifier l\'altimétrie des foyers par rapport au sol selon les plans validés',
      'S\'assurer que le diamètre de tubage est conforme aux spécifications techniques (fiche de validation)',
      'Réaliser une inspection visuelle de chaque zone (voiles béton, maçonnerie, cloisons, sol)',
      'Mettre en place la boite d\'encastrement correctement positionnée avec la bonne cote d\'encastrement',
      'Remplacer les tubes non conformes par la marque validée ou obtenir une dérogation signée',
      'Vérifier le remplissage des tubes : max 40 % de la section intérieure',
      'Établir un PV de réception des tubages signé avant coulage ou fermeture des cloisons',
    ],
    criticality: 'critical',
    criticité_fr: 'Critique',
    durée_h: 278,
    durée_range: '57 h – 539 h',
    norm: 'NFC 15-100 §521 + NF EN 61386 + ISO 9001:2015 §8.5.1',
    tubageGroups: [
      {
        group: 'Tubage dans les voiles en béton',
        elements: [
          { element:'Marque des tubes (Isogris/Tube orange)',        description:'Manque des recettes F.O et Cat7, et le dossier technique TQC',              correction:'Fournir les documents',                                           criticité:'Élevée',   criticality:'high',    durée_h:205 },
          { element:'Cotations des foyers par rapport aux murs',     description:'Manque des recettes F.O et Cat7, et le dossier technique TQC',              correction:'Fournir les documents',                                           criticité:'Élevée',   criticality:'high',    durée_h:205 },
          { element:'Altimétrie des foyers par rapport au Sol',      description:'Manque des recettes F.O et Cat7, et le dossier technique TQC',              correction:'Fournir les documents',                                           criticité:'Élevée',   criticality:'high',    durée_h:205 },
          { element:'Diamètre de tubage',                            description:'Manque des recettes, porte documents et plan TQC',                          correction:'Entamer la mise en service et fournir les documents',              criticité:'Faible',   criticality:'low',     durée_h:539 },
        ],
      },
      {
        group: 'Tubage dans les murs en maçonnerie',
        elements: [
          { element:'Marque des tubes (Isogris/Tube orange)',        description:'Manque des recettes, porte documents et plan TQC',                          correction:'Entamer la mise en service et fournir les documents',              criticité:'Moyenne',  criticality:'medium',  durée_h:539 },
          { element:'Cotations des foyers par rapport aux murs',     description:'Manque des recettes, porte documents et plan TQC',                          correction:'Entamer la mise en service et fournir les documents',              criticité:'Critique', criticality:'critical', durée_h:539 },
          { element:'Altimétrie des foyers par rapport au Sol',      description:'Manque du dossier technique à jour. Quelque départs sont dégradés',         correction:'Fournir le dossier technique à jour et traiter les dégradations',  criticité:'Moyenne',  criticality:'medium',  durée_h:372 },
          { element:'Diamètre de tubage',                            description:'Manque du dossier technique à jour. Quelque départs sont dégradés',         correction:'Fournir le dossier technique à jour et traiter les dégradations',  criticité:'Moyenne',  criticality:'medium',  durée_h:372 },
        ],
      },
      {
        group: 'Tubage dans les cloisons en vitre/BA13',
        elements: [
          { element:'Marque des tubes (Isogris/Tube orange)',        description:'Manque du dossier technique à jour. Quelque départs sont dégradés',         correction:'Fournir le dossier technique à jour et traiter les dégradations',  criticité:'Moyenne',  criticality:'medium',  durée_h:372 },
          { element:'Cotations des foyers par rapport aux murs',     description:'Camera N17-TOU-CDI3 non affiché',                                           correction:'changement du pleug de camera',                                   criticité:'Moyenne',  criticality:'medium',  durée_h:57  },
          { element:'Altimétrie des foyers par rapport au Sol',      description:'Camera N17-TOU-CDI3 non affiché',                                           correction:'changement du pleug de camera',                                   criticité:'Moyenne',  criticality:'medium',  durée_h:57  },
          { element:'Diamètre de tubage',                            description:'Des coupure sur l\'enregistrement du camera N02-TOU-CDI7',                  correction:'reconfiguration du camera',                                       criticité:'Faible',   criticality:'low',     durée_h:62  },
        ],
      },
      {
        group: 'Tubage dans le sol (boites au sol)',
        elements: [
          { element:'Marque des tubes (Isogris/Tube orange)',        description:'Des coupure sur l\'enregistrement du camera N02-TOU-CDI7',                  correction:'reconfiguration du camera',                                       criticité:'Élevée',   criticality:'high',    durée_h:62  },
          { element:'Cotations des foyers par rapport aux murs',     description:'Des coupure sur l\'enregistrement du camera N02-TOU-CDI8',                  correction:'reconfiguration du camera',                                       criticité:'Moyenne',  criticality:'medium',  durée_h:86  },
          { element:'Altimétrie des foyers par rapport au Sol',      description:'Des coupure sur l\'enregistrement du camera N02-TOU-CDI9',                  correction:'reconfiguration du camera',                                       criticité:'Élevée',   criticality:'high',    durée_h:110 },
          { element:'Diamètre de tubage',                            description:'Des coupure sur l\'enregistrement du camera N02-TOU-CDI10',                 correction:'reconfiguration du camera',                                       criticité:'Élevée',   criticality:'high',    durée_h:134 },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // CFA — PRÉCÂBLAGE VDI  (source: CFO.xlsx — Autocontrôle CFA - Précablage VDI)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfa-precablage-vdi',
    type: 'CFA',
    category: 'Précâblage VDI',
    typeFiche: 'Autocontrôle CFA — Précâblage VDI',
    keywords: ['precablage','vdi','cfa','recette','cat7','fo','fibre','optique',
               'tqc','reseau','donnees','informatique','rj45','patch'],
    checkPoints: [],
    descriptions: [
      'Manque des recettes F.O et Cat7, et le dossier technique TQC',
      'Manque des recettes, porte-documents et plan TQC',
      'Manque du dossier technique à jour — quelques départs sont dégradés',
    ],
    description: 'Manque des recettes F.O et Cat7, et le dossier technique TQC',
    solutions: [
      'Fournir les recettes F.O (fibre optique) et Cat7 complètes et signées',
      'Entamer la mise en service et fournir tous les documents TQC requis',
      'Fournir le dossier technique à jour et remédier aux dégradations constatées',
      'Vérifier la conformité du précâblage VDI selon la norme ISO/IEC 11801 et EN 50173',
      'Réaliser les mesures de réflectométrie (OTDR) sur les liens fibre optique',
      'Effectuer les tests de performances sur les liens cuivre Cat7 (test autorisé selon TIA-1152)',
      'S\'assurer que le brassage est correctement réalisé et repéré dans les baies informatiques',
      'Vérifier la mise à la terre des chemins de câbles VDI et des baies de brassage',
      'Livrer le DOE (Dossier des Ouvrages Exécutés) complet avec les résultats de mesures',
    ],
    criticality: 'high',
    criticité_fr: 'Élevée',
    durée_h: 372,
    durée_range: '205 h – 539 h',
    norm: 'ISO/IEC 11801 + EN 50173 + ISO 9001:2015 §8.5.1',
  },

  // ══════════════════════════════════════════════════════════════════
  // CFA — VIDÉOSURVEILLANCE  (source: CFO.xlsx — Autocontrôle CFA - Video)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfa-video',
    type: 'CFA',
    category: 'Vidéosurveillance',
    typeFiche: 'Autocontrôle CFA — Vidéosurveillance',
    keywords: ['video','camera','cfa','enregistrement','coupure','nvr','affichage',
               'surveillance','plug','reconfiguration','dvr','poe','reseau'],
    checkPoints: [],
    descriptions: [
      'Camera N17-TOU-CDI3 non affiché',
      'Des coupure sur l\'enregistrement du camera N02-TOU-CDI7',
      'Caméra non conforme',
      'Camera non conforme',
    ],
    description: 'Camera non affichée / Coupures sur l\'enregistrement',
    solutions: [
      'Procéder au changement du plug (connecteur) de la caméra défectueuse',
      'Effectuer la reconfiguration de la caméra dans le logiciel de gestion NVR/DVR',
      'Vérifier la stabilité de l\'alimentation PoE (switch PoE, budget de puissance)',
      'Contrôler la qualité du câblage réseau (atténuation, continuité, connectique RJ45)',
      'Vérifier les paramètres de compression vidéo (codec H.264/H.265) et le bitrate',
      'Contrôler la capacité de stockage disponible sur le NVR (disques, RAID)',
      'S\'assurer de l\'absence de conflits d\'adresses IP sur le réseau vidéo',
      'Vérifier l\'emplacement de la caméra par rapport au plan d\'implantation validé',
      'Mettre à jour le firmware de la caméra et du NVR vers la dernière version stable',
      'Réaliser et documenter les tests de fonctionnement complets (détection, enregistrement, PTZ)',
    ],
    criticality: 'medium',
    criticité_fr: 'Moyenne',
    durée_h: 60,
    durée_range: '57 h – 62 h',
    norm: 'EN 62676 + NFC 15-100 §521 + ISO 9001:2015 §8.5.1',
  },

  // ══════════════════════════════════════════════════════════════════
  // CFO — CÂBLAGE  (source: CFO.xlsx)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfo-cablage',
    type: 'CFO',
    category: 'Câblage',
    typeFiche: 'Autocontrôle CFO — Câblage',
    keywords: ['cablage','cfo','ndc','note','calcul','jour','bilan','puissance',
               'section','conducteur','fusible','protection'],
    checkPoints: [],
    descriptions: [
      'Manque de la NDC (Note de Calcul) à jour',
    ],
    description: 'Manque de la NDC à jour',
    solutions: [
      'Fournir la NDC (Note de Calcul) à jour, signée et approuvée par le BET',
      'Vérifier la cohérence entre la NDC et les schémas d\'exécution en vigueur',
      'Mettre à jour le DOE avec la version finale de la NDC validée',
      'Contrôler que les sections de câbles sont conformes aux résultats de la NDC',
      'Vérifier les chutes de tension et les bilans de puissance selon la NDC révisée',
      'Planifier une réunion de validation avec le BET et le MOE pour approuver la NDC',
      'Archiver les versions précédentes de la NDC avec justification des révisions',
      'Vérifier la conformité des câbles posés (section, type, longueur) avec la NDC approuvée',
    ],
    criticality: 'high',
    criticité_fr: 'Élevée',
    durée_h: 178,
    durée_range: '178 h',
    norm: 'NFC 15-100 §521 + UTE C15-105 + ISO 9001:2015 §8.5.1',
  },

  // ══════════════════════════════════════════════════════════════════
  // CFO — CHEMIN DE CÂBLE  (source: CFO.xlsx)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfo-cdc',
    type: 'CFO',
    category: 'Chemin de câble',
    typeFiche: 'Autocontrôle CFO — Chemin de câble',
    keywords: ['chemin','cable','cdc','cfo','galvanisation','support','reperage',
               'corrosion','zinc','fixation','dalle','suspendu','aco'],
    checkPoints: [],
    descriptions: [
      'Galvanisation à reprendre',
      'Manque galvanisation de support CDC',
      'Manque galvanisation des supports',
      'Voir la fiche',
    ],
    description: 'Galvanisation à reprendre — chemin de câble CFO non conforme',
    solutions: [
      'Galvaniser tous les supports et chemins de câble manquants selon NF EN ISO 1461',
      'Appliquer une protection anti-corrosion (zinc spray) sur les zones dégradées ou coupées',
      'Mettre en place le repérage complet et conforme au plan de repérage approuvé',
      'Voir et traiter la fiche d\'Action Corrective Officielle (ACO) associée',
      'Vérifier la continuité électrique de la mise à la terre des chemins de câble (résistance < 1 Ω)',
      'Contrôler le serrage de tous les boulons et éléments de fixation des supports CDC',
      'S\'assurer que les couvercles des chemins de câble sont posés et verrouillés',
      'Établir un PV de réception des CDC signé par le CdT et le MOE avant encastrement',
    ],
    criticality: 'medium',
    criticité_fr: 'Moyenne',
    durée_h: 209,
    durée_range: '32 h – 490 h',
    norm: 'NFC 15-100 §521 + NF EN ISO 1461 + ISO 9001:2015 §8.5.1',
  },

  // ══════════════════════════════════════════════════════════════════
  // CFO — COFFRET ÉLECTRIQUE (Repérage & Schémas)  (source: CFO.xlsx)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfo-coffret-reperage',
    type: 'CFO',
    category: 'Coffret électrique',
    typeFiche: 'Autocontrôle CFO — Coffret électrique',
    keywords: ['coffret','tableau','cfo','reperage','schema','unifilaire','multifilaire',
               'composant','armoire','centrale','mesure','nettoyage','bobine','imx',
               'disjoncteur','divisionnaire','relais','phase','bloc','differentiel',
               'compteur','protection','moteur','serrage','appareillage','qm3','parafoudre',
               'marque','repere'],
    checkPoints: [],
    descriptions: [
      'Manque repérage des composants',
      'Manque repérage',
      'Manque schéma unifilaire',
      'Manque schéma multifilaire',
      'Manque repérage et schéma unifilaire',
      'Manque schéma unifilaire & disjoncteurs',
      'Manque bobine IMX & schéma unifilaire',
      'Manque disjoncteur divisionnaire, disjoncteurs et schéma multifilaire',
      'Manque disjoncteurs divisionnaires, schéma multifilaire',
      'Nettoyage de l\'armoire requis',
      'Repérage des centrales de mesures non effectué',
      'Manque de relais de phase',
      'Manque relais de phase',
      'Manque du relais de phase',
      'Manque protection des compteurs',
      'Manque de repérage / Manque protection des compteurs',
      'Manque repérage / Manque protection des compteurs',
      'Manque protection des compteurs / Manque repérage',
      'Manque protection des compteurs / Manque de repérage',
      'Manque protection des compteurs / Manque repérage des composants',
      'Manque repérage / Manque protections des compteurs',
      'Manque repérage des centrales de mesures + calibre QM3 non conforme',
      'Manque repérage des centrales de mesures + disjoncteur moteur',
      'Manque repérage des centrales de mesures + disjoncteur moteur et Q16',
      'Manque repérage ID1 et ID2 et manque serrage porte',
      'Manque repère composant / Sous réserve de justification concernant le changement de la marque parafoudre',
      'Manque schéma et disjoncteur',
      'Manque schéma multifilaire & Manque parafoudre',
      'Manque schéma multifilaire et disjoncteur',
      'Manque schéma multifilaire, multifilaire et appareillage non conforme',
      'Voir la fiche',
      'Manque schéma unifilaire et disjoncteur',
      'Manque schéma unifilaire et disjoncteurs',
      'Manque schéma unifilaire multifilaire et repérage',
      'Manque schéma unifilaire, parafoudre',
      'Manque bloc différentiel & Manque repérage et la marque',
      'Nettoyage de l\'armoire',
      'Nettoyage de l\'armoire / Repérage des centrale de mesure non fait',
      'Repérage des centrales de mesures non fait + nettoyage de l\'armoire',
      'Repérage et la marque non conformes',
      'Repères non conformes',
    ],
    description: 'Manque repérage, schéma, relais de phase, protection des compteurs, appareillage non conforme ou repères non conformes',
    solutions: [
      'Compléter le repérage de tous les composants selon la nomenclature du DOE',
      'Déposer les schémas unifilaires et multifilaires à jour dans le coffret',
      'Mettre en conformité l\'appareillage selon la NDC validée par le BET',
      'Poser les protections des compteurs manquantes',
      'Installer et repérer les centrales de mesures conformément au plan',
      'Installer le relais de phase sur les départs moteurs conformément aux spécifications',
      'Nettoyer l\'intérieur de l\'armoire et s\'assurer de l\'absence de corps étrangers',
      'Vérifier la conformité du repérage ID1 et ID2 et assurer le serrage de la porte',
      'Réaliser un essai fonctionnel complet de chaque départ après mise en conformité',
      'Archiver la version finale du schéma multifilaire dans le DOE de réception',
    ],
    criticality: 'high',
    criticité_fr: 'Élevée',
    durée_h: 494,
    durée_range: '6 h – 2 269 h',
    norm: 'NFC 15-100 §533, §537 + ISO 9001:2015 §8.5.1',
  },

  // ══════════════════════════════════════════════════════════════════
  // CFO — COFFRET ÉLECTRIQUE (Mise à la terre)  (source: CFO.xlsx)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfo-coffret-mat',
    type: 'CFO',
    category: 'Coffret électrique — Mise à la terre',
    typeFiche: 'Autocontrôle CFO — Coffret électrique',
    keywords: ['coffret','cfo','terre','raccordement','porte','mis','raccorde',
               'tresse','equipotentiel','conducteur','protection','pe'],
    checkPoints: [],
    descriptions: [
      'La mise à la terre non raccordée',
      'La porte non mise à la terre',
    ],
    description: 'La mise à la terre du coffret non raccordée',
    solutions: [
      'Raccorder la mise à la terre de l\'armoire sur le réseau de terre général du bâtiment',
      'Mettre à la terre la porte du coffret avec une tresse souple de section ≥ 6 mm²',
      'Vérifier la continuité du conducteur de protection (PE) depuis le TGBT jusqu\'au coffret',
      'Mesurer la résistance de terre : valeur attendue < 1 Ω (voire < 0,1 Ω en HT)',
      'Vérifier l\'absence de coupure ou de mauvaise connexion sur toute la boucle de terre',
      'Contrôler que toutes les masses métalliques accessibles sont reliées au conducteur PE',
      'Réaliser l\'essai de continuité équipotentielle avant la mise sous tension',
      'Documenter les mesures de terre dans le procès-verbal de recette électrique (PV)',
      'Planifier un contrôle périodique de la résistance de terre (vérification annuelle recommandée)',
    ],
    criticality: 'critical',
    criticité_fr: 'Critique',
    durée_h: 220,
    durée_range: '3 h – 2 247 h',
    norm: 'NFC 15-100 §411, §533 + NF EN 50522 + ISO 9001:2015',
  },

  // ══════════════════════════════════════════════════════════════════
  // CFO — COFFRET ÉLECTRIQUE (Parafoudre / Calibre)  (source: CFO.xlsx)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfo-coffret-protection',
    type: 'CFO',
    category: 'Coffret électrique — Protection',
    typeFiche: 'Autocontrôle CFO — Coffret électrique',
    keywords: ['parafoudre','calibre','disjoncteur','cfo','qm1','qm3','protection',
               'conforme','marque','reference','justification','derogation','calcul'],
    checkPoints: [],
    descriptions: [
      'Parafoudre non conforme',
      'PARAFOUDRE NON CONFORME',
      'Parafoudre non conforme — marque différente de celle validée',
      'Calibre du QM1 non conforme + manque des centrales de mesures',
      'Sous réserve de justification concernant le changement de la marque parafoudre',
      'Sous réserve de justification concernant le changement de la marque parafoudre et de la référence du disjoncteur',
      'Le calibre est différent de celui indiqué dans la note de calcul',
    ],
    description: 'Parafoudre non conforme et/ou calibre de protection non conforme',
    solutions: [
      'Remplacer le parafoudre par le modèle conforme à la fiche technique validée par le BET',
      'Changer le disjoncteur QM1/QM3 par un calibre conforme à la note de calcul',
      'Poser le repérage des centrales de mesures manquantes',
      'Fournir une justification technique ou une dérogation approuvée par le BET en cas de changement de marque',
      'Vérifier la classe de parafoudre (Type 1, 2 ou 3) selon l\'exposition foudre du site',
      'Contrôler l\'état et la connectique du parafoudre (cartouches, voyant de signalisation)',
      'Vérifier la sélectivité entre le disjoncteur amont et les protections aval après changement de calibre',
      'Réaliser une vérification fonctionnelle des protections différentielles et disjoncteurs',
      'Mettre à jour les schémas unifilaires avec le matériel réellement installé',
    ],
    criticality: 'high',
    criticité_fr: 'Élevée',
    durée_h: 1903,
    durée_range: '468 h – 1 903 h',
    norm: 'NFC 15-100 §533 + NF EN 61643-11 + ISO 9001:2015 §8.5.1',
  },

  // ══════════════════════════════════════════════════════════════════
  // CFO — ÉCLAIRAGE  (source: CFO.xlsx)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfo-eclairage',
    type: 'CFO',
    category: 'Éclairage',
    typeFiche: 'Autocontrôle CFO — Éclairage',
    keywords: ['eclairage','spot','luminaire','lampe','suspension','serrage','cfo',
               'allumage','reference','hauteur','driver','ballast','led','flux'],
    checkPoints: [],
    descriptions: [
      '10 spots non allumés',
      'Hauteur de suspension non conforme (S12, S13, S14)',
      'des hauteur de suspension (s12,s13,s14)',
      'Référence des luminaires R25 non conformes',
      'Serrage non conforme',
    ],
    description: 'Spots non allumés / hauteur de suspension et référence luminaire non conformes',
    solutions: [
      'Identifier et remplacer les spots défaillants (vérifier driver LED, connectique, alimentation)',
      'Ajuster la hauteur de suspension des luminaires S12, S13, S14 conformément aux plans d\'exécution',
      'Remplacer les luminaires R25 par la référence conforme à la fiche de validation matériel',
      'Contrôler et corriger le serrage de tous les luminaires (risque de chute)',
      'Vérifier l\'alimentation de chaque spot (tension, polarité, calibre de protection)',
      'Tester le fonctionnement de chaque luminaire après remplacement (allumage, gradation)',
      'Vérifier la conformité des niveaux d\'éclairement (lux) par rapport aux exigences projet',
      'Contrôler l\'indice de protection (IP) des luminaires selon les locaux (IP44 min en locaux humides)',
      'Documenter les essais d\'éclairage avec les mesures luxmétriques dans le PV de réception',
    ],
    criticality: 'medium',
    criticité_fr: 'Moyenne',
    durée_h: 691,
    durée_range: '205 h – 2 462 h',
    norm: 'NFC 15-100 §559 + EN 60598 + ISO 9001:2015 §8.5.1',
  },

  // ══════════════════════════════════════════════════════════════════
  // CFO — INSTALLATION GROUPE ÉLECTROGÈNE  (source: CFO.xlsx)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfo-install-ge',
    type: 'CFO',
    category: 'Installation Groupe électrogène',
    typeFiche: 'Autocontrôle CFO — Installation Groupe électrogène',
    keywords: ['installation','groupe','electrogene','cfo','ge','generatrice',
               'diesel','automatisme','demarrage','relance'],
    checkPoints: [],
    descriptions: [
      'Éléments à vérifier non achevés',
      'éléments à vérifier non achevé',
    ],
    description: 'Éléments d\'installation du groupe électrogène non achevés',
    solutions: [
      'Relancer l\'équipe travaux pour achèvement des éléments d\'installation ASAP',
      'Vérifier la fixation et le génie civil de la dalle anti-vibratile du groupe électrogène',
      'Contrôler le raccordement des câbles de puissance (BT, commandes) et des protections',
      'Vérifier le circuit d\'échappement (silencieux, conduit, evacuation des gaz)',
      'S\'assurer du raccordement du circuit carburant (réservoir journalier, tuyauteries, vannes)',
      'Vérifier le circuit de refroidissement (radiateur, niveau eau, ventilation du local)',
      'Effectuer les essais de démarrage manuel et automatique du GE selon la procédure constructeur',
      'Tester le basculement automatique en cas de coupure secteur (temps de démarrage < 15 s)',
      'Établir un PV de mise en service du groupe signé par le constructeur et le MOE',
    ],
    criticality: 'high',
    criticité_fr: 'Élevée',
    durée_h: 84,
    durée_range: '84 h',
    norm: 'NFC 15-100 + NF ISO 8528 + ISO 9001:2015 §8.5.1',
  },

  // ══════════════════════════════════════════════════════════════════
  // CFO — MISE À LA TERRE (Générale)  (source: CFO.xlsx)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfo-mat',
    type: 'CFO',
    category: 'Mise à la terre',
    typeFiche: 'Autocontrôle CFO — Mise à la terre',
    keywords: ['mise','terre','cfo','mat','equipotentiel','tellurometre',
               'piquet','fouille','conducteur','cuivre','resistance','masse',
               'tep','ltes','ltep','liaisons'],
    checkPoints: [],
    descriptions: [
      'Voir PJ — repère les câbles et màj plan',
      'Voir PJ',
    ],
    description: 'Repérage des câbles de terre et plan MAT non mis à jour',
    solutions: [
      'Repérer tous les câbles de mise à la terre et mettre à jour le plan MAT',
      'Vérifier la résistance du réseau de terre : valeur ≤ 5 Ω (norme NFC 15-100)',
      'Contrôler la continuité du conducteur de protection depuis les prises de terre jusqu\'au TGBT',
      'S\'assurer de la bonne connexion des liaisons équipotentielles principales (LTEP) et supplémentaires (LTES)',
      'Vérifier la section minimale du conducteur de terre (16 mm² Cu nu ou 25 mm² Cu protégé)',
      'Contrôler la mise à la terre de tous les éléments métalliques (tableaux, chemins de câble, armatures)',
      'Réaliser les mesures de résistance de terre avec un telluromètre et documenter les résultats',
      'Mettre à jour le plan de masse avec toutes les liaisons de terre réalisées',
    ],
    criticality: 'critical',
    criticité_fr: 'Critique',
    durée_h: 38,
    durée_range: '38 h',
    norm: 'NFC 15-100 §541, §542 + NF EN 50522 + ISO 9001:2015',
  },

  // ══════════════════════════════════════════════════════════════════
  // CFO — MONTAGE DE CELLULE MT  (source: CFO.xlsx)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfo-cellule-mt',
    type: 'CFO',
    category: 'Montage de cellule MT',
    typeFiche: 'Autocontrôle CFO — Montage de cellule MT',
    keywords: ['cellule','cfo','moyenne','tension','mt','hta','arrivee','depart',
               'disjoncteur','sectionneur','tc','tp','protection','activation'],
    checkPoints: [],
    descriptions: [
      'Éléments à vérifier manquants — Activation et rappel requis',
      'Éléments à vérifier manquant',
    ],
    description: 'Éléments à vérifier manquants sur le montage cellule MT',
    solutions: [
      'Effectuer l\'activation et le rappel des actions de mise en conformité ASAP',
      'Vérifier la fixation mécanique et le calage des cellules MT selon les plans constructeur',
      'Contrôler le raccordement des câbles HTA (phase, gaine, mise à la terre des écrans)',
      'Vérifier les connexions des transformateurs de courant (TC) et de tension (TP)',
      'Tester le fonctionnement des protections (relais de protection, déclencheurs)',
      'Vérifier le système de verrouillage et de condamnation des cellules (sécurité)',
      'Réaliser les essais de rigidité diélectrique avant la mise sous tension HTA',
      'Contrôler la séquence de manœuvre des cellules avec le gestionnaire du réseau',
      'Établir le protocole de mise en service HTA signé par un organisme agréé (consignation)',
    ],
    criticality: 'critical',
    criticité_fr: 'Critique',
    durée_h: 56,
    durée_range: '56 h',
    norm: 'NFC 13-100 + CEI 62271-200 + ISO 9001:2015 §8.5.1',
  },

  // ══════════════════════════════════════════════════════════════════
  // CFO — MONTAGE GROUPE ÉLECTROGÈNE  (source: CFO.xlsx)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfo-montage-ge',
    type: 'CFO',
    category: 'Montage Groupe électrogène',
    typeFiche: 'Autocontrôle CFO — Montage Groupe électrogène',
    keywords: ['montage','groupe','electrogene','cfo','ge','assemblage','structure',
               'socle','accouplage','alternateur','moteur','diesel'],
    checkPoints: [],
    descriptions: [],
    description: 'Éléments de montage du groupe électrogène à vérifier',
    solutions: [
      'Vérifier le serrage et l\'alignement de l\'accouplement moteur-alternateur',
      'Contrôler la fixation du groupe sur sa dalle anti-vibratile (boulons, silent-blocs)',
      'Vérifier le niveau d\'huile moteur, le liquide de refroidissement et le carburant',
      'Contrôler le câblage de la commande et des protections électriques du groupe',
      'Tester la mise à la terre du bâti du groupe et de l\'alternateur',
      'Vérifier les protections thermiques du groupe (thermostat, pressostat huile)',
      'Effectuer un essai de fonctionnement à vide (30 min) puis en charge (60 min)',
      'Contrôler les niveaux de vibrations et de bruit selon les seuils admissibles',
      'Établir la fiche de mise en service constructeur complète et signée',
    ],
    criticality: 'high',
    criticité_fr: 'Élevée',
    durée_h: 132,
    durée_range: '132 h',
    norm: 'NFC 15-100 + NF ISO 8528 + ISO 9001:2015 §8.5.1',
  },

  // ══════════════════════════════════════════════════════════════════
  // CFO — POSTE TRANSFORMATEUR  (source: CFO.xlsx)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfo-poste-transfo',
    type: 'CFO',
    category: 'Poste transformateur',
    typeFiche: 'Autocontrôle CFO — Poste transformateur',
    keywords: ['poste','transfo','transformateur','cfo','ht','bt','livraison',
               'reseau','tgbt','agir','elements','acheves'],
    checkPoints: [],
    descriptions: [
      'Éléments à vérifier non achevés',
      'Eléments à vérifier non achevés.',
    ],
    description: 'Éléments du poste transformateur non achevés — Agir ASAP',
    solutions: [
      'Agir ASAP pour l\'achèvement de tous les éléments à vérifier du poste HTA/BT',
      'Vérifier la conformité de l\'installation du transformateur (calage, fixation, distances)',
      'Contrôler les connexions HTA (câbles arrivée réseau, cellules) et BT (jeux de barres, TGBT)',
      'Vérifier la mise à la terre du poste (transformateur, enveloppe, réseau de terre)',
      'Contrôler le niveau d\'huile diélectrique et l\'état du conservateur (transformateur huile)',
      'Réaliser les essais de rigidité diélectrique et de rapport de transformation',
      'Vérifier le système de ventilation du local (grilles, extracteurs, température ambiante)',
      'Obtenir le PV de mise en service du poste signé par le concessionnaire et le BET',
    ],
    criticality: 'critical',
    criticité_fr: 'Critique',
    durée_h: 84,
    durée_range: '84 h',
    norm: 'NFC 13-100 + CEI 60076 + ISO 9001:2015 §8.5.1',
  },

  // ══════════════════════════════════════════════════════════════════
  // CFO — PRISE DE COURANT  (source: CFO.xlsx)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfo-prise-courant',
    type: 'CFO',
    category: 'Prise de courant',
    typeFiche: 'Autocontrôle CFO — Prise de courant',
    keywords: ['prise','courant','cfo','plaque','reference','conforme','boite',
               'encastrement','socle','16a','20a','2p','3p','type'],
    checkPoints: [],
    descriptions: [
      'La référence de la plaque',
      'La référence de la plaque non conforme',
      'La référence de plaque non conforme',
      'La référence de la plaque non conforme à la spécification technique',
    ],
    description: 'Référence de la plaque de prise de courant non conforme',
    solutions: [
      'Procéder au changement de la plaque par la référence conforme à la fiche de validation matériel',
      'Vérifier que la référence de chaque prise est conforme à la spécification technique validée',
      'Contrôler le type de prise (2P, 2P+T, 3P+T) selon le plan d\'implantation et la NDC',
      'Vérifier le calibre de la prise (16 A, 20 A, 32 A) par rapport au circuit de distribution',
      'Contrôler la côte d\'encastrement de la boîte et son horizontalité / verticalité',
      'Vérifier la connexion et le serrage des conducteurs (phase, neutre, PE) dans la prise',
      'Tester le fonctionnement de chaque prise avec un testeur de prise (polarité, présence terre)',
      'Vérifier l\'indice de protection (IP) des prises selon les locaux (IP44 min cuisine/extérieur)',
      'Établir la liste de contrôle des prises de courant validée dans le DOE de réception',
    ],
    criticality: 'medium',
    criticité_fr: 'Moyenne',
    durée_h: 659,
    durée_range: '38 h – 9 270 h',
    norm: 'NFC 15-100 §553 + EN 60884 + ISO 9001:2015 §8.5.1',
  },

  // ══════════════════════════════════════════════════════════════════
  // CFO — TIRAGE DE CÂBLE  (source: CFO.xlsx)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfo-tirage-cable',
    type: 'CFO',
    category: 'Tirage de câble',
    typeFiche: 'Autocontrôle CFO — Tirage de câble',
    keywords: ['tirage','cable','cfo','attachement','fixation','reperage','gaine',
               'tubage','emplacement','cfi','cdc','attache','collier','aco'],
    checkPoints: [],
    descriptions: [
      'Attachement du câble non conforme',
      'Câble non attaché sur CDC',
      'Repérage et gaine des câbles NC',
      'Repérage et attachement de câble sur CDC NC',
      'Manque repère câble',
      'Manque tubage',
      'Emplacement de caméra non conforme par rapport au plan',
      'Voir fiche ACO',
      'voir la fiche',
    ],
    description: 'Attachement et repérage des câbles non conformes sur chemins de câble',
    solutions: [
      'Assurer une fixation conforme des câbles avec colliers agréés selon les règles de l\'art',
      'Attacher tous les câbles sur les chemins de câble (CDC) suivant la règle de l\'art',
      'Repérer chaque câble correctement selon la liste de câbles et le plan de repérage',
      'Corriger et modifier le câble selon le plan d\'exécution révisé',
      'Mettre en place le tubage de protection manquant aux traversées et zones exposées',
      'Ajuster l\'emplacement des caméras conformément au plan d\'implantation validé',
      'Vérifier la gaine de protection de chaque câble (continuité, étanchéité)',
      'S\'assurer de l\'absence de câbles posés sur les faux-plafonds sans support agréé',
      'Réaliser un autocontrôle photographique avant fermeture des faux-plafonds',
    ],
    criticality: 'high',
    criticité_fr: 'Élevée',
    durée_h: 131,
    durée_range: '14 h – 326 h',
    norm: 'NFC 15-100 §521 + UTE C11-001 + ISO 9001:2015 §8.5.1',
  },

  // ══════════════════════════════════════════════════════════════════
  // CFO — TRANSFORMATEUR DE PUISSANCE HT  (source: CFO.xlsx)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfo-transfo-ht',
    type: 'CFO',
    category: 'Transformateur de puissance HT',
    typeFiche: 'Autocontrôle CFO — Transformateur de puissance HT',
    keywords: ['transformateur','puissance','cfo','ht','primaire','secondaire',
               'raccordement','dossier','technique','reseau','hta','bt','sec'],
    checkPoints: [],
    descriptions: [
      'Éléments à contrôler non achevés',
      'Eléments à controler non achevé',
      'Raccordement des câbles primaires et secondaires non achevé — dossier technique requis',
      'raccordement des câbles primaires et secondaires non achevé - Dossier technique à jour',
    ],
    description: 'Raccordement HT non achevé et dossier technique incomplet',
    solutions: [
      'Achever le raccordement des câbles primaires (HTA) et secondaires (BT) du transformateur',
      'Fournir le dossier technique complet (schémas, notices, rapports d\'essais constructeur)',
      'Vérifier la conformité des connexions selon le schéma de câblage du constructeur',
      'Contrôler le serrage des bornes au couple prescrit par le constructeur',
      'Effectuer les mesures de résistance d\'isolement (mégohmmétrie) avant mise sous tension',
      'Réaliser les essais de rigidité diélectrique HTA selon CEI 60076',
      'Vérifier le rapport de transformation (tensions à vide) sur les 3 phases',
      'Contrôler la protection différentielle du transformateur (relais de protection, Buchholz si huile)',
      'Obtenir le PV de mise en service du transformateur signé par le BET et le concessionnaire',
    ],
    criticality: 'critical',
    criticité_fr: 'Critique',
    durée_h: 193,
    durée_range: '132 h – 273 h',
    norm: 'CEI 60076 + NFC 54-100 + ISO 9001:2015 §8.5.1',
  },

  // ══════════════════════════════════════════════════════════════════
  // CFO — TUBAGE  (source: CFO.xlsx)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'cfo-tubage',
    type: 'CFO',
    category: 'Tubage',
    typeFiche: 'Autocontrôle CFO — Tubage',
    keywords: ['tubage','tube','cfo','cotation','saignee','boite','encastrement',
               'marque','validation','pvc','rigide','continentale','ayka','tgbt',
               'reperage','shunt','acheminement','fermeture','grillage','terre','nettoyage'],
    checkPoints: [],
    descriptions: [
      'Cotation non conforme',
      'Fermeture des saignées non conformes',
      'FERMETURE DES SAIGNEES NON CONFORMES',
      'Fiche de validation pour tubes rigides PVC manquante',
      'Boîte encastrée incorrectement positionnée',
      'Marque tube différente de celle de la fiche de validation',
      'La marque continentale est différente de celle (AYKA) décrite sur la fiche de validation',
      'Boîtes d\'encastrement non nettoyées',
      'Manque acheminement / manque boîtes d\'encastrement',
      'Manque acheminement',
      'Manque des boîtes d\'encastrement',
      'Manque de repérage mise à la terre',
      'Manque quq tubage et shunt',
      'Tubage non conforme par rapport à la fiche technique validée',
      'Tubage à refaire en fonction de l\'emplacement de la porte',
    ],
    description: 'Cotation, fermeture des saignées, marque, boîtes encastrement ou mise à la terre non conformes',
    solutions: [
      'Mettre en conformité la cotation du tubage selon les plans d\'exécution validés',
      'Respecter la procédure de fermeture des saignées avec grillage anti-fissures selon les règles de l\'art',
      'Envoyer la fiche de validation des tubes rigides PVC pour approbation BET/MOE',
      'Ajuster et repositionner les boîtes encastrées conformément aux plans (cote, hauteur, inclinaison)',
      'Remplacer les tubes par la marque conforme à la fiche technique validée (ou obtenir une dérogation)',
      'Nettoyer les boîtes d\'encastrement pour éviter leur déformation lors du remplissage',
      'Mettre en place le repérage de la mise à la terre des tubes conducteurs si requis',
      'Réaliser l\'acheminement des tubes manquants et s\'assurer de la continuité du tubage',
      'Vérifier le diamètre nominal des tubes par rapport aux câbles prévus (remplissage max 40 %)',
      'Établir un PV de réception du tubage avant fermeture définitive des saignées',
    ],
    criticality: 'high',
    criticité_fr: 'Élevée',
    durée_h: 290,
    durée_range: '12 h – 1 572 h',
    norm: 'NFC 15-100 §521 + NF EN 61386 + ISO 9001:2015 §8.5.1',
  },

];

// ══════════════════════════════════════════════════════════════════
// MATCHING ENGINE
// ══════════════════════════════════════════════════════════════════

export function findBestMatch(inputText) {
  if (!inputText || inputText.trim().length === 0) return { match: null, score: 0 };

  const inputTokens = tokenize(inputText);
  if (inputTokens.length === 0) return { match: null, score: 0 };

  const rawLower = removeAccents(inputText.toLowerCase());
  const wantsCFO = rawLower.includes('cfo') || rawLower.includes('courant fort');
  const wantsCFA = rawLower.includes('cfa') || rawLower.includes('courant faible');

  let bestMatch = null;
  let bestScore = 0;

  for (const nc of NC_CASES) {
    // Normalize keywords the same way as input (remove accents, stem plurals)
    const keyTokens = (nc.keywords || []).map(k => normalize(removeAccents(k)));
    const descTokens = tokenize(nc.description || '');
    const extraDescs = (nc.descriptions || []).flatMap(d => tokenize(d));
    // Check-points carry the exact wording the user is likely to paste — include them
    const cpTokens   = (nc.checkPoints || []).flatMap(cp => tokenize(cp));
    const allNcTokens = [...keyTokens, ...descTokens, ...extraDescs, ...cpTokens];

    let score = jaccard(inputTokens, allNcTokens);

    // Exact keyword hit bonus (strong signal)
    const keyHits = inputTokens.filter(t => keyTokens.includes(t)).length;
    score += keyHits * 0.08;

    // Type preference bonus / penalty
    if (wantsCFO && nc.type === 'CFO') score += 0.18;
    if (wantsCFA && nc.type === 'CFA') score += 0.18;
    if (wantsCFO && nc.type === 'CFA') score *= 0.3;
    if (wantsCFA && nc.type === 'CFO') score *= 0.3;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = nc;
    }
  }

  const THRESHOLD = 0.07;
  return {
    match: bestScore >= THRESHOLD ? bestMatch : null,
    score: Math.min(Math.round(bestScore * 100 + 25), 98),
  };
}
