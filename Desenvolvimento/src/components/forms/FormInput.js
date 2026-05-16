import React from 'react';
import './FormInput.css';

/**
 * Input padronizado com label
 * @param {object} props
 * @param {string} props.label - Texto do label
 * @param {string} props.type - Tipo do input (text, number, date, etc)
 * @param {string} props.value - Valor do input
 * @param {function} props.onChange - Callback de mudança
 * @param {string} props.placeholder - Placeholder
 * @param {boolean} props.required - Campo obrigatório
 * @param {string} props.className - Classes CSS adicionais
 */
function FormInput({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  className = '',
  ...props 
}) {
  return (
    <div className={`form-input-wrapper ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-input"
        {...props}
      />
    </div>
  );
}

export default FormInput;
