import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './MaterialModal.css';
import { uid } from '../../utils/helpers';

function MaterialModal({ isOpen, onClose, onSalvar, materialEditando = null }) {
  const [abaAtiva, setAbaAtiva] = useState('novo'); // 'novo' ou 'salvos'
  const [formData, setFormData] = useState({
    nome: '',
    valorUnitario: '',
    quantidade: '',
    unidade: 'un'
  });
  
  // Buscar materiais salvos do localStorage
  const [materiaisSalvos, setMateriaisSalvos] = useState(() => {
    const salvos = localStorage.getItem('oc_materiais_personalizados');
    return salvos ? JSON.parse(salvos) : [];
  });
  
  // Quantidades para materiais salvos
  const [quantidadesSalvos, setQuantidadesSalvos] = useState({});
  
  // Seleção múltipla de materiais salvos
  const [materiaisSalvosSelecionados, setMateriaisSalvosSelecionados] = useState([]);

  useEffect(() => {
    if (materialEditando) {
      setAbaAtiva('novo');
      setFormData({
        nome: materialEditando.nome || '',
        valorUnitario: materialEditando.valorUnitario?.toString() || '',
        quantidade: materialEditando.quantidade?.toString() || '',
        unidade: materialEditando.unidadeMedida || materialEditando.unidade || 'un'
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
      id: materialEditando?.id || uid(),
      nome: formData.nome.trim(),
      valorUnitario: parseFloat(formData.valorUnitario),
      quantidade: parseFloat(formData.quantidade),
      unidadeMedida: formData.unidade,
      unidade: formData.unidade,
      total: calcularTotal(),
      origem: 'manual'
    };

    // Se não está editando, salva no localStorage para reutilização
    if (!materialEditando) {
      const materialParaSalvar = {
        id: uid(),
        nome: formData.nome.trim(),
        valorUnitario: parseFloat(formData.valorUnitario),
        unidadeMedida: formData.unidade,
        criadoEm: new Date().toISOString()
      };
      
      const novosMateriais = [...materiaisSalvos, materialParaSalvar];
      localStorage.setItem('oc_materiais_personalizados', JSON.stringify(novosMateriais));
      setMateriaisSalvos(novosMateriais);
    }

    onSalvar(material);
    
    // Limpar formulário
    setFormData({
      nome: '',
      valorUnitario: '',
      quantidade: '',
      unidade: 'un'
    });
    onClose();
  };

  const handleToggleMaterialSalvo = (materialSalvo) => {
    const jaSelecionado = materiaisSalvosSelecionados.find(m => m.id === materialSalvo.id);
    
    if (jaSelecionado) {
      // Remove da seleção
      setMateriaisSalvosSelecionados(materiaisSalvosSelecionados.filter(m => m.id !== materialSalvo.id));
      const novasQuantidades = { ...quantidadesSalvos };
      delete novasQuantidades[materialSalvo.id];
      setQuantidadesSalvos(novasQuantidades);
    } else {
      // Adiciona à seleção
      setMateriaisSalvosSelecionados([...materiaisSalvosSelecionados, materialSalvo]);
      setQuantidadesSalvos({ ...quantidadesSalvos, [materialSalvo.id]: 1 });
    }
  };

  const handleAdicionarMateriaisSalvos = () => {
    if (materiaisSalvosSelecionados.length === 0) return;

    materiaisSalvosSelecionados.forEach(materialSalvo => {
      const quantidade = quantidadesSalvos[materialSalvo.id] || 1;
      const material = {
        id: uid(),
        nome: materialSalvo.nome,
        valorUnitario: materialSalvo.valorUnitario,
        quantidade: quantidade,
        unidadeMedida: materialSalvo.unidadeMedida,
        unidade: materialSalvo.unidadeMedida,
        total: materialSalvo.valorUnitario * quantidade,
        origem: 'manual'
      };

      onSalvar(material);
    });

    // Limpar seleção
    setMateriaisSalvosSelecionados([]);
    setQuantidadesSalvos({});
    onClose();
  };

  const handleUsarMaterialSalvo = (materialSalvo, quantidade = 1) => {
    const material = {
      id: uid(),
      nome: materialSalvo.nome,
      valorUnitario: materialSalvo.valorUnitario,
      quantidade: quantidade,
      unidadeMedida: materialSalvo.unidadeMedida,
      unidade: materialSalvo.unidadeMedida,
      total: materialSalvo.valorUnitario * quantidade,
      origem: 'manual'
    };

    onSalvar(material);
    onClose();
  };

  const handleExcluirMaterialSalvo = (id) => {
    if (window.confirm('Excluir este material salvo?')) {
      const novosMateriais = materiaisSalvos.filter(m => m.id !== id);
      localStorage.setItem('oc_materiais_personalizados', JSON.stringify(novosMateriais));
      setMateriaisSalvos(novosMateriais);
    }
  };

  // Validação
  const formValido = 
    formData.nome.trim().length > 0 &&
    parseFloat(formData.valorUnitario) > 0 &&
    parseFloat(formData.quantidade) > 0;

  const total = calcularTotal();

  // Se está editando, não mostra abas
  if (materialEditando) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} titulo="✏️ Editar Material">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Nome */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px', color: 'var(--muted)' }}>
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
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Preço, Quantidade e Unidade */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px', color: 'var(--muted)' }}>
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
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px', color: 'var(--muted)' }}>
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
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px', color: 'var(--muted)' }}>
                Unidade
              </label>
              <select
                value={formData.unidade}
                onChange={(e) => handleChange('unidade', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--bg)',
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
            border: '2px solid var(--accent)'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--muted)' }}>
              Valor total:
            </span>
            <strong style={{ fontSize: '20px', color: 'var(--accent)' }}>
              R$ {total.toFixed(2).replace('.', ',')}
            </strong>
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
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
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              disabled={!formValido}
              style={{
                flex: 1,
                padding: '12px',
                background: formValido ? 'var(--accent)' : 'var(--bg3)',
                border: 'none',
                borderRadius: '8px',
                color: formValido ? '#fff' : 'var(--muted)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: formValido ? 'pointer' : 'not-allowed',
                opacity: formValido ? 1 : 0.5
              }}
            >
              ✅ Salvar Alterações
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  // Modo adicionar (com abas)
  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="📦 Adicionar Material">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Abas */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border)' }}>
          <button
            onClick={() => setAbaAtiva('novo')}
            style={{
              flex: 1,
              padding: '12px',
              background: abaAtiva === 'novo' ? 'var(--accent)' : 'transparent',
              border: 'none',
              borderBottom: abaAtiva === 'novo' ? '2px solid var(--accent)' : 'none',
              color: abaAtiva === 'novo' ? '#fff' : 'var(--text)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              borderRadius: '8px 8px 0 0',
              marginBottom: '-2px'
            }}
          >
            ✏️ Novo Material
          </button>
          
          <button
            onClick={() => setAbaAtiva('salvos')}
            style={{
              flex: 1,
              padding: '12px',
              background: abaAtiva === 'salvos' ? 'var(--accent)' : 'transparent',
              border: 'none',
              borderBottom: abaAtiva === 'salvos' ? '2px solid var(--accent)' : 'none',
              color: abaAtiva === 'salvos' ? '#fff' : 'var(--text)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              borderRadius: '8px 8px 0 0',
              marginBottom: '-2px'
            }}
          >
            💾 Salvos ({materiaisSalvos.length})
          </button>
        </div>

        {/* ABA NOVO */}
        {abaAtiva === 'novo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Nome */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px', color: 'var(--muted)' }}>
                Nome do material <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                placeholder="Ex: Cimento, Areia, Tinta..."
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Preço, Quantidade e Unidade */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px', color: 'var(--muted)' }}>
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
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px', color: 'var(--muted)' }}>
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
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px', color: 'var(--muted)' }}>
                  Unidade
                </label>
                <select
                  value={formData.unidade}
                  onChange={(e) => handleChange('unidade', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--bg)',
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
            {formData.valorUnitario && formData.quantidade && (
              <div style={{
                padding: '12px',
                background: 'var(--bg3)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>
                  Total:
                </span>
                <span style={{ fontSize: '18px', color: 'var(--accent)', fontWeight: '700' }}>
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            )}

            <button
              onClick={handleSalvar}
              disabled={!formValido}
              style={{
                width: '100%',
                padding: '12px',
                background: formValido ? 'var(--accent)' : 'var(--bg3)',
                border: 'none',
                borderRadius: '8px',
                color: formValido ? '#fff' : 'var(--muted)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: formValido ? 'pointer' : 'not-allowed',
                opacity: formValido ? 1 : 0.5,
                marginTop: '8px'
              }}
            >
              ✅ Adicionar Material
            </button>
          </div>
        )}

        {/* ABA SALVOS */}
        {abaAtiva === 'salvos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {materiaisSalvos.length === 0 ? (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: 'var(--muted)',
                fontSize: '14px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>💾</div>
                <p>Nenhum material personalizado salvo ainda.</p>
                <p style={{ fontSize: '12px', marginTop: '8px' }}>
                  Crie materiais na aba "✏️ Novo Material" e eles ficarão salvos aqui para reutilização!
                </p>
              </div>
            ) : (
              <>
                {/* Lista de materiais salvos */}
                <div style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {materiaisSalvos.map(material => {
                    const quantidade = quantidadesSalvos[material.id] || 1;
                    const selecionado = materiaisSalvosSelecionados.find(m => m.id === material.id);
                    
                    return (
                      <div
                        key={material.id}
                        onClick={() => handleToggleMaterialSalvo(material)}
                        style={{
                          padding: '12px',
                          background: selecionado ? 'var(--accent)15' : 'var(--bg3)',
                          border: selecionado ? '2px solid var(--accent)' : '1px solid var(--border)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          position: 'relative'
                        }}
                      >
                        {/* Checkbox */}
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          display: 'flex',
                          gap: '6px'
                        }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            border: `2px solid ${selecionado ? 'var(--accent)' : 'var(--border)'}`,
                            background: selecionado ? 'var(--accent)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {selecionado && '✓'}
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExcluirMaterialSalvo(material.id);
                            }}
                            title="Excluir"
                            style={{
                              width: '24px',
                              height: '24px',
                              background: '#dc3545',
                              border: 'none',
                              borderRadius: '4px',
                              color: '#fff',
                              fontSize: '12px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            🗑️
                          </button>
                        </div>

                        {/* Informações do material */}
                        <div style={{ paddingRight: '60px' }}>
                          <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                            {material.nome}
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>
                            {material.unidadeMedida} • R$ {material.valorUnitario.toFixed(2).replace('.', ',')}
                          </div>

                          {/* Input de quantidade (só aparece se selecionado) */}
                          {selecionado && (
                            <div style={{ marginTop: '8px' }} onClick={(e) => e.stopPropagation()}>
                              <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                                Quantidade:
                              </label>
                              <input
                                type="number"
                                value={quantidade}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  setQuantidadesSalvos({ ...quantidadesSalvos, [material.id]: parseFloat(e.target.value) || 1 });
                                }}
                                onClick={(e) => e.stopPropagation()}
                                min="0.01"
                                step="0.01"
                                style={{
                                  width: '100%',
                                  padding: '8px',
                                  background: 'var(--bg)',
                                  border: '1px solid var(--border)',
                                  borderRadius: '6px',
                                  color: 'var(--text)',
                                  fontSize: '13px'
                                }}
                              />
                              <div style={{
                                marginTop: '6px',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: 'var(--accent)'
                              }}>
                                Total: R$ {(material.valorUnitario * quantidade).toFixed(2).replace('.', ',')}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Painel de materiais selecionados */}
                {materiaisSalvosSelecionados.length > 0 && (
                  <div style={{
                    padding: '12px',
                    background: 'var(--bg3)',
                    borderRadius: '8px',
                    border: '2px solid var(--accent)'
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      {materiaisSalvosSelecionados.length} material(is) selecionado(s)
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--accent)' }}>
                      Total Geral: R$ {materiaisSalvosSelecionados.reduce((sum, m) => {
                        const qtd = quantidadesSalvos[m.id] || 1;
                        return sum + (m.valorUnitario * qtd);
                      }, 0).toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                )}

                {/* Botão adicionar múltiplos */}
                <button
                  onClick={handleAdicionarMateriaisSalvos}
                  disabled={materiaisSalvosSelecionados.length === 0}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: materiaisSalvosSelecionados.length > 0 ? 'var(--accent)' : 'var(--bg3)',
                    border: 'none',
                    borderRadius: '8px',
                    color: materiaisSalvosSelecionados.length > 0 ? '#fff' : 'var(--muted)',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: materiaisSalvosSelecionados.length > 0 ? 'pointer' : 'not-allowed',
                    opacity: materiaisSalvosSelecionados.length > 0 ? 1 : 0.5
                  }}
                >
                  ✅ Adicionar {materiaisSalvosSelecionados.length > 0 ? `${materiaisSalvosSelecionados.length} Material(is)` : 'Materiais'}
                </button>
              </>
            )}
          </div>
        )}

        {/* Botão Cancelar */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
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
          Cancelar
        </button>
      </div>
    </Modal>
  );
}

export default MaterialModal;
