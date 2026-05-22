import React from 'react';
import ThemeToggle from './ThemeToggle';
import cmsLogo from '../assets/CMS.png';

export default function Header() {
  return (
    <header>
      <div className="logo">
        <img src={cmsLogo} alt="CMS" className="logo-mark-img" />
        <div>
          <div className="logo-text">NC·AI Expert System CMS</div>
          <div className="logo-sub">Hotel Mixed-Use — CFO Quality Control</div>
        </div>
      </div>
      <div className="header-right">
        <div className="project-badge">CHANTIER · HOTEL MIXED-USE</div>
        <ThemeToggle />
        <div className="status-dot"></div>
        <div className="status-text">SYSTÈME ACTIF</div>
      </div>
    </header>
  );
}
