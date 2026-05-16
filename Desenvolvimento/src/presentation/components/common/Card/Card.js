import React from 'react';
import './Card.css';

/**
 * Card - Componente de card reutilizável
 */
function Card({
  children,
  title,
  subtitle,
  footer,
  variant = 'default', // default, primary, success, danger, warning
  className = '',
  onClick,
  hoverable = false
}) {
  const classNames = [
    'card',
    `card--${variant}`,
    hoverable && 'card--hoverable',
    onClick && 'card--clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} onClick={onClick}>
      {(title || subtitle) && (
        <div className="card__header">
          {title && <h3 className="card__title">{title}</h3>}
          {subtitle && <p className="card__subtitle">{subtitle}</p>}
        </div>
      )}
      
      <div className="card__body">
        {children}
      </div>
      
      {footer && (
        <div className="card__footer">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
