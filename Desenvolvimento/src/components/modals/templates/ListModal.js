/**
 * ListModal - Template para modais com lista/tabela
 * 
 * Uso:
 * <ListModal
 *   isOpen={true}
 *   onClose={handleClose}
 *   titulo="Pedidos"
 *   tabs={['Todos', 'Ativos', 'Finalizados']}
 *   activeTab={tab}
 *   onTabChange={setTab}
 *   searchValue={busca}
 *   onSearchChange={setBusca}
 *   searchPlaceholder="Buscar pedidos..."
 *   onAdd={handleNovo}
 *   addLabel="Novo Pedido"
 * >
 *   {items.map(item => <ItemCard key={item.id} {...item} />)}
 * </ListModal>
 */

import React from 'react';
import Modal from '../Modal';

function ListModal({
  isOpen,
  onClose,
  titulo,
  children,
  // Tabs
  tabs = [],
  activeTab,
  onTabChange,
  // Search
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  showSearch = true,
  // Actions
  onAdd,
  addLabel = 'Adicionar',
  customFooter = null,
  // Header alert
  alertMessage,
  alertStyle = {}
}) {
  const footerButtons = customFooter || (
    onAdd && (
      <button
        onClick={onAdd}
        style={{
          width: '100%',
          padding: '14px',
          background: 'var(--accent)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <span style={{ fontSize: '18px' }}>➕</span>
        <span>{addLabel}</span>
      </button>
    )
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
        {/* Alert opcional */}
        {alertMessage && (
          <div style={{
            padding: '12px 16px',
            background: 'var(--accent)',
            color: 'white',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
            ...alertStyle
          }}>
            {alertMessage}
          </div>
        )}

        {/* Tabs fixas */}
        {tabs.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '16px',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0
          }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange?.(tab)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: activeTab === tab ? 'var(--accent)' : 'var(--bg3)',
                  border: 'none',
                  borderRadius: '8px',
                  color: activeTab === tab ? 'white' : 'var(--text)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Busca fixa */}
        {showSearch && (
          <div style={{
            padding: '16px',
            borderBottom: '1px solid var(--border)',
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
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
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
        )}

        {/* Lista rolável */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
          padding: '16px'
        }}>
          {children}
        </div>
      </div>
    </Modal>
  );
}

export default ListModal;
