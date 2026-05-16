// Utilitários gerais

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const hoje = () => new Date().toISOString().split('T')[0];

export const fmt = (v) => new Intl.NumberFormat('pt-BR', { 
  style: 'currency', 
  currency: 'BRL' 
}).format(v || 0);

export const fmtD = (d) => {
  if (!d) return '—';
  const [a, m, dd] = d.split('-');
  return `${dd}/${m}/${a}`;
};

export const hora = () => new Date().toLocaleTimeString('pt-BR', { 
  hour: '2-digit', 
  minute: '2-digit' 
});

export const proprio = (s) => {
  if (!s || typeof s !== 'string') return '';
  return s.trim()
    .split(' ')
    .filter(w => w.length > 0)
    .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

export const chave = (s) => {
  if (!s || typeof s !== 'string') return '';
  return s.trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// Converte palavras numéricas para dígitos
const NUM_MAP = {
  'zero': '0', 'um': '1', 'uma': '1', 'dois': '2', 'duas': '2',
  'tres': '3', 'três': '3', 'quatro': '4', 'cinco': '5',
  'seis': '6', 'sete': '7', 'oito': '8', 'nove': '9', 'dez': '10'
};

export function normNums(txt) {
  let r = txt;
  for (let [palavra, digito] of Object.entries(NUM_MAP)) {
    const re = new RegExp(`\\b${palavra}\\b`, 'gi');
    r = r.replace(re, digito);
  }
  return r;
}

export function parsearValor(txt) {
  // Remove palavras antes do número
  const limpo = txt.replace(/\b(gastei|cobrei|vai\s+pagar|pagar|custou|valor\s+de)\s*/gi, '');
  
  const norm = normNums(limpo);
  const match = norm.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return null;
  let val = match[1].replace(',', '.');
  const num = parseFloat(val);
  
  // detecta "mil" ou "k"
  if ((/\bmil\b/i.test(txt) || /\bk\b/i.test(txt)) && num < 1000) {
    return num * 1000;
  }
  
  // detecta "dois mil", "três mil", etc
  const milhares = {
    'um': 1000, 'dois': 2000, 'duas': 2000, 'tres': 3000, 'três': 3000,
    'quatro': 4000, 'cinco': 5000, 'seis': 6000, 'sete': 7000,
    'oito': 8000, 'nove': 9000, 'dez': 10000
  };
  
  for (const [palavra, valor] of Object.entries(milhares)) {
    if (new RegExp(`\\b${palavra}\\s+mil\\b`, 'i').test(txt)) {
      return valor;
    }
  }
  
  return num;
}

export function parsearData(txt) {
  // tenta extrair data no formato dd/mm/yyyy ou yyyy-mm-dd
  const match = txt.match(/(\d{1,2})[/\-](\d{1,2})[/\-](\d{2,4})/);
  if (match) {
    // eslint-disable-next-line no-unused-vars
    const [_, d, m, a] = match;
    const ano = a.length === 2 ? '20' + a : a;
    return `${ano}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  
  // palavras-chave
  if (/\bhoje\b/i.test(txt)) return hoje();
  if (/\bontem\b/i.test(txt)) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }
  
  return null;
}
