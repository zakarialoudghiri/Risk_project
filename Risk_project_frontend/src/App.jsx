import { useState, useRef, useCallback, useEffect } from 'react';
import Header from './components/Header';
import LoadingOverlay from './components/LoadingOverlay';
import InputSection from './components/InputSection';
import ResultArea from './components/ResultArea';
import HistoryTab from './components/HistoryTab';
import StatsTab from './components/StatsTab';
import ReferentielTab from './components/ReferentielTab';
import ChatbotTab from './components/ChatbotTab';
import { findBestMatch } from './data/chatbotData';
import { CRIT_LABELS } from './data/constants';

// Norms by category
const NORMS = {
  'Câblage':                  'NFC 15-100 §521 + UTE C15-105',
  'Chemin de câble':          'NFC 15-100 §521 + NF EN ISO 1461',
  'Coffret / Tableau électrique': 'NFC 15-100 §533, §537 + ISO 9001:2015 §8.5.1',
  'Éclairage':                'NFC 15-100 §559 + EN 60598',
  'Prise de courant':         'NFC 15-100 §553 + EN 60884',
  'Tirage de câble':          'NFC 15-100 §521 + UTE C11-001',
  'Tubage':                   'NFC 15-100 §521 + EN 61386',
  'Mise à la terre':          'NFC 15-100 §541, §542 + NF EN 50522',
  'Précâblage VDI':           'ISO/IEC 11801 + EN 50173 + ISO 9001',
  'Vidéo surveillance':       'EN 62676 + ISO 9001:2015 §8.5.1',
};

const DELAYS = { critical: '24h', high: '48h', medium: '5 jours', low: '7 jours' };

// Loading steps
const LOADING_DELAYS = [0, 400, 900, 1400];

function buildKb(nc, score) {
  const durée = nc.durée_range
    ? nc.durée_range
    : nc.durée_h
      ? `~ ${Math.round(nc.durée_h)} h`
      : (DELAYS[nc.criticality] || '48h');
  return {
    category:    `${nc.type} > ${nc.category}`,
    subcategory: nc.description,
    typeFiche:   nc.typeFiche || `Autocontrôle ${nc.type} — ${nc.category}`,
    lot:         nc.type,
    criticality: nc.criticality,
    actions:     nc.solutions,
    norm:        nc.norm || NORMS[nc.category] || 'NFC 15-100 + ISO 9001:2015',
    delay:       durée,
  };
}

