import React, { useState, useEffect } from 'react';
import DescontoModal from '../../../../components/modals/DescontoModal';
import { StandardModal } from '../../layout';
import { Input, Select, Card, Badge, Button } from '../../common';
import { formatarMoeda } from '../../../../infrastructure/formatters';

/**
 * PedidoFormModal - Modal padronizado para criar/editar pedido
 * 
 * Exemplo de modal COMPLEXO com abas e muito conteúdo
 * O BODY rola, header e footer ficam fixos!
 */
function PedidoFormModal({ 
  isOpen, 
  onClose, 
  onSave,
  cliente,
  pedidoEditando = null 
}) {
  const [abaAtiva, setAbaAtiva] = useState('servicos'); // servicos, materiais, pagamento
  
  const [formData, setFormData] = useState({
    referencia: pedidoEditando?.referencia || '',
    status: pedidoEditando?.status || 'aguardando',
    validadeOrcamento: pedidoEditando?.validadeOrcamento || '',
    prazoExecucao: pedidoEditando?.prazoExecucao || '',
    observacoes: pedidoEditando?.observacoes || '',
    servicos: pedidoEditando?.servicos || [],
    materiais: pedidoEditando?.materiais || [],
    desconto: pedidoEditando?.desconto !== undefined && pedidoEditando?.desconto !== null ? pedidoEditando.desconto : '',
    taxaEntrega: pedidoEditando?.taxaEntrega || 0
  });

  const [saving, setSaving] = useState(false);
  const [modalDescontoOpen, setModalDescontoOpen] = useState(false);

  // Calcula totais
  const subtotalServicos = formData.servicos.reduce((sum, s) => 
    sum + (s.valorUnitario * s.quantidade), 0
  );
  
  const subtotalMateriais = formData.materiais.reduce((sum, m) => 
    sum + (m.valorUnitario * m.quantidade), 0
  );
  
  const subtotal = subtotalServicos + subtotalMateriais;
  const total = subtotal - (parseFloat(formData.desconto) || 0) + formData.taxaEntrega;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      alert('Erro ao salvar pedido. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const isEdit = !!pedidoEditando;

  // Botão customizado no header (exemplo)
  const headerAction = !isEdit && (
    <Button size="small" variant="success" onClick={() => alert('Buscar templates')}>
      📋 Templates
    </Button>
  );

  // Ações customizadas no footer (exemplo)
  const footerActions = (
    <>
      <Button size="small" variant="info" onClick={() => alert('Pré-visualizar')}>
        👁️ Pré-visualizar
      </Button>
      <Button size="small" variant="warning" onClick={() => alert('Salvar rascunho')}>
        💾 Rascunho
      </Button>
    </>
  );

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar Pedido' : 'Novo Pedido'}
      subtitle={cliente ? `Cliente: ${cliente.nome}` : 'Selecione um cliente'}
      onSave={handleSave}
      onCancel={onClose}
      saveLabel={isEdit ? 'Salvar Alterações' : 'Criar Pedido'}
      saveLoading={saving}
      saveDisabled={saving || !cliente}
      size="xlarge"
      headerAction={headerAction}
      footerActions={footerActions}
    >
      {/* ABAS */}
      <div className="tabs">
        <button
          className={`tab ${abaAtiva === 'servicos' ? 'tab--active' : ''}`}
          onClick={() => setAbaAtiva('servicos')}
        >
          📝 Serviços
        </button>
        <button
          className={`tab ${abaAtiva === 'materiais' ? 'tab--active' : ''}`}
          onClick={() => setAbaAtiva('materiais')}
        >
          🧱 Materiais
        </button>
        <button
          className={`tab ${abaAtiva === 'pagamento' ? 'tab--active' : ''}`}
          onClick={() => setAbaAtiva('pagamento')}
        >
          💰 Pagamento
        </button>
      </div>

      {/* CONTEÚDO DAS ABAS - Este conteúdo rola! */}
      
      {/* Informações Básicas (sempre visível) */}
      <div className="form-section">
        <h3 className="form-section__title">Informações Básicas</h3>
        
        <div className="form-row">
          <Input
            label="Referência do pedido"
            value={formData.referencia}
            onChange={(e) => handleChange('referencia', e.target.value)}
            placeholder="Ex: Reforma Casa João"
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={[
              { value: 'aguardando', label: 'Aguardando' },
              { value: 'aprovado', label: 'Aprovado' },
              { value: 'em_andamento', label: 'Em Andamento' },
              { value: 'concluido', label: 'Concluído' },
              { value: 'cancelado', label: 'Cancelado' }
            ]}
          />
        </div>

        <div className="form-row">
          <Input
            label="Validade do orçamento"
            type="date"
            value={formData.validadeOrcamento}
            onChange={(e) => handleChange('validadeOrcamento', e.target.value)}
          />

          <Input
            label="Prazo de execução"
            value={formData.prazoExecucao}
            onChange={(e) => handleChange('prazoExecucao', e.target.value)}
            placeholder="Ex: 15 dias"
          />
        </div>
      </div>

      {/* Conteúdo da aba ativa */}
      {abaAtiva === 'servicos' && (
        <div className="form-section">
          <h3 className="form-section__title">Serviços</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>
            Lista de serviços será exibida aqui...
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>
            (Exemplo de conteúdo que rola dentro do modal)
          </p>
          {/* Simula muito conteúdo para testar scroll */}
          {[...Array(10)].map((_, i) => (
            <div key={i} style={{ padding: '1rem', margin: '0.5rem 0', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              Serviço exemplo {i + 1} - Este é um exemplo de conteúdo que terá scroll
            </div>
          ))}
        </div>
      )}

      {abaAtiva === 'materiais' && (
        <div className="form-section">
          <h3 className="form-section__title">Materiais</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>
            Lista de materiais será exibida aqui...
          </p>
        </div>
      )}

      {abaAtiva === 'pagamento' && (
        <div className="form-section">
          <h3 className="form-section__title">Condições de Pagamento</h3>
          
          <div className="form-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '600' }}>Desconto</div>
                    <div style={{ fontSize: '14px', color: formData.desconto ? '#667eea' : '#94a3b8' }}>{formData.desconto === '' || formData.desconto === null || formData.desconto === undefined ? '_' : formatarMoeda(formData.desconto)}</div>
                  </div>
                  <button onClick={() => setModalDescontoOpen(true)} style={{ width: '40px', height: '40px', background: '#6c63ff', border: 'none', borderRadius: '50%', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>+</button>
                </div>
              </div>

            <Input
              label="Taxa de entrega (R$)"
              type="number"
              step="0.01"
              value={formData.taxaEntrega}
              onChange={(e) => handleChange('taxaEntrega', parseFloat(e.target.value) || 0)}
              placeholder="0,00"
            />
          </div>

          {/* Resumo financeiro */}
          <Card title="Resumo Financeiro" variant="primary">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal Serviços:</span>
                <strong>{formatarMoeda(subtotalServicos)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal Materiais:</span>
                <strong>{formatarMoeda(subtotalMateriais)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc3545' }}>
                <span>Desconto:</span>
                <strong>- {formatarMoeda(formData.desconto)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#28a745' }}>
                <span>Taxa de Entrega:</span>
                <strong>+ {formatarMoeda(formData.taxaEntrega)}</strong>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem' }}>
                <strong>TOTAL:</strong>
                <strong style={{ color: '#667eea' }}>{formatarMoeda(total)}</strong>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Observações */}
      <div className="form-section">
        <h3 className="form-section__title">Observações</h3>
        <textarea
          className="form-textarea"
          value={formData.observacoes}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          placeholder="Observações sobre o pedido..."
          rows="4"
        />
      </div>

      {/* Estilos inline para o exemplo */}
      <style jsx>{`
        .tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        }

        .tab {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.2s ease;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
        }

        .tab:hover {
          color: #e0e0e0;
          background: rgba(255, 255, 255, 0.05);
        }

        .tab--active {
          color: #667eea;
          border-bottom-color: #667eea;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .form-section__title {
          margin: 0 0 1rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: #667eea;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 0.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          font-family: inherit;
          color: #e0e0e0;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          resize: vertical;
        }

      <DescontoModal
        isOpen={modalDescontoOpen}
        onClose={() => setModalDescontoOpen(false)}
        onApply={(valor) => { handleChange('desconto', valor); setModalDescontoOpen(false); }}
        totais={{ totalServicos: subtotalServicos, totalMateriais: subtotalMateriais, subtotal }}
      />

        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          background: rgba(255, 255, 255, 0.08);
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .tabs {
            overflow-x: auto;
          }
        }
      `}</style>
    </StandardModal>
  );
}

export default PedidoFormModal;
