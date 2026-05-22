import React from 'react';
import { CRIT_LABELS, CRIT_CLASSES, CRIT_ICONS } from '../data/constants';

export default function ResultArea({ result, onMarkResolved }) {
  if (!result) {
    return (
      <div className="result-area">
        <div className="empty-state">
          <div className="empty-icon">🤖</div>
          <p>Saisissez une description NC<br />pour activer l'analyse IA</p>
        </div>
      </div>
    );
  }

  // SYNTAX ERROR state
  if (result.syntaxError) {
    return (
      <div className="result-area">
        <div className="result-card" style={{ borderColor: 'rgba(255,68,68,0.35)' }}>
          <div className="card-header" style={{ background: 'rgba(255,68,68,0.06)' }}>
            <span className="card-title" style={{ color: 'var(--red)', letterSpacing: '.15em' }}>
              ⚠ SYNTAX ERROR
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)' }}>
              {result.time}
            </span>
          </div>
          <div className="card-body">
            <div style={{
              background: 'var(--bg3)', borderRadius: '8px', padding: '10px 12px',
              marginBottom: '14px', fontSize: '12px', color: 'var(--text2)',
              lineHeight: 1.5, fontStyle: 'italic',
            }}>
              "{result.text}"
            </div>
            <div style={{
              background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)',
              borderRadius: '8px', padding: '12px 14px',
            }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--red)', fontWeight: 700, marginBottom: '6px' }}>
                Cas non reconnu dans la base de données NC
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'rgba(255,68,68,0.6)', lineHeight: 1.7 }}>
                Le chatbot fonctionne uniquement sur les cas de non-conformités<br />
                présents dans la base de données. Veuillez saisir une description<br />
                NC reconnue ou utiliser l'un des exemples ci-dessus.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { text, kb, conf, time } = result;
  const confClass = conf >= 80 ? 'high' : conf >= 55 ? 'med' : 'low';
  const confColor = confClass === 'high' ? 'var(--green)' : confClass === 'med' ? 'var(--yellow)' : 'var(--red)';
  const pathParts = kb.category.split(' > ');

  return (
    <div className="result-area">
      {/* NLP Classification Card */}
      <div className="result-card">
        <div className="card-header">
          <span className="card-title nlp">⬡ MODULE NLP — CLASSIFICATION</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)' }}>{time}</span>
        </div>
        <div className="card-body">
          <div style={{
            background: 'var(--bg3)', borderRadius: '8px', padding: '10px 12px',
            marginBottom: '14px', fontSize: '12px', color: 'var(--text2)', lineHeight: 1.5, fontStyle: 'italic',
          }}>
            "{text}"
          </div>

          {/* Type Fiche badge */}
          {kb.typeFiche && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '3px 10px', borderRadius: '5px', marginBottom: '10px',
              background: kb.lot === 'CFO' ? 'rgba(255,107,53,0.12)' : 'rgba(127,255,107,0.08)',
              border: `1px solid ${kb.lot === 'CFO' ? 'rgba(255,107,53,0.3)' : 'rgba(127,255,107,0.2)'}`,
              fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: 700,
              color: kb.lot === 'CFO' ? 'var(--accent2)' : 'var(--accent3)',
            }}>
              {kb.lot === 'CFO' ? '⚡' : '📡'} {kb.typeFiche}
            </div>
          )}

          <div className="classification-path">
            {pathParts.map((p, i) => (
              <React.Fragment key={i}>
                <span className="path-segment">{p}</span>
                {i < pathParts.length - 1 && <span className="path-arrow">›</span>}
              </React.Fragment>
            ))}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '10px', fontFamily: 'var(--mono)' }}>
            Sous-type : <span style={{ color: 'var(--text2)' }}>{kb.subcategory}</span>
          </div>
          <div className="confidence-bar">
            <div className="confidence-label">
              <span>Confiance NLP</span>
              <span style={{ color: confColor }}>{conf}%</span>
            </div>
            <div className="bar-track">
              <div className={`bar-fill ${confClass}`} style={{ width: `${conf}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Diagnostic Card */}
      <div className="result-card">
        <div className="card-header">
          <span className="card-title expert">◈ SYSTÈME EXPERT — DIAGNOSTIC</span>
        </div>
        <div className="card-body">
          <div className={`criticality-badge ${CRIT_CLASSES[kb.criticality]}`}>
            {CRIT_ICONS[kb.criticality]} CRITICITÉ : {CRIT_LABELS[kb.criticality]}
          </div>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-item-label">Délai de levée</div>
              <div className="info-item-value">{kb.delay}</div>
            </div>
            <div className="info-item">
              <div className="info-item-label">Référence norme</div>
              <div className="info-item-value" style={{ fontSize: '11px', fontFamily: 'var(--mono)' }}>
                {kb.norm.split('+')[0].trim()}
              </div>
            </div>
          </div>
          <div className="iso-tag">⚖ {kb.norm}</div>
        </div>
      </div>

      {/* Action Plan Card */}
      <div className="result-card">
        <div className="card-header">
          <span className="card-title action">✓ PLAN D'ACTION CORRECTIVE</span>
        </div>
        <div className="card-body">
          <div className="action-list">
            {kb.actions.map((a, i) => (
              <div className="action-item" key={i}>
                <span className="action-num">0{i + 1}</span>
                <span className="action-text">{a}</span>
              </div>
            ))}
          </div>
          <button className="btn-export" onClick={onMarkResolved} style={{ marginTop: '10px' }}>
            ✓ Marquer comme levée
          </button>
        </div>
      </div>
    </div>
  );
}
