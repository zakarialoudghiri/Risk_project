import React from 'react';
import { CRIT_LABELS, CRIT_CLASSES, CRIT_ICONS } from '../data/constants';

export default function HistoryTab({ history, onReload }) {
  if (!history.length) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '.1em' }}>
        Aucune NC analysée
      </div>
    );
  }

  return (
    <div>
      {history.map((item, i) => {
        if (item.syntaxError) {
          return (
            <div className="history-item" key={i} onClick={() => onReload(i)}
              style={{ borderColor: 'rgba(255,68,68,0.25)' }}>
              <div className="history-header">
                <span className="history-type" style={{ color: 'var(--red)' }}>⚠ SYNTAX ERROR</span>
                <span className="history-time">{item.time}</span>
              </div>
              <div className="history-text">{item.text}</div>
            </div>
          );
        }

        return (
          <div className="history-item" key={i} onClick={() => onReload(i)}>
            <div className="history-header">
              <span className="history-type">{item.kb.category.split(' > ')[1] || item.kb.lot}</span>
              <span className="history-time">{item.time}</span>
            </div>
            <div className="history-text">{item.text}</div>
            <span className={`history-badge ${CRIT_CLASSES[item.kb.criticality]}`}
              style={{ fontFamily: 'var(--mono)', fontSize: '9px' }}>
              {CRIT_ICONS[item.kb.criticality]} {CRIT_LABELS[item.kb.criticality]}
            </span>
            {item.resolved && (
              <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--green)', marginLeft: '6px' }}>✓ LEVÉE</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
