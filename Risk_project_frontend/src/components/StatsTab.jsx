import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { CRIT_LABELS } from '../data/constants';

Chart.register(...registerables);

export default function StatsTab({ history, catCount, critCount, timelineData, onExport }) {
  const paretoRef = useRef(null);
  const critRef = useRef(null);
  const timelineRef = useRef(null);
  const paretoChartRef = useRef(null);
  const critChartRef = useRef(null);
  const timelineChartRef = useRef(null);

  const total = history.length;
  const resolved = history.filter(h => h.resolved).length;

  useEffect(() => {
    if (total === 0) return;

    // Pareto
    const sorted = Object.entries(catCount).sort((a, b) => b[1] - a[1]);
    const labels = sorted.map(([k]) => k.split(' > ').slice(1).join(' > ') || k);
    const values = sorted.map(([, v]) => v);
    const totalCat = values.reduce((a, b) => a + b, 0);
    let cumul = 0;
    const cumPcts = values.map(v => { cumul += v; return Math.round(cumul / totalCat * 100); });
    const bgColors = values.map((_, i) => cumPcts[i] <= 80 || i === 0 ? '#B8860B' : '#2a3a4a');

    if (paretoChartRef.current) paretoChartRef.current.destroy();
    paretoChartRef.current = new Chart(paretoRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { type: 'bar', data: values, backgroundColor: bgColors, borderWidth: 0, yAxisID: 'y', order: 2 },
          { type: 'line', data: cumPcts, borderColor: '#ff6b35', backgroundColor: 'transparent', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#ff6b35', yAxisID: 'y2', order: 1 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ctx.datasetIndex === 0 ? ' ' + ctx.raw + ' NC' : ' ' + ctx.raw + '% cumulé' } } },
        scales: {
          x: { ticks: { color: '#4a5568', font: { size: 9 }, maxRotation: 35 }, grid: { color: 'rgba(255,255,255,0.04)' } },
          y: { position: 'left', ticks: { color: '#4a5568', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
          y2: { position: 'right', min: 0, max: 100, ticks: { color: '#ff6b35', font: { size: 9 }, callback: v => v + '%' }, grid: { display: false } }
        }
      }
    });

    // Criticité doughnut
    const critLabels = ['Critique', 'Élevée', 'Moyenne', 'Faible'];
    const critValues = [critCount.critical, critCount.high, critCount.medium, critCount.low];
    const critColors = ['#ff4444', '#ff8c42', '#ffd166', '#06d6a0'];

    if (critChartRef.current) critChartRef.current.destroy();
    critChartRef.current = new Chart(critRef.current, {
      type: 'doughnut',
      data: { labels: critLabels, datasets: [{ data: critValues, backgroundColor: critColors, borderWidth: 0, hoverOffset: 4 }] },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '65%',
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => ` ${c.label}: ${c.raw} (${total ? Math.round(c.raw / total * 100) : 0}%)` } } }
      }
    });

    // Timeline
    const tlLabels = timelineData.map(d => d.label);
    const tlValues = timelineData.map(d => d.count);

    if (timelineChartRef.current) timelineChartRef.current.destroy();
    timelineChartRef.current = new Chart(timelineRef.current, {
      type: 'line',
      data: {
        labels: tlLabels,
        datasets: [{
          label: 'NC / jour', data: tlValues,
          borderColor: '#7fff6b', backgroundColor: 'rgba(127,255,107,0.08)',
          borderWidth: 2, pointRadius: 4, pointBackgroundColor: '#7fff6b',
          fill: true, tension: 0.3
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#4a5568', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
          y: { ticks: { color: '#4a5568', font: { size: 9 }, stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.04)' }, min: 0 }
        }
      }
    });

    return () => {
      paretoChartRef.current?.destroy();
      critChartRef.current?.destroy();
      timelineChartRef.current?.destroy();
    };
  }, [total, catCount, critCount, timelineData]);

  const critLabels = ['Critique', 'Élevée', 'Moyenne', 'Faible'];
  const critValues = [critCount.critical, critCount.high, critCount.medium, critCount.low];
  const critColors = ['#ff4444', '#ff8c42', '#ffd166', '#06d6a0'];

  return (
    <>
      <div className="stats-kpi">
        <div className="kpi-card"><div className="kpi-val" style={{ color: 'var(--accent)' }}>{total}</div><div className="kpi-lbl">NC Analysées</div></div>
        <div className="kpi-card"><div className="kpi-val" style={{ color: 'var(--red)' }}>{critCount.critical}</div><div className="kpi-lbl">Critiques</div></div>
        <div className="kpi-card"><div className="kpi-val" style={{ color: 'var(--orange)' }}>{critCount.high}</div><div className="kpi-lbl">Élevées</div></div>
        <div className="kpi-card"><div className="kpi-val" style={{ color: 'var(--green)' }}>{resolved}</div><div className="kpi-lbl">Résolues</div></div>
      </div>

      {/* Pareto */}
      <div className="chart-block">
        <div className="chart-title">⬡ Diagramme de Pareto — NC par catégorie</div>
        <div className="chart-wrap" style={{ height: '200px' }}>
          <canvas ref={paretoRef}></canvas>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#B8860B', display: 'inline-block' }}></span>NC (vital)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#2a3a4a', display: 'inline-block' }}></span>NC (trivial)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)' }}>
            <span style={{ width: '10px', height: '2px', background: '#ff6b35', display: 'inline-block' }}></span>% cumulé
          </span>
        </div>
      </div>

      {/* Criticité */}
      <div className="chart-block">
        <div className="chart-title">◈ Distribution criticité</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'center' }}>
          <div className="chart-wrap" style={{ height: '140px' }}>
            <canvas ref={critRef}></canvas>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {critLabels.map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: critColors[i], flexShrink: 0, display: 'inline-block' }}></span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text2)' }}>{l} <strong style={{ color: 'var(--text)' }}>{critValues[i]}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="chart-block">
        <div className="chart-title">↗ Évolution NC dans le temps</div>
        <div className="chart-wrap" style={{ height: '130px' }}>
          <canvas ref={timelineRef}></canvas>
        </div>
      </div>

      <button className="btn-export" onClick={onExport}>⬇ Exporter rapport CSV</button>
    </>
  );
}
