import React from 'react';
import './FormSelect.css';

/**
 * Select padronizado com label e ícones
 * @param {object} props
 * @param {string} props.label - Texto do label
 * @param {string} props.value - Valor selecionado
 * @param {function} props.onChange - Callback de mudança
 * @param {Array} props.options - Array de opções [{value, label, icon}]
 * @param {boolean} props.required - Campo obrigatório
 * @param {string} props.className - Classes CSS adicionais
 */
function FormSelect({ 
  label, 
  value, 
  onChange, 
  options = [], 
  required = false,
  className = '',
  ...props 
}) {
  return (
    <div className={`form-select-wrapper ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className="form-select"
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.icon && `${option.icon} `}{option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FormSelect;
