/**
 * Entidade Cliente - Domain Model
 * Representa um cliente no sistema (pessoa física ou jurídica)
 */
export class Cliente {
  constructor({
    id,
    nome,
    tipo = 'pf', // 'pf' ou 'pj'
    cpfCnpj = '',
    telefone = '',
    email = '',
    endereco = '',
    cidade = '',
    estado = '',
    cep = '',
    observacoes = '',
    dataCadastro = new Date().toISOString()
  }) {
    this.id = id;
    this.nome = nome;
    this.tipo = tipo;
    this.cpfCnpj = cpfCnpj;
    this.telefone = telefone;
    this.email = email;
    this.endereco = endereco;
    this.cidade = cidade;
    this.estado = estado;
    this.cep = cep;
    this.observacoes = observacoes;
    this.dataCadastro = dataCadastro;
  }

  /**
   * Retorna nome formatado com título (Sr./Sra.)
   */
  getNomeCompleto() {
    return this.nome;
  }

  /**
   * Valida se os dados obrigatórios estão preenchidos
   */
  isValid() {
    return this.nome && this.nome.trim().length > 0;
  }

  /**
   * Retorna tipo formatado
   */
  getTipoFormatado() {
    return this.tipo === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica';
  }

  /**
   * Converte para objeto simples (para persistência)
   */
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      tipo: this.tipo,
      cpfCnpj: this.cpfCnpj,
      telefone: this.telefone,
      email: this.email,
      endereco: this.endereco,
      cidade: this.cidade,
      estado: this.estado,
      cep: this.cep,
      observacoes: this.observacoes,
      dataCadastro: this.dataCadastro
    };
  }

  /**
   * Cria instância a partir de objeto simples
   */
  static fromJSON(data) {
    return new Cliente(data);
  }
}
