import React from 'react';
import './ActionButtons.css';

/**
 * Botões de ação padronizados (Cancelar/Salvar)
 * @param {object} props
 * @param {function} props.onCancel - Callback do botão cancelar
 * @param {function} props.onSave - Callback do botão salvar
 * @param {string} props.saveLabel - Texto do botão salvar
 * @param {string} props.cancelLabel - Texto do botão cancelar
 * @param {boolean} props.saveDisabled - Desabilita botão salvar
 */
function ActionButtons({ 
  onCancel, 
  onSave, 
  saveLabel = '✓ Salvar', 
  cancelLabel = 'Cancelar',
  saveDisabled = false
}) {
  return (
    <div className="action-buttons">
      <button className="btn-action btn-cancel" onClick={onCancel} type="button">
        {cancelLabel}
      </button>
      <button 
        className="btn-action btn-save" 
        onClick={onSave} 
        disabled={saveDisabled}
        type="button"
      >
        {saveLabel}
      </button>
    </div>
  );
}

export default ActionButtons;
