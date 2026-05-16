// Catálogo de serviços/produtos

export const CAT = {
  'disjuntor': { nome: 'Disjuntor', un: 'un', preco: 50, precisaMedida: false },
  'tomada': { nome: 'Tomada', un: 'un', preco: 40, precisaMedida: false },
  'interruptor': { nome: 'Interruptor', un: 'un', preco: 35, precisaMedida: false },
  'chuveiro': { nome: 'Chuveiro', un: 'un', preco: 80, precisaMedida: false },
  'ventilador': { nome: 'Ventilador de teto', un: 'un', preco: 120, precisaMedida: false },
  'sanca': { nome: 'Sanca de gesso com LED', un: 'm', preco: 120, precisaMedida: true },
  'spot': { nome: 'Spot embutido', un: 'un', preco: 30, precisaMedida: false },
  'trilho': { nome: 'Trilho de LED', un: 'm', preco: 150, precisaMedida: true },
  'led': { nome: 'Barra de LED', un: 'm', preco: 80, precisaMedida: true },
  'camera': { nome: 'Câmera de segurança', un: 'un', preco: 200, precisaMedida: false },
  'câmera': { nome: 'Câmera de segurança', un: 'un', preco: 200, precisaMedida: false },
  'sensor': { nome: 'Sensor de presença', un: 'un', preco: 80, precisaMedida: false },
  'campainha': { nome: 'Campainha', un: 'un', preco: 60, precisaMedida: false },
  'quadro': { nome: 'Quadro de distribuição', un: 'un', preco: 300, precisaMedida: false },
  'eletroduto': { nome: 'Eletroduto', un: 'm', preco: 15, precisaMedida: true },
  'fio': { nome: 'Fio', un: 'm', preco: 5, precisaMedida: true },
  'cabo': { nome: 'Cabo', un: 'm', preco: 8, precisaMedida: true },
  'split': { nome: 'Ar condicionado split', un: 'un', preco: 400, precisaMedida: false },
  'espelho': { nome: 'Espelho de tomada', un: 'un', preco: 15, precisaMedida: false },
  'canaleta': { nome: 'Canaleta', un: 'm', preco: 20, precisaMedida: true }
};

export const CAT_KEYS = Object.keys(CAT).sort((a, b) => b.length - a.length);

export function buscarCat(texto) {
  const txtNorm = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  for (let chave of CAT_KEYS) {
    if (txtNorm.includes(chave)) {
      return { chave, ...CAT[chave] };
    }
  }
  
  return null;
}

export function getPrecoEfetivo(chave) {
  try {
    const precos = JSON.parse(localStorage.getItem('oc_precos') || '{}');
    return precos[chave] || CAT[chave]?.preco || 0;
  } catch {
    return CAT[chave]?.preco || 0;
  }
}
