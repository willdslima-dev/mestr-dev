import React, { useState } from 'react';
import Modal from './Modal';
import './RelatorioModal.css';

function RelatorioModal({ isOpen, onClose, cliente, ORC = {} }) {
  const [abaAtiva, setAbaAtiva] = useState('faturamento'); // 'faturamento' ou 'orcamento'
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  // Filtra pedidos do cliente
  const pedidosCliente = cliente 
    ? Object.values(ORC).filter(p => p.clienteId === cliente.id)
    : [];

  // Calcula dados financeiros
  const calcularFinanceiro = () => {
    let totalFaturado = 0;
    let totalPago = 0;
    let totalPendente = 0;

    pedidosCliente.forEach(pedido => {
      const totalServicos = (pedido.servicos || []).reduce((acc, s) => 
        acc + ((s.valorUnitario || 0) * (s.quantidade || 1)), 0);
      const totalMateriais = (pedido.materiais || []).reduce((acc, m) => 
        acc + ((m.valorUnitario || 0) * (m.quantidade || 1)), 0);
      const subtotal = totalServicos + totalMateriais;
      const valorFinal = subtotal - (pedido.desconto || 0);
      
      totalFaturado += valorFinal;
      const totalPagoAtual = (pedido.pagamentos || []).reduce((sum, p) => sum + (p.valor || 0), 0);
      totalPago += totalPagoAtual;
      totalPendente += (valorFinal - totalPagoAtual);
    });

    return { totalFaturado, totalPago, totalPendente };
  };

  const financeiro = calcularFinanceiro();

  const formatarValor = (valor) => {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  };

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

  const handleGerarPDF = (pedido) => {
    const html = gerarHTMLOrcamento(pedido, cliente);
    abrirEmJanela(html, `Orcamento_${pedido.numero}.pdf`);
  };

  const handleCompartilharWhatsapp = (pedido) => {
    const mensagem = `Olá ${cliente.nome}! 👋\n\nSegue em anexo o orçamento para o pedido Nº ${pedido.numero}.\n\nValor: ${formatarValor(calcularValorPedido(pedido))}\n\nPrecisa de mais informações? Estou à disposição! 📞`;
    
    const numeroWhatsapp = cliente.whatsapp?.replace(/\D/g, '') || cliente.telefone?.replace(/\D/g, '');
    const urlWhatsapp = `https://wa.me/55${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
    
    window.open(urlWhatsapp, '_blank');
  };

  const calcularValorPedido = (pedido) => {
    const totalServicos = (pedido.servicos || []).reduce((acc, s) => 
      acc + ((s.valorUnitario || 0) * (s.quantidade || 1)), 0);
    const totalMateriais = (pedido.materiais || []).reduce((acc, m) => 
      acc + ((m.valorUnitario || 0) * (m.quantidade || 1)), 0);
    return totalServicos + totalMateriais - (pedido.desconto || 0);
  };

  const abrirEmJanela = (html, nome) => {
    const janela = window.open('', '_blank');
    janela.document.write(html);
    janela.document.close();
  };

  const gerarHTMLOrcamento = (pedido, cliente) => {
    const totalServicos = (pedido.servicos || []).reduce((acc, s) => 
      acc + ((s.valorUnitario || 0) * (s.quantidade || 1)), 0);
    const totalMateriais = (pedido.materiais || []).reduce((acc, m) => 
      acc + ((m.valorUnitario || 0) * (m.quantidade || 1)), 0);
    const subtotal = totalServicos + totalMateriais;
    const desconto = pedido.desconto || 0;
    const valorTotal = subtotal - desconto;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Orçamento ${pedido.numero}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 40px;
      color: #333;
      background: white;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #6c63ff;
    }
    .header h1 {
      font-size: 32px;
      color: #6c63ff;
      margin-bottom: 5px;
    }
    .cliente-info {
      margin-bottom: 30px;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .cliente-info h3 {
      color: #333;
      margin-bottom: 10px;
    }
    .info-linha {
      display: flex;
      padding: 6px 0;
      font-size: 14px;
    }
    .info-label {
      font-weight: 600;
      width: 120px;
      color: #666;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
    }
    th {
      background: #6c63ff;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .tabela-servicos, .tabela-materiais {
      margin-bottom: 30px;
    }
    .tabela-servicos h4, .tabela-materiais h4 {
      color: #333;
      margin: 20px 0 10px 0;
      font-size: 16px;
    }
    .totalizador {
      margin-top: 40px;
      padding: 20px;
      background: linear-gradient(135deg, #6c63ff 0%, #5851ea 100%);
      color: white;
      border-radius: 8px;
      text-align: right;
    }
    .totalizador-linha {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 16px;
    }
    .totalizador-linha strong {
      font-size: 18px;
    }
    .valor-final {
      border-top: 2px solid rgba(255,255,255,0.3);
      padding-top: 15px;
      margin-top: 15px;
      font-size: 24px;
      font-weight: bold;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    @media print {
      body { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>ORÇAMENTO</h1>
    <p>Pedido Nº ${pedido.numero}</p>
  </div>

  <div class="cliente-info">
    <h3>👤 Dados do Cliente</h3>
    <div class="info-linha">
      <span class="info-label">Nome:</span>
      <span>${cliente.nome}</span>
    </div>
    <div class="info-linha">
      <span class="info-label">Endereço:</span>
      <span>${pedido.referencia || cliente.endereco || 'Não informado'}</span>
    </div>
    <div class="info-linha">
      <span class="info-label">Telefone:</span>
      <span>${cliente.telefone || cliente.whatsapp || 'Não informado'}</span>
    </div>
    <div class="info-linha">
      <span class="info-label">Data:</span>
      <span>${pedido.criadoEm || new Date().toLocaleDateString('pt-BR')}</span>
    </div>
  </div>

  ${pedido.servicos && pedido.servicos.length > 0 ? `
    <div class="tabela-servicos">
      <h4>🔧 Serviços</h4>
      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th style="text-align: center;">Qtd</th>
            <th style="text-align: right;">Valor Unit.</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${pedido.servicos.map(s => `
            <tr>
              <td>${s.descricao}</td>
              <td style="text-align: center;">${s.quantidade || 1}</td>
              <td style="text-align: right;">R$ ${((s.valorUnitario || 0).toFixed(2)).replace('.', ',')}</td>
              <td style="text-align: right;">R$ ${(((s.valorUnitario || 0) * (s.quantidade || 1)).toFixed(2)).replace('.', ',')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : ''}

  ${pedido.materiais && pedido.materiais.length > 0 ? `
    <div class="tabela-materiais">
      <h4>📦 Materiais</h4>
      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th style="text-align: center;">Qtd</th>
            <th style="text-align: right;">Valor Unit.</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${pedido.materiais.map(m => `
            <tr>
              <td>${m.descricao}</td>
              <td style="text-align: center;">${m.quantidade || 1}</td>
              <td style="text-align: right;">R$ ${((m.valorUnitario || 0).toFixed(2)).replace('.', ',')}</td>
              <td style="text-align: right;">R$ ${(((m.valorUnitario || 0) * (m.quantidade || 1)).toFixed(2)).replace('.', ',')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : ''}

  <div class="totalizador">
    <div class="totalizador-linha">
      <span>Subtotal:</span>
      <strong>R$ ${subtotal.toFixed(2).replace('.', ',')}</strong>
    </div>
    ${desconto > 0 ? `
      <div class="totalizador-linha">
        <span>Desconto:</span>
        <strong>- R$ ${desconto.toFixed(2).replace('.', ',')}</strong>
      </div>
    ` : ''}
    <div class="totalizador-linha valor-final">
      <span>Valor Total:</span>
      <strong>R$ ${valorTotal.toFixed(2).replace('.', ',')}</strong>
    </div>
  </div>

  <div class="footer">
    <p>Documento gerado automaticamente pelo Mestre.IA</p>
    <p>Válido por 30 dias</p>
  </div>
</body>
</html>
    `;
  };

  if (!cliente) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Relatório - ${cliente.nome}`}>
      <div className="relatorio-modal">
        {/* Abas */}
        <div className="abas">
          <button
            className={`aba ${abaAtiva === 'faturamento' ? 'ativa' : ''}`}
            onClick={() => setAbaAtiva('faturamento')}
          >
            💰 Faturamento
          </button>
          <button
            className={`aba ${abaAtiva === 'orcamento' ? 'ativa' : ''}`}
            onClick={() => setAbaAtiva('orcamento')}
          >
            📄 Orçamentos
          </button>
        </div>

        {/* Conteúdo - Faturamento */}
        {abaAtiva === 'faturamento' && (
          <div className="aba-conteudo">
            {/* Resumo financeiro */}
            <div className="resumo-financeiro">
              <div className="card-valor faturado">
                <div className="card-titulo">Total Faturado</div>
                <div className="card-valor-grande">{formatarValor(financeiro.totalFaturado)}</div>
              </div>
              <div className="card-valor pago">
                <div className="card-titulo">Total Pago</div>
                <div className="card-valor-grande">{formatarValor(financeiro.totalPago)}</div>
              </div>
              <div className="card-valor pendente">
                <div className="card-titulo">A Receber</div>
                <div className="card-valor-grande">{formatarValor(financeiro.totalPendente)}</div>
              </div>
            </div>

            {/* Lista de pedidos */}
            <div className="lista-pedidos">
              <h3>📋 Pedidos Realizados</h3>
              {pedidosCliente.length === 0 ? (
                <p className="sem-pedidos">Nenhum pedido encontrado para este cliente.</p>
              ) : (
                <div className="pedidos-grid">
                  {pedidosCliente.map(pedido => {
                    const valorPedido = calcularValorPedido(pedido);
                    const totalPago = (pedido.pagamentos || []).reduce((sum, p) => sum + (p.valor || 0), 0);
                    const status = statusConfig[pedido.status] || { label: 'Desconhecido', cor: '#999', icon: '?' };

                    return (
                      <div key={pedido.id} className="card-pedido">
                        <div className="pedido-numero">Pedido Nº {pedido.numero}</div>
                        <div className="pedido-status" style={{ background: status.cor }}>
                          {status.icon} {status.label}
                        </div>
                        <div className="pedido-info">
                          <div className="info-linha">
                            <span className="label">Data:</span>
                            <span>{pedido.criadoEm}</span>
                          </div>
                          <div className="info-linha">
                            <span className="label">Referência:</span>
                            <span>{pedido.referencia || '-'}</span>
                          </div>
                          <div className="info-linha destaque">
                            <span className="label">Valor:</span>
                            <span>{formatarValor(valorPedido)}</span>
                          </div>
                          <div className="info-linha">
                            <span className="label">Pago:</span>
                            <span className="valor-pago">{formatarValor(totalPago)}</span>
                          </div>
                          {valorPedido - totalPago > 0 && (
                            <div className="info-linha destaque">
                              <span className="label">Pendente:</span>
                              <span className="valor-pendente">{formatarValor(valorPedido - totalPago)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Conteúdo - Orçamentos */}
        {abaAtiva === 'orcamento' && (
          <div className="aba-conteudo">
            <h3>📄 Selecione um Pedido para Gerar Orçamento</h3>
            {pedidosCliente.length === 0 ? (
              <p className="sem-pedidos">Nenhum pedido encontrado para este cliente.</p>
            ) : (
              <div className="lista-orcamentos">
                {pedidosCliente.map(pedido => {
                  const valorPedido = calcularValorPedido(pedido);
                  const status = statusConfig[pedido.status] || { label: 'Desconhecido', cor: '#999', icon: '?' };

                  return (
                    <div key={pedido.id} className="item-orcamento">
                      <div className="orcamento-header">
                        <div className="orcamento-info">
                          <div className="orcamento-numero">Pedido Nº {pedido.numero}</div>
                          <div className="orcamento-status" style={{ background: status.cor }}>
                            {status.icon} {status.label}
                          </div>
                        </div>
                        <div className="orcamento-valor">
                          {formatarValor(valorPedido)}
                        </div>
                      </div>

                      <div className="orcamento-detalhes">
                        <span>📅 {pedido.criadoEm}</span>
                        <span>📍 {pedido.referencia || 'Sem referência'}</span>
                        <span>📦 {(pedido.servicos?.length || 0) + (pedido.materiais?.length || 0)} itens</span>
                      </div>

                      <div className="orcamento-acoes">
                        <button
                          className="btn-pdf"
                          onClick={() => handleGerarPDF(pedido)}
                        >
                          📄 Gerar PDF
                        </button>
                        <button
                          className="btn-whatsapp"
                          onClick={() => handleCompartilharWhatsapp(pedido)}
                        >
                          💬 Enviar WhatsApp
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default RelatorioModal;
