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

  const handleGerarPDFRelatorio = () => {
    const html = gerarHTMLRelatorio(cliente, pedidosCliente, financeiro);
    abrirEmJanela(html, `Relatorio_${cliente.nome.replace(/\W/g, '_')}.pdf`);
  };

  const handleCompartilharWhatsapp = (pedido) => {
    const numeroWhatsapp = cliente.whatsapp?.replace(/\D/g, '') || cliente.telefone?.replace(/\D/g, '');
    if (!numeroWhatsapp) {
      window.alert('Número de WhatsApp/telefone do cliente não informado.');
      return;
    }

    const mensagem = `Olá ${cliente.nome}! 👋\n\nSegue em anexo o orçamento para o pedido Nº ${pedido.numero}.\n\nValor: ${formatarValor(calcularValorPedido(pedido))}\n\nPrecisa de mais informações? Estou à disposição! 📞`;
    const urlWhatsapp = `https://wa.me/55${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsapp, '_blank');
  };

  const handleCompartilharWhatsappRelatorio = () => {
    const numeroWhatsapp = cliente.whatsapp?.replace(/\D/g, '') || cliente.telefone?.replace(/\D/g, '');
    if (!numeroWhatsapp) {
      window.alert('Número de WhatsApp/telefone do cliente não informado.');
      return;
    }

    const mensagem = `Olá ${cliente.nome}! 👋\n\nSegue o relatório de faturamento com os pedidos realizados, valores pagos e pendentes.\n\nTotal faturado: ${formatarValor(financeiro.totalFaturado)}\nTotal pago: ${formatarValor(financeiro.totalPago)}\nA receber: ${formatarValor(financeiro.totalPendente)}\n\nSe quiser, posso enviar o orçamento de um pedido específico.`;
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

  const gerarHTMLRelatorio = (cliente, pedidos, financeiro) => {
    const pedidosHtml = pedidos.length === 0 ? '<p>Nenhum pedido registrado.</p>' : pedidos.map(pedido => {
      const valorPedido = calcularValorPedido(pedido);
      const totalPago = (pedido.pagamentos || []).reduce((sum, p) => sum + (p.valor || 0), 0);
      const pendente = valorPedido - totalPago;
      const status = statusConfig[pedido.status] || { label: pedido.status || 'Desconhecido', cor: '#999', icon: '•' };

      return `
        <div class="pedido-item">
          <div class="pedido-item-top">
            <strong>Pedido Nº ${pedido.numero}</strong>
            <span class="pedido-status" style="background:${status.cor};">${status.icon} ${status.label}</span>
          </div>
          <div class="pedido-item-linha">
            <span>Data:</span><span>${pedido.criadoEm || '-'}</span>
          </div>
          <div class="pedido-item-linha">
            <span>Referência:</span><span>${pedido.referencia || '-'}</span>
          </div>
          <div class="pedido-item-linha">
            <span>Valor:</span><span>${formatarValor(valorPedido)}</span>
          </div>
          <div class="pedido-item-linha">
            <span>Pago:</span><span>${formatarValor(totalPago)}</span>
          </div>
          <div class="pedido-item-linha">
            <span>Pendente:</span><span>${formatarValor(pendente)}</span>
          </div>
        </div>
      `;
    }).join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Relatório ${cliente.nome}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; background: white; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { font-size: 32px; color: #6c63ff; margin-bottom: 6px; }
    .header p { font-size: 14px; color: #666; }
    .resumo { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-top: 30px; }
    .bloco { background: #f8f8ff; border-radius: 14px; padding: 22px; border: 1px solid #e7e7f5; }
    .bloco h3 { margin-bottom: 16px; color: #333; font-size: 16px; }
    .info-linha { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e7e7f5; font-size: 14px; }
    .info-linha:last-child { border-bottom: none; }
    .info-label { color: #6b7280; }
    .info-valor { font-weight: 600; }
    .pedido-item { margin-bottom: 18px; padding: 18px; border-radius: 14px; background: #fff; box-shadow: 0 8px 20px rgba(0,0,0,0.03); }
    .pedido-item-top { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-bottom: 12px; }
    .pedido-status { border-radius: 999px; padding: 4px 12px; color: white; font-size: 12px; }
    .pedido-item-linha { display: flex; justify-content: space-between; padding: 8px 0; border-top: 1px solid #f1f1f7; font-size: 14px; }
    .pedido-item-linha:first-of-type { border-top: none; }
    .seta { display: inline-block; margin-left: 6px; }
    .cliente-info { margin-top: 20px; padding: 24px; border-radius: 16px; background: #fafafa; border: 1px solid #e9e9f2; }
    .cliente-info h3 { margin-bottom: 12px; font-size: 16px; color: #333; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e8e8f1; color: #666; font-size: 13px; text-align: center; }
    @media print { body { padding: 18px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Relatório de Faturamento</h1>
    <p>${cliente.nome} • ${cliente.telefone || cliente.whatsapp || 'Contato não informado'}</p>
  </div>

  <div class="cliente-info">
    <h3>Dados do Cliente</h3>
    <div class="info-linha"><span class="info-label">Nome</span><span class="info-valor">${cliente.nome}</span></div>
    <div class="info-linha"><span class="info-label">Telefone</span><span class="info-valor">${cliente.telefone || cliente.whatsapp || 'Não informado'}</span></div>
    <div class="info-linha"><span class="info-label">E-mail</span><span class="info-valor">${cliente.email || 'Não informado'}</span></div>
    <div class="info-linha"><span class="info-label">Endereço</span><span class="info-valor">${cliente.endereco || 'Não informado'}</span></div>
  </div>

  <div class="resumo">
    <div class="bloco">
      <h3>Total Faturado</h3>
      <div class="info-linha"><span class="info-label">Valor</span><span class="info-valor">${formatarValor(financeiro.totalFaturado)}</span></div>
    </div>
    <div class="bloco">
      <h3>Total Pago</h3>
      <div class="info-linha"><span class="info-label">Valor</span><span class="info-valor">${formatarValor(financeiro.totalPago)}</span></div>
    </div>
    <div class="bloco">
      <h3>A Receber</h3>
      <div class="info-linha"><span class="info-label">Valor</span><span class="info-valor">${formatarValor(financeiro.totalPendente)}</span></div>
    </div>
  </div>

  <div style="margin-top: 34px;">
    <h3 style="font-size: 18px; margin-bottom: 18px; color: #333;">Pedidos do Cliente</h3>
    ${pedidosHtml}
  </div>

  <div class="footer">
    <p>Documento gerado automaticamente pelo Mestre.IA</p>
  </div>
</body>
</html>
    `;
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

            <div className="relatorio-acoes">
              <button className="btn-gerar-relatorio" onClick={handleGerarPDFRelatorio}>
                📄 Gerar relatório em PDF
              </button>
              <button className="btn-whatsapp-relatorio" onClick={handleCompartilharWhatsappRelatorio}>
                💬 Compartilhar WhatsApp
              </button>
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
