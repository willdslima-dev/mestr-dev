/** Status que entram no total pago / faturamento */
export function statusContaComoPago(status) {
  const s = (status || '').toLowerCase();
  return s === 'recebido' || s === 'pago';
}

/** Valor total do pedido (serviços + materiais − desconto + taxas) */
export function calcularValorPedido(pedido) {
  if (!pedido) return 0;
  const totalServicos = (pedido.servicos || []).reduce(
    (acc, s) => acc + ((s.valorUnitario || 0) * (s.quantidade || 1)),
    0
  );
  const totalMateriais = (pedido.materiais || []).reduce(
    (acc, m) => acc + ((m.valorUnitario || 0) * (m.quantidade || 1)),
    0
  );
  const subtotal = totalServicos + totalMateriais;
  const desconto = parseFloat(pedido.desconto) || 0;
  const taxa = parseFloat(pedido.taxaEntrega) || 0;
  const outras = parseFloat(pedido.outrasTaxas) || 0;
  return subtotal - desconto + taxa + outras;
}

/** Total já recebido no pedido (embedded + PAG global, sem duplicar id) */
export function getTotalPagoPedido(pedido, PAG = {}) {
  if (!pedido) return 0;
  const ids = new Set();
  let sum = 0;

  (pedido.pagamentos || []).forEach((p) => {
    if (statusContaComoPago(p.status)) {
      ids.add(p.id);
      sum += parseFloat(p.valor) || 0;
    }
  });

  Object.values(PAG || {}).forEach((p) => {
    if (
      p.pedidoId === pedido.id &&
      statusContaComoPago(p.status) &&
      !ids.has(p.id)
    ) {
      sum += parseFloat(p.valor) || 0;
    }
  });

  return sum;
}

export function getPedidosDoCliente(ORC, clienteId) {
  return Object.values(ORC || {})
    .filter((p) => p.clienteId === clienteId)
    .sort((a, b) => (b.numero || 0) - (a.numero || 0));
}

export function getRecebimentosCliente(PAG, clienteId, ORC = {}) {
  return Object.values(PAG || {})
    .filter((p) => p.clienteId === clienteId)
    .map((p) => ({
      ...p,
      pedidoNumero:
        p.pedidoNumero ||
        (p.pedidoId && ORC[p.pedidoId] ? ORC[p.pedidoId].numero : null)
    }))
    .sort(
      (a, b) =>
        new Date(b.dataRecebimento || 0) - new Date(a.dataRecebimento || 0)
    );
}

/** Vincula recebimento ao pedido em ORC.pagamentos[] */
export function syncPagamentoComPedido(pagamento, ORC, setORC) {
  if (!pagamento?.pedidoId || !ORC || !setORC) return;
  const pedido = ORC[pagamento.pedidoId];
  if (!pedido) return;

  const pagamentoPedido = {
    ...pagamento,
    pedidoNumero: pedido.numero
  };

  const pagamentos = [...(pedido.pagamentos || [])];
  const idx = pagamentos.findIndex((p) => p.id === pagamento.id);
  if (idx >= 0) {
    pagamentos[idx] = pagamentoPedido;
  } else {
    pagamentos.push(pagamentoPedido);
  }

  setORC({
    ...ORC,
    [pagamento.pedidoId]: {
      ...pedido,
      pagamentos
    }
  });
}

/** Remove recebimento do pedido */
export function removerPagamentoDoPedido(pagamentoId, pedidoId, ORC, setORC) {
  if (!pedidoId || !ORC || !setORC) return;
  const pedido = ORC[pedidoId];
  if (!pedido) return;

  setORC({
    ...ORC,
    [pedidoId]: {
      ...pedido,
      pagamentos: (pedido.pagamentos || []).filter((p) => p.id !== pagamentoId)
    }
  });
}

/** Após salvar em PAG: atualiza ou remove do pedido conforme status */
export function aplicarPagamentoNoPedido(pagamento, pagamentoAnterior, ORC, setORC) {
  if (!setORC || !ORC) return;

  if (
    pagamentoAnterior?.pedidoId &&
    pagamentoAnterior.pedidoId !== pagamento.pedidoId
  ) {
    removerPagamentoDoPedido(
      pagamento.id,
      pagamentoAnterior.pedidoId,
      ORC,
      setORC
    );
  }

  if (pagamento.pedidoId && statusContaComoPago(pagamento.status)) {
    syncPagamentoComPedido(pagamento, ORC, setORC);
  } else if (pagamentoAnterior?.pedidoId) {
    removerPagamentoDoPedido(
      pagamento.id,
      pagamentoAnterior.pedidoId,
      ORC,
      setORC
    );
  }
}
