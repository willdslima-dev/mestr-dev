import React, { useEffect } from 'react';

function Notificacao({ mensagem, onFechar, duracao = 5000 }) {
  useEffect(() => {
    if (mensagem && duracao > 0) {
      const timer = setTimeout(() => {
        onFechar();
      }, duracao);
      return () => clearTimeout(timer);
    }
  }, [mensagem, duracao, onFechar]);

  if (!mensagem) return null;

  const cores = {
    aviso: {
      bg: '#fef3c7',
      text: '#92400e',
      border: '#f59e0b',
      icon: '⚠️'
    },
    erro: {
      bg: '#fee2e2',
      text: '#991b1b',
      border: '#ef4444',
      icon: '❌'
    },
    sucesso: {
      bg: '#d1fae5',
      text: '#065f46',
      border: '#10b981',
      icon: '✓'
    },
    info: {
      bg: '#dbeafe',
      text: '#1e40af',
      border: '#3b82f6',
      icon: 'ℹ️'
    }
  };

  const estilo = cores[mensagem.tipo] || cores.info;

  return (
    <div 
      style={{
        padding: '14px 16px',
        background: estilo.bg,
        color: estilo.text,
        fontSize: '13px',
        lineHeight: '1.5',
        borderLeft: `4px solid ${estilo.border}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        flexShrink: 0,
        position: 'relative',
        animation: 'slideDown 0.3s ease'
      }}
    >
      <span style={{ fontSize: '16px', flexShrink: 0 }}>
        {estilo.icon}
      </span>
      <span style={{ flex: 1 }}>{mensagem.texto}</span>
      <button
        onClick={onFechar}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          fontSize: '18px',
          padding: '0',
          opacity: 0.7,
          flexShrink: 0,
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
      >
        ✕
      </button>
    </div>
  );
}

export default Notificacao;