function App() {
  const [history, setHistory] = useState([]);
  const [catCount, setCatCount] = useState({});
  const [critCount, setCritCount] = useState({ critical: 0, high: 0, medium: 0, low: 0 });
  const [timelineData, setTimelineData] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [activeTab, setActiveTab] = useState('history');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(-1);
  const [analyzing, setAnalyzing] = useState(false);
  const [ncAlert, setNcAlert] = useState(null);
  const [alertKey, setAlertKey] = useState(0);
  const inputRef = useRef(null);
  const catCountRef = useRef({});
  const alertedCatsRef = useRef(new Set());
  const alertTimerRef = useRef(null);

  const triggerAlert = useCallback((types) => {
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    setNcAlert(types);
    setAlertKey(k => k + 1);
    alertTimerRef.current = setTimeout(() => setNcAlert(null), 30000);
  }, []);

  const dismissAlert = useCallback(() => {
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    setNcAlert(null);
  }, []);

  useEffect(() => () => { if (alertTimerRef.current) clearTimeout(alertTimerRef.current); }, []);

  const setInputValue = useCallback((val) => {
    if (inputRef.current) inputRef.current.value = val;
  }, []);

  const analyzeNC = useCallback(async () => {
    const text = inputRef.current?.value?.trim();
    if (!text) return;
    setAnalyzing(true);
    setLoading(true);
    setLoadingStep(-1);

    LOADING_DELAYS.forEach((delay, i) => {
      setTimeout(() => setLoadingStep(i), delay);
    });

    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setLoadingStep(-1);

    const { match, score } = findBestMatch(text);
    const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const dateLabel = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });

    let newItem;

    if (!match) {
      // SYNTAX ERROR
      newItem = { text, syntaxError: true, time: now, date: dateLabel, resolved: false };
    } else {
      const kb = buildKb(match, score);
      const conf = Math.min(Math.round(score * 100 + 40), 98); // scale for UX
      newItem = { text, kb, conf, time: now, date: dateLabel, resolved: false };

      const newCatCount = { ...catCountRef.current, [kb.category]: (catCountRef.current[kb.category] || 0) + 1 };
      catCountRef.current = newCatCount;
      setCatCount(newCatCount);
      const newCount = newCatCount[kb.category];
      if (newCount > 5 && !alertedCatsRef.current.has(kb.category)) {
        alertedCatsRef.current.add(kb.category);
        const overTypes = Object.entries(newCatCount)
          .filter(([, v]) => v > 5)
          .map(([cat, count]) => ({ cat, count }));
        triggerAlert(overTypes);
      }
      setCritCount(prev => ({ ...prev, [kb.criticality]: prev[kb.criticality] + 1 }));
      setTimelineData(prev => {
        const existing = prev.find(d => d.label === dateLabel);
        if (existing) return prev.map(d => d.label === dateLabel ? { ...d, count: d.count + 1 } : d);
        return [...prev, { label: dateLabel, count: 1 }];
      });
    }

    setHistory(prev => [newItem, ...prev]);
    setCurrentResult(newItem);
    setAnalyzing(false);
    if (inputRef.current) inputRef.current.value = '';
  }, [triggerAlert]);

  const markResolved = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[0] = { ...updated[0], resolved: true };
      return updated;
    });
    setCurrentResult(prev => prev ? { ...prev, resolved: true } : prev);
  }, []);

  const reloadResult = useCallback((i) => {
    setHistory(prev => {
      const item = prev[i];
      if (item) setCurrentResult(item);
      return prev;
    });
  }, []);

  const exportData = useCallback(() => {
    if (!history.length) { alert('Aucune donnée.'); return; }
    const rows = [['Heure', 'Date', 'Observation', 'Catégorie', 'Criticité', 'Délai', 'Norme', 'Levée']];
    history.forEach(h => {
      if (h.syntaxError) {
        rows.push([h.time, h.date, `"${h.text}"`, 'SYNTAX ERROR', '-', '-', '-', '-']);
      } else {
        rows.push([h.time, h.date, `"${h.text}"`, h.kb.category, CRIT_LABELS[h.kb.criticality], h.kb.delay, h.kb.norm, h.resolved ? 'Oui' : 'Non']);
      }
    });
    const csv = rows.map(r => r.join(';')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' }));
    a.download = `NC_CFO_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }, [history]);

  const TAB_KEYS   = ['history', 'stats', 'ref', 'chatbot'];
  const TAB_LABELS = ['Historique', 'Statistiques', 'Référentiel', 'Chatbot NC'];

  return (
    <>
      <Header />

      {ncAlert && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(10,12,16,0.75)', backdropFilter: 'blur(6px)',
        }}>
          <div style={{
            background: 'var(--bg2)',
            border: '1.5px solid rgba(255,68,68,0.45)',
            borderRadius: '20px',
            padding: '40px 36px 30px',
            width: '480px', maxWidth: '92vw',
            position: 'relative',
            boxShadow: '0 0 90px rgba(255,68,68,0.2), 0 24px 64px rgba(0,0,0,0.55)',
            animation: 'slideIn .3s ease',
          }}>
            <button onClick={dismissAlert} style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)',
              borderRadius: '8px', color: 'var(--red)',
              width: '34px', height: '34px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', lineHeight: '1', fontWeight: '300', transition: 'all .2s',
            }}>×</button>

            <div style={{ textAlign: 'center', fontSize: '48px', marginBottom: '16px', lineHeight: '1' }}>⚠️</div>

            <div style={{
              fontFamily: 'var(--mono)', fontSize: '15px', color: 'var(--red)',
              letterSpacing: '.15em', textTransform: 'uppercase', fontWeight: '800',
              textAlign: 'center', marginBottom: '8px',
            }}>
              Alerte Concentration NC
            </div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text3)',
              textAlign: 'center', letterSpacing: '.1em', marginBottom: '28px',
            }}>
              Plus de 5 non-conformités détectées sur le même type
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {ncAlert.map(({ cat, count }) => (
                <div key={cat} style={{
                  background: 'rgba(255,68,68,0.07)', border: '1px solid rgba(255,68,68,0.22)',
                  borderRadius: '12px', padding: '16px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text3)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
                      {cat.split(' > ')[0]}
                    </span>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: '14px', color: 'var(--text)', fontWeight: '700' }}>
                      {cat.split(' > ').slice(1).join(' > ') || cat}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', marginLeft: '16px', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '30px', fontWeight: '800', color: 'var(--red)', lineHeight: '1' }}>{count}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'rgba(255,68,68,0.7)', letterSpacing: '.1em' }}>NC</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: 'rgba(255,68,68,0.06)', border: '1px solid rgba(255,68,68,0.18)',
              borderRadius: '9px', padding: '11px 16px', marginBottom: '20px',
              fontFamily: 'var(--mono)', fontSize: '11px', color: 'rgba(255,110,110,0.9)',
              letterSpacing: '.07em', textAlign: 'center',
            }}>
              Action corrective immédiate requise — Notifier le responsable qualité
            </div>

            <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden', marginBottom: '7px' }}>
              <div key={alertKey} style={{
                height: '100%', background: 'var(--red)', borderRadius: '2px',
                animation: 'ncCountdown 30s linear forwards',
              }} />
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text3)', textAlign: 'right', letterSpacing: '.08em' }}>
              Fermeture automatique dans 30s
            </div>
          </div>
        </div>
      )}

      <div className="app">
        <div className="left-panel">
          <LoadingOverlay active={loading} activeStep={loadingStep} />
          <InputSection
            onAnalyze={analyzeNC}
            disabled={analyzing}
            onSetInput={setInputValue}
            inputRef={inputRef}
          />
          <ResultArea result={currentResult} onMarkResolved={markResolved} />
        </div>

        <div className="right-panel">
          <div className="panel-tabs">
            {TAB_KEYS.map((tab, i) => (
              <button
                key={tab}
                className={`tab${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {TAB_LABELS[i]}
              </button>
            ))}
          </div>

          <div className={`tab-content${activeTab === 'history' ? ' active' : ''}`}>
            <HistoryTab history={history} onReload={reloadResult} />
          </div>

          <div className={`tab-content${activeTab === 'stats' ? ' active' : ''}`}>
            <StatsTab
              history={history}
              catCount={catCount}
              critCount={critCount}
              timelineData={timelineData}
              onExport={exportData}
            />
          </div>

          <div className={`tab-content${activeTab === 'ref' ? ' active' : ''}`}>
            <ReferentielTab />
          </div>

          <div className={`tab-content tab-content-flex${activeTab === 'chatbot' ? ' active' : ''}`}>
            <ChatbotTab active={activeTab === 'chatbot'} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
