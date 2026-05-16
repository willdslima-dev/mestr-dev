import React from 'react';
import Modal from './Modal';

function ConfigModal({ isOpen, onClose, theme, onThemeChange, onAutoTheme }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="⚙️ Configurações">
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--text)' }}>
          Aparência
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => onThemeChange('light')}
            className={`modal-btn ${theme === 'light' ? 'active' : ''}`}
            style={{
              background: theme === 'light' ? 'var(--accent)' : 'var(--bg3)',
              borderColor: theme === 'light' ? 'var(--accent)' : 'var(--border)',
              color: theme === 'light' ? '#fff' : 'var(--text)'
            }}
          >
            ☀️ Modo Claro
          </button>
          
          <button
            onClick={() => onThemeChange('dark')}
            className={`modal-btn ${theme === 'dark' ? 'active' : ''}`}
            style={{
              background: theme === 'dark' ? 'var(--accent)' : 'var(--bg3)',
              borderColor: theme === 'dark' ? 'var(--accent)' : 'var(--border)',
              color: theme === 'dark' ? '#fff' : 'var(--text)'
            }}
          >
            🌙 Modo Escuro
          </button>
          
          <button
            onClick={onAutoTheme}
            className="modal-btn"
          >
            🔄 Automático (Sistema)
          </button>
        </div>

        <p style={{
          fontSize: '11px',
          color: 'var(--muted)',
          marginTop: '12px',
          lineHeight: '1.5'
        }}>
          💡 No modo automático, o tema seguirá a configuração do seu sistema operacional
        </p>
      </div>

      <button className="modal-close" onClick={onClose}>
        Fechar
      </button>
    </Modal>
  );
}

export default ConfigModal;
