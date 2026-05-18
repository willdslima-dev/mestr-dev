import React, { useState } from 'react';

function PaymentMethodSelector({ value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);

  const paymentMethods = [
    { id: 'pix', label: 'PIX', icon: '📱' },
    { id: 'credito', label: 'Cartão de Crédito', icon: '💳' },
    { id: 'debito', label: 'Cartão de Débito', icon: '💳' },
    { id: 'boleto', label: 'Boleto', icon: '📄' },
    { id: 'transferencia', label: 'Transferência Bancária', icon: '🏦' },
    { id: 'dinheiro', label: 'Dinheiro', icon: '💵' },
    { id: 'cheque', label: 'Cheque', icon: '📋' }
  ];

  // Parse value - pode ser string separada por vírgula ou array
  const parseSelectedMethods = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      return val
        .split(',')
        .map(v => v.trim().toLowerCase())
        .filter(v => v);
    }
    return [];
  };

  const selectedMethods = parseSelectedMethods(value);

  // Toggle method
  const toggleMethod = (methodId) => {
    let updated;
    if (selectedMethods.includes(methodId)) {
      updated = selectedMethods.filter(m => m !== methodId);
    } else {
      updated = [...selectedMethods, methodId];
    }
    // Retorna como string separada por vírgula (compatível com API)
    onChange(updated.join(', '));
  };

  // Get display text
  const getDisplayText = () => {
    if (selectedMethods.length === 0) return 'Selecione os meios de pagamento';
    if (selectedMethods.length === 1) {
      const method = paymentMethods.find(m => m.id === selectedMethods[0]);
      return method ? `${method.icon} ${method.label}` : selectedMethods[0];
    }
    return `${selectedMethods.length} métodos selecionados`;
  };

  // Get all selected methods as badges
  const getSelectedBadges = () => {
    return selectedMethods
      .map(methodId => paymentMethods.find(m => m.id === methodId))
      .filter(Boolean);
  };

  return (
    <div style={{ marginBottom: '12px', position: 'relative' }}>
      <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
        {label}
      </label>

      {/* Display do valor selecionado */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '10px 12px',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          color: 'var(--text)',
          fontSize: '14px',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span>{getDisplayText()}</span>
        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* Exibe badges dos métodos selecionados */}
      {selectedMethods.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
          {getSelectedBadges().map((method) => (
            <div
              key={method.id}
              onClick={() => toggleMethod(method.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'var(--primary)',
                color: 'white',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.parentElement.style.opacity = '0.8';
              }}
              onMouseOut={(e) => {
                e.target.parentElement.style.opacity = '1';
              }}
            >
              <span>{method.icon}</span>
              <span>{method.label}</span>
              <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>×</span>
            </div>
          ))}
        </div>
      )}

      {/* Modal dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            marginTop: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          {paymentMethods.map((method) => {
            const isSelected = selectedMethods.includes(method.id);
            return (
              <div
                key={method.id}
                onClick={() => toggleMethod(method.id)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: isSelected ? 'var(--primary)' : 'transparent',
                  color: isSelected ? 'white' : 'var(--text)',
                  borderBottom: '1px solid var(--border)',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    background: isSelected ? 'var(--primary)' : 'var(--bg3)'
                  }
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'var(--bg3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleMethod(method.id)}
                  style={{
                    cursor: 'pointer',
                    width: '18px',
                    height: '18px'
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <span style={{ fontSize: '18px' }}>{method.icon}</span>
                <span style={{ flex: 1, fontSize: '14px', fontWeight: '500' }}>
                  {method.label}
                </span>
                {isSelected && (
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>✓</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Fechar dropdown ao clicar fora */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default PaymentMethodSelector;
