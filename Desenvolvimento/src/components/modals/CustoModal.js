import React, { useState, useEffect } from 'react';
import FormModal from './templates/FormModal';
import './CustoModal.css';
import { hoje } from '../../utils/helpers';

function CustoModal({ isOpen, onClose, onSalvar, custoEditando = null }) {
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    data: hoje(),
    categoria: 'material',
    observacao: ''
  });

  useEffect(() => {
    if (custoEditando) {
      setFormData({
        descricao: custoEditando.descricao || '',
        valor: custoEditando.valor?.toString() || '',
        data: custoEditando.data || hoje(),
        categoria: custoEditando.categoria || 'material',
        observacao: custoEditando.observacao || ''
      });
    } else {
      setFormData({
        descricao: '',
        valor: '',
        data: hoje(),
        categoria: 'material',
        observacao: ''
      });
    }
  }, [custoEditando, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSalvar = () => {
    const custo = {
      id: custoEditando?.id || `cst_${Date.now()}`,
      descricao: formData.descricao.trim(),
      valor: parseFloat(formData.valor),
      data: formData.data,
      categoria: formData.categoria,
      observacao: formData.observacao.trim()
    };

    onSalvar(custo);
    onClose();
  };

  const formatCurrency = (value) => {
    const numero = parseFloat(value) || 0;
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Validação
  const formValido = 
    formData.descricao.trim().length > 0 &&
    parseFloat(formData.valor) > 0 &&
    formData.data.length > 0;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      titulo={custoEditando ? "Editar Custo" : "Adicionar Custo"}
      onSave={handleSalvar}
      saveLabel={custoEditando ? 'Salvar alterações' : 'Adicionar custo'}
      isValid={formValido}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Descrição */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Descrição do custo <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.descricao}
            onChange={(e) => handleChange('descricao', e.target.value)}
            placeholder="Ex: Compra de material, pagamento de ajudante..."
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

        {/* Valor e Data */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth <= 480 ? '1fr' : '1fr 1fr', 
          gap: '12px' 
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Valor do custo (R$) <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.valor}
              onChange={(e) => handleChange('valor', e.target.value)}
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
            {formData.valor && (
              <div style={{ 
                marginTop: '8px', 
                fontSize: '16px', 
                fontWeight: '600', 
                color: 'var(--accent)' 
              }}>
                {formatCurrency(formData.valor)}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Data <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="date"
              value={formData.data}
              onChange={(e) => handleChange('data', e.target.value)}
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
        </div>

        {/* Categoria */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Categoria
          </label>
          <select
            value={formData.categoria}
            onChange={(e) => handleChange('categoria', e.target.value)}
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
            <option value="material">Material</option>
            <option value="mao_de_obra">Mão de obra</option>
            <option value="transporte">Transporte</option>
            <option value="alimentacao">Alimentação</option>
            <option value="equipamento">Equipamento</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        {/* Observação */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Observação
          </label>
          <textarea
            value={formData.observacao}
            onChange={(e) => handleChange('observacao', e.target.value)}
            placeholder="Informações adicionais sobre este custo..."
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
        </div>
      </div>
    </FormModal>
  );
}

export default CustoModal;
