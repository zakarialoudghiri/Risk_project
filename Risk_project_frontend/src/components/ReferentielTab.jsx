import React from 'react';
import { knowledgeBase } from '../data/constants';

const CRIT_COLORS = { critical: 'var(--red)', high: 'var(--orange)', medium: 'var(--yellow)', low: 'var(--green)' };
const LOT_ORDER = ['CFO', 'CFA', 'CVCD', 'Plomberie', 'Général'];

function groupByLot() {
  const grouped = {};
  for (const [key, val] of Object.entries(knowledgeBase)) {
    const lot = val.lot || 'Général';
    if (!grouped[lot]) grouped[lot] = [];
    grouped[lot].push({ key, ...val });
  }
  return LOT_ORDER.map(lot => ({ lot, items: grouped[lot] || [] })).filter(g => g.items.length > 0);
}

export default function ReferentielTab() {
  const groups = groupByLot();

  return (
    <>
      {groups.map(({ lot, items }) => (
        <div className="ref-section" key={lot}>
          <div className="ref-title">Catégories {lot}</div>
          {items.map(item => (
            <div className="ref-item" key={item.key} style={{ flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: CRIT_COLORS[item.criticality], flexShrink: 0, display: 'block' }}></span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{item.category.split(' > ').slice(1).join(' > ')}</span>
                <span style={{ fontSize: '10px', color: 'var(--text3)' }}>— {item.subcategory}</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--accent)', fontFamily: 'var(--mono)', paddingLeft: '13px' }}>{item.norm.split('+')[0].trim()} · {item.delay}</div>
            </div>
          ))}
        </div>
      ))}
      <div className="ref-section">
        <div className="ref-title">Niveaux de criticité ISO 9001</div>
        <div className="ref-item"><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--red)', flexShrink: 0, marginTop: '5px', display: 'block' }}></span>CRITIQUE — Risque sécurité / arrêt travaux immédiat</div>
        <div className="ref-item"><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--orange)', flexShrink: 0, marginTop: '5px', display: 'block' }}></span>ÉLEVÉE — Impact fonctionnel majeur / délai &lt;48h</div>
        <div className="ref-item"><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--yellow)', flexShrink: 0, marginTop: '5px', display: 'block' }}></span>MOYENNE — Non-conformité documentaire / délai 1 semaine</div>
        <div className="ref-item"><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--green)', flexShrink: 0, marginTop: '5px', display: 'block' }}></span>FAIBLE — Observation mineure / levée prochaine visite</div>
      </div>
    </>
  );
}
