import React, { useState, useRef, useEffect } from 'react';
import { findBestMatch } from '../data/chatbotData';

const CRIT_COLORS = {
  critical: '#ff4444',
  high:     '#ff8c42',
  medium:   '#ffd166',
  low:      '#06d6a0',
};
const CRIT_LABELS_FR = {
  critical: 'CRITIQUE',
  high:     'ÉLEVÉE',
  medium:   'MOYENNE',
  low:      'FAIBLE',
};
const CRIT_BG = {
  critical: 'rgba(255,68,68,0.12)',
  high:     'rgba(255,140,66,0.12)',
  medium:   'rgba(255,209,102,0.12)',
  low:      'rgba(6,214,160,0.12)',
};
const CRIT_BORDER = {
  critical: 'rgba(255,68,68,0.3)',
  high:     'rgba(255,140,66,0.3)',
  medium:   'rgba(255,209,102,0.3)',
  low:      'rgba(6,214,160,0.3)',
};

const CRIT_BG_LIGHT = { critical:'rgba(255,68,68,0.10)', high:'rgba(255,140,66,0.10)', medium:'rgba(184,134,11,0.10)', low:'rgba(6,214,160,0.10)' };
const CRIT_BORDER_LIGHT = { critical:'rgba(255,68,68,0.3)', high:'rgba(255,140,66,0.3)', medium:'rgba(184,134,11,0.25)', low:'rgba(6,214,160,0.3)' };

function CritBadge({ criticality, criticité }) {
  return (
    <span
      className="cb-cp-crit"
      style={{
        background: CRIT_BG_LIGHT[criticality] || 'rgba(184,134,11,0.1)',
        border: `1px solid ${CRIT_BORDER_LIGHT[criticality] || 'rgba(184,134,11,0.25)'}`,
        color: CRIT_COLORS[criticality] || 'var(--text2)',
      }}
    >
      {criticité || CRIT_LABELS_FR[criticality]}
    </span>
  );
}

