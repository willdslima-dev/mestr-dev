import React from 'react';
import './Button.css';

/**
 * Button - Componente de botão reutilizável
 */
function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, success, danger, warning, info
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  icon = null,
  fullWidth = false,
  className = ''
}) {
  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full-width',
    disabled && 'btn--disabled',
    loading && 'btn--loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="btn__spinner"></span>}
      {icon && !loading && <span className="btn__icon">{icon}</span>}
      <span className="btn__text">{children}</span>
    </button>
  );
}

export default Button;
