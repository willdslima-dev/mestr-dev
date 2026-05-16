/**
 * Formatters - Funções de formatação reutilizáveis
 */

/**
 * Formata valor monetário em Real (R$)
 */
export function formatarMoeda(valor) {
  const numero = parseFloat(valor) || 0;
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

/**
 * Formata número com separadores de milhar
 */
export function formatarNumero(valor, casasDecimais = 2) {
  const numero = parseFloat(valor) || 0;
  return numero.toLocaleString('pt-BR', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais
  });
}

/**
 * Formata CPF (000.000.000-00)
 */
export function formatarCPF(cpf) {
  if (!cpf) return '';
  
  const numeros = cpf.replace(/\D/g, '');
  
  if (numeros.length !== 11) return cpf;
  
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CNPJ (00.000.000/0000-00)
 */
export function formatarCNPJ(cnpj) {
  if (!cnpj) return '';
  
  const numeros = cnpj.replace(/\D/g, '');
  
  if (numeros.length !== 14) return cnpj;
  
  return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata CPF ou CNPJ automaticamente
 */
export function formatarCpfCnpj(valor) {
  if (!valor) return '';
  
  const numeros = valor.replace(/\D/g, '');
  
  if (numeros.length === 11) {
    return formatarCPF(numeros);
  } else if (numeros.length === 14) {
    return formatarCNPJ(numeros);
  }
  
  return valor;
}

/**
 * Formata telefone brasileiro
 */
export function formatarTelefone(telefone) {
  if (!telefone) return '';
  
  const numeros = telefone.replace(/\D/g, '');
  
  if (numeros.length === 11) {
    // Celular com 9 dígitos
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numeros.length === 10) {
    // Fixo ou celular sem 9
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return telefone;
}

/**
 * Formata CEP (00000-000)
 */
export function formatarCEP(cep) {
  if (!cep) return '';
  
  const numeros = cep.replace(/\D/g, '');
  
  if (numeros.length === 8) {
    return numeros.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
  
  return cep;
}

/**
 * Formata data no formato brasileiro (dd/mm/aaaa)
 */
export function formatarData(data) {
  if (!data) return '';
  
  const date = new Date(data);
  
  if (isNaN(date.getTime())) return data;
  
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  
  return `${dia}/${mes}/${ano}`;
}

/**
 * Formata data e hora no formato brasileiro (dd/mm/aaaa HH:mm)
 */
export function formatarDataHora(data) {
  if (!data) return '';
  
  const date = new Date(data);
  
  if (isNaN(date.getTime())) return data;
  
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  const hora = String(date.getHours()).padStart(2, '0');
  const minuto = String(date.getMinutes()).padStart(2, '0');
  
  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

/**
 * Formata hora (HH:mm)
 */
export function formatarHora(hora) {
  if (!hora) return '';
  
  // Se já está no formato correto
  if (/^\d{2}:\d{2}$/.test(hora)) return hora;
  
  // Remove caracteres não numéricos
  const numeros = hora.replace(/\D/g, '');
  
  if (numeros.length >= 4) {
    return numeros.substring(0, 2) + ':' + numeros.substring(2, 4);
  }
  
  return hora;
}

/**
 * Formata porcentagem
 */
export function formatarPorcentagem(valor, casasDecimais = 2) {
  const numero = parseFloat(valor) || 0;
  return numero.toFixed(casasDecimais) + '%';
}

/**
 * Trunca texto com reticências
 */
export function truncarTexto(texto, maxLength = 50) {
  if (!texto || texto.length <= maxLength) return texto;
  
  return texto.substring(0, maxLength) + '...';
}

/**
 * Capitaliza primeira letra
 */
export function capitalize(texto) {
  if (!texto) return '';
  
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

/**
 * Capitaliza cada palavra
 */
export function capitalizarPalavras(texto) {
  if (!texto) return '';
  
  return texto
    .split(' ')
    .map(palavra => capitalize(palavra))
    .join(' ');
}

/**
 * Remove acentos de texto
 */
export function removerAcentos(texto) {
  if (!texto) return '';
  
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Gera slug a partir de texto
 */
export function gerarSlug(texto) {
  if (!texto) return '';
  
  return removerAcentos(texto)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
