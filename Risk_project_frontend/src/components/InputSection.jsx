import React, { useState, useRef } from 'react';
import { EXAMPLES } from '../data/constants';

const CHIP_LABELS = ['Coffret NC', 'Tubage NC', 'Câble NC', 'Prise NC', 'Éclairage NC', 'VDI / F.O'];

export default function InputSection({ onAnalyze, disabled, onSetInput, inputRef }) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const toggleMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Reconnaissance vocale non supportée. Utilisez Chrome.');
      return;
    }
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      onSetInput(e.results[0][0].transcript);
      setIsRecording(false);
    };
    recognition.onerror = recognition.onend = () => setIsRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onAnalyze();
    }
  };

  return (
    <>
      <div className="input-section">
        <div className="section-label">Chatbot NC — Analyse IA</div>
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            placeholder="Saisissez une description de non-conformité... (ex: Manque schéma unifilaire, La mise à la terre non raccordée)"
            onKeyDown={handleKeyDown}
          />
          <div className="input-actions">
            <button
              className={`btn-mic${isRecording ? ' recording' : ''}`}
              title="Saisie vocale"
              onClick={toggleMic}
            >
              {isRecording ? '⏹️' : '🎙️'}
            </button>
            <button className="btn-analyze" disabled={disabled} onClick={onAnalyze}>
              <span>↑</span> ENVOYER
            </button>
          </div>
        </div>
      </div>

      <div className="examples">
        <span className="examples-label">EXEMPLES :</span>
        {CHIP_LABELS.map((label, i) => (
          <span key={i} className="example-chip" onClick={() => onSetInput(EXAMPLES[i])}>
            {label}
          </span>
        ))}
      </div>
    </>
  );
}
