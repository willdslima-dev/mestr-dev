/**
 * Entidade Agenda - Domain Model
 * Representa um compromisso/evento na agenda
 */
export class Agenda {
  constructor({
    id,
    titulo,
    descricao = '',
    data,
    horaInicio = '',
    horaFim = '',
    clienteId = null,
    pedidoId = null,
    tipo = 'compromisso', // compromisso, visita, execucao, reuniao
    status = 'pendente', // pendente, confirmado, concluido, cancelado
    observacoes = ''
  }) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.data = data;
    this.horaInicio = horaInicio;
    this.horaFim = horaFim;
    this.clienteId = clienteId;
    this.pedidoId = pedidoId;
    this.tipo = tipo;
    this.status = status;
    this.observacoes = observacoes;
  }

  /**
   * Valida se os dados são válidos
   */
  isValid() {
    return (
      this.titulo &&
      this.titulo.trim().length > 0 &&
      this.data
    );
  }

  /**
   * Retorna tipo formatado
   */
  getTipoFormatado() {
    const tipos = {
      compromisso: 'Compromisso',
      visita: 'Visita',
      execucao: 'Execução',
      reuniao: 'Reunião'
    };
    return tipos[this.tipo] || this.tipo;
  }

  /**
   * Retorna status formatado
   */
  getStatusFormatado() {
    const statusMap = {
      pendente: 'Pendente',
      confirmado: 'Confirmado',
      concluido: 'Concluído',
      cancelado: 'Cancelado'
    };
    return statusMap[this.status] || this.status;
  }

  /**
   * Verifica se o compromisso é hoje
   */
  isHoje() {
    const hoje = new Date().toISOString().split('T')[0];
    return this.data === hoje;
  }

  /**
   * Verifica se o compromisso já passou
   */
  isPast() {
    const hoje = new Date().toISOString().split('T')[0];
    return this.data < hoje;
  }

  /**
   * Converte para objeto simples
   */
  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      descricao: this.descricao,
      data: this.data,
      horaInicio: this.horaInicio,
      horaFim: this.horaFim,
      clienteId: this.clienteId,
      pedidoId: this.pedidoId,
      tipo: this.tipo,
      status: this.status,
      observacoes: this.observacoes
    };
  }

  /**
   * Cria instância a partir de objeto simples
   */
  static fromJSON(data) {
    return new Agenda(data);
  }
}
