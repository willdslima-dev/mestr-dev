/**
 * SelectModal - Template para modais de seleção (single ou multiple)
 * 
 * Uso:
 * <SelectModal
 *   isOpen={true}
 *   onClose={handleClose}
 *   titulo="Selecionar Cliente"
 *   mode="single" // ou "multiple"
 *   items={clientes}
 *   selectedItems={selectedClientes}
 *   onSelect={handleSelect}
 *   renderItem={(item) => <ClienteCard {...item} />}
 *   onAdd={handleAddNovo}
 *   addLabel="Adicionar Novo"
 * />
 */

import React, { useState } from 'react';
import Modal from '../Modal';

function SelectModal({
  isOpen,
  onClose,
  titulo,
  mode = 'single', // 'single' | 'multiple'
  items = [],
  selectedItems = [],
  onSelect,
  renderItem,
  onAdd,
  addLabel = 'Adicionar Novo',
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'Nenhum item encontrado',
  onConfirm, // Para mode='multiple'
  recentItems = [], // Itens recentes para mostrar no topo
  recentLabel = 'Recentes' // Label da seção de recentes
}) {
  const [busca, setBusca] = useState('');

  const itemsFiltrados = items.filter(item => {
    const searchTerm = busca.toLowerCase();
    return (
      item.nome?.toLowerCase().includes(searchTerm) ||
      item.titulo?.toLowerCase().includes(searchTerm) ||
      item.descricao?.toLowerCase().includes(searchTerm)
    );
  });

  const handleItemClick = (item) => {
    if (mode === 'single') {
      onSelect?.(item);
      onClose?.();
    } else {
      // Multiple selection
      const isSelected = selectedItems.some(i => i.id === item.id);
      if (isSelected) {
        onSelect?.(selectedItems.filter(i => i.id !== item.id));
      } else {
        onSelect?.([...selectedItems, item]);
      }
    }
  };

  const footerButtons = (
    <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
      {onAdd && (
        <button
          onClick={onAdd}
          style={{
            flex: 1,
            padding: '14px',
            background: 'var(--bg3)',
            border: '1px solid var(--accent)',
            borderRadius: '8px',
            color: 'var(--accent)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>➕</span>
          <span>{addLabel}</span>
        </button>
      )}
      
      {mode === 'multiple' && onConfirm && (
        <button
          onClick={() => {
            onConfirm(selectedItems);
            onClose?.();
          }}
          disabled={selectedItems.length === 0}
          style={{
            flex: 1,
            padding: '14px',
            background: selectedItems.length > 0 ? 'var(--accent)' : 'var(--bg3)',
            border: 'none',
            borderRadius: '8px',
            color: selectedItems.length > 0 ? 'white' : 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: selectedItems.length > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          Confirmar ({selectedItems.length})
        </button>
      )}
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
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Seção de Recentes - FIXA NO TOPO (não rola) */}
        {recentItems.length > 0 && !busca && (
          <div style={{ 
            marginBottom: '16px',
            flexShrink: 0
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              marginBottom: '12px',
              letterSpacing: '0.5px'
            }}>
              {recentLabel}
            </div>
            {/* Grid 2 colunas - Cards menores lado a lado */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '8px' 
            }}>
              {recentItems.map((item) => {
                const isSelected = mode === 'multiple' && selectedItems.some(i => i.id === item.id);
                
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    style={{
                      padding: '10px',
                      background: isSelected ? 'var(--accent)' : 'var(--bg3)',
                      border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {renderItem ? renderItem(item, true) : (
                      <div>
                        <div style={{ 
                          fontWeight: '600', 
                          fontSize: '13px',
                          marginBottom: '4px',
                          color: isSelected ? 'white' : 'var(--text)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.nome || item.titulo}
                        </div>
                        {item.telefone && (
                          <div style={{ 
                            fontSize: '11px', 
                            color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)' 
                          }}>
                            📱 {item.telefone}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Separador */}
            <div style={{
              height: '1px',
              background: 'var(--border)',
              margin: '16px 0 12px 0'
            }}></div>
          </div>
        )}

        {/* Busca fixa */}
        <div style={{
          padding: '0 0 16px 0',
          flexShrink: 0
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            background: 'var(--bg3)',
            borderRadius: '8px'
          }}>
            <i className="fas fa-search" style={{ color: 'var(--text-secondary)' }}></i>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text)',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* Lista rolável */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 0
        }}>
          {itemsFiltrados.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: 'var(--text-secondary)'
            }}>
              <p>{emptyMessage}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {itemsFiltrados.map((item) => {
                const isSelected = mode === 'multiple' && selectedItems.some(i => i.id === item.id);
                
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    style={{
                      padding: '16px',
                      background: isSelected ? 'var(--accent)' : 'var(--bg3)',
                      border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    {mode === 'multiple' && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isSelected ? 'white' : 'var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: isSelected ? 'var(--accent)' : 'transparent'
                      }}>
                        ✓
                      </div>
                    )}
                    
                    {renderItem ? renderItem(item) : (
                      <div>
                        <div style={{ 
                          fontWeight: '600', 
                          marginBottom: '4px',
                          color: isSelected ? 'white' : 'var(--text)'
                        }}>
                          {item.nome || item.titulo}
                        </div>
                        {item.descricao && (
                          <div style={{ 
                            fontSize: '13px', 
                            color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)' 
                          }}>
                            {item.descricao}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default SelectModal;
