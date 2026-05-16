/**
 * LocalStorageRepository - Base Repository
 * Classe base para repositórios que usam localStorage
 */
export class LocalStorageRepository {
  constructor(storageKey) {
    this.storageKey = storageKey;
  }

  /**
   * Busca todos os registros
   */
  findAll() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error(`Erro ao buscar ${this.storageKey}:`, error);
      return {};
    }
  }

  /**
   * Busca um registro por ID
   */
  findById(id) {
    const all = this.findAll();
    return all[id] || null;
  }

  /**
   * Salva um registro
   */
  save(id, data) {
    try {
      const all = this.findAll();
      all[id] = data;
      localStorage.setItem(this.storageKey, JSON.stringify(all));
      return true;
    } catch (error) {
      console.error(`Erro ao salvar ${this.storageKey}:`, error);
      return false;
    }
  }

  /**
   * Salva todos os registros
   */
  saveAll(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Erro ao salvar todos ${this.storageKey}:`, error);
      return false;
    }
  }

  /**
   * Remove um registro
   */
  delete(id) {
    try {
      const all = this.findAll();
      delete all[id];
      localStorage.setItem(this.storageKey, JSON.stringify(all));
      return true;
    } catch (error) {
      console.error(`Erro ao deletar ${this.storageKey}:`, error);
      return false;
    }
  }

  /**
   * Limpa todos os registros
   */
  clear() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error(`Erro ao limpar ${this.storageKey}:`, error);
      return false;
    }
  }

  /**
   * Conta total de registros
   */
  count() {
    const all = this.findAll();
    return Object.keys(all).length;
  }

  /**
   * Verifica se existe um registro
   */
  exists(id) {
    return this.findById(id) !== null;
  }
}
