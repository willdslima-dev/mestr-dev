/**
 * CustoRepository
 * Gerencia persistência de custos no localStorage
 */
export class CustoRepository {
  constructor() {
    this.storageKey = 'oc_custos';
  }

  /**
   * Busca todos os custos
   */
  findAll() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar custos:', error);
      return [];
    }
  }

  /**
   * Busca custos por pedido
   */
  findByPedido(pedidoId) {
    const all = this.findAll();
    return all.filter(custo => custo.pedidoId === pedidoId);
  }

  /**
   * Busca custos por categoria
   */
  findByCategoria(categoria) {
    const all = this.findAll();
    return all.filter(custo => custo.categoria === categoria);
  }

  /**
   * Adiciona um novo custo
   */
  create(custoData) {
    const all = this.findAll();
    const id = custoData.id || `cst_${Date.now()}`;
    const custo = { ...custoData, id };
    
    all.push(custo);
    this.saveAll(all);
    
    return custo;
  }

  /**
   * Atualiza um custo
   */
  update(id, custoData) {
    const all = this.findAll();
    const index = all.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error('Custo não encontrado');
    }
    
    all[index] = { ...all[index], ...custoData, id };
    this.saveAll(all);
    
    return all[index];
  }

  /**
   * Remove um custo
   */
  delete(id) {
    const all = this.findAll();
    const filtered = all.filter(c => c.id !== id);
    this.saveAll(filtered);
    return true;
  }

  /**
   * Salva todos os custos
   */
  saveAll(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erro ao salvar custos:', error);
      return false;
    }
  }

  /**
   * Calcula total de custos por pedido
   */
  calcularTotalPorPedido(pedidoId) {
    const custos = this.findByPedido(pedidoId);
    return custos.reduce((sum, custo) => sum + (custo.valor || 0), 0);
  }

  /**
   * Calcula total de custos por categoria
   */
  calcularTotalPorCategoria() {
    const all = this.findAll();
    const totais = {};
    
    all.forEach(custo => {
      const cat = custo.categoria || 'outro';
      totais[cat] = (totais[cat] || 0) + (custo.valor || 0);
    });
    
    return totais;
  }
}