// Renders the per-row check-point table for CFA — Tirage de câble
function CheckPointDetails({ rows }) {
  return (
    <>
      {rows.map((r) => (
        <div className="cb-cp-row" key={r.id}>
          <div className="cb-cp-idx">{String(r.id).padStart(2, '0')}</div>
          <div className="cb-cp-body">
            <div className="cb-cp-item">{r.item}</div>
            <div className="cb-cp-desc">⚠ {r.description}</div>
            <div className="cb-cp-correction">✓ {r.correction}</div>
            <div className="cb-cp-meta">
              <CritBadge criticality={r.criticality} criticité={r.criticité} />
              <span className="cb-cp-duree">{r.durée_h} h</span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

// Renders the grouped tubage table for CFA — Tubage
function TubageGroups({ groups }) {
  return (
    <>
      {groups.map((g, gi) => (
        <div className="cb-cp-group" key={gi}>
          <div className="cb-cp-group-title">▸ {g.group}</div>
          {g.elements.map((el, ei) => (
            <div className="cb-cp-row" key={ei}>
              <div className="cb-cp-idx">{String(ei + 1).padStart(2, '0')}</div>
              <div className="cb-cp-body">
                <div className="cb-cp-item">{el.element}</div>
                <div className="cb-cp-desc">⚠ {el.description}</div>
                <div className="cb-cp-correction">✓ {el.correction}</div>
                <div className="cb-cp-meta">
                  <CritBadge criticality={el.criticality} criticité={el.criticité} />
                  <span className="cb-cp-duree">{el.durée_h} h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

function MatchCard({ nc }) {
  const isCFO = nc.type === 'CFO';
  const hasDetailedRows  = nc.checkPointDetails && nc.checkPointDetails.length > 0;
  const hasTubageGroups  = nc.tubageGroups      && nc.tubageGroups.length > 0;
  const hasCheckPoints   = !hasDetailedRows && !hasTubageGroups && nc.checkPoints && nc.checkPoints.length > 0;
  const hasDescriptions  = !hasDetailedRows && !hasTubageGroups && nc.descriptions && nc.descriptions.length > 0;

  return (
    <div className="cb-result-card">
      <div className="cb-result-header">
        <span className="cb-result-title">⬡ ANALYSE NC — RÉSULTAT</span>
      </div>
      <div className="cb-result-body">

        {/* Type badge */}
        <div className={`cb-type-badge ${isCFO ? 'cfo' : 'cfa'}`}>
          {isCFO ? '⚡' : '📡'}
          <span>{nc.type}</span>
          <span className="cb-type-full">— Courant {isCFO ? 'Fort' : 'Faible'}</span>
        </div>

        {/* Category + TypeFiche */}
        <div className="cb-info-row">
          <span className="cb-info-lbl">CATÉGORIE</span>
          <span className="cb-info-val">{nc.category}</span>
        </div>
        {nc.typeFiche && (
          <div className="cb-info-row">
            <span className="cb-info-lbl">FICHE</span>
            <span className="cb-info-val" style={{ fontSize: '10px' }}>{nc.typeFiche}</span>
          </div>
        )}

        {/* Overall criticality */}
        <div
          className="cb-crit"
          style={{
            background: CRIT_BG[nc.criticality],
            border: `1px solid ${CRIT_BORDER[nc.criticality]}`,
            color: CRIT_COLORS[nc.criticality],
          }}
        >
          CRITICITÉ MAX : {CRIT_LABELS_FR[nc.criticality] || nc.criticality?.toUpperCase()}
        </div>

        {/* Délai de levée */}
        <div className="cb-info-row">
          <span className="cb-info-lbl">DURÉE DE RÉALISATION</span>
          <span className="cb-info-val" style={{ color:'var(--accent)', fontFamily:'var(--mono)', fontWeight:700 }}>
            {nc.durée_range || (nc.durée_h ? `~ ${Math.round(nc.durée_h)} h` : 'N/A')}
          </span>
        </div>

        {/* Norme */}
        {nc.norm && (
          <div className="cb-info-row">
            <span className="cb-info-lbl">NORME</span>
            <span className="cb-info-val" style={{ fontSize:'10px', fontFamily:'var(--mono)' }}>{nc.norm}</span>
          </div>
        )}

        {/* ── CFA Tirage de câble — per-item detail table ── */}
        {hasDetailedRows && (
          <>
            <div className="cb-plan-header" style={{ marginTop:'8px' }}>
              ✓ POINTS DE CONTRÔLE — DÉTAIL COMPLET (SOURCE EXCEL)
            </div>
            <CheckPointDetails rows={nc.checkPointDetails} />
          </>
        )}

        {/* ── CFA Tubage — grouped detail table ── */}
        {hasTubageGroups && (
          <>
            <div className="cb-plan-header" style={{ marginTop:'8px' }}>
              ✓ ÉLÉMENTS À VÉRIFIER PAR TYPE DE TUBAGE (SOURCE EXCEL)
            </div>
            <TubageGroups groups={nc.tubageGroups} />
          </>
        )}

        {/* Generic check points (other categories) */}
        {hasCheckPoints && (
          <>
            <div className="cb-plan-header" style={{ marginTop:'6px' }}>✓ POINTS DE CONTRÔLE</div>
            <div className="cb-solutions">
              {nc.checkPoints.map((cp, i) => (
                <div className="cb-sol-item" key={i}>
                  <span className="cb-sol-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cb-sol-text">{cp}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Generic descriptions */}
        {hasDescriptions && (
          <>
            <div className="cb-plan-header" style={{ marginTop:'6px' }}>⚠ DESCRIPTIONS NC (SOURCE EXCEL)</div>
            {nc.descriptions.map((d, i) => (
              <div className="cb-desc-box" key={i} style={{ marginBottom:'4px' }}>
                <span className="cb-desc-text">"{d}"</span>
              </div>
            ))}
          </>
        )}

        {/* Action plan — Excel + AI-enhanced */}
        <div className="cb-plan-header" style={{ marginTop:'8px' }}>✓ PLAN D'ACTION CORRECTIVE (ENRICHI)</div>
        <div className="cb-solutions">
          {nc.solutions.map((sol, i) => (
            <div className="cb-sol-item" key={i}>
              <span className="cb-sol-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="cb-sol-text">{sol}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

function SyntaxError() {
  return (
    <div className="cb-syntax-error">
      <div className="cb-error-icon">⚠</div>
      <div className="cb-error-title">SYNTAX ERROR</div>
      <div className="cb-error-body">
        Cas non reconnu dans la base de données NC.<br />
        Essayez : "CFA tirage de cable", "CFO coffret", "CFO tubage", etc.
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="cb-msg bot">
      <div className="cb-typing">
        <span></span><span></span><span></span>
      </div>
    </div>
  );
}

const EXAMPLE_QUERIES = [
  'TYPE DE NC CFA (tirage de cable)',
  'TYPE DE NC CFA (tubage)',
  'CFO coffret électrique',
  'CFO tirage de cable',
  'CFO mise à la terre',
  'CFA précâblage VDI',
  'CFO prise de courant',
  'CFO tubage',
];

export default function ChatbotTab({ active }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (active) inputRef.current?.focus();
  }, [active]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setBusy(true);

    await new Promise(r => setTimeout(r, 700));

    const { match } = findBestMatch(text);

    setMessages(prev => [
      ...prev,
      match
        ? { role: 'bot', nc: match }
        : { role: 'error' },
    ]);
    setBusy(false);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clear = () => {
    setMessages([]);
    setInput('');
    inputRef.current?.focus();
  };

  return (
    <div className="cb-container">

      {/* Header bar */}
      <div className="cb-topbar">
        <span className="cb-topbar-title">🤖 CHATBOT NC — IA</span>
        {messages.length > 0 && (
          <button className="cb-clear-btn" onClick={clear}>Effacer</button>
        )}
      </div>

      {/* Messages area */}
      {messages.length === 0 ? (
        <div className="cb-empty">
          <div className="cb-empty-icon">⚡ 📡</div>
          <p className="cb-empty-title">Saisissez un TYPE DE NC CFA ou CFO</p>
          <p className="cb-empty-sub">Exemples de requêtes reconnues :</p>
          <div className="cb-examples">
            {EXAMPLE_QUERIES.map((ex, i) => (
              <span
                key={i}
                className="cb-ex-chip"
                onClick={() => { setInput(ex); inputRef.current?.focus(); }}
              >
                {ex}
              </span>
            ))}
          </div>
          <div className="cb-empty-warning">
            Toute saisie non reconnue renvoie → SYNTAX ERROR
          </div>
        </div>
      ) : (
        <div className="cb-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`cb-msg ${msg.role}`}>
              {msg.role === 'user' && (
                <div className="cb-bubble user">{msg.text}</div>
              )}
              {msg.role === 'bot' && <MatchCard nc={msg.nc} />}
              {msg.role === 'error' && <SyntaxError />}
            </div>
          ))}
          {busy && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input row */}
      <div className="cb-input-row">
        <textarea
          ref={inputRef}
          className="cb-textarea"
          placeholder="Ex: TYPE DE NC CFA (tirage de cable) ou CFO coffret…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          rows={1}
        />
        <button
          className="cb-send"
          onClick={send}
          disabled={busy || !input.trim()}
          title="Envoyer"
        >
          ↑
        </button>
      </div>

    </div>
  );
}
