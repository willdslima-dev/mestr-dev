import { Servico } from './Servico';
import { Material } from './Material';

/**
 * Entidade Pedido/Orçamento - Domain Model
 * Representa um pedido/orçamento completo
 */
export class Pedido {
  constructor({
    id,
    numero,
    clienteId,
    status = 'aguardando', // aguardando, aprovado, em_andamento, concluido, cancelado
    referencia = '',
    dataCriacao = new Date().toISOString(),
    validadeOrcamento = '',
    prazoExecucao = '',
    horarioInicio = '',
    horarioTermino = '',
    observacoes = '',
    servicos = [],
    materiais = [],
    desconto = 0,
    taxaEntrega = 0,
    outrasTaxas = 0,
    condicoesPagamento = '',
    meiosPagamento = '',
    garantia = '',
    clausulasContratuais = '',
    informacoesAdicionais = '',
    anotacoes = '',
    relatorio = '',
    fotos = [],
    pagamentos = [],
    custos = []
  }) {
    this.id = id;
    this.numero = numero;
    this.clienteId = clienteId;
    this.status = status;
    this.referencia = referencia;
    this.dataCriacao = dataCriacao;
    this.validadeOrcamento = validadeOrcamento;
    this.prazoExecucao = prazoExecucao;
    this.horarioInicio = horarioInicio;
    this.horarioTermino = horarioTermino;
    this.observacoes = observacoes;
    this.servicos = servicos.map(s => s instanceof Servico ? s : Servico.fromJSON(s));
    this.materiais = materiais.map(m => m instanceof Material ? m : Material.fromJSON(m));
    this.desconto = desconto;
    this.taxaEntrega = taxaEntrega;
    this.outrasTaxas = outrasTaxas;
    this.condicoesPagamento = condicoesPagamento;
    this.meiosPagamento = meiosPagamento;
    this.garantia = garantia;
    this.clausulasContratuais = clausulasContratuais;
    this.informacoesAdicionais = informacoesAdicionais;
    this.anotacoes = anotacoes;
    this.relatorio = relatorio;
    this.fotos = fotos;
    this.pagamentos = pagamentos;
    this.custos = custos;
  }

  /**
   * Calcula o subtotal dos serviços
   */
  getSubtotalServicos() {
    return this.servicos.reduce((sum, servico) => sum + servico.getTotal(), 0);
  }

  /**
   * Calcula o subtotal dos materiais
   */
  getSubtotalMateriais() {
    return this.materiais.reduce((sum, material) => sum + material.getTotal(), 0);
  }

  /**
   * Calcula o subtotal geral (serviços + materiais)
   */
  getSubtotal() {
    return this.getSubtotalServicos() + this.getSubtotalMateriais();
  }

  /**
   * Calcula o total final com descontos e taxas
   */
  getTotal() {
    const subtotal = this.getSubtotal();
    return subtotal - this.desconto + this.taxaEntrega + this.outrasTaxas;
  }

  /**
   * Calcula total pago
   */
  getTotalPago() {
    return this.pagamentos.reduce((sum, pag) => sum + (pag.valor || 0), 0);
  }

  /**
   * Calcula saldo restante
   */
  getSaldo() {
    return this.getTotal() - this.getTotalPago();
  }

  /**
   * Calcula total de custos
   */
  getTotalCustos() {
    return this.custos.reduce((sum, custo) => sum + (custo.valor || 0), 0);
  }

  /**
   * Calcula lucro (total - custos)
   */
  getLucro() {
    return this.getTotal() - this.getTotalCustos();
  }

  /**
   * Adiciona um serviço
   */
  adicionarServico(servico) {
    this.servicos.push(servico instanceof Servico ? servico : Servico.fromJSON(servico));
  }

  /**
   * Remove um serviço
   */
  removerServico(servicoId) {
    this.servicos = this.servicos.filter(s => s.id !== servicoId);
  }

  /**
   * Adiciona um material
   */
  adicionarMaterial(material) {
    this.materiais.push(material instanceof Material ? material : Material.fromJSON(material));
  }

  /**
   * Remove um material
   */
  removerMaterial(materialId) {
    this.materiais = this.materiais.filter(m => m.id !== materialId);
  }

  /**
   * Valida se o pedido é válido
   */
  isValid() {
    return (
      this.numero &&
      this.clienteId &&
      (this.servicos.length > 0 || this.materiais.length > 0)
    );
  }

  /**
   * Retorna status formatado
   */
  getStatusFormatado() {
    const statusMap = {
      aguardando: 'Aguardando',
      aprovado: 'Aprovado',
      em_andamento: 'Em Andamento',
      concluido: 'Concluído',
      cancelado: 'Cancelado'
    };
    return statusMap[this.status] || this.status;
  }

  /**
   * Converte para objeto simples
   */
  toJSON() {
    return {
      id: this.id,
      numero: this.numero,
      clienteId: this.clienteId,
      status: this.status,
      referencia: this.referencia,
      dataCriacao: this.dataCriacao,
      validadeOrcamento: this.validadeOrcamento,
      prazoExecucao: this.prazoExecucao,
      horarioInicio: this.horarioInicio,
      horarioTermino: this.horarioTermino,
      observacoes: this.observacoes,
      servicos: this.servicos.map(s => s.toJSON()),
      materiais: this.materiais.map(m => m.toJSON()),
      desconto: this.desconto,
      taxaEntrega: this.taxaEntrega,
      outrasTaxas: this.outrasTaxas,
      condicoesPagamento: this.condicoesPagamento,
      meiosPagamento: this.meiosPagamento,
      garantia: this.garantia,
      clausulasContratuais: this.clausulasContratuais,
      informacoesAdicionais: this.informacoesAdicionais,
      anotacoes: this.anotacoes,
      relatorio: this.relatorio,
      fotos: this.fotos,
      pagamentos: this.pagamentos,
      custos: this.custos,
      // Valores calculados
      subtotalServicos: this.getSubtotalServicos(),
      subtotalMateriais: this.getSubtotalMateriais(),
      subtotal: this.getSubtotal(),
      total: this.getTotal(),
      totalPago: this.getTotalPago(),
      saldo: this.getSaldo(),
      totalCustos: this.getTotalCustos(),
      lucro: this.getLucro()
    };
  }

  /**
   * Cria instância a partir de objeto simples
   */
  static fromJSON(data) {
    return new Pedido(data);
  }
}
