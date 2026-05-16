import React from 'react';
import Modal from './Modal';

function AgendaModal({ isOpen, onClose, agenda = [] }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="📅 Agenda">
      <div className="modal-row">
        <button className="modal-btn">Hoje</button>
        <button className="modal-btn">Esta semana</button>
        <button className="modal-btn">Este mês</button>
      </div>
      
      {agenda.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px 0' }}>
          Nenhum compromisso agendado
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {agenda.map((item) => (
            <div 
              key={item.id} 
              style={{
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <strong>{item.tipo}</strong>
                <span style={{ color: 'var(--muted)', fontSize: '12px' }}>
                  {item.data} {item.hora}
                </span>
              </div>
              {item.obs && <p style={{ fontSize: '13px', color: 'var(--muted)' }}>{item.obs}</p>}
            </div>
          ))}
        </div>
      )}
      
      <button className="modal-close" onClick={onClose}>Fechar</button>
    </Modal>
  );
}

export default AgendaModal;
