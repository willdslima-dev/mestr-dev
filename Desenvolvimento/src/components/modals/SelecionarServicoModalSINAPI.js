import React, { useState } from 'react';
import Modal from './Modal';
import { servicosSINAPI, categoriasSINAPI, buscarServicos, buscarServicosPorCategoria } from '../../utils/sinapi';
import { uid } from '../../utils/helpers';
import './SelecionarServicoModal.css';

function SelecionarServicoModalSINAPI({ isOpen, onClose, onAdicionarServico }) {
  const [abaAtiva, setAbaAtiva] = useState('sinapi'); // 'sinapi', 'custom' ou 'salvos'
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [servicosSelecionados, setServicosSelecionados] = useState([]); // Array de serviços
  const [quantidades, setQuantidades] = useState({}); // { codigoServico: quantidade }
  const [valoresPersonalizados, setValoresPersonalizados] = useState({}); // { codigoServico: valor }
  const [usarValoresPersonalizados, setUsarValoresPersonalizados] = useState({}); // { codigoServico: boolean }
  
  // Buscar serviços salvos do localStorage
  const [servicosSalvos, setServicosSalvos] = useState(() => {
    const salvos = localStorage.getItem('oc_servicos_personalizados');
    return salvos ? JSON.parse(salvos) : [];
  });
  
  // Quantidades para serviços salvos
  const [quantidadesSalvos, setQuantidadesSalvos] = useState({});
  
  // Seleção múltipla de serviços salvos
  const [servicosSalvosSelecionados, setServicosSalvosSelecionados] = useState([]);

  // Formulário de serviço personalizado
  const [formCustom, setFormCustom] = useState({
    nome: '',
    descricao: '',
    unidadeMedida: 'm²',
    valorUnitario: '',
    quantidade: '1'
  });

  // Buscar serviços SINAPI
  const servicosSINAPIFiltrados = busca.trim() !== ''
    ? buscarServicos(busca)
    : buscarServicosPorCategoria(categoriaFiltro);

  const handleToggleServico = (servico) => {
    const jaSelecionado = servicosSelecionados.find(s => s.codigo === servico.codigo);
    
    if (jaSelecionado) {
      // Remove da seleção
      setServicosSelecionados(servicosSelecionados.filter(s => s.codigo !== servico.codigo));
      const novasQuantidades = { ...quantidades };
      const novosValores = { ...valoresPersonalizados };
      const novosUsarValores = { ...usarValoresPersonalizados };
      delete novasQuantidades[servico.codigo];
      delete novosValores[servico.codigo];
      delete novosUsarValores[servico.codigo];
      setQuantidades(novasQuantidades);
      setValoresPersonalizados(novosValores);
      setUsarValoresPersonalizados(novosUsarValores);
    } else {
      // Adiciona à seleção
      setServicosSelecionados([...servicosSelecionados, servico]);
      setQuantidades({ ...quantidades, [servico.codigo]: 1 });
      setValoresPersonalizados({ ...valoresPersonalizados, [servico.codigo]: servico.custoUnitario.toFixed(2) });
      setUsarValoresPersonalizados({ ...usarValoresPersonalizados, [servico.codigo]: false });
    }
  };

  const atualizarQuantidade = (codigo, valor) => {
    setQuantidades({ ...quantidades, [codigo]: parseFloat(valor) || 1 });
  };

  const atualizarValorPersonalizado = (codigo, valor) => {
    setValoresPersonalizados({ ...valoresPersonalizados, [codigo]: valor });
  };

  const toggleUsarValorPersonalizado = (codigo) => {
    setUsarValoresPersonalizados({ 
      ...usarValoresPersonalizados, 
      [codigo]: !usarValoresPersonalizados[codigo] 
    });
  };

  const handleAdicionarSINAPI = () => {
    if (servicosSelecionados.length === 0) return;

    // Adiciona cada serviço selecionado
    servicosSelecionados.forEach(servico => {
      const qtd = quantidades[servico.codigo] || 1;
      const usarPersonalizado = usarValoresPersonalizados[servico.codigo];
      const valorPersonalizado = valoresPersonalizados[servico.codigo];
      
      const valorFinal = usarPersonalizado 
        ? parseFloat(valorPersonalizado) 
        : servico.custoUnitario;

      const servicoParaAdicionar = {
        id: uid(),
        nome: servico.descricao,
        descricao: `${servico.codigo} - ${servico.categoria}`,
        unidadeMedida: servico.unidade,
        valorUnitario: valorFinal,
        quantidade: qtd,
        origem: 'SINAPI',
        codigoSINAPI: servico.codigo,
        insumos: servico.insumos // Passa os insumos para gerar materiais depois
      };

      onAdicionarServico(servicoParaAdicionar);
    });
    
    // Limpar tudo
    setServicosSelecionados([]);
    setQuantidades({});
    setValoresPersonalizados({});
    setUsarValoresPersonalizados({});
    onClose();
  };

  const handleAdicionarCustom = () => {
    if (!formCustom.nome.trim()) {
      alert('Preencha o nome do serviço');
      return;
    }
    if (!formCustom.valorUnitario || parseFloat(formCustom.valorUnitario) < 0) {
      alert('Informe um valor unitário válido');
      return;
    }
    if (!formCustom.quantidade || parseFloat(formCustom.quantidade) <= 0) {
      alert('Informe uma quantidade válida');
      return;
    }

    const servicoParaAdicionar = {
      id: uid(),
      nome: formCustom.nome,
      descricao: formCustom.descricao || '',
      unidadeMedida: formCustom.unidadeMedida,
      valorUnitario: parseFloat(formCustom.valorUnitario),
      quantidade: parseFloat(formCustom.quantidade),
      origem: 'PERSONALIZADO'
    };

    // Salvar no localStorage para reutilização
    const servicoParaSalvar = {
      id: uid(),
      nome: formCustom.nome,
      descricao: formCustom.descricao || '',
      unidadeMedida: formCustom.unidadeMedida,
      valorUnitario: parseFloat(formCustom.valorUnitario),
      criadoEm: new Date().toISOString()
    };
    
    const novosServicos = [...servicosSalvos, servicoParaSalvar];
    localStorage.setItem('oc_servicos_personalizados', JSON.stringify(novosServicos));
    setServicosSalvos(novosServicos);

    onAdicionarServico(servicoParaAdicionar);
    
    // Limpar formulário
    setFormCustom({
      nome: '',
      descricao: '',
      unidadeMedida: 'm²',
      valorUnitario: '',
      quantidade: '1'
    });
    onClose();
  };

  const handleToggleServicoSalvo = (servicoSalvo) => {
    const jaSelecionado = servicosSalvosSelecionados.find(s => s.id === servicoSalvo.id);
    
    if (jaSelecionado) {
      // Remove da seleção
      setServicosSalvosSelecionados(servicosSalvosSelecionados.filter(s => s.id !== servicoSalvo.id));
      const novasQuantidades = { ...quantidadesSalvos };
      delete novasQuantidades[servicoSalvo.id];
      setQuantidadesSalvos(novasQuantidades);
    } else {
      // Adiciona à seleção
      setServicosSalvosSelecionados([...servicosSalvosSelecionados, servicoSalvo]);
      setQuantidadesSalvos({ ...quantidadesSalvos, [servicoSalvo.id]: 1 });
    }
  };

  const handleAdicionarServicosSalvos = () => {
    if (servicosSalvosSelecionados.length === 0) return;

    servicosSalvosSelecionados.forEach(servicoSalvo => {
      const quantidade = quantidadesSalvos[servicoSalvo.id] || 1;
      const servicoParaAdicionar = {
        id: uid(),
        nome: servicoSalvo.nome,
        descricao: servicoSalvo.descricao || '',
        unidadeMedida: servicoSalvo.unidadeMedida,
        valorUnitario: servicoSalvo.valorUnitario,
        quantidade: quantidade,
        origem: 'PERSONALIZADO'
      };

      onAdicionarServico(servicoParaAdicionar);
    });

    // Limpar seleção
    setServicosSalvosSelecionados([]);
    setQuantidadesSalvos({});
    onClose();
  };

  const handleUsarServicoSalvo = (servicoSalvo, quantidade = 1) => {
    const servicoParaAdicionar = {
      id: uid(),
      nome: servicoSalvo.nome,
      descricao: servicoSalvo.descricao || '',
      unidadeMedida: servicoSalvo.unidadeMedida,
      valorUnitario: servicoSalvo.valorUnitario,
      quantidade: quantidade,
      origem: 'PERSONALIZADO'
    };

    onAdicionarServico(servicoParaAdicionar);
    onClose();
  };

  const handleExcluirServicoSalvo = (id) => {
    if (window.confirm('Excluir este serviço salvo?')) {
      const novosServicos = servicosSalvos.filter(s => s.id !== id);
      localStorage.setItem('oc_servicos_personalizados', JSON.stringify(novosServicos));
      setServicosSalvos(novosServicos);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="📋 Adicionar Serviço">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Abas */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border)' }}>
          <button
            onClick={() => setAbaAtiva('sinapi')}
            style={{
              flex: 1,
              padding: '12px',
              background: abaAtiva === 'sinapi' ? 'var(--accent)' : 'transparent',
              border: 'none',
              borderBottom: abaAtiva === 'sinapi' ? '2px solid var(--accent)' : 'none',
              color: abaAtiva === 'sinapi' ? '#fff' : 'var(--text)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              borderRadius: '8px 8px 0 0',
              marginBottom: '-2px'
            }}
          >
            📊 Tabela SINAPI
          </button>
          
          <button
            onClick={() => setAbaAtiva('custom')}
            style={{
              flex: 1,
              padding: '12px',
              background: abaAtiva === 'custom' ? 'var(--accent)' : 'transparent',
              border: 'none',
              borderBottom: abaAtiva === 'custom' ? '2px solid var(--accent)' : 'none',
              color: abaAtiva === 'custom' ? '#fff' : 'var(--text)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              borderRadius: '8px 8px 0 0',
              marginBottom: '-2px'
            }}
          >
            ✏️ Personalizado
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
            💾 Salvos ({servicosSalvos.length})
          </button>
        </div>

        {/* ABA SINAPI */}
        {abaAtiva === 'sinapi' && (
          <>
            {/* Filtros */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="🔍 Buscar por código ou descrição..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                style={{
                  flex: '1 1 300px',
                  padding: '10px 12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '14px'
                }}
              />
              
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                style={{
                  padding: '10px 12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {categoriasSINAPI.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Lista de Serviços */}
            <div style={{ 
              maxHeight: '300px', 
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {servicosSINAPIFiltrados.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px 0' }}>
                  Nenhum serviço encontrado
                </p>
              )}
              
              {servicosSINAPIFiltrados.map(servico => {
                const selecionado = servicosSelecionados.find(s => s.codigo === servico.codigo);
                
                return (
                  <div
                    key={servico.codigo}
                    onClick={() => handleToggleServico(servico)}
                    style={{
                      padding: '12px',
                      background: selecionado ? 'var(--accent)20' : 'var(--bg3)',
                      border: selecionado ? '2px solid var(--accent)' : '1px solid var(--border)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!selecionado) {
                        e.currentTarget.style.borderColor = 'var(--accent)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selecionado) {
                        e.currentTarget.style.borderColor = 'var(--border)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'start', marginBottom: '8px' }}>
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={!!selecionado}
                        onChange={() => {}} // Controle pelo onClick do div
                        style={{
                          width: '18px',
                          height: '18px',
                          marginTop: '2px',
                          cursor: 'pointer'
                        }}
                      />
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '12px', 
                          color: 'var(--accent)', 
                          fontWeight: '600',
                          marginBottom: '4px'
                        }}>
                          {servico.codigo} • {servico.categoria}
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text)', lineHeight: '1.4' }}>
                          {servico.descricao}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '30px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                        Unidade: {servico.unidade}
                      </span>
                      <span style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: '600' }}>
                        R$ {servico.custoUnitario.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    
                    {servico.insumos && servico.insumos.length > 0 && (
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px', marginLeft: '30px' }}>
                        💼 {servico.insumos.length} insumos • 📦 Materiais serão adicionados automaticamente
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Painel de Serviços Selecionados */}
            {servicosSelecionados.length > 0 && (
              <div style={{
                padding: '16px',
                background: 'var(--bg2)',
                border: '2px solid var(--accent)',
                borderRadius: '8px',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '12px' }}>
                  ✅ Serviços Selecionados ({servicosSelecionados.length})
                </h4>
                
                {servicosSelecionados.map(servico => (
                  <div 
                    key={servico.codigo}
                    style={{
                      padding: '12px',
                      background: 'var(--bg3)',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '600', marginBottom: '6px' }}>
                      {servico.codigo}
                    </div>
                    
                    <div style={{ fontSize: '13px', color: 'var(--text)', marginBottom: '8px' }}>
                      {servico.descricao.substring(0, 80)}...
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                          Quantidade ({servico.unidade})
                        </label>
                        <input
                          type="number"
                          value={quantidades[servico.codigo] || 1}
                          onChange={(e) => atualizarQuantidade(servico.codigo, e.target.value)}
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
                      </div>
                      
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                          Valor Unit. (R$)
                        </label>
                        <input
                          type="number"
                          value={usarValoresPersonalizados[servico.codigo] 
                            ? valoresPersonalizados[servico.codigo] 
                            : servico.custoUnitario.toFixed(2)}
                          onChange={(e) => {
                            atualizarValorPersonalizado(servico.codigo, e.target.value);
                            if (!usarValoresPersonalizados[servico.codigo]) {
                              toggleUsarValorPersonalizado(servico.codigo);
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          min="0"
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
                      </div>
                    </div>
                    
                    <div style={{
                      marginTop: '8px',
                      padding: '8px',
                      background: 'var(--bg2)',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Total:</span>
                      <span style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: '600' }}>
                        R$ {(
                          (usarValoresPersonalizados[servico.codigo] 
                            ? parseFloat(valoresPersonalizados[servico.codigo]) 
                            : servico.custoUnitario) * (quantidades[servico.codigo] || 1)
                        ).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Total Geral */}
                <div style={{
                  padding: '12px',
                  background: 'var(--bg3)',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '2px solid var(--accent)'
                }}>
                  <span style={{ fontSize: '16px', color: 'var(--text)', fontWeight: '600' }}>
                    Total Geral:
                  </span>
                  <span style={{ fontSize: '18px', color: 'var(--accent)', fontWeight: '700' }}>
                    R$ {servicosSelecionados.reduce((total, servico) => {
                      const qtd = quantidades[servico.codigo] || 1;
                      const valor = usarValoresPersonalizados[servico.codigo]
                        ? parseFloat(valoresPersonalizados[servico.codigo])
                        : servico.custoUnitario;
                      return total + (valor * qtd);
                    }, 0).toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <button
                  onClick={handleAdicionarSINAPI}
                  style={{
                    width: '100%',
                    marginTop: '12px',
                    padding: '12px',
                    background: 'var(--accent)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ✅ Adicionar {servicosSelecionados.length} Serviço{servicosSelecionados.length > 1 ? 's' : ''}
                </button>
              </div>
            )}
          </>
        )}

        {/* ABA PERSONALIZADO */}
        {abaAtiva === 'custom' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                Nome do Serviço *
              </label>
              <input
                type="text"
                value={formCustom.nome}
                onChange={(e) => setFormCustom({ ...formCustom, nome: e.target.value })}
                placeholder="Ex: Instalação elétrica"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                Descrição (opcional)
              </label>
              <textarea
                value={formCustom.descricao}
                onChange={(e) => setFormCustom({ ...formCustom, descricao: e.target.value })}
                placeholder="Detalhes adicionais..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                  Unidade de Medida
                </label>
                <select
                  value={formCustom.unidadeMedida}
                  onChange={(e) => setFormCustom({ ...formCustom, unidadeMedida: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="m²">m² (metro quadrado)</option>
                  <option value="m">m (metro linear)</option>
                  <option value="m³">m³ (metro cúbico)</option>
                  <option value="UN">UN (unidade)</option>
                  <option value="h">h (hora)</option>
                  <option value="KG">KG (quilograma)</option>
                  <option value="L">L (litro)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                  Quantidade *
                </label>
                <input
                  type="number"
                  value={formCustom.quantidade}
                  onChange={(e) => setFormCustom({ ...formCustom, quantidade: e.target.value })}
                  min="0.01"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                Valor Unitário (R$) *
              </label>
              <input
                type="number"
                value={formCustom.valorUnitario}
                onChange={(e) => setFormCustom({ ...formCustom, valorUnitario: e.target.value })}
                min="0"
                step="0.01"
                placeholder="0,00"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '14px'
                }}
              />
            </div>

            {formCustom.valorUnitario && formCustom.quantidade && (
              <div style={{
                padding: '12px',
                background: 'var(--bg3)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '500' }}>
                  Total:
                </span>
                <span style={{ fontSize: '18px', color: 'var(--accent)', fontWeight: '700' }}>
                  R$ {(parseFloat(formCustom.valorUnitario) * parseFloat(formCustom.quantidade)).toFixed(2).replace('.', ',')}
                </span>
              </div>
            )}

            <button
              onClick={handleAdicionarCustom}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--accent)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              ✅ Adicionar Serviço Personalizado
            </button>
          </div>
        )}

        {/* ABA SALVOS */}
        {abaAtiva === 'salvos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {servicosSalvos.length === 0 ? (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: 'var(--muted)',
                fontSize: '14px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>💾</div>
                <p>Nenhum serviço personalizado salvo ainda.</p>
                <p style={{ fontSize: '12px', marginTop: '8px' }}>
                  Crie serviços na aba "✏️ Personalizado" e eles ficarão salvos aqui para reutilização!
                </p>
              </div>
            ) : (
              <>
                {/* Lista de serviços salvos */}
                <div style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {servicosSalvos.map(servico => {
                    const quantidade = quantidadesSalvos[servico.id] || 1;
                    const selecionado = servicosSalvosSelecionados.find(s => s.id === servico.id);
                    
                    return (
                      <div
                        key={servico.id}
                        onClick={() => handleToggleServicoSalvo(servico)}
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
                              handleExcluirServicoSalvo(servico.id);
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

                        {/* Informações do serviço */}
                        <div style={{ paddingRight: '60px' }}>
                          <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                            {servico.nome}
                          </div>
                          {servico.descricao && (
                            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>
                              {servico.descricao}
                            </div>
                          )}
                          <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>
                            {servico.unidadeMedida} • R$ {servico.valorUnitario.toFixed(2).replace('.', ',')}
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
                                  setQuantidadesSalvos({ ...quantidadesSalvos, [servico.id]: parseFloat(e.target.value) || 1 });
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
                                Total: R$ {(servico.valorUnitario * quantidade).toFixed(2).replace('.', ',')}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Painel de serviços selecionados */}
                {servicosSalvosSelecionados.length > 0 && (
                  <div style={{
                    padding: '12px',
                    background: 'var(--bg3)',
                    borderRadius: '8px',
                    border: '2px solid var(--accent)'
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      {servicosSalvosSelecionados.length} serviço(s) selecionado(s)
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--accent)' }}>
                      Total Geral: R$ {servicosSalvosSelecionados.reduce((sum, s) => {
                        const qtd = quantidadesSalvos[s.id] || 1;
                        return sum + (s.valorUnitario * qtd);
                      }, 0).toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                )}

                {/* Botão adicionar múltiplos */}
                <button
                  onClick={handleAdicionarServicosSalvos}
                  disabled={servicosSalvosSelecionados.length === 0}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: servicosSalvosSelecionados.length > 0 ? 'var(--accent)' : 'var(--bg3)',
                    border: 'none',
                    borderRadius: '8px',
                    color: servicosSalvosSelecionados.length > 0 ? '#fff' : 'var(--muted)',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: servicosSalvosSelecionados.length > 0 ? 'pointer' : 'not-allowed',
                    opacity: servicosSalvosSelecionados.length > 0 ? 1 : 0.5
                  }}
                >
                  ✅ Adicionar {servicosSalvosSelecionados.length > 0 ? `${servicosSalvosSelecionados.length} Serviço(s)` : 'Serviços'}
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

export default SelecionarServicoModalSINAPI;
