import React, { useEffect } from 'react';
import './Modal.css';

/**
 * Modal - ATUALIZADO com estrutura padronizada
 * Header fixo, Body com scroll, Footer fixo
 * 
 * Props:
 * - isOpen: boolean
 * - onClose: function
 * - title/titulo: string (compatibilidade)
 * - children: conteúdo (pode ser um objeto com {body, footer})
 * - comScroll: boolean (retrocompatibilidade)
 * - footer: ReactNode (botões de ação fixos no footer)
 */
function Modal({ isOpen, onClose, children, title, titulo, comScroll = true, footer }) {
  // Bloqueia scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fecha com ESC
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Suporta tanto 'title' quanto 'titulo' para retrocompatibilidade
  const modalTitle = title || titulo;

  // Se children é um objeto com body e footer, usa eles
  // Senão, usa children como body
  const hasStructure = children && typeof children === 'object' && (children.body || children.footer);
  const bodyContent = hasStructure ? children.body : children;
  const footerContent = hasStructure ? children.footer : footer;

  return (
    <div className="overlay show" onClick={handleOverlayClick}>
      <div className="modal modal--new-structure">
        {/* HEADER FIXO */}
        <div className="modal-header modal-header--fixed">
          {modalTitle && <h2>{modalTitle}</h2>}
          <button className="modal-close-btn" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>
        
        {/* BODY COM SCROLL */}
        <div className={`modal-content modal-content--scrollable ${comScroll ? 'com-scroll' : ''}`}>
          {bodyContent}
        </div>
        
        {/* FOOTER FIXO (se existir) */}
        {footerContent && (
          <div className="modal-footer modal-footer--fixed">
            {footerContent}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
