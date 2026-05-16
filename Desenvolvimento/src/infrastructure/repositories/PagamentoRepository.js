/**
 * PagamentoRepository
 * Gerencia persistência de pagamentos no localStorage
 */
export class PagamentoRepository {
  constructor() {
    this.storageKey = 'oc_pag';
  }

  /**
   * Busca todos os pagamentos
   */
  findAll() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      return [];
    }
  }

  /**
   * Busca pagamentos por pedido
   */
  findByPedido(pedidoId) {
    const all = this.findAll();
    return all.filter(pag => pag.pedidoId === pedidoId);
  }

  /**
   * Busca pagamentos por cliente
   */
  findByCliente(clienteId) {
    const all = this.findAll();
    return all.filter(pag => pag.clienteId === clienteId);
  }

  /**
   * Adiciona um novo pagamento
   */
  create(pagamentoData) {
    const all = this.findAll();
    const id = pagamentoData.id || `pag_${Date.now()}`;
    const pagamento = { ...pagamentoData, id };
    
    all.push(pagamento);
    this.saveAll(all);
    
    return pagamento;
  }

  /**
   * Atualiza um pagamento
   */
  update(id, pagamentoData) {
    const all = this.findAll();
    const index = all.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Pagamento não encontrado');
    }
    
    all[index] = { ...all[index], ...pagamentoData, id };
    this.saveAll(all);
    
    return all[index];
  }

  /**
   * Remove um pagamento
   */
  delete(id) {
    const all = this.findAll();
    const filtered = all.filter(p => p.id !== id);
    this.saveAll(filtered);
    return true;
  }

  /**
   * Salva todos os pagamentos
   */
  saveAll(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erro ao salvar pagamentos:', error);
      return false;
    }
  }

  /**
   * Calcula total pago por pedido
   */
  calcularTotalPorPedido(pedidoId) {
    const pagamentos = this.findByPedido(pedidoId);
    return pagamentos.reduce((sum, pag) => sum + (pag.valor || 0), 0);
  }

  /**
   * Calcula total pago por cliente
   */
  calcularTotalPorCliente(clienteId) {
    const pagamentos = this.findByCliente(clienteId);
    return pagamentos.reduce((sum, pag) => sum + (pag.valor || 0), 0);
  }
}
