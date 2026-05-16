import React from 'react';
import Modal from './Modal';

function VisualizarPedidoModal({ isOpen, onClose, pedido, cliente, onEditar }) {
  if (!pedido) return null;

  const calcularTotal = () => {
    const totalServicos = (pedido.servicos || []).reduce((acc, s) => acc + (s.valorUnitario * s.quantidade), 0);
    const totalMateriais = (pedido.materiais || []).reduce((acc, m) => acc + (m.valorUnitario * m.quantidade), 0);
    return totalServicos + totalMateriais - (pedido.desconto || 0) + (pedido.taxaEntrega || 0) + (pedido.outrasTaxas || 0);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pendente: { label: 'Pendente', cor: '#f5a623', icon: '⏳' },
      aguardando: { label: 'Aguardando', cor: '#f5a623', icon: '⏳' },
      aprovado: { label: 'Aprovado', cor: '#4a90e2', icon: '✓' },
      em_andamento: { label: 'Em andamento', cor: '#4a90e2', icon: '🔨' },
      aguardando_pagamento: { label: 'Aguardando pagamento', cor: '#4a90e2', icon: '💰' },
      concluido: { label: 'Concluído', cor: '#10b981', icon: '✓' },
      garantia: { label: 'Garantia', cor: '#10b981', icon: '🛡️' },
      cancelado: { label: 'Cancelado', cor: '#f06070', icon: '✕' }
    };
    return configs[status] || { label: status, cor: '#6b7280', icon: '●' };
  };

  const statusConfig = getStatusConfig(pedido.status);
  const valorTotal = calcularTotal();

  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo={`Pedido #${pedido.numero}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Header com Status */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '12px 16px',
          background: 'var(--bg2)',
          borderRadius: '8px'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>
              Data de criação
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '500' }}>
              {pedido.criadoEm ? new Date(pedido.criadoEm).toLocaleDateString('pt-BR') : '—'}
            </div>
          </div>
          <div style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: statusConfig.cor + '20',
            color: statusConfig.cor,
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>{statusConfig.icon}</span>
            {statusConfig.label}
          </div>
        </div>

        {/* Informações do Cliente */}
        <div style={{ 
          padding: '16px',
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: '8px'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '12px' }}>
            👤 Cliente
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Nome: </span>
              <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '500' }}>
                {pedido.clienteNome || cliente?.nome || '—'}
              </span>
            </div>
            
            {(cliente?.telefone || cliente?.whatsapp || pedido.clienteTelefone) && (
              <div>
                <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Telefone: </span>
                <span style={{ fontSize: '14px', color: 'var(--text)' }}>
                  {cliente?.whatsapp || cliente?.telefone || pedido.clienteTelefone}
                </span>
              </div>
            )}
            
            {cliente?.endereco && (
              <div>
                <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Endereço: </span>
                <span style={{ fontSize: '14px', color: 'var(--text)' }}>
                  {cliente.endereco.logradouro && `${cliente.endereco.logradouro}${cliente.endereco.numero ? ', ' + cliente.endereco.numero : ''}`}
                  {cliente.endereco.bairro && ` - ${cliente.endereco.bairro}`}
                  {cliente.endereco.cidade && ` - ${cliente.endereco.cidade}/${cliente.endereco.estado}`}
                </span>
              </div>
            )}
            
            {pedido.referencia && (
              <div>
                <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Referência: </span>
                <span style={{ fontSize: '14px', color: 'var(--text)' }}>
                  {pedido.referencia}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Datas e Horários */}
        {(pedido.validadeOrcamento || pedido.prazoExecucao || pedido.horarioInicio || pedido.horarioTermino) && (
          <div style={{ 
            padding: '16px',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: '8px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '12px' }}>
              📅 Datas e Horários
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pedido.validadeOrcamento && (
                <div>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Validade do orçamento: </span>
                  <span style={{ fontSize: '14px', color: 'var(--text)' }}>
                    {new Date(pedido.validadeOrcamento + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
              
              {pedido.prazoExecucao && (
                <div>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Prazo de execução: </span>
                  <span style={{ fontSize: '14px', color: 'var(--text)' }}>
                    {new Date(pedido.prazoExecucao + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
              
              {(pedido.horarioInicio || pedido.horarioTermino) && (
                <div>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Horário: </span>
                  <span style={{ fontSize: '14px', color: 'var(--text)' }}>
                    {pedido.horarioInicio || '--:--'} até {pedido.horarioTermino || '--:--'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Serviços */}
        {pedido.servicos && pedido.servicos.length > 0 && (
          <div style={{ 
            padding: '16px',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: '8px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '12px' }}>
              🔧 Serviços ({pedido.servicos.length})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pedido.servicos.map((servico, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '10px',
                    background: 'var(--bg2)',
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '500' }}>
                      {servico.nome}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      {servico.quantidade} {servico.unidadeMedida} × R$ {servico.valorUnitario?.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: '600' }}>
                    R$ {(servico.quantidade * servico.valorUnitario).toFixed(2).replace('.', ',')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Materiais */}
        {pedido.materiais && pedido.materiais.length > 0 && (
          <div style={{ 
            padding: '16px',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: '8px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '12px' }}>
              📦 Materiais ({pedido.materiais.length})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pedido.materiais.map((material, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '10px',
                    background: 'var(--bg2)',
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '500' }}>
                      {material.nome}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      {material.quantidade} {material.unidadeMedida} × R$ {material.valorUnitario?.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: '600' }}>
                    R$ {(material.quantidade * material.valorUnitario).toFixed(2).replace('.', ',')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resumo Financeiro */}
        <div style={{ 
          padding: '16px',
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: '8px'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '12px' }}>
            💰 Resumo Financeiro
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pedido.desconto > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Desconto:</span>
                <span style={{ fontSize: '14px', color: '#f06070' }}>
                  - R$ {pedido.desconto.toFixed(2).replace('.', ',')}
                </span>
              </div>
            )}
            
            {pedido.taxaEntrega > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Taxa de entrega:</span>
                <span style={{ fontSize: '14px', color: 'var(--text)' }}>
                  R$ {pedido.taxaEntrega.toFixed(2).replace('.', ',')}
                </span>
              </div>
            )}
            
            {pedido.outrasTaxas > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Outras taxas:</span>
                <span style={{ fontSize: '14px', color: 'var(--text)' }}>
                  R$ {pedido.outrasTaxas.toFixed(2).replace('.', ',')}
                </span>
              </div>
            )}
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              paddingTop: '12px',
              marginTop: '8px',
              borderTop: '2px solid var(--border)'
            }}>
              <span style={{ fontSize: '16px', color: 'var(--text)', fontWeight: '600' }}>Total:</span>
              <span style={{ fontSize: '18px', color: 'var(--accent)', fontWeight: '700' }}>
                R$ {valorTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>

        {/* Observações */}
        {pedido.observacoes && (
          <div style={{ 
            padding: '16px',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: '8px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '8px' }}>
              📝 Observações
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: '1.5' }}>
              {pedido.observacoes}
            </p>
          </div>
        )}

        {/* Botões de Ação */}
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          paddingTop: '8px',
          borderTop: '1px solid var(--border)',
          marginTop: '8px'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            ← Voltar
          </button>
          
          <button
            onClick={onEditar}
            style={{
              flex: 1,
              padding: '12px',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            ✏️ Editar Pedido
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default VisualizarPedidoModal;
