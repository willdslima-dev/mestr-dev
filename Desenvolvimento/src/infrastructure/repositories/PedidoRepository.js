import { LocalStorageRepository } from './LocalStorageRepository';
import { Pedido } from '../../domain/entities';

/**
 * PedidoRepository
 * Gerencia persistência de pedidos/orçamentos no localStorage
 */
export class PedidoRepository extends LocalStorageRepository {
  constructor() {
    super('oc_orc');
  }

  /**
   * Busca todos os pedidos como instâncias de Pedido
   */
  findAll() {
    const data = super.findAll();
    const pedidos = {};
    
    Object.keys(data).forEach(key => {
      pedidos[key] = Pedido.fromJSON(data[key]);
    });
    
    return pedidos;
  }

  /**
   * Busca um pedido por ID
   */
  findById(id) {
    const data = super.findById(id);
    return data ? Pedido.fromJSON(data) : null;
  }

  /**
   * Busca pedidos por cliente
   */
  findByCliente(clienteId) {
    const all = this.findAll();
    
    return Object.values(all).filter(pedido => 
      pedido.clienteId === clienteId
    );
  }

  /**
   * Busca pedidos por status
   */
  findByStatus(status) {
    const all = this.findAll();
    
    return Object.values(all).filter(pedido => 
      pedido.status === status
    );
  }

  /**
   * Busca pedidos por número
   */
  findByNumero(numero) {
    const all = this.findAll();
    
    return Object.values(all).find(pedido => 
      pedido.numero === numero
    ) || null;
  }

  /**
   * Salva um pedido
   */
  save(id, pedido) {
    const data = pedido instanceof Pedido ? pedido.toJSON() : pedido;
    return super.save(id, data);
  }

  /**
   * Cria um novo pedido
   */
  create(pedidoData) {
    const id = pedidoData.id || `orc_${Date.now()}`;
    const pedido = new Pedido({ ...pedidoData, id });
    
    if (!pedido.isValid()) {
      throw new Error('Dados do pedido inválidos');
    }
    
    this.save(id, pedido);
    return pedido;
  }

  /**
   * Atualiza um pedido existente
   */
  update(id, pedidoData) {
    const pedidoExistente = this.findById(id);
    
    if (!pedidoExistente) {
      throw new Error('Pedido não encontrado');
    }
    
    const pedidoAtualizado = new Pedido({ 
      ...pedidoExistente.toJSON(), 
      ...pedidoData, 
      id 
    });
    
    if (!pedidoAtualizado.isValid()) {
      throw new Error('Dados do pedido inválidos');
    }
    
    this.save(id, pedidoAtualizado);
    return pedidoAtualizado;
  }

  /**
   * Lista pedidos ordenados por data de criação (mais recente primeiro)
   */
  listOrdenado() {
    const all = this.findAll();
    return Object.values(all).sort((a, b) => 
      new Date(b.dataCriacao) - new Date(a.dataCriacao)
    );
  }

  /**
   * Gera próximo número de pedido
   */
  gerarProximoNumero() {
    const all = this.findAll();
    const pedidos = Object.values(all);
    const ano = new Date().getFullYear();
    const pedidosDoAno = pedidos.filter(p => p.numero?.includes(ano.toString()));
    const proximoNumero = pedidosDoAno.length + 1;
    
    return `${String(proximoNumero).padStart(3, '0')}-${ano}`;
  }

  /**
   * Calcula total de pedidos por status
   */
  countByStatus() {
    const all = this.findAll();
    const pedidos = Object.values(all);
    
    return {
      aguardando: pedidos.filter(p => p.status === 'aguardando').length,
      aprovado: pedidos.filter(p => p.status === 'aprovado').length,
      em_andamento: pedidos.filter(p => p.status === 'em_andamento').length,
      concluido: pedidos.filter(p => p.status === 'concluido').length,
      cancelado: pedidos.filter(p => p.status === 'cancelado').length
    };
  }

  /**
   * Calcula valor total de todos os pedidos
   */
  calcularValorTotal() {
    const all = this.findAll();
    return Object.values(all).reduce((sum, pedido) => sum + pedido.getTotal(), 0);
  }
}
