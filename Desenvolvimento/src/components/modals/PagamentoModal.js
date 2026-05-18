import React, { useState, useEffect, useMemo } from 'react';
import FormModal from './templates/FormModal';
import { FormCard, FormInput, FormSelect } from '../forms';
import { hoje } from '../../utils/helpers';
import {
  aplicarPagamentoNoPedido,
  calcularValorPedido,
  getPedidosDoCliente,
  getTotalPagoPedido
} from '../../utils/pagamentoSync';
import './PagamentoModal.css';

const STATUS_PEDIDO = {
  pendente: { label: 'Pendente', cor: '#f5a623', icon: '⏳' },
  aguardando: { label: 'Aguardando aprovação', cor: '#f5a623', icon: '⏳' },
  aprovado: { label: 'Aprovado', cor: '#4a90e2', icon: '✓' },
  em_andamento: { label: 'Em andamento', cor: '#4a90e2', icon: '🔨' },
  aguardando_pagamento: { label: 'Aguardando pagamento', cor: '#4a90e2', icon: '💰' },
  concluido: { label: 'Concluído', cor: '#10b981', icon: '✓' },
  garantia: { label: 'Garantia', cor: '#10b981', icon: '🛡️' },
  cancelado: { label: 'Cancelado', cor: '#f06070', icon: '✕' }
};

function PagamentoModal({
  isOpen,
  onClose,
  onSalvar,
  pagamento = null,
  pagamentoEditando = null,
  clientePadrao = null,
  statusPadrao = null,
  PAG,
  setPAG,
  ORC,
  setORC
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

  const pedidosCliente = useMemo(() => {
    if (!clientePadrao?.id || !ORC) return [];
    return getPedidosDoCliente(ORC, clientePadrao.id);
  }, [ORC, clientePadrao]);

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
      const pedidoUnico =
        pedidosCliente.length === 1 ? pedidosCliente[0].id : '';
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
        pedidoId: pedidoUnico
      });
    }
  }, [pagamentoAtual, statusPadrao, clientePadrao, isOpen, pedidosCliente]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelecionarPedido = (pedidoId) => {
    handleChange('pedidoId', pedidoId);
  };

  const formatarMoeda = (valor) =>
    `R$ ${(parseFloat(valor) || 0).toFixed(2).replace('.', ',')}`;

  const handleSalvar = () => {
    const pedido = formData.pedidoId ? ORC?.[formData.pedidoId] : null;
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
      pedidoNumero: pedido?.numero || null,
      dataCriacao: pagamentoAtual?.dataCriacao || new Date().toISOString()
    };

    if (PAG && setPAG) {
      const novoPAG = { ...PAG, [pagamentoData.id]: pagamentoData };
      setPAG(novoPAG);
      if (setORC && ORC) {
        aplicarPagamentoNoPedido(pagamentoData, pagamentoAtual, ORC, setORC);
      }
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

  const precisaSelecionarPedido = pedidosCliente.length > 1;
  const formValido =
    parseFloat(formData.valor) > 0 &&
    formData.dataRecebimento.length > 0 &&
    (!precisaSelecionarPedido || !!formData.pedidoId);

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
      <div className="pagamento-modal" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormCard>
          <FormSelect
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={statusOptions}
            required
          />
        </FormCard>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth <= 480 ? '1fr' : '1fr 1fr',
            gap: '12px'
          }}
        >
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

        {clientePadrao && (
          <FormCard>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: 'var(--bg3)',
                borderRadius: '8px'
              }}
            >
              <span style={{ fontSize: '20px' }}>👤</span>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Cliente</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{formData.clienteNome}</div>
              </div>
            </div>
          </FormCard>
        )}

        {clientePadrao && pedidosCliente.length > 0 && (
          <FormCard>
            <div className="pedidos-pagamento-titulo">Vincular ao pedido</div>
            {precisaSelecionarPedido && (
              <p className="pedidos-pagamento-hint">
                Este cliente tem mais de um pedido. Selecione em qual pedido lançar este recebimento.
              </p>
            )}
            <div className="pedidos-pagamento-lista">
              {pedidosCliente.map((pedido) => {
                const status =
                  STATUS_PEDIDO[pedido.status] || STATUS_PEDIDO.pendente;
                const valorTotal = calcularValorPedido(pedido);
                const totalPago = getTotalPagoPedido(pedido, PAG);
                const pendente = Math.max(0, valorTotal - totalPago);
                const selecionado = formData.pedidoId === pedido.id;

                return (
                  <label
                    key={pedido.id}
                    className={`pedido-pagamento-item ${selecionado ? 'selecionado' : ''}`}
                  >
                    <input
                      type="radio"
                      name="pedidoPagamento"
                      checked={selecionado}
                      onChange={() => handleSelecionarPedido(pedido.id)}
                    />
                    <div className="pedido-pagamento-corpo">
                      <div className="pedido-pagamento-topo">
                        <span className="pedido-pagamento-numero">
                          Pedido nº {pedido.numero}
                        </span>
                        <span
                          className="pedido-pagamento-data"
                          style={{
                            background: status.cor,
                            color: '#fff',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            fontSize: '11px'
                          }}
                        >
                          {status.icon} {status.label}
                        </span>
                      </div>
                      {pedido.referencia && (
                        <div className="pedido-pagamento-ref">
                          Ref: {pedido.referencia}
                        </div>
                      )}
                      <div className="pedido-pagamento-valores">
                        <span>
                          Total: <strong>{formatarMoeda(valorTotal)}</strong>
                        </span>
                        <span>
                          Pago: <strong>{formatarMoeda(totalPago)}</strong>
                        </span>
                        {pendente > 0 && (
                          <span className="pedido-pagamento-pendente">
                            Pendente: <strong>{formatarMoeda(pendente)}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </FormCard>
        )}

        {clientePadrao && pedidosCliente.length === 0 && (
          <FormCard>
            <div className="pedido-pagamento-vazio">
              Nenhum pedido cadastrado para este cliente. O recebimento será salvo apenas no histórico do cliente.
            </div>
          </FormCard>
        )}

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
            {meiosPagamento.map((meio) => (
              <option key={meio.value} value={meio.value}>
                {meio.icon} {meio.label}
              </option>
            ))}
          </select>
        </FormCard>

        <FormCard>
          <FormInput
            label="Este valor refere-se a..."
            type="text"
            value={formData.referencia}
            onChange={(e) => handleChange('referencia', e.target.value)}
            placeholder='ex.: "parcela 1/3", "sinal de 50%"'
          />
        </FormCard>

        <FormCard>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
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

        <FormCard>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            Anotações{' '}
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              (não visível ao cliente)
            </span>
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
