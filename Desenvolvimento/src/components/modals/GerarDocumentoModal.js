import React, { useState } from 'react';
import Modal from './Modal';
import { ActionButtons } from '../forms';
import './GerarDocumentoModal.css';

function GerarDocumentoModal({ isOpen, onClose, cliente, pedidos = [], onGerarDocumento }) {
  const [pedidosSelecionados, setPedidosSelecionados] = useState([]);
  const [tipoGeracao, setTipoGeracao] = useState('individual'); // 'individual' ou 'todos'

  const togglePedido = (pedidoId) => {
    if (pedidosSelecionados.includes(pedidoId)) {
      setPedidosSelecionados(pedidosSelecionados.filter(id => id !== pedidoId));
    } else {
      setPedidosSelecionados([...pedidosSelecionados, pedidoId]);
    }
  };

  const selecionarTodos = () => {
    setPedidosSelecionados(pedidos.map(p => p.id));
  };

  const desmarcarTodos = () => {
    setPedidosSelecionados([]);
  };

  const handleGerar = () => {
    if (pedidosSelecionados.length === 0) {
      alert('Selecione pelo menos um pedido');
      return;
    }
    onGerarDocumento(pedidosSelecionados, tipoGeracao);
  };

  const statusConfig = {
    pendente: { label: 'Pendente', cor: '#f5a623', icon: '⏳' },
    aguardando: { label: 'Aguardando aprovação', cor: '#f5a623', icon: '⏳' },
    aprovado: { label: 'Aprovado', cor: '#4a90e2', icon: '✓' },
    em_andamento: { label: 'Em andamento', cor: '#4a90e2', icon: '🔨' },
    aguardando_pagamento: { label: 'Aguardando pagamento', cor: '#4a90e2', icon: '💰' },
    concluido: { label: 'Concluído', cor: '#10b981', icon: '✓' },
    garantia: { label: 'Garantia', cor: '#10b981', icon: '🛡️' },
    cancelado: { label: 'Cancelado', cor: '#f06070', icon: '✕' }
  };

  if (!cliente) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Gerar Documentos - ${cliente.nome}`}>
      <div className="gerar-documento-modal">
        {/* Alerta informativo */}
        <div className="alert-info">
          <span className="alert-icon">📄</span>
          <div className="alert-text">
            <strong>Selecione os pedidos</strong>
            <p>Escolha quais pedidos deseja incluir no documento</p>
          </div>
        </div>

        {/* Tipo de geração */}
        <div className="tipo-geracao-card">
          <label className="tipo-label">Tipo de documento:</label>
          <div className="tipo-options">
            <label className="tipo-option">
              <input
                type="radio"
                name="tipoGeracao"
                value="individual"
                checked={tipoGeracao === 'individual'}
                onChange={(e) => setTipoGeracao(e.target.value)}
              />
              <span>📄 Documentos separados (um arquivo por pedido)</span>
            </label>
            <label className="tipo-option">
              <input
                type="radio"
                name="tipoGeracao"
                value="todos"
                checked={tipoGeracao === 'todos'}
                onChange={(e) => setTipoGeracao(e.target.value)}
              />
              <span>📋 Documento único (todos os pedidos juntos)</span>
            </label>
          </div>
        </div>

        {/* Ações de seleção */}
        <div className="selecao-rapida">
          <button onClick={selecionarTodos} className="btn-selecao">
            ✓ Selecionar todos ({pedidos.length})
          </button>
          <button onClick={desmarcarTodos} className="btn-selecao">
            ✕ Desmarcar todos
          </button>
        </div>

        {/* Lista de pedidos */}
        <div className="pedidos-lista">
          {pedidos.length === 0 ? (
            <div className="pedidos-vazio">
              <span className="pedidos-vazio-icon">📭</span>
              <p>Este cliente não possui pedidos cadastrados</p>
            </div>
          ) : (
            pedidos.map(pedido => {
              const status = statusConfig[pedido.status] || statusConfig.pendente;
              const isSelecionado = pedidosSelecionados.includes(pedido.id);

              return (
                <div
                  key={pedido.id}
                  className={`pedido-item ${isSelecionado ? 'selecionado' : ''}`}
                  onClick={() => togglePedido(pedido.id)}
                >
                  <div className="pedido-checkbox">
                    <input
                      type="checkbox"
                      checked={isSelecionado}
                      onChange={() => {}}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <div className="pedido-info">
                    <div className="pedido-header">
                      <span className="pedido-numero">Pedido {pedido.numero}</span>
                      <span className="pedido-data">{pedido.criadoEm}</span>
                    </div>

                    <div className="pedido-status-badge" style={{ background: status.cor }}>
                      <span>{status.icon}</span>
                      <span>{status.label}</span>
                    </div>

                    {pedido.referencia && (
                      <div className="pedido-referencia">
                        Ref: {pedido.referencia}
                      </div>
                    )}

                    <div className="pedido-valor">
                      Valor: <strong>R$ {(pedido.total || 0).toFixed(2).replace('.', ',')}</strong>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Resumo de seleção */}
        {pedidosSelecionados.length > 0 && (
          <div className="selecao-resumo">
            <strong>{pedidosSelecionados.length}</strong> pedido(s) selecionado(s)
          </div>
        )}

        {/* Botões de ação */}
        <ActionButtons
          onCancel={onClose}
          onSave={handleGerar}
          saveLabel={`📄 Gerar ${pedidosSelecionados.length > 1 ? 'documentos' : 'documento'}`}
          saveDisabled={pedidosSelecionados.length === 0}
        />
      </div>
    </Modal>
  );
}

export default GerarDocumentoModal;
