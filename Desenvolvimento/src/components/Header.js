import React from 'react';
import './Header.css';

function Header({ onMenuClick, onAgendaClick, theme, onThemeToggle, iaAtiva }) {
  return (
    <div className="hdr">
      <div className="hdr-logo">⚡</div>
      <div className="hdr-info">
        <h1>Mestre.IA</h1>
        <p>
          <span className="dot"></span>
          {iaAtiva ? '🤖 IA Ativa' : '💻 Modo Local'}
        </p>
      </div>
      <div className="hdr-menu">
        <button 
          className="btn-hdr" 
          onClick={onThemeToggle} 
          title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button className="btn-hdr" onClick={onAgendaClick} title="Agenda">
          📅
        </button>
        <button className="btn-hdr" onClick={onMenuClick} title="Menu">
          ☰
        </button>
      </div>
    </div>
  );
}

export default Header;
