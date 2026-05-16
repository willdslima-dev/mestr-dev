import React, { useState, useEffect } from 'react';
import FormModal from './templates/FormModal';
import './ServicoModal.css';

function ServicoModal({ isOpen, onClose, onSalvar, servicoEditando = null }) {
  const [formData, setFormData] = useState({
    descricao: '',
    valorUnitario: '',
    quantidade: '',
    unidade: 'm²'
  });

  useEffect(() => {
    if (servicoEditando) {
      setFormData({
        descricao: servicoEditando.descricao || '',
        valorUnitario: servicoEditando.valorUnitario?.toString() || '',
        quantidade: servicoEditando.quantidade?.toString() || '',
        unidade: servicoEditando.unidade || 'm²'
      });
    } else {
      setFormData({
        descricao: '',
        valorUnitario: '',
        quantidade: '',
        unidade: 'm²'
      });
    }
  }, [servicoEditando, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calcularTotal = () => {
    const valor = parseFloat(formData.valorUnitario) || 0;
    const qtd = parseFloat(formData.quantidade) || 0;
    return valor * qtd;
  };

  const handleSalvar = () => {
    const servico = {
      id: servicoEditando?.id || `srv_${Date.now()}`,
      descricao: formData.descricao.trim(),
      valorUnitario: parseFloat(formData.valorUnitario),
      quantidade: parseFloat(formData.quantidade),
      unidade: formData.unidade,
      total: calcularTotal()
    };

    onSalvar(servico);
    onClose();
  };

  const formatCurrency = (value) => {
    const numero = parseFloat(value) || 0;
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Validação
  const formValido = 
    formData.descricao.trim().length > 0 &&
    parseFloat(formData.valorUnitario) > 0 &&
    parseFloat(formData.quantidade) > 0;

  const total = calcularTotal();

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      titulo={servicoEditando ? "Editar Serviço" : "Adicionar Serviço"}
      onSave={handleSalvar}
      saveLabel={servicoEditando ? 'Salvar alterações' : 'Adicionar serviço'}
      isValid={formValido}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Descrição */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Descrição do serviço <span style={{ color: 'red' }}>*</span>
          </label>
          <textarea
            value={formData.descricao}
            onChange={(e) => handleChange('descricao', e.target.value)}
            placeholder="Ex: Pintura de parede externa, instalação de piso..."
            rows="3"
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
        </div>

        {/* Valor, Quantidade e Unidade */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth <= 480 ? '1fr' : '2fr 2fr 1fr', 
          gap: '12px' 
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Preço unitário (R$/{formData.unidade}) <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.valorUnitario}
              onChange={(e) => handleChange('valorUnitario', e.target.value)}
              placeholder="0,00"
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Quantidade <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.quantidade}
              onChange={(e) => handleChange('quantidade', e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Unidade
            </label>
            <select
              value={formData.unidade}
              onChange={(e) => handleChange('unidade', e.target.value)}
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
              <option value="m²">m²</option>
              <option value="m">m</option>
              <option value="un">un</option>
              <option value="h">h</option>
              <option value="dia">dia</option>
            </select>
          </div>
        </div>

        {/* Preview do total */}
        <div style={{
          padding: '16px',
          background: 'var(--bg3)',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '2px solid var(--accent)',
          marginTop: '8px'
        }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
            Valor total do serviço:
          </span>
          <strong style={{ fontSize: '20px', color: 'var(--accent)' }}>
            {formatCurrency(total)}
          </strong>
        </div>
      </div>
    </FormModal>
  );
}

export default ServicoModal;
