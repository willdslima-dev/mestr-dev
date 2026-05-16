import React from 'react';
import './Badge.css';

/**
 * Badge - Componente de badge/tag reutilizável
 */
function Badge({
  children,
  variant = 'default', // default, primary, success, danger, warning, info
  size = 'medium', // small, medium, large
  rounded = false,
  className = ''
}) {
  const classNames = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    rounded && 'badge--rounded',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames}>
      {children}
    </span>
  );
}

export default Badge;
