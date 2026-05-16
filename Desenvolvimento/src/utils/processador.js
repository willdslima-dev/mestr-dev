import { buscarCat, getPrecoEfetivo } from './catalogo';
import { chave, proprio, parsearValor, parsearData, uid, hoje } from './helpers';

// ═══════════════════════════════════════
// EXTRAÇÃO DE ENTIDADES
// ═══════════════════════════════════════

const STOP_NAMES = [
  'quanto', 'pendente', 'faturamento', 'orcamento', 'orçamento', 
  'pagamento', 'novo', 'listar', 'ajuda', 'hoje', 'ontem', 
  'dia', 'valor', 'registrar', 'ver', 'mostrar', 'gerar', 
  'nota', 'nf', 'saldo', 'historico', 'relatorio', 'todos', 
  'cliente', 'precisa', 'preciso', 'quero', 'adicionar', 
  'incluir', 'remover', 'tirar', 'estou', 'fazendo', 'vou',
  'fazer', 'fiz', 'tou', 'pro', 'pra', 'para', 'uma', 'um',
  'ele', 'ela', 'vai', 'pagar', 'gastei', 'cobrei'
];

export function extrairNome(txt) {
  if (!txt || typeof txt !== 'string') return null;
  
  // Remove padrões comuns antes do nome
  let limpo = txt
    .replace(/\b(estou|tou|tô)\s+(fazendo|vai fazer|fiz)\s+(para|pra|pro)\s+/gi, '')
    .replace(/\b(vou fazer|fazer)\s+(para|pra|pro)\s+/gi, '')
    .replace(/\b(para|pra|pro)\s+(o|a)?\s*/gi, '')
    .replace(/\b(do|da)\s+/gi, '');
  
  const palavras = limpo.split(/\s+/).filter(w => w && w.length > 2);
  const nomes = palavras.filter(p => {
    const k = chave(p);
    return k && !STOP_NAMES.includes(k) && !/^\d+$/.test(p);
  });
  
  if (nomes.length === 0) return null;
  
  // Pega as 2 primeiras palavras que parecem nome
  return proprio(nomes.slice(0, 2).join(' '));
}

export function extrairEndereco(txt) {
  const match = txt.match(/\b(rua|av|avenida|travessa|alameda)\s+[a-záàâãéêíóôõúç\s,]+\d+/i);
  return match ? match[0] : null;
}

export function extrairTelefone(txt) {
  const match = txt.match(/\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}/);
  return match ? match[0] : null;
}

// ═══════════════════════════════════════
// PARSER DE SERVIÇOS
// ═══════════════════════════════════════

export function parsearServicos(txt) {
  const segmentos = dividirSegmentos(txt);
  const itens = [];
  
  for (let seg of segmentos) {
    const item = parsearSegmento(seg);
    if (item) itens.push(item);
  }
  
  return itens;
}

