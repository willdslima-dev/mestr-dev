import React from 'react';
import './Select.css';

/**
 * Select - Componente de select reutilizável
 */
function Select({
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Selecione...',
  label,
  error,
  disabled = false,
  required = false,
  className = ''
}) {
  const selectId = `select-${name}`;
  
  const classNames = [
    'select-wrapper',
    error && 'select-wrapper--error',
    disabled && 'select-wrapper--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {label && (
        <label htmlFor={selectId} className="select__label">
          {label}
          {required && <span className="select__required">*</span>}
        </label>
      )}
      
      <div className="select__container">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="select"
        >
          {placeholder && <option value="">{placeholder}</option>}
          
          {options.map((option, index) => (
            <option
              key={option.value || index}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <span className="select__arrow">▼</span>
      </div>
      
      {error && <span className="select__error">{error}</span>}
    </div>
  );
}

export default Select;
