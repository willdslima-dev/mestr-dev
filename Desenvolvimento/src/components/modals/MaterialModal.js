import React, { useState, useEffect } from 'react';
import FormModal from './templates/FormModal';
import './MaterialModal.css';

function MaterialModal({ isOpen, onClose, onSalvar, materialEditando = null }) {
  const [formData, setFormData] = useState({
    nome: '',
    valorUnitario: '',
    quantidade: '',
    unidade: 'un'
  });

  useEffect(() => {
    if (materialEditando) {
      setFormData({
        nome: materialEditando.nome || '',
        valorUnitario: materialEditando.valorUnitario?.toString() || '',
        quantidade: materialEditando.quantidade?.toString() || '',
        unidade: materialEditando.unidade || 'un'
      });
    } else {
      setFormData({
        nome: '',
        valorUnitario: '',
        quantidade: '',
        unidade: 'un'
      });
    }
  }, [materialEditando, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calcularTotal = () => {
    const valor = parseFloat(formData.valorUnitario) || 0;
    const qtd = parseFloat(formData.quantidade) || 0;
    return valor * qtd;
  };

  const handleSalvar = () => {
    const material = {
      id: materialEditando?.id || `mat_${Date.now()}`,
      nome: formData.nome.trim(),
      valorUnitario: parseFloat(formData.valorUnitario),
      quantidade: parseFloat(formData.quantidade),
      unidade: formData.unidade,
      total: calcularTotal()
    };

    onSalvar(material);
    onClose();
  };

  const formatCurrency = (value) => {
    const numero = parseFloat(value) || 0;
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Validação
  const formValido = 
    formData.nome.trim().length > 0 &&
    parseFloat(formData.valorUnitario) > 0 &&
    parseFloat(formData.quantidade) > 0;

  const total = calcularTotal();

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      titulo={materialEditando ? "Editar Material" : "Adicionar Material"}
      onSave={handleSalvar}
      saveLabel={materialEditando ? 'Salvar alterações' : 'Adicionar material'}
      isValid={formValido}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Nome */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Nome do material <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            placeholder="Ex: Madeirite, Pote, Tinta acrílica..."
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

        {/* Preço, Quantidade e Unidade */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth <= 480 ? '1fr' : '2fr 2fr 1fr', 
          gap: '12px' 
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Preço unitário (R$) <span style={{ color: 'red' }}>*</span>
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
              <option value="un">un</option>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="L">L</option>
              <option value="ml">ml</option>
              <option value="m">m</option>
              <option value="m²">m²</option>
              <option value="cx">cx</option>
              <option value="pct">pct</option>
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
            Valor total do material:
          </span>
          <strong style={{ fontSize: '20px', color: 'var(--accent)' }}>
            {formatCurrency(total)}
          </strong>
        </div>
      </div>
    </FormModal>
  );
}

export default MaterialModal;
