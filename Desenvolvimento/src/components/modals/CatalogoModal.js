import React, { useState } from 'react';
import Modal from './Modal';

function CatalogoModal({ isOpen, onClose }) {
  const [filtro, setFiltro] = useState('');
  const [precos, setPrecos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('oc_precos') || '{}');
    } catch {
      return {};
    }
  });

  const catalogoBase = {
    'Elétrica Básica': [
      { nome: 'Instalação de disjuntor', un: 'un', precoBase: 50 },
      { nome: 'Instalação de tomada', un: 'un', precoBase: 40 },
      { nome: 'Instalação de interruptor', un: 'un', precoBase: 35 },
      { nome: 'Troca de chuveiro', un: 'un', precoBase: 80 }
    ],
    'Iluminação': [
      { nome: 'Sanca de gesso com LED', un: 'm', precoBase: 120 },
      { nome: 'Instalação de spot', un: 'un', precoBase: 30 },
      { nome: 'Trilho de LED', un: 'm', precoBase: 150 }
    ],
    'Automação': [
      { nome: 'Instalação de câmera', un: 'un', precoBase: 200 },
      { nome: 'Sensor de presença', un: 'un', precoBase: 80 },
      { nome: 'Campainha inteligente', un: 'un', precoBase: 150 }
    ]
  };

  const salvarPreco = (chave, valor) => {
    const novosPrecos = { ...precos, [chave]: parseFloat(valor) || 0 };
    setPrecos(novosPrecos);
    localStorage.setItem('oc_precos', JSON.stringify(novosPrecos));
  };

  const getPreco = (item) => {
    const chave = item.nome.toLowerCase();
    return precos[chave] || item.precoBase;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="📚 Catálogo de Serviços">
      <input
        type="text"
        placeholder="🔍 Buscar serviço..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          color: 'var(--text)',
          fontSize: '14px',
          marginBottom: '16px'
        }}
      />

      {Object.entries(catalogoBase).map(([categoria, itens]) => {
        const itensFiltrados = itens.filter(item =>
          item.nome.toLowerCase().includes(filtro.toLowerCase())
        );

        if (itensFiltrados.length === 0 && filtro) return null;

        return (
          <div key={categoria} style={{ marginBottom: '16px' }}>
            <h3 style={{ 
              fontSize: '13px', 
              color: 'var(--muted)', 
              marginBottom: '8px',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '6px'
            }}>
              {categoria}
            </h3>
            {itensFiltrados.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 52px 100px',
                  gap: '8px',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: idx < itensFiltrados.length - 1 ? '1px dashed var(--border)' : 'none'
                }}
              >
                <div style={{ fontSize: '13px' }}>{item.nome}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center' }}>
                  {item.un}
                </div>
                <input
                  type="number"
                  value={getPreco(item)}
                  onChange={(e) => salvarPreco(item.nome.toLowerCase(), e.target.value)}
                  style={{
                    padding: '6px 8px',
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    color: 'var(--text)',
                    fontSize: '12px',
                    textAlign: 'right'
                  }}
                />
              </div>
            ))}
          </div>
        );
      })}

      <button className="modal-close" onClick={onClose}>Fechar</button>
    </Modal>
  );
}

export default CatalogoModal;
