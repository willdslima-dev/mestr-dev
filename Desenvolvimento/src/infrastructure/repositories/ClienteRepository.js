import { LocalStorageRepository } from './LocalStorageRepository';
import { Cliente } from '../../domain/entities';

/**
 * ClienteRepository
 * Gerencia persistência de clientes no localStorage
 */
export class ClienteRepository extends LocalStorageRepository {
  constructor() {
    super('oc_cli');
  }

  /**
   * Busca todos os clientes como instâncias de Cliente
   */
  findAll() {
    const data = super.findAll();
    const clientes = {};
    
    Object.keys(data).forEach(key => {
      if (data[key].nome && data[key].nome.trim() !== '') {
        clientes[key] = Cliente.fromJSON(data[key]);
      }
    });
    
    return clientes;
  }

  /**
   * Busca um cliente por ID
   */
  findById(id) {
    const data = super.findById(id);
    return data ? Cliente.fromJSON(data) : null;
  }

  /**
   * Busca clientes por nome (busca parcial)
   */
  findByNome(nome) {
    const all = this.findAll();
    const nomeLower = nome.toLowerCase();
    
    return Object.values(all).filter(cliente => 
      cliente.nome.toLowerCase().includes(nomeLower)
    );
  }

  /**
   * Busca cliente por CPF/CNPJ
   */
  findByCpfCnpj(cpfCnpj) {
    const all = this.findAll();
    
    return Object.values(all).find(cliente => 
      cliente.cpfCnpj === cpfCnpj
    ) || null;
  }

  /**
   * Salva um cliente
   */
  save(id, cliente) {
    const data = cliente instanceof Cliente ? cliente.toJSON() : cliente;
    return super.save(id, data);
  }

  /**
   * Cria um novo cliente
   */
  create(clienteData) {
    const id = clienteData.id || `cli_${Date.now()}`;
    const cliente = new Cliente({ ...clienteData, id });
    
    if (!cliente.isValid()) {
      throw new Error('Dados do cliente inválidos');
    }
    
    this.save(id, cliente);
    return cliente;
  }

  /**
   * Atualiza um cliente existente
   */
  update(id, clienteData) {
    const clienteExistente = this.findById(id);
    
    if (!clienteExistente) {
      throw new Error('Cliente não encontrado');
    }
    
    const clienteAtualizado = new Cliente({ ...clienteExistente, ...clienteData, id });
    
    if (!clienteAtualizado.isValid()) {
      throw new Error('Dados do cliente inválidos');
    }
    
    this.save(id, clienteAtualizado);
    return clienteAtualizado;
  }

  /**
   * Lista clientes ordenados por nome
   */
  listOrdenado() {
    const all = this.findAll();
    return Object.values(all).sort((a, b) => 
      a.nome.localeCompare(b.nome)
    );
  }

  /**
   * Filtra clientes por tipo (pf/pj)
   */
  findByTipo(tipo) {
    const all = this.findAll();
    return Object.values(all).filter(cliente => cliente.tipo === tipo);
  }
}
