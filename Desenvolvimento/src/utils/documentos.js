import { hoje } from './helpers';

/**
 * Gera documento HTML para um único pedido
 */
export const gerarDocumentoPedido = (pedido, cliente) => {
  // Calcula totais com segurança
  const totalServicos = pedido.servicos?.reduce((acc, s) => {
    const valor = (s.valorUnitario || s.preco || 0);
    const qtd = (s.quantidade || 1);
    return acc + (valor * qtd);
  }, 0) || 0;

  const totalMateriais = pedido.materiais?.reduce((acc, m) => {
    const valor = (m.valorUnitario || m.preco || 0);
    const qtd = (m.quantidade || 1);
    return acc + (valor * qtd);
  }, 0) || 0;

  const subtotal = totalServicos + totalMateriais;
  const desconto = pedido.desconto || 0;
  const valorTotal = subtotal - desconto;

  const totalPago = pedido.pagamentos?.reduce((sum, p) => sum + (p.valor || 0), 0) || 0;
  const valorPendente = valorTotal - totalPago;

  const statusOpcoes = {
    aguardando: { label: 'Aguardando aprovação', cor: '#f5a623' },
    pendente: { label: 'Pendente', cor: '#f5a623' },
    aprovado: { label: 'Aprovado', cor: '#4a90e2' },
    em_andamento: { label: 'Em andamento', cor: '#6c63ff' },
    concluido: { label: 'Concluído', cor: '#10b981' },
    cancelado: { label: 'Cancelado', cor: '#f06070' }
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Pedido ${pedido.numero} - ${cliente.nome}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 40px;
      color: #333;
      background: white;
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #6c63ff;
    }
    .logo h1 {
      font-size: 32px;
      color: #6c63ff;
      margin-bottom: 5px;
    }
    .logo p {
      color: #666;
      font-size: 14px;
    }
    .header {
      margin-bottom: 30px;
      text-align: center;
    }
    .header h2 {
      font-size: 24px;
      color: #333;
      margin-bottom: 10px;
    }
    .header .info {
      font-size: 14px;
      color: #666;
    }
    .bloco {
      margin-bottom: 30px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      page-break-inside: avoid;
    }
    .bloco-titulo {
      background: #6c63ff;
      color: white;
      padding: 12px 20px;
      font-size: 18px;
      font-weight: 600;
    }
    .bloco-conteudo {
      padding: 20px;
    }
    .info-linha {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .info-linha:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #666;
      width: 150px;
    }
    .info-valor {
      flex: 1;
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th {
      background: #f5f5f5;
      padding: 10px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #ddd;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .total-linha {
      font-weight: 600;
      font-size: 16px;
      background: #f9f9f9;
    }
    .destaque {
      background: #fff3cd;
      padding: 15px;
      border-radius: 6px;
      margin-top: 15px;
      border-left: 4px solid #ffc107;
    }
    .destaque strong {
      color: #856404;
    }
    .sucesso {
      background: #d4edda;
      border-left-color: #28a745;
    }
    .sucesso strong {
      color: #155724;
    }
    @media print {
      body { padding: 20px; }
      .bloco { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <!-- Logo -->
  <div class="logo">
    <h1>⚡ Mestre.IA</h1>
    <p>Gestão Inteligente de Serviços</p>
  </div>

  <!-- Header -->
  <div class="header">
    <h2>Pedido Nº ${pedido.numero}</h2>
    <div class="info">
      <strong>Status:</strong> ${statusOpcoes[pedido.status]?.label || pedido.status} | 
      <strong>Data:</strong> ${pedido.criadoEm || hoje()}
      ${pedido.referencia ? ` | <strong>Ref:</strong> ${pedido.referencia}` : ''}
    </div>
  </div>

  <!-- Bloco 1: Dados do Cliente -->
  <div class="bloco">
    <div class="bloco-titulo">📋 Dados do Cliente</div>
    <div class="bloco-conteudo">
      <div class="info-linha">
        <div class="info-label">Nome:</div>
        <div class="info-valor">${cliente.nome}</div>
      </div>
      <div class="info-linha">
        <div class="info-label">Telefone:</div>
        <div class="info-valor">${cliente.telefone || cliente.whatsapp || 'Não informado'}</div>
      </div>
      ${cliente.whatsapp ? `
      <div class="info-linha">
        <div class="info-label">WhatsApp:</div>
        <div class="info-valor">${cliente.whatsapp}</div>
      </div>
      ` : ''}
      ${cliente.endereco ? `
      <div class="info-linha">
        <div class="info-label">Endereço:</div>
        <div class="info-valor">${cliente.endereco}</div>
      </div>
      ` : ''}
      ${cliente.email ? `
      <div class="info-linha">
        <div class="info-label">E-mail:</div>
        <div class="info-valor">${cliente.email}</div>
      </div>
      ` : ''}
    </div>
  </div>

  <!-- Bloco 2: Orçamento -->
  <div class="bloco">
    <div class="bloco-titulo">💰 Orçamento</div>
    <div class="bloco-conteudo">
      ${(pedido.servicos && pedido.servicos.length > 0) ? `
        <h3 style="margin-bottom: 10px; color: #666; font-size: 16px;">Serviços</h3>
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
            ${pedido.servicos.map(s => {
              const valorUnit = s.valorUnitario || s.preco || 0;
              const qtd = s.quantidade || 1;
              return `
              <tr>
                <td>${s.descricao}</td>
                <td style="text-align: center;">${qtd} ${s.unidade || ''}</td>
                <td style="text-align: right;">R$ ${valorUnit.toFixed(2).replace('.', ',')}</td>
                <td style="text-align: right;">R$ ${(valorUnit * qtd).toFixed(2).replace('.', ',')}</td>
              </tr>
              `;
            }).join('')}
            <tr class="total-linha">
              <td colspan="3" style="text-align: right;">Subtotal Serviços:</td>
              <td style="text-align: right;">R$ ${totalServicos.toFixed(2).replace('.', ',')}</td>
            </tr>
          </tbody>
        </table>
      ` : '<p style="color: #999;">Nenhum serviço adicionado</p>'}

      ${(pedido.materiais && pedido.materiais.length > 0) ? `
        <h3 style="margin: 20px 0 10px 0; color: #666; font-size: 16px;">Materiais</h3>
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
            ${pedido.materiais.map(m => {
              const valorUnit = m.valorUnitario || m.preco || 0;
              const qtd = m.quantidade || 1;
              return `
              <tr>
                <td>${m.descricao}</td>
                <td style="text-align: center;">${qtd}</td>
                <td style="text-align: right;">R$ ${valorUnit.toFixed(2).replace('.', ',')}</td>
                <td style="text-align: right;">R$ ${(valorUnit * qtd).toFixed(2).replace('.', ',')}</td>
              </tr>
              `;
            }).join('')}
            <tr class="total-linha">
              <td colspan="3" style="text-align: right;">Subtotal Materiais:</td>
              <td style="text-align: right;">R$ ${totalMateriais.toFixed(2).replace('.', ',')}</td>
            </tr>
          </tbody>
        </table>
      ` : ''}

      ${desconto > 0 ? `
        <div style="margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 6px;">
          <div style="display: flex; justify-content: space-between;">
            <strong>Desconto:</strong>
            <strong style="color: #28a745;">- R$ ${desconto.toFixed(2).replace('.', ',')}</strong>
          </div>
        </div>
      ` : ''}

      <div style="margin-top: 20px; padding: 15px; background: #6c63ff; color: white; border-radius: 6px; text-align: center;">
        <div style="font-size: 14px; margin-bottom: 5px;">VALOR TOTAL</div>
        <div style="font-size: 28px; font-weight: bold;">R$ ${valorTotal.toFixed(2).replace('.', ',')}</div>
      </div>

      ${pedido.condicoesPagamento ? `
        <div style="margin-top: 15px;">
          <strong>Condições de Pagamento:</strong>
          <p style="margin-top: 5px; color: #666;">${pedido.condicoesPagamento}</p>
        </div>
      ` : ''}

      ${pedido.informacoesAdicionais ? `
        <div style="margin-top: 15px;">
          <strong>Informações Adicionais:</strong>
          <p style="margin-top: 5px; color: #666;">${pedido.informacoesAdicionais}</p>
        </div>
      ` : ''}
    </div>
  </div>

  <!-- Bloco 3: Pagamentos -->
  <div class="bloco">
    <div class="bloco-titulo">💳 Pagamentos e Pendências</div>
    <div class="bloco-conteudo">
      ${(pedido.pagamentos && pedido.pagamentos.length > 0) ? `
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Forma de Pagamento</th>
              <th>Status</th>
              <th style="text-align: right;">Valor</th>
            </tr>
          </thead>
          <tbody>
            ${pedido.pagamentos.map(p => `
              <tr>
                <td>${p.data || 'Não informado'}</td>
                <td>${p.forma || p.meioPagamento || 'Não informado'}</td>
                <td>
                  <span style="color: ${p.status === 'recebido' ? '#10b981' : '#f5a623'}; font-weight: 600;">
                    ${p.status === 'recebido' ? '✓ Recebido' : '⏳ Pendente'}
                  </span>
                </td>
                <td style="text-align: right;">R$ ${(p.valor || 0).toFixed(2).replace('.', ',')}</td>
              </tr>
            `).join('')}
            <tr class="total-linha">
              <td colspan="3" style="text-align: right;">Total Pago:</td>
              <td style="text-align: right;">R$ ${totalPago.toFixed(2).replace('.', ',')}</td>
            </tr>
          </tbody>
        </table>
      ` : '<p style="color: #999;">Nenhum pagamento registrado</p>'}

      ${valorPendente > 0 ? `
        <div class="destaque">
          <strong>⚠️ Valor Pendente:</strong> R$ ${valorPendente.toFixed(2).replace('.', ',')}
        </div>
      ` : valorPendente === 0 && totalPago > 0 ? `
        <div class="destaque sucesso">
          <strong>✓ Pagamento Concluído!</strong> Não há valores pendentes.
        </div>
      ` : ''}
    </div>
  </div>

  <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center; color: #999; font-size: 12px;">
    <p>Documento gerado em ${hoje()} via Mestre.IA</p>
  </div>
</body>
</html>
  `;
};

/**
 * Gera documento HTML consolidado com múltiplos pedidos
 */
export const gerarDocumentoConsolidado = (pedidos, cliente) => {
  let totalGeral = 0;
  let totalPagoGeral = 0;

  const pedidosHTML = pedidos.map(pedido => {
    const totalServicos = pedido.servicos?.reduce((acc, s) => {
      const valor = (s.valorUnitario || s.preco || 0);
      const qtd = (s.quantidade || 1);
      return acc + (valor * qtd);
    }, 0) || 0;

    const totalMateriais = pedido.materiais?.reduce((acc, m) => {
      const valor = (m.valorUnitario || m.preco || 0);
      const qtd = (m.quantidade || 1);
      return acc + (valor * qtd);
    }, 0) || 0;

    const subtotal = totalServicos + totalMateriais;
    const desconto = pedido.desconto || 0;
    const valorTotal = subtotal - desconto;

    const totalPago = pedido.pagamentos?.reduce((sum, p) => sum + (p.valor || 0), 0) || 0;

    totalGeral += valorTotal;
    totalPagoGeral += totalPago;

    const statusOpcoes = {
      aguardando: { label: 'Aguardando aprovação', cor: '#f5a623' },
      pendente: { label: 'Pendente', cor: '#f5a623' },
      aprovado: { label: 'Aprovado', cor: '#4a90e2' },
      em_andamento: { label: 'Em andamento', cor: '#6c63ff' },
      concluido: { label: 'Concluído', cor: '#10b981' },
      cancelado: { label: 'Cancelado', cor: '#f06070' }
    };

    return `
    <div class="pedido-secao">
      <div class="pedido-header">
        <h2>Pedido Nº ${pedido.numero}</h2>
        <div class="pedido-info">
          <strong>Status:</strong> ${statusOpcoes[pedido.status]?.label || pedido.status} | 
          <strong>Data:</strong> ${pedido.criadoEm || hoje()}
          ${pedido.referencia ? ` | <strong>Ref:</strong> ${pedido.referencia}` : ''}
        </div>
      </div>

      ${(pedido.servicos && pedido.servicos.length > 0) || (pedido.materiais && pedido.materiais.length > 0) ? `
        <div class="bloco">
          <div class="bloco-titulo">💰 Orçamento</div>
          <div class="bloco-conteudo">
            ${(pedido.servicos && pedido.servicos.length > 0) ? `
              <h4>Serviços</h4>
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
                  ${pedido.servicos.map(s => {
                    const valorUnit = s.valorUnitario || s.preco || 0;
                    const qtd = s.quantidade || 1;
                    return `
                    <tr>
                      <td>${s.descricao}</td>
                      <td style="text-align: center;">${qtd} ${s.unidade || ''}</td>
                      <td style="text-align: right;">R$ ${valorUnit.toFixed(2).replace('.', ',')}</td>
                      <td style="text-align: right;">R$ ${(valorUnit * qtd).toFixed(2).replace('.', ',')}</td>
                    </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            ` : ''}

            ${(pedido.materiais && pedido.materiais.length > 0) ? `
              <h4 style="margin-top: 15px;">Materiais</h4>
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
                  ${pedido.materiais.map(m => {
                    const valorUnit = m.valorUnitario || m.preco || 0;
                    const qtd = m.quantidade || 1;
                    return `
                    <tr>
                      <td>${m.descricao}</td>
                      <td style="text-align: center;">${qtd}</td>
                      <td style="text-align: right;">R$ ${valorUnit.toFixed(2).replace('.', ',')}</td>
                      <td style="text-align: right;">R$ ${(valorUnit * qtd).toFixed(2).replace('.', ',')}</td>
                    </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            ` : ''}

            <div class="valor-pedido">
              Valor do Pedido: <strong>R$ ${valorTotal.toFixed(2).replace('.', ',')}</strong>
              ${totalPago > 0 ? ` | Pago: <strong style="color: #10b981;">R$ ${totalPago.toFixed(2).replace('.', ',')}</strong>` : ''}
            </div>
          </div>
        </div>
      ` : ''}
    </div>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Pedidos - ${cliente.nome}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 40px;
      color: #333;
      background: white;
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #6c63ff;
    }
    .logo h1 {
      font-size: 32px;
      color: #6c63ff;
      margin-bottom: 5px;
    }
    .logo p {
      color: #666;
      font-size: 14px;
    }
    .cliente-header {
      margin-bottom: 30px;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .cliente-header h2 {
      font-size: 24px;
      color: #333;
      margin-bottom: 10px;
    }
    .pedido-secao {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    .pedido-header {
      background: linear-gradient(135deg, #6c63ff 0%, #5851ea 100%);
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      margin-bottom: 0;
    }
    .pedido-header h2 {
      font-size: 20px;
      margin-bottom: 8px;
    }
    .pedido-info {
      font-size: 14px;
      opacity: 0.95;
    }
    .bloco {
      border: 2px solid #e0e0e0;
      border-top: none;
      border-radius: 0 0 8px 8px;
      overflow: hidden;
    }
    .bloco-titulo {
      background: #f5f5f5;
      color: #333;
      padding: 12px 20px;
      font-size: 16px;
      font-weight: 600;
      border-bottom: 2px solid #e0e0e0;
    }
    .bloco-conteudo {
      padding: 20px;
    }
    h4 {
      color: #666;
      font-size: 15px;
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    th {
      background: #f5f5f5;
      padding: 8px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #ddd;
      font-size: 13px;
    }
    td {
      padding: 8px;
      border-bottom: 1px solid #eee;
      font-size: 13px;
    }
    .valor-pedido {
      margin-top: 15px;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 6px;
      text-align: right;
      font-size: 15px;
    }
    .totalizador-geral {
      margin-top: 40px;
      padding: 30px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border-radius: 12px;
      text-align: center;
    }
    .totalizador-geral h3 {
      font-size: 20px;
      margin-bottom: 20px;
    }
    .totalizador-linha {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 18px;
    }
    .totalizador-linha:last-child {
      border-top: 2px solid rgba(255,255,255,0.3);
      padding-top: 15px;
      margin-top: 10px;
      font-size: 24px;
      font-weight: bold;
    }
    @media print {
      body { padding: 20px; }
      .pedido-secao { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="logo">
    <h1>⚡ Mestre.IA</h1>
    <p>Gestão Inteligente de Serviços</p>
  </div>

  <div class="cliente-header">
    <h2>Relatório de Pedidos - ${cliente.nome}</h2>
    <p style="color: #666; margin-top: 8px;">
      Total de pedidos: <strong>${pedidos.length}</strong> | 
      Data de emissão: <strong>${hoje()}</strong>
    </p>
  </div>

  ${pedidosHTML}

  <div class="totalizador-geral">
    <h3>📊 Totalizador Geral</h3>
    <div class="totalizador-linha">
      <span>Total de Pedidos:</span>
      <strong>R$ ${totalGeral.toFixed(2).replace('.', ',')}</strong>
    </div>
    <div class="totalizador-linha">
      <span>Total Pago:</span>
      <strong>R$ ${totalPagoGeral.toFixed(2).replace('.', ',')}</strong>
    </div>
    <div class="totalizador-linha">
      <span>Saldo Pendente:</span>
      <strong>R$ ${(totalGeral - totalPagoGeral).toFixed(2).replace('.', ',')}</strong>
    </div>
  </div>

  <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center; color: #999; font-size: 12px;">
    <p>Documento gerado em ${hoje()} via Mestre.IA</p>
  </div>
</body>
</html>
  `;
};
