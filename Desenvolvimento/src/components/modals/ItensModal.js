import React, { useState } from 'react';
import Modal from './Modal';

function ItensModal({ isOpen, onClose, ORC = {}, CLI = {} }) {
  const [orcSelecionado, setOrcSelecionado] = useState(null);

  const orcsArray = Object.values(ORC);

  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="📝 Editar Itens de Orçamentos">
      {orcsArray.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px 0' }}>
          Nenhum orçamento disponível
        </p>
      ) : (
        <>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px', display: 'block' }}>
              Selecione um orçamento:
            </label>
            <select 
              style={{
                width: '100%',
                padding: '10px',
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)',
                fontSize: '13px'
              }}
              value={orcSelecionado || ''}
              onChange={(e) => setOrcSelecionado(e.target.value)}
            >
              <option value="">-- Escolha um orçamento --</option>
              {orcsArray.map((orc) => {
                const cliente = CLI[orc.clienteId];
                return (
                  <option key={orc.id} value={orc.id}>
                    #{orc.numero} - {cliente?.nome || 'Cliente'} - R$ {orc.total?.toFixed(2) || '0.00'}
                  </option>
                );
              })}
            </select>
          </div>

          {orcSelecionado && (
            <div style={{ 
              background: 'var(--bg3)', 
              border: '1px solid var(--border)', 
              borderRadius: '10px', 
              padding: '12px' 
            }}>
              <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>
                Itens do Orçamento #{ORC[orcSelecionado]?.numero}
              </h3>
              {ORC[orcSelecionado]?.itens?.map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '8px',
                    padding: '8px 0',
                    borderBottom: idx < ORC[orcSelecionado].itens.length - 1 ? '1px solid var(--border)' : 'none'
                  }}
                >
                  <div style={{ flex: 1, fontSize: '13px' }}>{item.nome}</div>
                  <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                    {item.qtd}x R$ {item.preco?.toFixed(2) || '0.00'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      <button className="modal-close" onClick={onClose}>Fechar</button>
    </Modal>
  );
}

export default ItensModal;
