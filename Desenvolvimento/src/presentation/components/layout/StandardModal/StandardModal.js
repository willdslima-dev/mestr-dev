import React, { useEffect } from 'react';
import { Button } from '../common';
import './StandardModal.css';

/**
 * StandardModal - Modal padronizado com header fixo, body com scroll, footer fixo
 * 
 * Estrutura:
 * ┌─────────────────────────────┐
 * │ HEADER (fixo)               │ ← Título + botão fechar
 * ├─────────────────────────────┤
 * │                             │
 * │ BODY (scroll)               │ ← Conteúdo com scroll
 * │                             │
 * ├─────────────────────────────┤
 * │ FOOTER (fixo)               │ ← Botões de ação
 * └─────────────────────────────┘
 */
function StandardModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  
  // Footer actions
  onSave,
  onCancel,
  saveLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  showSaveButton = true,
  showCancelButton = true,
  saveDisabled = false,
  saveLoading = false,
  saveVariant = 'primary',
  
  // Additional footer buttons
  footerActions,
  
  // Header actions (botão extra no header, ex: "Novo Cliente")
  headerAction,
  
  // Modal size
  size = 'large', // small, medium, large, xlarge, fullscreen
  
  // Custom class
  className = ''
}) {
  // Fecha modal com ESC
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

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

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  if (!isOpen) return null;

  const modalClassNames = [
    'standard-modal',
    `standard-modal--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="standard-modal-overlay" onClick={onClose}>
      <div className={modalClassNames} onClick={(e) => e.stopPropagation()}>
        {/* HEADER FIXO */}
        <div className="standard-modal__header">
          <div className="standard-modal__header-content">
            <div className="standard-modal__title-group">
              <h2 className="standard-modal__title">{title}</h2>
              {subtitle && <p className="standard-modal__subtitle">{subtitle}</p>}
            </div>
            
            <div className="standard-modal__header-actions">
              {headerAction && (
                <div className="standard-modal__header-action">
                  {headerAction}
                </div>
              )}
              
              <button
                className="standard-modal__close"
                onClick={handleCancel}
                aria-label="Fechar modal"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* BODY COM SCROLL */}
        <div className="standard-modal__body">
          <div className="standard-modal__body-content">
            {children}
          </div>
        </div>

        {/* FOOTER FIXO */}
        {(showSaveButton || showCancelButton || footerActions) && (
          <div className="standard-modal__footer">
            <div className="standard-modal__footer-actions">
              {/* Ações customizadas à esquerda */}
              {footerActions && (
                <div className="standard-modal__footer-custom">
                  {footerActions}
                </div>
              )}
              
              {/* Botões principais à direita */}
              <div className="standard-modal__footer-main">
                {showCancelButton && (
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                  >
                    {cancelLabel}
                  </Button>
                )}
                
                {showSaveButton && (
                  <Button
                    variant={saveVariant}
                    onClick={handleSave}
                    disabled={saveDisabled}
                    loading={saveLoading}
                  >
                    {saveLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StandardModal;
