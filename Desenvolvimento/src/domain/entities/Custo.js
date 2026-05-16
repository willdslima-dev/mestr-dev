/**
 * Entidade Custo - Domain Model
 * Representa um custo associado a um pedido
 */
export class Custo {
  constructor({
    id,
    pedidoId,
    descricao,
    valor,
    data = new Date().toISOString(),
    categoria = '', // material, mao_de_obra, transporte, ferramenta, outro
    comprovante = '',
    observacoes = ''
  }) {
    this.id = id;
    this.pedidoId = pedidoId;
    this.descricao = descricao;
    this.valor = valor;
    this.data = data;
    this.categoria = categoria;
    this.comprovante = comprovante;
    this.observacoes = observacoes;
  }

  /**
   * Valida se os dados são válidos
   */
  isValid() {
    return (
      this.pedidoId &&
      this.descricao &&
      this.descricao.trim().length > 0 &&
      this.valor > 0 &&
      this.data
    );
  }

  /**
   * Retorna categoria formatada
   */
  getCategoriaFormatada() {
    const categorias = {
      material: 'Material',
      mao_de_obra: 'Mão de Obra',
      transporte: 'Transporte',
      ferramenta: 'Ferramenta',
      outro: 'Outro'
    };
    return categorias[this.categoria] || this.categoria;
  }

  /**
   * Converte para objeto simples
   */
  toJSON() {
    return {
      id: this.id,
      pedidoId: this.pedidoId,
      descricao: this.descricao,
      valor: this.valor,
      data: this.data,
      categoria: this.categoria,
      comprovante: this.comprovante,
      observacoes: this.observacoes
    };
  }

  /**
   * Cria instância a partir de objeto simples
   */
  static fromJSON(data) {
    return new Custo(data);
  }
}
