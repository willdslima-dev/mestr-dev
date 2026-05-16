import React, { useState, useEffect } from 'react';
import FormModal from './templates/FormModal';
import { FormCard, FormInput, FormSelect } from '../forms';
import { hoje } from '../../utils/helpers';

function PagamentoModal({ 
  isOpen, 
  onClose, 
  onSalvar, 
  pagamento = null, 
  pagamentoEditando = null,
  clientePadrao = null,
  statusPadrao = null,
  PAG,
  setPAG
}) {
  const pagamentoAtual = pagamento || pagamentoEditando;
  
  const [formData, setFormData] = useState({
    valor: '',
    dataRecebimento: hoje(),
    status: statusPadrao || 'recebido',
    meioPagamento: 'pix',
    referencia: '',
    informacoesAdicionais: '',
    anotacoes: '',
    clienteId: clientePadrao?.id || '',
    clienteNome: clientePadrao?.nome || '',
    pedidoId: ''
  });

  useEffect(() => {
    if (pagamentoAtual) {
      setFormData({
        valor: pagamentoAtual.valor?.toString() || '',
        dataRecebimento: pagamentoAtual.dataRecebimento || hoje(),
        status: pagamentoAtual.status || statusPadrao || 'recebido',
        meioPagamento: pagamentoAtual.meioPagamento || 'pix',
        referencia: pagamentoAtual.referencia || '',
        informacoesAdicionais: pagamentoAtual.informacoesAdicionais || '',
        anotacoes: pagamentoAtual.anotacoes || '',
        clienteId: pagamentoAtual.clienteId || clientePadrao?.id || '',
        clienteNome: pagamentoAtual.clienteNome || clientePadrao?.nome || '',
        pedidoId: pagamentoAtual.pedidoId || ''
      });
    } else {
      setFormData({
        valor: '',
        dataRecebimento: hoje(),
        status: statusPadrao || 'recebido',
        meioPagamento: 'pix',
        referencia: '',
        informacoesAdicionais: '',
        anotacoes: '',
        clienteId: clientePadrao?.id || '',
        clienteNome: clientePadrao?.nome || '',
        pedidoId: ''
      });
    }
  }, [pagamentoAtual, statusPadrao, clientePadrao, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSalvar = () => {
    const pagamentoData = {
      id: pagamentoAtual?.id || `pag_${Date.now()}`,
      valor: parseFloat(formData.valor),
      dataRecebimento: formData.dataRecebimento,
      status: formData.status,
      meioPagamento: formData.meioPagamento,
      referencia: formData.referencia.trim(),
      informacoesAdicionais: formData.informacoesAdicionais.trim(),
      anotacoes: formData.anotacoes.trim(),
      clienteId: formData.clienteId,
      clienteNome: formData.clienteNome,
      pedidoId: formData.pedidoId,
      dataCriacao: pagamentoAtual?.dataCriacao || new Date().toISOString()
    };

    if (PAG && setPAG) {
      const novoPAG = { ...PAG, [pagamentoData.id]: pagamentoData };
      setPAG(novoPAG);
      onClose();
    } else if (onSalvar) {
      onSalvar(pagamentoData);
      onClose();
    }
  };

  const statusOptions = [
    { value: 'recebido', label: 'Recebido', icon: '●' },
    { value: 'a receber', label: 'A receber', icon: '●' },
    { value: 'em atraso', label: 'Em atraso', icon: '●' },
    { value: 'pago', label: 'Pago', icon: '●' },
    { value: 'previsto', label: 'Previsto', icon: '●' }
  ];

  const meiosPagamento = [
    { value: 'pix', label: 'PIX', icon: '📱' },
    { value: 'dinheiro', label: 'Dinheiro', icon: '💵' },
    { value: 'cartao_credito', label: 'Cartão de Crédito', icon: '💳' },
    { value: 'cartao_debito', label: 'Cartão de Débito', icon: '💳' },
    { value: 'transferencia', label: 'Transferência', icon: '🏦' },
    { value: 'boleto', label: 'Boleto', icon: '📄' },
    { value: 'cheque', label: 'Cheque', icon: '📝' }
  ];

  // Validação
  const formValido = 
    parseFloat(formData.valor) > 0 &&
    formData.dataRecebimento.length > 0;

  const getTitulo = () => {
    if (pagamentoAtual) return 'Editar Pagamento';
    return 'Novo Recebimento';
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      titulo={getTitulo()}
      onSave={handleSalvar}
      saveLabel="Salvar recebimento"
      isValid={formValido}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Status */}
        <FormCard>
          <FormSelect
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={statusOptions}
            required
          />
        </FormCard>

        {/* Data e Valor */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth <= 480 ? '1fr' : '1fr 1fr', 
          gap: '12px' 
        }}>
          <FormCard>
            <FormInput
              label="Data"
              type="date"
              value={formData.dataRecebimento}
              onChange={(e) => handleChange('dataRecebimento', e.target.value)}
              required
            />
          </FormCard>

          <FormCard>
            <FormInput
              label="Valor (R$)"
              type="number"
              step="0.01"
              min="0"
              value={formData.valor}
              onChange={(e) => handleChange('valor', e.target.value)}
              placeholder="0,00"
              required
            />
          </FormCard>
        </div>

        {/* Cliente */}
        {clientePadrao && (
          <FormCard>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'var(--bg3)',
              borderRadius: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>👤</span>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Cliente</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{formData.clienteNome}</div>
              </div>
            </div>
          </FormCard>
        )}

        {/* Meio de Pagamento */}
        <FormCard>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Meio de pagamento
          </label>
          <select
            value={formData.meioPagamento}
            onChange={(e) => handleChange('meioPagamento', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            {meiosPagamento.map(meio => (
              <option key={meio.value} value={meio.value}>
                {meio.icon} {meio.label}
              </option>
            ))}
          </select>
        </FormCard>

        {/* Referência */}
        <FormCard>
          <FormInput
            label='Este valor refere-se a...'
            type="text"
            value={formData.referencia}
            onChange={(e) => handleChange('referencia', e.target.value)}
            placeholder='ex.: "parcela 1/3", "sinal de 50%"'
          />
        </FormCard>

        {/* Informações adicionais */}
        <FormCard>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            Informações adicionais
          </label>
          <textarea
            value={formData.informacoesAdicionais}
            onChange={(e) => handleChange('informacoesAdicionais', e.target.value)}
            placeholder="Detalhes sobre o pagamento..."
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text)',
              fontSize: '14px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </FormCard>

        {/* Anotações privadas */}
        <FormCard>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            Anotações <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>(não visível ao cliente)</span>
          </label>
          <textarea
            value={formData.anotacoes}
            onChange={(e) => handleChange('anotacoes', e.target.value)}
            placeholder="Observações internas..."
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text)',
              fontSize: '14px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </FormCard>
      </div>
    </FormModal>
  );
}

export default PagamentoModal;
