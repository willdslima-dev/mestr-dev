import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import PedidoModal from './PedidoModal';
import VisualizarPedidoModal from './VisualizarPedidoModal';

function CalendarioComAgenda({ isOpen, onClose, onSelecionarData, dataSelecionada, AGENDA = [], ORC = {}, CLI = {}, setORC, setCLI }) {
  const [mesAtual, setMesAtual] = useState(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState(dataSelecionada ? new Date(dataSelecionada) : null);
  const [pedidoParaVisualizar, setPedidoParaVisualizar] = useState(null);
  const [mostrarVisualizacaoModal, setMostrarVisualizacaoModal] = useState(false);
  const [mostrarEdicaoModal, setMostrarEdicaoModal] = useState(false);

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Gerar dias do calendário
  const diasDoMes = useMemo(() => {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();
    
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    
    const diasAnteriores = primeiroDia.getDay();
    const totalDias = ultimoDia.getDate();
    
    const dias = [];
    
    // Dias do mês anterior (vazios)
    for (let i = 0; i < diasAnteriores; i++) {
      dias.push(null);
    }
    
    // Dias do mês atual
    for (let dia = 1; dia <= totalDias; dia++) {
      dias.push(new Date(ano, mes, dia));
    }
    
    return dias;
  }, [mesAtual]);

  // Verificar se tem compromissos/pedidos em uma data
  const temCompromissoNoDia = (data) => {
    if (!data) return false;
    
    const dataStr = data.toISOString().split('T')[0];
    
    // Verificar na AGENDA
    const temAgenda = AGENDA.some(item => {
      if (item.data) {
        const itemData = item.data.split(' ')[0]; // pega só a data sem hora
        return itemData === dataStr;
      }
      return false;
    });
    
    // Verificar nos pedidos (prazoExecucao ou validadeOrcamento)
    const temPedido = Object.values(ORC).some(pedido => {
      if (pedido.prazoExecucao) {
        const prazoStr = pedido.prazoExecucao.split('T')[0];
        if (prazoStr === dataStr) return true;
      }
      if (pedido.validadeOrcamento) {
        const validadeStr = pedido.validadeOrcamento.split('T')[0];
        if (validadeStr === dataStr) return true;
      }
      return false;
    });
    
    return temAgenda || temPedido;
  };

  // Buscar compromissos do dia selecionado
  const compromissosDoDia = useMemo(() => {
    if (!diaSelecionado) return [];
    
    const dataStr = diaSelecionado.toISOString().split('T')[0];
    const compromissos = [];
    
    // Buscar na agenda
    AGENDA.forEach(item => {
      if (item.data && item.data.split(' ')[0] === dataStr) {
        compromissos.push({
          tipo: 'agenda',
          titulo: item.tipo || 'Compromisso',
          hora: item.hora || '',
          obs: item.obs || '',
          dados: item
        });
      }
    });
    
    // Buscar nos pedidos
    Object.values(ORC).forEach(pedido => {
      const cliente = CLI[pedido.clienteId] || {};
      
      // Calcular valor total do pedido
      const totalServicos = (pedido.servicos || []).reduce((acc, s) => acc + (s.valorUnitario * s.quantidade), 0);
      const totalMateriais = (pedido.materiais || []).reduce((acc, m) => acc + (m.valorUnitario * m.quantidade), 0);
      const valorTotal = totalServicos + totalMateriais - (pedido.desconto || 0) + (pedido.taxaEntrega || 0) + (pedido.outrasTaxas || 0);
      
      if (pedido.prazoExecucao && pedido.prazoExecucao.split('T')[0] === dataStr) {
        compromissos.push({
          tipo: 'pedido',
          tipoCampo: 'prazo',
          titulo: `Pedido #${pedido.numero}`,
          clienteNome: pedido.clienteNome || cliente.nome || 'Cliente',
          clienteTelefone: cliente.telefone || cliente.whatsapp || '',
          campo: 'Prazo de execução',
          horarioInicio: pedido.horarioInicio || '',
          horarioTermino: pedido.horarioTermino || '',
          valorTotal: valorTotal,
          status: pedido.status || '',
          dados: pedido
        });
      }
      
      if (pedido.validadeOrcamento && pedido.validadeOrcamento.split('T')[0] === dataStr) {
        // Só adiciona se não foi adicionado pelo prazo
        const jaAdicionado = compromissos.some(c => c.dados?.id === pedido.id);
        if (!jaAdicionado) {
          compromissos.push({
            tipo: 'pedido',
            tipoCampo: 'validade',
            titulo: `Pedido #${pedido.numero}`,
            clienteNome: pedido.clienteNome || cliente.nome || 'Cliente',
            clienteTelefone: cliente.telefone || cliente.whatsapp || '',
            campo: 'Validade do orçamento',
            horarioInicio: pedido.horarioInicio || '',
            horarioTermino: pedido.horarioTermino || '',
            valorTotal: valorTotal,
            status: pedido.status || '',
            dados: pedido
          });
        }
      }
    });
    
    return compromissos;
  }, [diaSelecionado, AGENDA, ORC, CLI]);

  const mesAnterior = () => {
    setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1));
  };

  const mesSeguinte = () => {
    setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1));
  };

  const handleDiaClick = (data) => {
    if (!data) return;
    setDiaSelecionado(data);
  };

  const handleConfirmar = () => {
    if (diaSelecionado) {
      const dataFormatada = diaSelecionado.toISOString().split('T')[0];
      onSelecionarData(dataFormatada);
      onClose();
    }
  };

  const handleVisualizarPedido = (pedido) => {
    setPedidoParaVisualizar(pedido);
    setMostrarVisualizacaoModal(true);
  };

  const handleEditarPedido = () => {
    setMostrarVisualizacaoModal(false);
    setMostrarEdicaoModal(true);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pendente: { label: 'Pendente', cor: '#f5a623' },
      aguardando: { label: 'Aguardando', cor: '#f5a623' },
      aprovado: { label: 'Aprovado', cor: '#4a90e2' },
      em_andamento: { label: 'Em andamento', cor: '#4a90e2' },
      aguardando_pagamento: { label: 'Aguardando pagamento', cor: '#4a90e2' },
      concluido: { label: 'Concluído', cor: '#10b981' },
      garantia: { label: 'Garantia', cor: '#10b981' },
      cancelado: { label: 'Cancelado', cor: '#f06070' }
    };
    return configs[status] || { label: status, cor: '#6b7280' };
  };

  const ehHoje = (data) => {
    if (!data) return false;
    const hoje = new Date();
    return data.getDate() === hoje.getDate() &&
           data.getMonth() === hoje.getMonth() &&
           data.getFullYear() === hoje.getFullYear();
  };

  const ehSelecionado = (data) => {
    if (!data || !diaSelecionado) return false;
    return data.getDate() === diaSelecionado.getDate() &&
           data.getMonth() === diaSelecionado.getMonth() &&
           data.getFullYear() === diaSelecionado.getFullYear();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} titulo="📅 Selecionar Data" comScroll={false}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: 'auto',
        maxHeight: '90vh',
        minHeight: '400px',
        width: '100%'
      }}>
        {/* Calendário */}
        <div style={{ 
          flex: '0 0 auto', 
          padding: 'clamp(8px, 2vw, 12px)', 
          background: 'var(--bg2)', 
          borderRadius: '12px', 
          marginBottom: '12px',
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden'
        }}>
          {/* Header do mês */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(8px, 2vw, 12px)' }}>
            <button
              onClick={mesAnterior}
              style={{
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                width: 'clamp(32px, 8vw, 40px)',
                height: 'clamp(32px, 8vw, 40px)',
                minWidth: '32px',
                cursor: 'pointer',
                color: 'var(--text)',
                fontSize: 'clamp(16px, 4vw, 20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                touchAction: 'manipulation'
              }}
            >
              ‹
            </button>
            
            <h3 style={{ 
              margin: 0, 
              fontSize: 'clamp(13px, 3.5vw, 16px)', 
              color: 'var(--text)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              padding: '0 8px'
            }}>
              {meses[mesAtual.getMonth()]} {mesAtual.getFullYear()}
            </h3>
            
            <button
              onClick={mesSeguinte}
              style={{
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                width: 'clamp(32px, 8vw, 40px)',
                height: 'clamp(32px, 8vw, 40px)',
                minWidth: '32px',
                cursor: 'pointer',
                color: 'var(--text)',
                fontSize: 'clamp(16px, 4vw, 20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                touchAction: 'manipulation'
              }}
            >
              ›
            </button>
          </div>

          {/* Dias da semana */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: 'clamp(2px, 0.5vw, 4px)',
            marginBottom: 'clamp(4px, 1vw, 6px)',
            width: '100%'
          }}>
            {diasSemana.map(dia => (
              <div 
                key={dia}
                style={{
                  textAlign: 'center',
                  fontSize: 'clamp(9px, 2vw, 12px)',
                  fontWeight: '600',
                  color: 'var(--muted)',
                  padding: 'clamp(2px, 0.5vw, 4px)',
                  overflow: 'hidden'
                }}
              >
                {dia}
              </div>
            ))}
          </div>

          {/* Grid de dias */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: 'clamp(2px, 0.5vw, 4px)',
            width: '100%'
          }}>
            {diasDoMes.map((data, index) => (
              <div
                key={index}
                onClick={() => handleDiaClick(data)}
                style={{
                  width: '100%',
                  paddingBottom: '100%',
                  position: 'relative',
                  borderRadius: 'clamp(4px, 1vw, 6px)',
                  cursor: data ? 'pointer' : 'default',
                  background: data 
                    ? ehSelecionado(data) 
                      ? 'var(--accent)' 
                      : ehHoje(data)
                        ? 'var(--bg3)'
                        : 'transparent'
                    : 'transparent',
                  border: ehHoje(data) && !ehSelecionado(data) ? '2px solid var(--accent)' : 'none',
                  transition: 'all 0.2s',
                  touchAction: 'manipulation'
                }}
              >
                {data && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: ehSelecionado(data) ? '#fff' : 'var(--text)',
                    fontSize: 'clamp(10px, 2.5vw, 14px)',
                    fontWeight: ehHoje(data) ? '600' : '400'
                  }}>
                    {data.getDate()}
                    {temCompromissoNoDia(data) && (
                      <div style={{
                        position: 'absolute',
                        bottom: 'clamp(2px, 0.5vw, 3px)',
                        width: 'clamp(3px, 0.8vw, 4px)',
                        height: 'clamp(3px, 0.8vw, 4px)',
                        borderRadius: '50%',
                        background: ehSelecionado(data) ? '#fff' : 'var(--accent)'
                      }} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Compromissos do dia */}
        <div style={{ 
          flex: '1 1 auto', 
          overflowY: 'auto',
          minHeight: '150px',
          maxHeight: '300px',
          paddingBottom: '12px'
        }}>
          <h4 style={{ 
            fontSize: 'clamp(12px, 3.5vw, 14px)', 
            color: 'var(--text)', 
            marginBottom: '10px', 
            fontWeight: '600' 
          }}>
            {diaSelecionado 
              ? `Compromissos - ${diaSelecionado.getDate()}/${diaSelecionado.getMonth() + 1}/${diaSelecionado.getFullYear()}`
              : 'Selecione uma data'}
          </h4>

          {!diaSelecionado && (
            <p style={{ 
              textAlign: 'center', 
              color: 'var(--muted)', 
              padding: '20px 8px', 
              fontSize: 'clamp(11px, 3vw, 13px)' 
            }}>
              Clique em uma data no calendário acima
            </p>
          )}

          {diaSelecionado && compromissosDoDia.length === 0 && (
            <p style={{ 
              textAlign: 'center', 
              color: 'var(--muted)', 
              padding: '20px 8px', 
              fontSize: 'clamp(11px, 3vw, 13px)' 
            }}>
              📭 Nenhum compromisso neste dia
            </p>
          )}

          {compromissosDoDia.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {compromissosDoDia.map((item, index) => (
                <div
                  key={index}
                  onClick={() => item.tipo === 'pedido' ? handleVisualizarPedido(item.dados) : null}
                  style={{
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '10px',
                    cursor: item.tipo === 'pedido' ? 'pointer' : 'default',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (item.tipo === 'pedido') {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  {/* Tipo de compromisso */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    marginBottom: '6px',
                    flexWrap: 'wrap',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}>
                        {item.tipo === 'agenda' ? '📆' : '📋'}
                      </span>
                      <strong style={{ 
                        fontSize: 'clamp(12px, 3.5vw, 14px)', 
                        color: 'var(--text)',
                        wordBreak: 'break-word'
                      }}>
                        {item.titulo}
                      </strong>
                    </div>
                    
                    {item.tipo === 'pedido' && (
                      <span style={{
                        fontSize: 'clamp(10px, 2.5vw, 11px)',
                        padding: '3px 6px',
                        borderRadius: '4px',
                        background: getStatusConfig(item.status).cor + '20',
                        color: getStatusConfig(item.status).cor,
                        fontWeight: '500',
                        whiteSpace: 'nowrap'
                      }}>
                        {getStatusConfig(item.status).label}
                      </span>
                    )}
                  </div>
                  
                  {/* Informações do pedido */}
                  {item.tipo === 'pedido' && (
                    <>
                      {/* Nome do cliente */}
                      <div style={{ marginBottom: '4px', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                        <span style={{ 
                          fontSize: 'clamp(11px, 3vw, 13px)', 
                          color: 'var(--text)', 
                          fontWeight: '500' 
                        }}>
                          👤 {item.clienteNome}
                        </span>
                        {item.clienteTelefone && (
                          <span style={{ 
                            fontSize: 'clamp(10px, 2.8vw, 12px)', 
                            color: 'var(--muted)' 
                          }}>
                            📱 {item.clienteTelefone}
                          </span>
                        )}
                      </div>
                      
                      {/* Horário */}
                      {(item.horarioInicio || item.horarioTermino) && (
                        <div style={{ marginBottom: '4px' }}>
                          <span style={{ fontSize: 'clamp(11px, 3vw, 13px)', color: 'var(--text)' }}>
                            🕐 {item.horarioInicio || '--:--'} até {item.horarioTermino || '--:--'}
                          </span>
                        </div>
                      )}
                      
                      {/* Valor */}
                      {item.valorTotal > 0 && (
                        <div style={{ marginBottom: '6px' }}>
                          <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '600' }}>
                            💰 R$ {item.valorTotal.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      )}
                      
                      {/* Campo (prazo ou validade) */}
                      <div style={{ 
                        fontSize: '11px', 
                        color: 'var(--muted)', 
                        marginTop: '8px',
                        paddingTop: '8px',
                        borderTop: '1px solid var(--border)'
                      }}>
                        📌 {item.campo}
                      </div>
                      
                      {/* Indicador de clique */}
                      <div style={{ 
                        fontSize: '11px', 
                        color: 'var(--accent)', 
                        marginTop: '4px',
                        textAlign: 'right'
                      }}>
                        Clique para visualizar ›
                      </div>
                    </>
                  )}
                  
                  {/* Informações da agenda */}
                  {item.tipo === 'agenda' && (
                    <>
                      {item.hora && (
                        <div style={{ marginBottom: '6px' }}>
                          <span style={{ fontSize: '13px', color: 'var(--text)' }}>
                            🕐 {item.hora}
                          </span>
                        </div>
                      )}
                      {item.obs && (
                        <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '4px 0' }}>
                          {item.obs}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botões de ação */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border)'
        }}>
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
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Cancelar
          </button>
          
          <button
            onClick={handleConfirmar}
            disabled={!diaSelecionado}
            style={{
              flex: 1,
              padding: '12px',
              background: diaSelecionado ? 'var(--accent)' : 'var(--bg3)',
              border: 'none',
              borderRadius: '8px',
              color: diaSelecionado ? '#fff' : 'var(--muted)',
              fontSize: '14px',
              cursor: diaSelecionado ? 'pointer' : 'not-allowed',
              fontWeight: '500'
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </Modal>

    {/* Modal de Visualização (Somente Leitura) */}
    {mostrarVisualizacaoModal && pedidoParaVisualizar && (
      <VisualizarPedidoModal
        isOpen={mostrarVisualizacaoModal}
        onClose={() => {
          setMostrarVisualizacaoModal(false);
          setPedidoParaVisualizar(null);
        }}
        pedido={pedidoParaVisualizar}
        cliente={CLI[pedidoParaVisualizar.clienteId]}
        onEditar={handleEditarPedido}
      />
    )}

    {/* Modal de Edição do Pedido */}
    {mostrarEdicaoModal && pedidoParaVisualizar && (
      <PedidoModal
        isOpen={mostrarEdicaoModal}
        onClose={() => {
          setMostrarEdicaoModal(false);
          setPedidoParaVisualizar(null);
        }}
        pedidoExistente={pedidoParaVisualizar}
        ORC={ORC}
        setORC={setORC}
        CLI={CLI}
        setCLI={setCLI}
        AGENDA={AGENDA}
      />
    )}
    </>
  );
}

export default CalendarioComAgenda;
