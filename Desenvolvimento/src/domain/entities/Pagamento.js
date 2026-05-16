/**
 * Entidade Pagamento - Domain Model
 * Representa um pagamento recebido de um pedido
 */
export class Pagamento {
  constructor({
    id,
    pedidoId,
    clienteId,
    valor,
    data = new Date().toISOString(),
    formaPagamento = '', // dinheiro, pix, cartao, transferencia
    comprovante = '',
    observacoes = ''
  }) {
    this.id = id;
    this.pedidoId = pedidoId;
    this.clienteId = clienteId;
    this.valor = valor;
    this.data = data;
    this.formaPagamento = formaPagamento;
    this.comprovante = comprovante;
    this.observacoes = observacoes;
  }

  /**
   * Valida se os dados são válidos
   */
  isValid() {
    return (
      this.pedidoId &&
      this.clienteId &&
      this.valor > 0 &&
      this.data
    );
  }

  /**
   * Retorna forma de pagamento formatada
   */
  getFormaPagamentoFormatada() {
    const formas = {
      dinheiro: 'Dinheiro',
      pix: 'PIX',
      cartao: 'Cartão',
      transferencia: 'Transferência',
      boleto: 'Boleto'
    };
    return formas[this.formaPagamento] || this.formaPagamento;
  }

  /**
   * Converte para objeto simples
   */
  toJSON() {
    return {
      id: this.id,
      pedidoId: this.pedidoId,
      clienteId: this.clienteId,
      valor: this.valor,
      data: this.data,
      formaPagamento: this.formaPagamento,
      comprovante: this.comprovante,
      observacoes: this.observacoes
    };
  }

  /**
   * Cria instância a partir de objeto simples
   */
  static fromJSON(data) {
    return new Pagamento(data);
  }
}
