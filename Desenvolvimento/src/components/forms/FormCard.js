import React from 'react';
import './FormCard.css';

/**
 * Card container para agrupar campos de formulário
 * @param {object} props
 * @param {React.ReactNode} props.children - Conteúdo do card
 * @param {string} props.className - Classes CSS adicionais
 */
function FormCard({ children, className = '' }) {
  return (
    <div className={`form-card ${className}`}>
      {children}
    </div>
  );
}

export default FormCard;
