import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './SelecionarServicoModal.css';

function SelecionarServicoModal({ isOpen, onClose, onAdicionarServico }) {
  const [abaAtiva, setAbaAtiva] = useState('cadastrar'); // 'catalogo' ou 'cadastrar' - começa em cadastrar
  const [busca, setBusca] = useState('');
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  
  // Formulário de cadastrar serviço
  const [formCadastro, setFormCadastro] = useState({
    nome: '',
    detalhes: '',
    unidadeMedida: 'm²',
    precoUnitario: '',
    quantidade: '1'
  });
  
  const [salvarNoCatalogo, setSalvarNoCatalogo] = useState(false);

  // Catálogo de serviços - carrega do localStorage
  const [catalogoServicos, setCatalogoServicos] = useState([]);

  // Carrega catálogo do localStorage
  useEffect(() => {
    const catalogoSalvo = localStorage.getItem('CATALOGO_SERVICOS');
    if (catalogoSalvo) {
      setCatalogoServicos(JSON.parse(catalogoSalvo));
    } else {
      // Catálogo inicial padrão
      const catalogoPadrao = [
        { id: 1, nome: 'Cortineiro drywall ST', unidade: 'unidade', preco: 0 },
        { id: 2, nome: 'Fechamento drywall ST', unidade: 'm (linear)', preco: 0 },
        { id: 3, nome: 'Forro drywall ST', unidade: 'm²', preco: 0 },
        { id: 4, nome: 'Gesso 3D', unidade: 'm²', preco: 0 },
        { id: 5, nome: 'Instalações elétricas', unidade: 'unidade', preco: 0 },
        { id: 6, nome: 'Kit porta p/ parede drywall completo - Prime', unidade: 'unidade', preco: 0, detalhes: '(Batente, folha, fechadura, dobradiças e guarnição)' },
        { id: 7, nome: 'Molduras de gesso', unidade: 'm (linear)', preco: 0 }
      ];
      setCatalogoServicos(catalogoPadrao);
      localStorage.setItem('CATALOGO_SERVICOS', JSON.stringify(catalogoPadrao));
    }
  }, []);

  const servicosFiltrados = catalogoServicos.filter(s => 
    s.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const toggleSelecao = (servicoId) => {
    if (servicosSelecionados.includes(servicoId)) {
      setServicosSelecionados(servicosSelecionados.filter(id => id !== servicoId));
    } else {
      setServicosSelecionados([...servicosSelecionados, servicoId]);
    }
  };

  const handleAdicionarDoCatalogo = () => {
    const servicos = catalogoServicos.filter(s => servicosSelecionados.includes(s.id));
    servicos.forEach(servico => {
      onAdicionarServico({
        id: `srv_${Date.now()}_${Math.random()}`,
        descricao: servico.nome + (servico.detalhes ? ` ${servico.detalhes}` : ''),
        valorUnitario: servico.preco,
        quantidade: 1,
        unidade: servico.unidade,
        total: servico.preco
      });
    });
    setServicosSelecionados([]);
    onClose();
  };

  const handleCadastrarServico = () => {
    if (!formCadastro.nome.trim()) {
      alert('Preencha o nome do serviço');
      return;
    }
    if (!formCadastro.precoUnitario || parseFloat(formCadastro.precoUnitario) < 0) {
      alert('Informe um preço unitário válido');
      return;
    }
    if (!formCadastro.quantidade || parseFloat(formCadastro.quantidade) <= 0) {
      alert('Informe uma quantidade válida');
      return;
    }

    const servico = {
      id: `srv_${Date.now()}`,
      descricao: formCadastro.nome + (formCadastro.detalhes ? ` - ${formCadastro.detalhes}` : ''),
      valorUnitario: parseFloat(formCadastro.precoUnitario),
      quantidade: parseFloat(formCadastro.quantidade),
      unidade: formCadastro.unidadeMedida,
      total: parseFloat(formCadastro.precoUnitario) * parseFloat(formCadastro.quantidade)
    };

    // Se salvarNoCatalogo === true, salvar no catálogo (localStorage)
    if (salvarNoCatalogo) {
      const novoItemCatalogo = {
        id: Date.now(), // ID único baseado em timestamp
        nome: formCadastro.nome.trim(),
        unidade: formCadastro.unidadeMedida,
        preco: parseFloat(formCadastro.precoUnitario),
        detalhes: formCadastro.detalhes.trim() || undefined
      };
      
      const novoCatalogo = [...catalogoServicos, novoItemCatalogo];
      setCatalogoServicos(novoCatalogo);
      localStorage.setItem('CATALOGO_SERVICOS', JSON.stringify(novoCatalogo));
    }
    
    onAdicionarServico(servico);
    
    // Limpar form
    setFormCadastro({
      nome: '',
      detalhes: '',
      unidadeMedida: 'm²',
      precoUnitario: '',
      quantidade: '1'
    });
    setSalvarNoCatalogo(false);
    
    onClose();
  };

  const calcularValorTotal = () => {
    const preco = parseFloat(formCadastro.precoUnitario) || 0;
    const qtd = parseFloat(formCadastro.quantidade) || 0;
    return preco * qtd;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar serviço ao pedido">
      <div className="selecionar-servico-modal">
        {/* Abas */}
        <div className="abas-servico">
          <button
            className={`aba-btn ${abaAtiva === 'catalogo' ? 'ativa' : ''}`}
            onClick={() => setAbaAtiva('catalogo')}
          >
            <i className="fas fa-list"></i> Catálogo
          </button>
          <button
            className={`aba-btn ${abaAtiva === 'cadastrar' ? 'ativa' : ''}`}
            onClick={() => setAbaAtiva('cadastrar')}
          >
            <i className="fas fa-plus-circle"></i> Cadastrar serviço
          </button>
        </div>

        {/* Aba Catálogo */}
        {abaAtiva === 'catalogo' && (
          <div className="aba-catalogo">
            {/* Busca */}
            <div className="busca-catalogo">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Buscar"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            {/* Lista de serviços */}
            <div className="lista-servicos-catalogo">
              {servicosFiltrados.map(servico => (
                <div
                  key={servico.id}
                  className="item-servico-catalogo"
                  style={{ position: 'relative' }}
                >
                  {/* Botões de ação */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '50px',
                    display: 'flex',
                    gap: '6px',
                    zIndex: 10
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implementar edição
                        alert('⚠️ Funcionalidade de edição será implementada em breve!');
                      }}
                      style={{
                        background: 'var(--accent)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: 'white'
                      }}
                      title="Editar serviço do catálogo"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Excluir "${servico.nome}" do catálogo?`)) {
                          const novoCatalogo = catalogoServicos.filter(s => s.id !== servico.id);
                          setCatalogoServicos(novoCatalogo);
                          localStorage.setItem('CATALOGO_SERVICOS', JSON.stringify(novoCatalogo));
                        }
                      }}
                      style={{
                        background: '#f06070',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: 'white'
                      }}
                      title="Excluir serviço do catálogo"
                    >
                      🗑️
                    </button>
                  </div>

                  <div 
                    className="info-servico"
                    onClick={() => toggleSelecao(servico.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="nome-servico">{servico.nome}</div>
                    {servico.detalhes && (
                      <div className="detalhes-servico">{servico.detalhes}</div>
                    )}
                    <div className="preco-servico">
                      Preço por {servico.unidade}: <strong>R$ {servico.preco.toFixed(2)}</strong>
                    </div>
                  </div>
                  <div 
                    className="checkbox-wrapper"
                    onClick={() => toggleSelecao(servico.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <input
                      type="checkbox"
                      checked={servicosSelecionados.includes(servico.id)}
                      onChange={() => {}}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Botão adicionar do catálogo */}
            {servicosSelecionados.length > 0 && (
              <button className="btn-adicionar-catalogo" onClick={handleAdicionarDoCatalogo}>
                Adicionar {servicosSelecionados.length} serviço(s) ao pedido
              </button>
            )}
          </div>
        )}

        {/* Aba Cadastrar */}
        {abaAtiva === 'cadastrar' && (
          <div className="aba-cadastrar">
            <div className="form-group">
              <label>Qual é o serviço?</label>
              <input
                type="text"
                value={formCadastro.nome}
                onChange={(e) => setFormCadastro({ ...formCadastro, nome: e.target.value })}
                placeholder="Ex: Pintura de parede, Instalação de piso..."
              />
            </div>

            <div className="form-group">
              <label>Detalhes (opcional)</label>
              <textarea
                value={formCadastro.detalhes}
                onChange={(e) => setFormCadastro({ ...formCadastro, detalhes: e.target.value })}
                placeholder="Informações adicionais..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Unidade de medida</label>
              <select
                value={formCadastro.unidadeMedida}
                onChange={(e) => setFormCadastro({ ...formCadastro, unidadeMedida: e.target.value })}
              >
                <option value="m²">m² (metro quadrado)</option>
                <option value="m">m (metro linear)</option>
                <option value="un">un (unidade)</option>
                <option value="h">h (hora)</option>
                <option value="dia">dia</option>
                <option value="kg">kg (quilograma)</option>
                <option value="L">L (litro)</option>
                <option value="cx">cx (caixa)</option>
                <option value="pct">pct (pacote)</option>
              </select>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Preço unitário</label>
                <div className="input-com-botoes">
                  <button
                    className="btn-menos"
                    onClick={() => {
                      const atual = parseFloat(formCadastro.precoUnitario) || 0;
                      if (atual > 0) {
                        setFormCadastro({ ...formCadastro, precoUnitario: (atual - 1).toString() });
                      }
                    }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formCadastro.precoUnitario}
                    onChange={(e) => setFormCadastro({ ...formCadastro, precoUnitario: e.target.value })}
                    placeholder="0,00"
                  />
                  <button
                    className="btn-mais"
                    onClick={() => {
                      const atual = parseFloat(formCadastro.precoUnitario) || 0;
                      setFormCadastro({ ...formCadastro, precoUnitario: (atual + 1).toString() });
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Quantidade</label>
                <div className="input-com-botoes">
                  <button
                    className="btn-menos"
                    onClick={() => {
                      const atual = parseFloat(formCadastro.quantidade) || 1;
                      if (atual > 1) {
                        setFormCadastro({ ...formCadastro, quantidade: (atual - 1).toString() });
                      }
                    }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={formCadastro.quantidade}
                    onChange={(e) => setFormCadastro({ ...formCadastro, quantidade: e.target.value })}
                    placeholder="1"
                  />
                  <button
                    className="btn-mais"
                    onClick={() => {
                      const atual = parseFloat(formCadastro.quantidade) || 0;
                      setFormCadastro({ ...formCadastro, quantidade: (atual + 1).toString() });
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Valor total */}
            <div className="valor-total-cadastro">
              <span>Valor</span>
              <strong>R$ {calcularValorTotal().toFixed(2).replace('.', ',')}</strong>
            </div>

            {/* Checkbox salvar no catálogo */}
            <div className="salvar-catalogo-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={salvarNoCatalogo}
                  onChange={(e) => setSalvarNoCatalogo(e.target.checked)}
                />
                <span>Salvar serviço no meu catálogo</span>
              </label>
            </div>

            {/* Botão adicionar */}
            <button className="btn-adicionar-servico" onClick={handleCadastrarServico}>
              adicionar esse serviço
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default SelecionarServicoModal;
