import React, { useState } from 'react';
import { StandardModal } from '../../layout';
import { Input, Select, Button } from '../../common';
import { validarEmail, validarTelefone, validarNaoVazio } from '../../../../infrastructure/validators';
import { formatarTelefone, formatarCpfCnpj } from '../../../../infrastructure/formatters';

/**
 * ClienteFormModal - Modal padronizado para criar/editar cliente
 * 
 * ESTRUTURA:
 * ┌─────────────────────────────────────┐
 * │ [Título]                    [Fechar]│ ← Header fixo
 * ├─────────────────────────────────────┤
 * │                                     │
 * │  [Formulário com scroll]            │ ← Body com scroll
 * │                                     │
 * ├─────────────────────────────────────┤
 * │              [Cancelar] [Salvar]    │ ← Footer fixo
 * └─────────────────────────────────────┘
 */
function ClienteFormModal({ 
  isOpen, 
  onClose, 
  onSave,
  clienteEditando = null 
}) {
  const [formData, setFormData] = useState({
    nome: clienteEditando?.nome || '',
    tipo: clienteEditando?.tipo || 'pf',
    cpfCnpj: clienteEditando?.cpfCnpj || '',
    telefone: clienteEditando?.telefone || '',
    email: clienteEditando?.email || '',
    endereco: clienteEditando?.endereco || '',
    cidade: clienteEditando?.cidade || '',
    estado: clienteEditando?.estado || '',
    cep: clienteEditando?.cep || '',
    observacoes: clienteEditando?.observacoes || ''
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Atualiza quando clienteEditando muda
  React.useEffect(() => {
    if (isOpen) {
      if (clienteEditando) {
        setFormData({
          nome: clienteEditando.nome || '',
          tipo: clienteEditando.tipo || 'pf',
          cpfCnpj: clienteEditando.cpfCnpj || '',
          telefone: clienteEditando.telefone || '',
          email: clienteEditando.email || '',
          endereco: clienteEditando.endereco || '',
          cidade: clienteEditando.cidade || '',
          estado: clienteEditando.estado || '',
          cep: clienteEditando.cep || '',
          observacoes: clienteEditando.observacoes || ''
        });
      } else {
        // Limpa formulário
        setFormData({
          nome: '',
          tipo: 'pf',
          cpfCnpj: '',
          telefone: '',
          email: '',
          endereco: '',
          cidade: '',
          estado: '',
          cep: '',
          observacoes: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, clienteEditando]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpa erro do campo quando usuário digita
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validarFormulario = () => {
    const newErrors = {};

    // Nome obrigatório
    if (!validarNaoVazio(formData.nome)) {
      newErrors.nome = 'Nome é obrigatório';
    }

    // Email (se preenchido)
    if (formData.email && !validarEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Telefone (se preenchido)
    if (formData.telefone && !validarTelefone(formData.telefone)) {
      newErrors.telefone = 'Telefone inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validarFormulario()) {
      return;
    }

    setSaving(true);
    
    try {
      // Formata dados antes de salvar
      const dadosFormatados = {
        ...formData,
        telefone: formData.telefone ? formatarTelefone(formData.telefone) : '',
        cpfCnpj: formData.cpfCnpj ? formatarCpfCnpj(formData.cpfCnpj) : ''
      };

      await onSave(dadosFormatados);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const isEdit = !!clienteEditando;

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar Cliente' : 'Novo Cliente'}
      subtitle={isEdit ? `Editando: ${clienteEditando?.nome}` : 'Preencha os dados do novo cliente'}
      onSave={handleSave}
      onCancel={onClose}
      saveLabel={isEdit ? 'Salvar Alterações' : 'Criar Cliente'}
      saveLoading={saving}
      saveDisabled={saving}
      size="large"
    >
      {/* FORMULÁRIO - Este conteúdo terá SCROLL */}
      <div className="form-section">
        <h3 className="form-section__title">Dados Básicos</h3>
        
        <Input
          label="Nome completo"
          name="nome"
          value={formData.nome}
          onChange={(e) => handleChange('nome', e.target.value)}
          placeholder="Ex: João da Silva"
          required
          error={errors.nome}
          icon="👤"
        />

        <Select
          label="Tipo de pessoa"
          name="tipo"
          value={formData.tipo}
          onChange={(e) => handleChange('tipo', e.target.value)}
          options={[
            { value: 'pf', label: 'Pessoa Física' },
            { value: 'pj', label: 'Pessoa Jurídica' }
          ]}
          required
        />

        <Input
          label={formData.tipo === 'pf' ? 'CPF' : 'CNPJ'}
          name="cpfCnpj"
          value={formData.cpfCnpj}
          onChange={(e) => handleChange('cpfCnpj', e.target.value)}
          placeholder={formData.tipo === 'pf' ? '000.000.000-00' : '00.000.000/0000-00'}
          error={errors.cpfCnpj}
        />
      </div>

      <div className="form-section">
        <h3 className="form-section__title">Contato</h3>
        
        <Input
          label="Telefone"
          name="telefone"
          type="tel"
          value={formData.telefone}
          onChange={(e) => handleChange('telefone', e.target.value)}
          placeholder="(11) 98765-4321"
          error={errors.telefone}
          icon="📱"
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="cliente@email.com"
          error={errors.email}
          icon="📧"
        />
      </div>

      <div className="form-section">
        <h3 className="form-section__title">Endereço</h3>
        
        <Input
          label="Endereço completo"
          name="endereco"
          value={formData.endereco}
          onChange={(e) => handleChange('endereco', e.target.value)}
          placeholder="Rua, número, complemento"
          icon="📍"
        />

        <div className="form-row">
          <Input
            label="Cidade"
            name="cidade"
            value={formData.cidade}
            onChange={(e) => handleChange('cidade', e.target.value)}
            placeholder="São Paulo"
          />

          <Input
            label="Estado"
            name="estado"
            value={formData.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
            placeholder="SP"
            maxLength={2}
          />

          <Input
            label="CEP"
            name="cep"
            value={formData.cep}
            onChange={(e) => handleChange('cep', e.target.value)}
            placeholder="00000-000"
          />
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section__title">Observações</h3>
        
        <textarea
          className="form-textarea"
          value={formData.observacoes}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          placeholder="Anotações adicionais sobre o cliente..."
          rows="4"
        />
      </div>

      {/* Estilos inline para o exemplo */}
      <style jsx>{`
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
          grid-template-columns: 2fr 1fr 1.5fr;
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
          transition: all 0.2s ease;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </StandardModal>
  );
}

export default ClienteFormModal;
