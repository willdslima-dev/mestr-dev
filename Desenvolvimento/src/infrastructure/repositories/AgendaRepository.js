/**
 * AgendaRepository
 * Gerencia persistência de compromissos/agenda no localStorage
 */
export class AgendaRepository {
  constructor() {
    this.storageKey = 'oc_agenda';
  }

  /**
   * Busca todos os compromissos
   */
  findAll() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar agenda:', error);
      return [];
    }
  }

  /**
   * Busca compromissos por data
   */
  findByData(data) {
    const all = this.findAll();
    return all.filter(item => item.data === data);
  }

  /**
   * Busca compromissos por cliente
   */
  findByCliente(clienteId) {
    const all = this.findAll();
    return all.filter(item => item.clienteId === clienteId);
  }

  /**
   * Busca compromissos por pedido
   */
  findByPedido(pedidoId) {
    const all = this.findAll();
    return all.filter(item => item.pedidoId === pedidoId);
  }

  /**
   * Busca compromissos de hoje
   */
  findHoje() {
    const hoje = new Date().toISOString().split('T')[0];
    return this.findByData(hoje);
  }

  /**
   * Adiciona um novo compromisso
   */
  create(agendaData) {
    const all = this.findAll();
    const id = agendaData.id || `agd_${Date.now()}`;
    const agenda = { ...agendaData, id };
    
    all.push(agenda);
    this.saveAll(all);
    
    return agenda;
  }

  /**
   * Atualiza um compromisso
   */
  update(id, agendaData) {
    const all = this.findAll();
    const index = all.findIndex(a => a.id === id);
    
    if (index === -1) {
      throw new Error('Compromisso não encontrado');
    }
    
    all[index] = { ...all[index], ...agendaData, id };
    this.saveAll(all);
    
    return all[index];
  }

  /**
   * Remove um compromisso
   */
  delete(id) {
    const all = this.findAll();
    const filtered = all.filter(a => a.id !== id);
    this.saveAll(filtered);
    return true;
  }

  /**
   * Salva todos os compromissos
   */
  saveAll(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erro ao salvar agenda:', error);
      return false;
    }
  }

  /**
   * Lista compromissos ordenados por data
   */
  listOrdenado() {
    const all = this.findAll();
    return all.sort((a, b) => {
      const dataA = new Date(a.data + ' ' + (a.horaInicio || '00:00'));
      const dataB = new Date(b.data + ' ' + (b.horaInicio || '00:00'));
      return dataA - dataB;
    });
  }
}
