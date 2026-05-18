import React from 'react';

function StatusSelector({ value, onChange, label }) {
  const statusOptions = [
    { id: 'pendente', label: 'Pendente', icon: '⏳', color: '#f5a623' },
    { id: 'aguardando', label: 'Aguardando aprovação', icon: '⏳', color: '#f5a623' },
    { id: 'aprovado', label: 'Aprovado', icon: '✓', color: '#4a90e2' },
    { id: 'em_andamento', label: 'Em andamento', icon: '🔨', color: '#4a90e2' },
    { id: 'aguardando_pagamento', label: 'Aguardando pagamento', icon: '💰', color: '#4a90e2' },
    { id: 'concluido', label: 'Concluído', icon: '✓', color: '#10b981' },
    { id: 'garantia', label: 'Garantia', icon: '🛡️', color: '#10b981' },
    { id: 'cancelado', label: 'Cancelado', icon: '✕', color: '#f06070' }
  ];

  const currentStatus = statusOptions.find(s => s.id === value) || statusOptions[0];

  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 12px',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          color: 'var(--text)',
          fontSize: '14px',
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23${currentStatus.color.slice(1)}' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: '32px'
        }}
      >
        {statusOptions.map((status) => (
          <option key={status.id} value={status.id}>
            {status.icon} {status.label}
          </option>
        ))}
      </select>

      {/* Badge com status atual */}
      <div style={{
        marginTop: '8px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        background: currentStatus.color,
        color: 'white',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        <span style={{ fontSize: '16px' }}>{currentStatus.icon}</span>
        <span>{currentStatus.label}</span>
      </div>
    </div>
  );
}

export default StatusSelector;
