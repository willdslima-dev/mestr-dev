import React, { useState } from 'react';
import ListModal from './templates/ListModal';
import PedidoModal from './PedidoModal';
import Notificacao from '../Notificacao';
import './PedidosModal.css';
import { useDB } from '../../hooks/useDB';

function PedidosModal({ isOpen, onClose, clienteFiltro = null, ORC: ORCProp, setORC: setORCProp }) {
  const { ORC: ORCLocal, CLI, AGENDA, setORC: setORCLocal, setCLI } = useDB();
  
  // Usa o ORC passado por prop se existir, senão usa o local
  const ORC = ORCProp || ORCLocal;
  const setORC = setORCProp || setORCLocal;
  
  const [abaAtiva, setAbaAtiva] = useState('Todos os pedidos');
  const [busca, setBusca] = useState('');
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [modalPedidoAberto, setModalPedidoAberto] = useState(false);
  const [statusFiltrado, setStatusFiltrado] = useState(null);
  const [criandoNovoPedido, setCriandoNovoPedido] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  // Converte ORC em array e filtra por cliente se necessário
  const pedidos = ORC ? Object.values(ORC).filter(p => {
    if (clienteFiltro) {
      return p.clienteId === clienteFiltro.id;
    }
    return true;
  }) : [];

  // Agrupa pedidos por status
  const pedidosPorStatus = {
    pendente: pedidos.filter(p => p.status === 'pendente' || !p.status),
    aguardando: pedidos.filter(p => p.status === 'aguardando'),
    aprovado: pedidos.filter(p => p.status === 'aprovado'),
    em_andamento: pedidos.filter(p => p.status === 'em_andamento'),
    aguardando_pagamento: pedidos.filter(p => p.status === 'aguardando_pagamento'),
    concluido: pedidos.filter(p => p.status === 'concluido'),
    garantia: pedidos.filter(p => p.status === 'garantia'),
    cancelado: pedidos.filter(p => p.status === 'cancelado')
  };

  // Configuração dos status
  const statusConfig = {
    pendente: { label: 'Pendente', cor: '#f5a623', icon: '⏳' },
    aguardando: { label: 'Aguardando aprovação', cor: '#f5a623', icon: '⏳' },
    aprovado: { label: 'Aprovado', cor: '#4a90e2', icon: '✓' },
    em_andamento: { label: 'Em andamento', cor: '#4a90e2', icon: '🔨' },
    aguardando_pagamento: { label: 'Aguardando pagamento', cor: '#4a90e2', icon: '💰' },
    concluido: { label: 'Concluído', cor: '#10b981', icon: '✓' },
    garantia: { label: 'Garantia', cor: '#10b981', icon: '🛡️' },
    cancelado: { label: 'Cancelado', cor: '#f06070', icon: '✕' }
  };

  // Filtra pedidos pela busca
  const pedidosFiltrados = pedidos.filter(p => {
    if (statusFiltrado && p.status !== statusFiltrado) {
      return false;
    }
    
    if (busca) {
      return p.clienteNome?.toLowerCase().includes(busca.toLowerCase()) ||
             p.numero?.toLowerCase().includes(busca.toLowerCase()) ||
             p.referencia?.toLowerCase().includes(busca.toLowerCase());
    }
    
    return true;
  });

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
  };

  const calcularTotalPedido = (pedido) => {
    const totalServicos = (pedido.servicos || []).reduce((acc, s) => acc + (s.valorUnitario * s.quantidade), 0);
    const totalMateriais = (pedido.materiais || []).reduce((acc, m) => acc + (m.valorUnitario * m.quantidade), 0);
    const desconto = pedido.desconto || 0;
    const taxaEntrega = pedido.taxaEntrega || 0;
    const outrasTaxas = pedido.outrasTaxas || 0;
    return totalServicos + totalMateriais - desconto + taxaEntrega + outrasTaxas;
  };

  const handleAbrirPedido = (pedido) => {
    let cliente = CLI ? CLI[pedido.clienteId] : null;
    
    if (!cliente && pedido.clienteNome) {
      cliente = {
        id: pedido.clienteId,
        nome: pedido.clienteNome,
        telefone: pedido.clienteTelefone || '',
        whatsapp: pedido.clienteTelefone || ''
      };
    }
    
    if (cliente) {
      setPedidoSelecionado({ pedido, cliente });
      setModalPedidoAberto(true);
    } else {
      setMensagem({
        tipo: 'erro',
        texto: 'Não foi possível abrir o pedido. Dados do cliente não encontrados.'
      });
    }
  };

  const handleNovoPedido = () => {
    if (clienteFiltro) {
      setCriandoNovoPedido(true);
      setPedidoSelecionado({ pedido: null, cliente: clienteFiltro });
      setModalPedidoAberto(true);
    } else {
      // Abre modal de pedido SEM cliente pré-selecionado
      setCriandoNovoPedido(true);
      setPedidoSelecionado({ pedido: null, cliente: null });
      setModalPedidoAberto(true);
    }
  };

  const handleClickStatus = (statusKey) => {
    const qtd = pedidosPorStatus[statusKey]?.length || 0;
    if (qtd > 0) {
      setStatusFiltrado(statusKey);
      setAbaAtiva('Todos os pedidos');
      setBusca('');
    }
  };

  const limparFiltro = () => {
    setStatusFiltrado(null);
    setBusca('');
  };

  // Renderiza conteúdo conforme aba ativa
  const renderConteudo = () => {
    if (abaAtiva === 'Todos os pedidos') {
      return (
        <>
          {/* Filtro ativo */}
          {statusFiltrado && (
            <div className="filtro-ativo" style={{ 
              marginBottom: '16px',
              padding: '12px 16px',
              background: 'var(--bg3)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>
                Filtrando por: <strong>{statusConfig[statusFiltrado]?.label}</strong>
              </span>
              <button 
                onClick={limparFiltro} 
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                ✕ Limpar filtro
              </button>
            </div>
          )}

          {/* Lista de pedidos */}
          {pedidosFiltrados.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: 'var(--text-secondary)'
            }}>
              <p>Nenhum pedido encontrado</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pedidosFiltrados.map(pedido => {
                const status = statusConfig[pedido.status] || statusConfig.aguardando;
                return (
                  <div
                    key={pedido.id}
                    className="card-pedido"
                    onClick={() => handleAbrirPedido(pedido)}
                    style={{
                      padding: '16px',
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <div 
                        style={{ 
                          display: 'inline-block',
                          padding: '4px 10px',
                          background: status.cor,
                          color: 'white',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        {status.icon} {status.label}
                      </div>
                    </div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {pedido.clienteNome}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      {pedido.referencia}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Pedido n. {pedido.numero}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Criado em {pedido.criadoEm}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginTop: '8px',
                      paddingTop: '8px',
                      borderTop: '1px solid var(--border)'
                    }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Valor:</span>
                      <strong style={{ fontSize: '16px' }}>{formatarValor(calcularTotalPedido(pedido))}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      );
    }

    // Aba "Pedidos por status"
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Object.keys(statusConfig).map(statusKey => {
          const status = statusConfig[statusKey];
          const qtd = pedidosPorStatus[statusKey]?.length || 0;
          
          return (
            <div
              key={statusKey}
              onClick={() => handleClickStatus(statusKey)}
              style={{
                padding: '16px',
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                cursor: qtd > 0 ? 'pointer' : 'default',
                opacity: qtd > 0 ? 1 : 0.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div 
                  style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    background: status.cor 
                  }}
                ></div>
                <span style={{ fontWeight: '600' }}>{status.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold',
                  color: 'var(--accent)' 
                }}>
                  {qtd}
                </span>
                {qtd > 0 && <i className="fas fa-chevron-right" style={{ color: 'var(--text-secondary)' }}></i>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Notificacao 
        mensagem={mensagem}
        onFechar={() => setMensagem(null)}
      />

      <ListModal
        isOpen={isOpen}
        onClose={onClose}
        titulo="Pedidos"
        tabs={['Todos os pedidos', 'Pedidos por status']}
        activeTab={abaAtiva}
        onTabChange={setAbaAtiva}
        searchValue={busca}
        onSearchChange={setBusca}
        searchPlaceholder="Buscar pedidos..."
        showSearch={abaAtiva === 'Todos os pedidos'}
        onAdd={handleNovoPedido}
        addLabel="Novo Pedido"
        alertMessage={clienteFiltro ? (
          <span>
            <span>📋</span>
            <span> Mostrando apenas pedidos de <strong>{clienteFiltro.nome}</strong></span>
          </span>
        ) : null}
      >
        {renderConteudo()}
      </ListModal>

      {/* Modal de editar/criar pedido */}
      {modalPedidoAberto && pedidoSelecionado && (
        <PedidoModal
          isOpen={modalPedidoAberto}
          onClose={() => {
            setModalPedidoAberto(false);
            setPedidoSelecionado(null);
            setCriandoNovoPedido(false);
          }}
          cliente={pedidoSelecionado.cliente}
          CLI={CLI}
          setCLI={setCLI}
          ORC={ORC}
          setORC={setORC}
          AGENDA={AGENDA}
          pedidoExistente={criandoNovoPedido ? null : pedidoSelecionado.pedido}
        />
      )}
    </>
  );
}

export default PedidosModal;
