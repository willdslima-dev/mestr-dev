/**
 * Entidade Material - Domain Model
 * Representa um material usado em um pedido
 */
export class Material {
  constructor({
    id,
    nome,
    quantidade,
    unidade = 'un',
    valorUnitario,
    fornecedor = '',
    observacoes = ''
  }) {
    this.id = id;
    this.nome = nome;
    this.quantidade = quantidade;
    this.unidade = unidade;
    this.valorUnitario = valorUnitario;
    this.fornecedor = fornecedor;
    this.observacoes = observacoes;
  }

  /**
   * Calcula o total do material
   */
  getTotal() {
    return this.valorUnitario * this.quantidade;
  }

  /**
   * Valida se os dados são válidos
   */
  isValid() {
    return (
      this.nome && 
      this.nome.trim().length > 0 &&
      this.valorUnitario >= 0 &&
      this.quantidade > 0
    );
  }

  /**
   * Converte para objeto simples
   */
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      quantidade: this.quantidade,
      unidade: this.unidade,
      valorUnitario: this.valorUnitario,
      fornecedor: this.fornecedor,
      observacoes: this.observacoes,
      total: this.getTotal()
    };
  }

  /**
   * Cria instância a partir de objeto simples
   */
  static fromJSON(data) {
    return new Material(data);
  }
}