function dividirSegmentos(txt) {
  // Divide por vírgula, "e", "mais"
  return txt.split(/[,;]|\s+e\s+|\s+mais\s+/i)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function parsearSegmento(seg) {
  const catItem = buscarCat(seg);
  if (!catItem) return null;
  
  // Tenta extrair quantidade
  const qtdMatch = seg.match(/(\d+)\s*x?/i);
  const qtd = qtdMatch ? parseInt(qtdMatch[1]) : 1;
  
  // Tenta extrair preço explícito
  const precoExplicito = parsearValor(seg);
  
  return {
    nome: catItem.nome,
    qtd,
    preco: precoExplicito || getPrecoEfetivo(catItem.chave),
    un: catItem.un,
    precisaMedida: catItem.precisaMedida
  };
}

// ═══════════════════════════════════════
// INTENÇÃO
// ═══════════════════════════════════════

export function detectarIntencao(txt) {
  const t = txt.toLowerCase();
  
  // Criar novo pedido/serviço - linguagem informal
  if (/\b(estou|tou|tô)\s+(fazendo|vai fazer)\s+(para|pra|pro)\b/i.test(t)) {
    return 'CRIAR';
  }
  
  if (/\b(fiz|fez)\s+(para|pra|pro|do|da)\b/i.test(t)) {
    return 'CRIAR';
  }
  
  // Criar novo orçamento - formal
  if (/\b(novo|criar|fazer|gerar)\s+(orcamento|orçamento|pedido)\b/i.test(t)) {
    return 'ABRIR_MODAL'; // Abre modal
  }
  
  // Adicionar itens
  if (/\b(adicionar|incluir|add|colocar|por)\b/i.test(t)) {
    return 'ADD';
  }
  
  // Pagamento
  if (/\b(pag|receb|dinheiro|reais|r\$)\b/i.test(t)) {
    return 'PAG';
  }
  
  // Saldo
  if (/\b(saldo|deve|devendo|pendente|falta)\b/i.test(t)) {
    return 'SALDO';
  }
  
  // Ver orçamento
  if (/\b(ver|mostrar|exibir)\s+(orcamento|orçamento)\b/i.test(t)) {
    return 'VER_ORC';
  }
  
  // Listar clientes
  if (/\b(listar|mostrar|ver)\s+(clientes?|todos)\b/i.test(t)) {
    return 'LIST_CLI';
  }
  
  // Fatura/Nota
  if (/\b(nota|fatura|nf|nota\s+fiscal)\b/i.test(t)) {
    return 'FATURA';
  }
  
  // Relatório
  if (/\b(relatorio|relatório|resumo)\b/i.test(t)) {
    return 'RELATORIO';
  }
  
  // Pendências
  if (/\b(pendencias|pendências|atrasado)\b/i.test(t)) {
    return 'PENDENCIAS';
  }
  
  // Ajuda
  if (/\b(ajuda|help|comandos)\b/i.test(t)) {
    return 'AJUDA';
  }
  
  return 'DESCONHECIDO';
}

// ═══════════════════════════════════════
// OPERAÇÕES DE DADOS
// ═══════════════════════════════════════

export function findCli(CLI, nome) {
  const k = chave(nome);
  return CLI[k] || null;
}

export function getOrCreateCli(CLI, setCLI, nome, extra = {}) {
  const k = chave(nome);
  if (CLI[k]) return CLI[k];
  
  const novoCli = {
    id: uid(),
    nome: proprio(nome),
    criadoEm: hoje(),
    ...extra
  };
  
  setCLI({ ...CLI, [k]: novoCli });
  return novoCli;
}

export function orcsDosCli(ORC, cliId) {
  return Object.values(ORC)
    .filter(o => o.clienteId === cliId)
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
}

export function pagsDosCli(PAG, cliId) {
  return PAG
    .filter(p => p.clienteId === cliId)
    .sort((a, b) => a.data.localeCompare(b.data));
}

export function saldoCli(ORC, PAG, cliId) {
  const orcs = orcsDosCli(ORC, cliId);
  const totalOrc = orcs.reduce((acc, o) => acc + (o.total || 0), 0);
  
  const pags = pagsDosCli(PAG, cliId);
  const totalPago = pags.reduce((acc, p) => acc + (p.valor || 0), 0);
  
  return totalOrc - totalPago;
}

export function gerarNumOrc(ORC) {
  const nums = Object.values(ORC).map(o => o.numero || 0);
  return nums.length > 0 ? Math.max(...nums) + 1 : 1;
}

export function calcTotal(orc) {
  const totalItens = orc.itens.reduce((acc, it) => acc + (it.preco * it.qtd), 0);
  return totalItens + (orc.mdo || 0);
}

export function criarOrc(ORC, setORC, cliId, desc, itens, mdo = 0) {
  const id = uid();
  const numero = gerarNumOrc(ORC);
  
  const novoOrc = {
    id,
    numero,
    clienteId: cliId,
    desc: desc || 'Serviços elétricos',
    itens: itens || [],
    mdo: mdo || 0,
    total: 0,
    status: 'pendente',
    criadoEm: hoje()
  };
  
  novoOrc.total = calcTotal(novoOrc);
  
  setORC({ ...ORC, [id]: novoOrc });
  return novoOrc;
}

export function regPag(PAG, setPAG, cliId, orcId, valor, data, obs = '') {
  const novoPag = {
    id: uid(),
    clienteId: cliId,
    orcId: orcId || null,
    valor,
    data: data || hoje(),
    obs,
    criadoEm: hoje()
  };
  
  setPAG([...PAG, novoPag]);
  return novoPag;
}

// ═══════════════════════════════════════
// HANDLERS PRINCIPAIS
// ═══════════════════════════════════════

export function processarMensagem(txt, CLI, ORC, PAG, setCLI, setORC, setPAG) {
  const intent = detectarIntencao(txt);
  const nome = extrairNome(txt);
  
  let resposta = { tipo: 'texto', conteudo: '' };
  
  switch (intent) {
    case 'ABRIR_MODAL':
      resposta = {
        tipo: 'texto',
        conteudo: 'Por favor, clique no botão "📋 Novo pedido" ou digite "novo pedido" para criar um novo pedido.'
      };
      break;
      
    case 'CRIAR':
      resposta = handleCriar(txt, nome, CLI, ORC, setCLI, setORC);
      break;
      
    case 'ADD':
      resposta = handleAdd(txt, nome, CLI, ORC, setORC);
      break;
      
    case 'PAG':
      resposta = handlePag(txt, nome, CLI, ORC, PAG, setPAG);
      break;
      
    case 'SALDO':
      resposta = handleSaldo(nome, CLI, ORC, PAG);
      break;
      
    case 'VER_ORC':
      resposta = handleVerOrc(nome, CLI, ORC);
      break;
      
    case 'LIST_CLI':
      resposta = handleListCli(CLI);
      break;
      
    case 'FATURA':
      resposta = handleFatura(nome, CLI, ORC, PAG);
      break;
      
    case 'RELATORIO':
      resposta = handleRelatorio(CLI, ORC, PAG);
      break;
      
    case 'AJUDA':
      resposta = handleAjuda();
      break;
      
    default:
      resposta = {
        tipo: 'texto',
        conteudo: 'Desculpe, não entendi. Tente "ajuda" para ver os comandos disponíveis.'
      };
  }
  
  return resposta;
}

// Handlers individuais (versões simplificadas)

function handleCriar(txt, nome, CLI, ORC, setCLI, setORC) {
  if (!nome) {
    return { tipo: 'texto', conteudo: 'Por favor, informe o nome do cliente.' };
  }
  
  const cli = getOrCreateCli(CLI, setCLI, nome);
  
  // Tenta extrair serviço/material da mensagem
  let itens = parsearServicos(txt);
  
  // Se não encontrou no catálogo, extrai manualmente
  if (itens.length === 0) {
    // Busca padrões como "uma instalação elétrica", "serviço de pintura"
    const servicoMatch = txt.match(/\b(uma?|um)\s+([a-záàâãéêíóôõúç\s]+?)(?=,|\.|gastei|ele|cobrei|vai|$)/i);
    const valor = parsearValor(txt);
    
    if (servicoMatch && valor) {
      const servicoNome = servicoMatch[2].trim();
      itens = [{
        nome: proprio(servicoNome),
        qtd: 1,
        preco: valor,
        un: 'serviço',
        precisaMedida: false
      }];
    }
  }
  
  if (itens.length === 0) {
    return { 
      tipo: 'texto', 
      conteudo: `Cliente ${cli.nome} registrado! Quais serviços deseja adicionar?` 
    };
  }
  
  const orc = criarOrc(ORC, setORC, cli.id, 'Serviços', itens);
  
  return {
    tipo: 'card',
    texto: `✅ Orçamento #${orc.numero} criado para ${cli.nome}!`,
    card: gerarCardOrc(orc, cli)
  };
}

function handleAdd(txt, nome, CLI, ORC, setORC) {
  if (!nome) {
    return { tipo: 'texto', conteudo: 'Por favor, informe o nome do cliente.' };
  }
  
  const cli = findCli(CLI, nome);
  if (!cli) {
    return { tipo: 'texto', conteudo: `Cliente ${nome} não encontrado.` };
  }
  
  const orcs = orcsDosCli(ORC, cli.id);
  if (orcs.length === 0) {
    return { tipo: 'texto', conteudo: `${cli.nome} não tem orçamentos ainda.` };
  }
  
  const itens = parsearServicos(txt);
  if (itens.length === 0) {
    return { tipo: 'texto', conteudo: 'Não consegui identificar os itens a adicionar.' };
  }
  
  const orc = orcs[0]; // Adiciona no último orçamento
  orc.itens = [...orc.itens, ...itens];
  orc.total = calcTotal(orc);
  
  setORC({ ...ORC, [orc.id]: orc });
  
  return {
    tipo: 'card',
    texto: `Itens adicionados ao orçamento #${orc.numero}!`,
    card: gerarCardOrc(orc, cli)
  };
}

function handlePag(txt, nome, CLI, ORC, PAG, setPAG) {
  if (!nome) {
    return { tipo: 'texto', conteudo: 'Por favor, informe o nome do cliente.' };
  }
  
  const cli = findCli(CLI, nome);
  if (!cli) {
    return { tipo: 'texto', conteudo: `Cliente ${nome} não encontrado.` };
  }
  
  const valor = parsearValor(txt);
  if (!valor) {
    return { tipo: 'texto', conteudo: 'Não consegui identificar o valor do pagamento.' };
  }
  
  const data = parsearData(txt) || hoje();
  const orcs = orcsDosCli(ORC, cli.id);
  const orcId = orcs[0]?.id || null;
  
  regPag(PAG, setPAG, cli.id, orcId, valor, data);
  
  return {
    tipo: 'texto',
    conteudo: `✅ Pagamento de R$ ${valor.toFixed(2)} registrado para ${cli.nome}!`
  };
}

function handleSaldo(nome, CLI, ORC, PAG) {
  if (!nome) {
    return { tipo: 'texto', conteudo: 'Por favor, informe o nome do cliente.' };
  }
  
  const cli = findCli(CLI, nome);
  if (!cli) {
    return { tipo: 'texto', conteudo: `Cliente ${nome} não encontrado.` };
  }
  
  const saldo = saldoCli(ORC, PAG, cli.id);
  
  return {
    tipo: 'texto',
    conteudo: `💰 Saldo de ${cli.nome}: R$ ${saldo.toFixed(2)}`
  };
}

function handleVerOrc(nome, CLI, ORC) {
  if (!nome) {
    return { tipo: 'texto', conteudo: 'Por favor, informe o nome do cliente.' };
  }
  
  const cli = findCli(CLI, nome);
  if (!cli) {
    return { tipo: 'texto', conteudo: `Cliente ${nome} não encontrado.` };
  }
  
  const orcs = orcsDosCli(ORC, cli.id);
  if (orcs.length === 0) {
    return { tipo: 'texto', conteudo: `${cli.nome} não tem orçamentos.` };
  }
  
  return {
    tipo: 'card',
    texto: `Orçamentos de ${cli.nome}:`,
    card: orcs.map(o => gerarCardOrc(o, cli)).join('<br>')
  };
}

function handleListCli(CLI) {
  const clis = Object.values(CLI);
  if (clis.length === 0) {
    return { tipo: 'texto', conteudo: 'Nenhum cliente cadastrado ainda.' };
  }
  
  const lista = clis.map(c => `• ${c.nome}`).join('\n');
  return {
    tipo: 'texto',
    conteudo: `👥 Clientes cadastrados:\n${lista}`
  };
}

function handleFatura(nome, CLI, ORC, PAG) {
  return { tipo: 'texto', conteudo: '📄 Funcionalidade de fatura em desenvolvimento.' };
}

function handleRelatorio(CLI, ORC, PAG) {
  const numCli = Object.keys(CLI).length;
  const numOrc = Object.keys(ORC).length;
  const totalFat = Object.values(ORC).reduce((acc, o) => acc + o.total, 0);
  const totalPago = PAG.reduce((acc, p) => acc + p.valor, 0);
  const pendente = totalFat - totalPago;
  
  return {
    tipo: 'texto',
    conteudo: `📊 Relatório:\n• Clientes: ${numCli}\n• Orçamentos: ${numOrc}\n• Faturamento: R$ ${totalFat.toFixed(2)}\n• Recebido: R$ ${totalPago.toFixed(2)}\n• Pendente: R$ ${pendente.toFixed(2)}`
  };
}

function handleAjuda() {
  return {
    tipo: 'texto',
    conteudo: `🆘 Comandos disponíveis:
• "novo orçamento [nome]" - Criar orçamento
• "adicionar [itens] para [nome]" - Adicionar itens
• "[nome] pagou [valor]" - Registrar pagamento
• "saldo [nome]" - Ver saldo
• "ver orçamento [nome]" - Ver orçamentos
• "listar clientes" - Listar todos
• "relatório" - Ver resumo geral`
  };
}

// ═══════════════════════════════════════
// GERAÇÃO DE CARDS (HTML)
// ═══════════════════════════════════════

function gerarCardOrc(orc, cli) {
  const itensHtml = orc.itens.map(it => `
    <div class="row">
      <span class="lbl">${it.nome} (${it.qtd}x)</span>
      <span class="val">R$ ${(it.preco * it.qtd).toFixed(2)}</span>
    </div>
  `).join('');
  
  return `
    <div class="card">
      <div class="card-hdr purple">
        Orçamento #${orc.numero} - ${cli.nome}
      </div>
      <div class="card-body">
        ${itensHtml}
        ${orc.mdo > 0 ? `<div class="row"><span class="lbl">Mão de obra</span><span class="val">R$ ${orc.mdo.toFixed(2)}</span></div>` : ''}
      </div>
      <div class="card-total">
        <span>Total</span>
        <span>R$ ${orc.total.toFixed(2)}</span>
      </div>
    </div>
  `;
}
