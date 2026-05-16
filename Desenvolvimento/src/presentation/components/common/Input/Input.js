import React from 'react';
import './Input.css';

/**
 * Input - Componente de input reutilizável
 */
function Input({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  icon = null,
  helperText,
  className = '',
  ...props
}) {
  const inputId = `input-${name}`;
  
  const classNames = [
    'input-wrapper',
    error && 'input-wrapper--error',
    disabled && 'input-wrapper--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
          {required && <span className="input__required">*</span>}
        </label>
      )}
      
      <div className="input__container">
        {icon && <span className="input__icon">{icon}</span>}
        
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`input ${icon ? 'input--with-icon' : ''}`}
          {...props}
        />
      </div>
      
      {error && <span className="input__error">{error}</span>}
      {helperText && !error && <span className="input__helper">{helperText}</span>}
    </div>
  );
}

export default Input;
