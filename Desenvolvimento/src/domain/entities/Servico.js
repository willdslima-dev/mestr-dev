/**
 * Entidade Serviço - Domain Model
 * Representa um serviço/item em um pedido
 */
export class Servico {
  constructor({
    id,
    descricao,
    valorUnitario,
    quantidade = 1,
    unidade = 'm²',
    desconto = 0
  }) {
    this.id = id;
    this.descricao = descricao;
    this.valorUnitario = valorUnitario;
    this.quantidade = quantidade;
    this.unidade = unidade;
    this.desconto = desconto;
  }

  /**
   * Calcula o subtotal (sem desconto)
   */
  getSubtotal() {
    return this.valorUnitario * this.quantidade;
  }

  /**
   * Calcula o total com desconto
   */
  getTotal() {
    const subtotal = this.getSubtotal();
    return subtotal - this.desconto;
  }

  /**
   * Valida se os dados são válidos
   */
  isValid() {
    return (
      this.descricao && 
      this.descricao.trim().length > 0 &&
      this.valorUnitario > 0 &&
      this.quantidade > 0
    );
  }

  /**
   * Converte para objeto simples
   */
  toJSON() {
    return {
      id: this.id,
      descricao: this.descricao,
      valorUnitario: this.valorUnitario,
      quantidade: this.quantidade,
      unidade: this.unidade,
      desconto: this.desconto,
      subtotal: this.getSubtotal(),
      total: this.getTotal()
    };
  }

  /**
   * Cria instância a partir de objeto simples
   */
  static fromJSON(data) {
    return new Servico(data);
  }
}
