/**
 * FormModal - Template para modais com formulário
 * 
 * Uso:
 * <FormModal
 *   isOpen={true}
 *   onClose={handleClose}
 *   titulo="Adicionar Cliente"
 *   onSave={handleSave}
 *   onCancel={handleCancel}
 *   saveLabel="Salvar Cliente"
 *   cancelLabel="Cancelar"
 *   isValid={formIsValid}
 * >
 *   <Input name="nome" ... />
 *   <Input name="telefone" ... />
 * </FormModal>
 */

import React from 'react';
import Modal from '../Modal';

function FormModal({
  isOpen,
  onClose,
  titulo,
  children,
  onSave,
  onCancel,
  saveLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  isValid = true,
  isSaving = false,
  showCancelButton = true,
  customFooter = null
}) {
  const footerButtons = customFooter || (
    <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
      {showCancelButton && (
        <button
          onClick={onCancel || onClose}
          style={{
            flex: 1,
            padding: '14px',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {cancelLabel}
        </button>
      )}
      <button
        onClick={onSave}
        disabled={!isValid || isSaving}
        style={{
          flex: 1,
          padding: '14px',
          background: isValid && !isSaving ? 'var(--accent)' : 'var(--bg3)',
          border: 'none',
          borderRadius: '8px',
          color: isValid && !isSaving ? 'white' : 'var(--text-secondary)',
          fontSize: '14px',
          fontWeight: '600',
          cursor: isValid && !isSaving ? 'pointer' : 'not-allowed',
          opacity: isSaving ? 0.7 : 1
        }}
      >
        {isSaving ? '⏳ Salvando...' : saveLabel}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titulo={titulo}
      comScroll={false}
      footer={footerButtons}
    >
      {children}
    </Modal>
  );
}

export default FormModal;
