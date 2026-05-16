/**
 * Validators - Funções de validação reutilizáveis
 */

/**
 * Valida CPF
 */
export function validarCPF(cpf) {
  if (!cpf) return false;
  
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');
  
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  // Validação dos dígitos verificadores
  let soma = 0;
  let resto;
  
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
}

/**
 * Valida CNPJ
 */
export function validarCNPJ(cnpj) {
  if (!cnpj) return false;
  
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/\D/g, '');
  
  if (cnpj.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpj)) return false;
  
  // Validação dos dígitos verificadores
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;
  
  return true;
}

/**
 * Valida email
 */
export function validarEmail(email) {
  if (!email) return false;
  
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida telefone brasileiro
 */
export function validarTelefone(telefone) {
  if (!telefone) return false;
  
  // Remove caracteres não numéricos
  const numeros = telefone.replace(/\D/g, '');
  
  // Aceita 10 ou 11 dígitos (com ou sem 9 no celular)
  return numeros.length === 10 || numeros.length === 11;
}

/**
 * Valida CEP
 */
export function validarCEP(cep) {
  if (!cep) return false;
  
  // Remove caracteres não numéricos
  const numeros = cep.replace(/\D/g, '');
  
  return numeros.length === 8;
}

/**
 * Valida se é um número positivo
 */
export function validarNumeroPositivo(valor) {
  const numero = parseFloat(valor);
  return !isNaN(numero) && numero > 0;
}

/**
 * Valida se é uma data válida
 */
export function validarData(data) {
  if (!data) return false;
  
  const date = new Date(data);
  return date instanceof Date && !isNaN(date);
}

/**
 * Valida se string não está vazia
 */
export function validarNaoVazio(texto) {
  return texto && texto.trim().length > 0;
}

/**
 * Valida campos obrigatórios de um objeto
 */
export function validarCamposObrigatorios(objeto, campos) {
  return campos.every(campo => {
    const valor = objeto[campo];
    return valor !== undefined && valor !== null && valor !== '';
  });
}
