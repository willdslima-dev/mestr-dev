import React from 'react';
import './ValueCard.css';

/**
 * Card de valor destacado com gradiente
 * @param {object} props
 * @param {string} props.label - Texto do label
 * @param {string|number} props.value - Valor do input
 * @param {function} props.onChange - Callback de mudança
 * @param {string} props.formattedValue - Valor formatado para exibição
 * @param {string} props.variant - Estilo do card: 'income' (azul), 'expense' (vermelho), 'neutral' (cinza)
 * @param {string} props.placeholder - Placeholder do input
 */
function ValueCard({ 
  label, 
  value, 
  onChange, 
  formattedValue,
  variant = 'income', // 'income', 'expense', 'neutral'
  placeholder = '0,00',
  ...props 
}) {
  return (
    <div className={`value-card value-card-${variant}`}>
      <label className="value-card-label">{label}</label>
      <input
        type="number"
        step="0.01"
        min="0"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="value-card-input"
        {...props}
      />
      {formattedValue && value && (
        <div className="value-card-preview">
          {formattedValue}
        </div>
      )}
    </div>
  );
}

export default ValueCard;
