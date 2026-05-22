import React from 'react';

const STEPS = [
  'Analyse NLP en cours...',
  'Classification référentiel CFO...',
  'Consultation base historique...',
  'Génération plan d\'action ISO 9001...',
];

export default function LoadingOverlay({ active, activeStep }) {
  return (
    <div className={`loading-overlay${active ? ' active' : ''}`}>
      <div className="loader-ring"></div>
      <div className="loader-steps">
        {STEPS.map((label, i) => {
          let cls = 'loader-step';
          if (i < activeStep) cls += ' done';
          else if (i === activeStep) cls += ' active-step';
          return (
            <div className={cls} key={i}>
              <span className="step-indicator"></span>
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
