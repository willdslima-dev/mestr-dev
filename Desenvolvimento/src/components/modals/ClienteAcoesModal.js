import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import PagamentoModal from './PagamentoModal';
import PedidosModal from './PedidosModal';
import SelecionarClienteModal from './SelecionarClienteModal';
import RelatorioModal from './RelatorioModal';
import './ClienteAcoesModal.css';

function ClienteAcoesModal({ isOpen, onClose, cliente, CLI, ORC, PAG, setCLI, setPAG, onNovoPedido }) {
  const [tela, setTela] = useState('principal'); // 'principal', 'lista-pagamentos', 'lista-pedidos'
  const [statusSelecionado, setStatusSelecionado] = useState(null);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState(null);
  const [mostrarPagamentoModal, setMostrarPagamentoModal] = useState(false);
  const [mostrarPedidosModal, setMostrarPedidosModal] = useState(false);
  const [mostrarRelatorioModal, setMostrarRelatorioModal] = useState(false);
  const [mostrarEditarCliente, setMostrarEditarCliente] = useState(false);
  const [secoesAbertas, setSecoesAbertas] = useState({
    pedidos: false,
    pagamentos: false,
    compromissos: false,
    atalhos: true
  });

  const toggleSecao = (secao) => {
    setSecoesAbertas(prev => ({
      ...prev,
      [secao]: !prev[secao]
    }));
  };

  const handleEditarCliente = () => {
    setMostrarEditarCliente(true);
  };

  // Lógica para telefone/whatsapp
  const getTelefoneExibicao = () => {
    if (cliente.whatsapp) return { valor: cliente.whatsapp, tipo: 'WhatsApp' };
    if (cliente.telefone) return { valor: cliente.telefone, tipo: 'Telefone' };
    return { valor: null, tipo: 'Telefone' };
  };

  // Buscar pedidos do cliente
  const pedidosCliente = useMemo(() => {
    if (!ORC || !cliente) return [];
    return Object.values(ORC).filter(p => p.clienteId === cliente.id);
  }, [ORC, cliente]);

  // Buscar pagamentos do cliente
  const pagamentosCliente = useMemo(() => {
    if (!PAG || !cliente) return [];
    return Object.values(PAG).filter(p => p.clienteId === cliente.id);
  }, [PAG, cliente]);

  // Calcular totais por status
  const totaisPorStatus = useMemo(() => {
    const totais = {
      recebido: 0,
      aReceber: 0,
      emAtraso: 0,
      pago: 0,
      previsto: 0
    };

    pagamentosCliente.forEach(pag => {
      const valor = parseFloat(pag.valor) || 0;
      const status = pag.status?.toLowerCase() || '';
      
      if (status === 'recebido') totais.recebido += valor;
      else if (status === 'a receber') totais.aReceber += valor;
      else if (status === 'em atraso') totais.emAtraso += valor;
      else if (status === 'pago') totais.pago += valor;
      else if (status === 'previsto') totais.previsto += valor;
    });

    return totais;
  }, [pagamentosCliente]);

  // Filtrar pagamentos por status
  const pagamentosFiltrados = useMemo(() => {
    if (!statusSelecionado) return [];
    return pagamentosCliente.filter(p => 
      p.status?.toLowerCase() === statusSelecionado.toLowerCase()
    );
  }, [pagamentosCliente, statusSelecionado]);

  const handleStatusClick = (status) => {
    setStatusSelecionado(status);
    setTela('lista-pagamentos');
  };

  const handlePagamentoClick = (pagamento) => {
    setPagamentoSelecionado(pagamento);
    setMostrarPagamentoModal(true);
  };

  const handleNovoPagamento = () => {
    setPagamentoSelecionado(null);
    setMostrarPagamentoModal(true);
  };

  const handleVerPedidos = () => {
    setMostrarPedidosModal(true);
  };

  const handleVerRelatorio = () => {
    setMostrarRelatorioModal(true);
  };

  const handleVoltar = () => {
    setTela('principal');
    setStatusSelecionado(null);
  };

  const handleFechar = () => {
    setTela('principal');
    setStatusSelecionado(null);
    setPagamentoSelecionado(null);
    onClose();
  };

  const getStatusConfig = (status) => {
    const configs = {
      'recebido': { cor: '#10b981', icone: '●', label: 'Recebido' },
      'a receber': { cor: '#10b981', icone: '●', label: 'A receber' },
      'em atraso': { cor: '#f59e0b', icone: '●', label: 'Em atraso' },
      'pago': { cor: '#8b5cf6', icone: '●', label: 'Pago' },
      'previsto': { cor: '#8b5cf6', icone: '●', label: 'Previsto' }
    };
    return configs[status] || { cor: '#6b7280', icone: '●', label: status };
  };

  const getBotaoLabel = () => {
    if (!statusSelecionado) return 'novo recibo';
    const labels = {
      'recebido': 'novo recibo',
      'a receber': 'novo a receber',
      'em atraso': 'novo em atraso',
      'pago': 'novo pago',
      'previsto': 'novo previsto'
    };
    return labels[statusSelecionado.toLowerCase()] || 'novo pagamento';
  };

  // Se não tem cliente, não renderiza nada
  if (!cliente) return null;

  // Tela Principal
  if (tela === 'principal') {
    const telefoneInfo = getTelefoneExibicao();
    
    return (
      <>
        <Modal isOpen={isOpen} onClose={handleFechar} comScroll={false}>
          <div className="cliente-acoes-modal">
            {/* Header customizado com nome e infos */}
            <div className="modal-header-customizado">
              {/* Botão X dentro do bloco */}
              <button className="btn-fechar-inline" onClick={handleFechar}>
                ×
              </button>
              
              <h2 className="cliente-nome">{cliente.nome}</h2>
              
              <div className="cliente-infos">
                {/* Endereço primeiro */}
                {(cliente.endereco?.logradouro || cliente.endereco?.cidade) && (
                  <div className="info-linha">
                    <span className="info-icone-mini">📍</span>
                    <span className="info-texto-mini">
                      {cliente.endereco?.logradouro && (
                        <>
                          {String(cliente.endereco.logradouro)}
                          {cliente.endereco?.numero && `, ${String(cliente.endereco.numero)}`}
                          {(cliente.endereco?.bairro || cliente.endereco?.cidade) && ' • '}
                        </>
                      )}
                      {cliente.endereco?.cidade && String(cliente.endereco.cidade)}
                      {cliente.endereco?.estado && `/${String(cliente.endereco.estado)}`}
                    </span>
                  </div>
                )}

                {/* Telefone/WhatsApp com botão depois */}
                {telefoneInfo.valor && (
                  <div className="info-linha">
                    <span className="info-icone-mini">📱</span>
                    <span className="info-texto-mini">{String(telefoneInfo.valor)}</span>
                    <button 
                      className="btn-whatsapp-mini"
                      onClick={() => window.open(`https://wa.me/55${telefoneInfo.valor.replace(/\D/g, '')}`, '_blank')}
                      title="Abrir no WhatsApp"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Área com scroll */}
            <div className="cliente-acoes-scroll">
              {/* Seção Pedidos - PRIMEIRO */}
              <div className="secao-expandivel">
                <div className="secao-header" onClick={handleVerPedidos}>
                  <span className="secao-icone">📋</span>
                  <h3 className="secao-titulo">Pedidos</h3>
                  <span className="status-seta">›</span>
                </div>
              </div>

              {/* Seção Pagamentos - MINIMIZADO */}
              <div className="secao-expandivel">
                <div className="secao-header" onClick={() => toggleSecao('pagamentos')}>
                  <span className="secao-icone">💰</span>
                  <h3 className="secao-titulo">Pagamentos</h3>
                  <span 
                    className="secao-toggle"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--bg3)',
                      transition: 'transform 0.2s',
                      transform: secoesAbertas.pagamentos ? 'rotate(90deg)' : 'rotate(0deg)'
                    }}
                  >
                    &gt;
                  </span>
                </div>
                
                {secoesAbertas.pagamentos && (
                  <div className="secao-conteudo">
                    <div className="lista-status">
                      <div 
                        className="item-status"
                        onClick={() => handleStatusClick('recebido')}
                      >
                        <span className="status-icone" style={{ color: '#10b981' }}>●</span>
                        <span className="status-label">Recebido</span>
                        <span className="status-seta">›</span>
                      </div>

                      <div 
                        className="item-status"
                        onClick={() => handleStatusClick('a receber')}
                      >
                        <span className="status-icone" style={{ color: '#10b981' }}>●</span>
                        <span className="status-label">A receber</span>
                        <span className="status-seta">›</span>
                      </div>

                      <div 
                        className="item-status"
                        onClick={() => handleStatusClick('em atraso')}
                      >
                        <span className="status-icone" style={{ color: '#f59e0b' }}>●</span>
                        <span className="status-label">Em atraso</span>
                        <span className="status-seta">›</span>
                      </div>

                      <div 
                        className="item-status"
                        onClick={() => handleStatusClick('pago')}
                      >
                        <span className="status-icone" style={{ color: '#8b5cf6' }}>●</span>
                        <span className="status-label">Pago</span>
                        <span className="status-seta">›</span>
                      </div>

                      <div 
                        className="item-status"
                        onClick={() => handleStatusClick('previsto')}
                      >
                        <span className="status-icone" style={{ color: '#8b5cf6' }}>●</span>
                        <span className="status-label">Previsto</span>
                        <span className="status-seta">›</span>
                      </div>

                      <div 
                        className="item-status"
                        onClick={() => handleStatusClick('em atraso')}
                      >
                        <span className="status-icone" style={{ color: '#ef4444' }}>●</span>
                        <span className="status-label">Em atraso</span>
                        <span className="status-seta">›</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Seção Compromissos - MINIMIZADO */}
              <div className="secao-expandivel">
                <div className="secao-header" onClick={() => toggleSecao('compromissos')}>
                  <span className="secao-icone">◆</span>
                  <h3 className="secao-titulo">Compromissos</h3>
                  <span 
                    className="secao-toggle"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--bg3)',
                      transition: 'transform 0.2s',
                      transform: secoesAbertas.compromissos ? 'rotate(90deg)' : 'rotate(0deg)'
                    }}
                  >
                    &gt;
                  </span>
                </div>
              </div>

              {/* Seção Atalhos - SEMPRE EXPANDIDO */}
              <div className="secao-expandivel">
                <div className="secao-header" onClick={() => toggleSecao('atalhos')}>
                  <span className="secao-icone">⚡</span>
                  <h3 className="secao-titulo">Atalhos</h3>
                  <span 
                    className="secao-toggle"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--bg3)',
                      transition: 'transform 0.2s',
                      transform: secoesAbertas.atalhos ? 'rotate(90deg)' : 'rotate(0deg)'
                    }}
                  >
                    &gt;
                  </span>
                </div>
                
                {secoesAbertas.atalhos && (
                  <div className="secao-conteudo">
                    <div className="atalhos-grid">
                      <button className="atalho-card" onClick={handleNovoPagamento}>
                        <span className="atalho-icone">💵</span>
                        <span className="atalho-label">Lançar recebimento</span>
                      </button>
                      
                      <button className="atalho-card">
                        <span className="atalho-icone">📊</span>
                        <span className="atalho-label">Novo custo</span>
                      </button>
                      
                      <button className="atalho-card" onClick={handleVerRelatorio}>
                        <span className="atalho-icone">📊</span>
                        <span className="atalho-label">Relatório do cliente</span>
                      </button>
                      <button className="atalho-card">
                        <span className="atalho-icone">📆</span>
                        <span className="atalho-label">Novo compromisso</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botão fixo rodapé */}
            <div className="cliente-acoes-rodape">
              <button className="btn-acao-principal" onClick={onNovoPedido}>
                <span>📋</span>
                novo pedido
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal de Relatório */}
        {mostrarRelatorioModal && (
          <RelatorioModal
            isOpen={mostrarRelatorioModal}
            onClose={() => setMostrarRelatorioModal(false)}
            cliente={cliente}
            ORC={ORC}
          />
        )}

        {/* Modal de Pagamento */}
        {mostrarPagamentoModal && (
          <PagamentoModal
            isOpen={mostrarPagamentoModal}
            onClose={() => {
              setMostrarPagamentoModal(false);
              setPagamentoSelecionado(null);
            }}
            pagamento={pagamentoSelecionado}
            clientePadrao={cliente}
            PAG={PAG}
            setPAG={setPAG}
          />
        )}

        {/* Modal de Pedidos */}
        {mostrarPedidosModal && (
          <PedidosModal
            isOpen={mostrarPedidosModal}
            onClose={() => setMostrarPedidosModal(false)}
            clienteFiltro={cliente}
            ORC={ORC}
          />
        )}

        {/* Modal de Editar Cliente */}
        {mostrarEditarCliente && (
          <SelecionarClienteModal
            key={cliente?.id || cliente?.nome || 'editar-cliente'}
            isOpen={mostrarEditarCliente}
            onClose={() => setMostrarEditarCliente(false)}
            CLI={CLI}
            setCLI={setCLI}
            onClienteSelecionado={() => {}} 
            ORC={ORC}
            clienteParaEditar={cliente}
            modoEdicaoDireta={true}
          />
        )}
      </>
    );
  }

  // Tela de Lista de Pagamentos
  if (tela === 'lista-pagamentos') {
    const config = getStatusConfig(statusSelecionado);
    
    return (
      <>
        <Modal 
          isOpen={isOpen} 
          onClose={handleFechar} 
          titulo={config.label}
          comScroll={false}
        >
          <div className="cliente-acoes-modal">
            {/* Header com info do cliente */}
            <div className="lista-pagamentos-header">
              <button className="btn-voltar" onClick={handleVoltar}>
                ‹
              </button>
              <div className="header-info">
                <div className="header-titulo">{config.label}</div>
                <div className="header-subtitulo">{cliente.nome}</div>
              </div>
            </div>

            {/* Lista com scroll */}
            <div className="cliente-acoes-scroll">
              {pagamentosFiltrados.length === 0 ? (
                <div className="lista-vazia">
                  <span style={{ fontSize: '48px', marginBottom: '16px' }}>📭</span>
                  <p>Nenhum pagamento {config.label.toLowerCase()}</p>
                </div>
              ) : (
                <div className="lista-pagamentos">
                  {pagamentosFiltrados.map(pag => (
                    <div 
                      key={pag.id} 
                      className="card-pagamento"
                      onClick={() => handlePagamentoClick(pag)}
                    >
                      <div className="pagamento-header">
                        <div className="pagamento-data">
                          Data do recebimento: {pag.dataRecebimento || '—'}
                        </div>
                      </div>
                      <div className="pagamento-valor">
                        <span className="label-valor">Valor:</span>
                        <span className="valor-numero">
                          R$ {parseFloat(pag.valor || 0).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <span className="pagamento-seta">›</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botão fixo */}
            <div className="cliente-acoes-rodape">
              <button className="btn-acao-principal" onClick={handleNovoPagamento}>
                <span>💵</span>
                {getBotaoLabel()}
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal de Pagamento */}
        {mostrarPagamentoModal && (
          <PagamentoModal
            isOpen={mostrarPagamentoModal}
            onClose={() => {
              setMostrarPagamentoModal(false);
              setPagamentoSelecionado(null);
            }}
            pagamento={pagamentoSelecionado}
            clientePadrao={cliente}
            statusPadrao={statusSelecionado}
            PAG={PAG}
            setPAG={setPAG}
          />
        )}
      </>
    );
  }

  return null;
}

export default ClienteAcoesModal;
