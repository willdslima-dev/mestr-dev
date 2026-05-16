// ═══════════════════════════════════════════════════════════════
// NÚCLEO DE INTELIGÊNCIA OPERACIONAL - DEVCOM
// Sistema de IA integrado para interpretação e execução automática
// ═══════════════════════════════════════════════════════════════

/**
 * SYSTEM PROMPT - Configuração de personalidade e comportamento da IA
 * Este prompt deve ser enviado como "system message" em toda chamada à API
 */
export const SYSTEM_PROMPT = `Você é o Motor de Execução do sistema DevCom - um sistema de gestão de pedidos, clientes e orçamentos para empresas de construção e reforma.

PERSONALIDADE:
- Profissional, eficiente e proativo
- Nunca invente dados - sempre pergunte quando faltar informação
- Trate o sistema como um gerente operacional experiente
- Use linguagem clara e objetiva
- ENTENDA LINGUAGEM INFORMAL: "estou fazendo para X" = novo serviço para o cliente X (NÃO procure cliente chamado "estou fazendo"!)

MÓDULOS DISPONÍVEIS:
1. novo_pedido - Criar novos pedidos/orçamentos
2. lista_clientes - Consultar e gerenciar clientes
3. pedidos - Ver e gerenciar pedidos existentes
4. saldo - Consultar saldo de clientes
5. catalogo - Ver serviços e materiais disponíveis
6. agenda - Gerenciar agendamentos
7. documentos - Gerar documentos e notas

FORMATO OBRIGATÓRIO DE RESPOSTA:
Sua resposta SEMPRE deve ter duas partes:

1. TEXTO HUMANO (Markdown): Resposta empática e profissional para o usuário
2. CÓDIGO DE AÇÃO (JSON): Instrução estruturada para o sistema executar

Formato exato:
---
[Sua resposta amigável aqui em markdown]

§§§ACTION§§§
{
  "modulo": "nome_do_modulo",
  "acao": "tipo_de_acao",
  "status": "validando" | "pronto" | "executar" | "info",
  "payload": {
    // dados relevantes
  },
  "faltando": ["campo1", "campo2"],
  "mensagemInterna": "nota para o sistema"
}
---

TIPOS DE AÇÃO:
- "validar_dados": Faltam informações, sistema deve aguardar resposta do usuário
- "abrir_modal": Abrir interface específica para o usuário preencher
- "executar": Dados completos, sistema pode executar a operação
- "consultar": Buscar e exibir informações
- "info": Resposta informativa, sem ação do sistema

REGRAS DE NEGÓCIO:

CRÍTICO - EXTRAÇÃO DE NOME DE CLIENTE:
- Ignore verbos/expressões antes do nome: "estou fazendo para [NOME]", "vou fazer pro [NOME]", "fiz para [NOME]"
- O nome do cliente vem DEPOIS de: "para", "pra", "pro", "do", "da"
- Exemplos:
  * "estou fazendo para Willian" → Cliente: Willian
  * "fiz pro João" → Cliente: João
  * "vendi pra Maria" → Cliente: Maria
  * "serviço do Carlos" → Cliente: Carlos
- NUNCA use como nome: "estou fazendo", "tô fazendo", "vou fazer", "fiz", etc.

Para NOVO PEDIDO:
- Sempre verifique: cliente, itens, quantidades, preços
- Se faltar algo, use "acao": "validar_dados" e liste em "faltando"
- Se tudo estiver completo, use "acao": "abrir_modal" para o usuário confirmar
- Aceite linguagem informal: "gastei X" = custo, "ele vai pagar X" = valor a receber
- Exemplo: "Vender 50 tijolos para o João" → pergunte preço, prazo, endereço de entrega

Para LISTA CLIENTES:
- Se pedir para listar, use "acao": "abrir_modal" com "modulo": "lista_clientes"
- Se perguntar sobre um cliente específico, use "acao": "consultar"

Para SALDO:
- Se pedir saldo geral, use "acao": "consultar" com "modulo": "saldo"
- Se pedir saldo de cliente específico, inclua o nome no payload

Para PEDIDOS:
- "Ver pedidos" → abre modal de pedidos
- "Pedidos do João" → filtra por cliente específico

EXEMPLOS DE USO:

Entrada: "estou fazendo para willian da rua 12, uma instalação elétrica, gastei mil reais e ele vai me pagar dia 30 deste mês"
Saída:
---
Perfeito! Entendi que você está fazendo uma **instalação elétrica** para o **Willian** (rua 12).

Resumo do serviço:
- Cliente: **Willian**
- Serviço: Instalação elétrica
- Custo: R$ 1.000,00
- Pagamento: Dia 30 deste mês
- Local: Rua 12

Está tudo correto? Vou abrir o formulário para você confirmar os detalhes!

§§§ACTION§§§
{
  "modulo": "novo_pedido",
  "acao": "abrir_modal",
  "status": "executar",
  "payload": {
    "cliente": "Willian",
    "itens": [
      {
        "material": "Instalação elétrica",
        "quantidade": 1,
        "unidade": "serviço",
        "preco": 1000
      }
    ],
    "dataPagamento": "30",
    "total": 1000,
    "observacoes": "Rua 12"
  },
  "faltando": [],
  "mensagemInterna": "Abrir modal com dados do serviço para Willian"
}
---

Entrada: "Quero vender 10 sacos de cimento para o Marcos"
Saída:
---
Perfeito! Vou iniciar um pedido para o **Marcos** com **10 sacos de cimento**. 

Para prosseguir, preciso saber:
- Qual o valor unitário de cada saco?
- Existe prazo de entrega acordado?
- Endereço de entrega já está cadastrado?

§§§ACTION§§§
{
  "modulo": "novo_pedido",
  "acao": "validar_dados",
  "status": "validando",
  "payload": {
    "cliente": "Marcos",
    "itens": [
      {
        "material": "cimento",
        "quantidade": 10,
        "unidade": "saco"
      }
    ]
  },
  "faltando": ["preco", "prazo_entrega", "endereco"],
  "mensagemInterna": "Aguardando dados complementares do pedido"
}
---

Entrada: "Lista todos os meus clientes"
Saída:
---
Abrindo a lista de clientes cadastrados no sistema... ✓

§§§ACTION§§§
{
  "modulo": "lista_clientes",
  "acao": "abrir_modal",
  "status": "executar",
  "payload": {},
  "faltando": [],
  "mensagemInterna": "Abrir modal de lista de clientes"
}
---

Entrada: "Quanto o João está devendo?"
Saída:
---
Consultando o saldo do cliente **João**...

§§§ACTION§§§
{
  "modulo": "saldo",
  "acao": "consultar",
  "status": "executar",
  "payload": {
    "cliente": "João",
    "tipo": "individual"
  },
  "faltando": [],
  "mensagemInterna": "Buscar saldo do cliente João"
}
---

REGRAS DE EXTRAÇÃO DE DADOS:

Quando o usuário fornecer um pedido completo em uma frase, extraia:
- **Cliente:** Nome da pessoa (ex: "para Willian", "para João", "cliente Maria", "estou fazendo para o Willian")
- **Material/Serviço:** O que será fornecido (ex: "material tal", "10 tijolos", "pintura", "instalação elétrica")
- **Quantidade:** Número de unidades (se mencionado)
- **Valor:** Preço total ou unitário (ex: "mil reais", "R$ 1000", "30 cada", "gastei mil reais")
- **Data/Prazo:** Quando será executado/entregue (ex: "executado hoje", "dia 20", "amanhã", "dia 30 deste mês")
- **Observações:** Detalhes adicionais

IMPORTANTE - LINGUAGEM COLOQUIAL:
O usuário pode usar expressões informais como:
- "estou fazendo para X" = novo pedido/serviço para cliente X
- "tô fazendo pra X" = novo pedido para cliente X
- "fiz um serviço pro X" = novo pedido concluído para cliente X
- "gastei X reais" = custo do serviço é X
- "ele vai pagar dia X" = prazo de pagamento
- "vai me pagar X" = valor a receber
- "cobrei X" = valor do serviço

Exemplos de extração com linguagem coloquial:

"estou fazendo para willian da rua 12, uma instalação elétrica, gastei mil reais e ele vai me pagar dia 30 deste mês"
→ Cliente: Willian (da rua 12)
→ Serviço: instalação elétrica
→ Custo: R$ 1.000,00
→ Valor a receber: R$ 1.000,00
→ Data de pagamento: dia 30
→ Observações: rua 12

"Pedido para Willian, com material tal, executado hoje, com valor de mil reais"
→ Cliente: Willian
→ Materiais: [material tal]
→ Data: hoje
→ Valor: R$ 1000,00

"Vender 50 sacos de cimento para João dia 20 a R$ 30 cada"
→ Cliente: João
→ Materiais: [50 sacos de cimento]
→ Data: dia 20
→ Valor unitário: R$ 30,00
→ Total: R$ 1.500,00

"fiz uma pintura pro Carlos, cobrei 2 mil, ele paga semana que vem"
→ Cliente: Carlos
→ Serviço: pintura
→ Valor: R$ 2.000,00
→ Prazo: semana que vem

Quando tiver TODOS os dados essenciais (cliente, material, valor), use:
{
  "modulo": "novo_pedido",
  "acao": "abrir_modal",
  "status": "executar",
  "payload": {
    "cliente": "nome",
    "itens": [{
      "material": "descrição",
      "quantidade": numero,
      "preco": valor_unitario
    }],
    "data": "data_formatada",
    "total": valor_total,
    "observacoes": "detalhes"
  },
  "faltando": []
}

IMPORTANTE:
- NUNCA omita o bloco §§§ACTION§§§
- Se faltar dados, liste em "faltando" e pergunte
- Sempre CONFIRME o resumo antes de abrir o modal
- Converta valores por extenso para números (mil = 1000, dois mil = 2000)
- Datas: "hoje" = data atual, "amanhã" = +1 dia, "dia X" = dia X do mês atual`;

/**
 * Parser de resposta da IA
 * Separa o texto humanizado do código de ação JSON
 */
export function parsearRespostaIA(resposta) {
  try {
    // Separa texto humano do código de ação
    const partes = resposta.split('§§§ACTION§§§');
    
    if (partes.length < 2) {
      // Resposta sem ação estruturada
      return {
        textoHumano: resposta.trim(),
        acao: null
      };
    }

    const textoHumano = partes[0].trim();
    const jsonTexto = partes[1].trim();

    // Parse do JSON de ação
    const acao = JSON.parse(jsonTexto);

    return {
      textoHumano,
      acao
    };
  } catch (error) {
    console.error('Erro ao parsear resposta da IA:', error);
    return {
      textoHumano: resposta,
      acao: null
    };
  }
}

/**
 * Validador de estrutura de ação
 * Garante que o JSON de ação está no formato correto
 */
export function validarAcao(acao) {
  if (!acao) return false;

  const camposObrigatorios = ['modulo', 'acao', 'status', 'payload'];
  const modulosValidos = [
    'novo_pedido', 
    'lista_clientes', 
    'pedidos', 
    'saldo', 
    'catalogo', 
    'agenda', 
    'documentos',
    'config'
  ];
  const acoesValidas = [
    'validar_dados', 
    'abrir_modal', 
    'executar', 
    'consultar', 
    'info'
  ];
  const statusValidos = ['validando', 'pronto', 'executar', 'info'];

  // Verifica campos obrigatórios
  for (const campo of camposObrigatorios) {
    if (!(campo in acao)) {
      console.warn(`Campo obrigatório faltando: ${campo}`);
      return false;
    }
  }

  // Valida módulo
  if (!modulosValidos.includes(acao.modulo)) {
    console.warn(`Módulo inválido: ${acao.modulo}`);
    return false;
  }

  // Valida ação
  if (!acoesValidas.includes(acao.acao)) {
    console.warn(`Ação inválida: ${acao.acao}`);
    return false;
  }

  // Valida status
  if (!statusValidos.includes(acao.status)) {
    console.warn(`Status inválido: ${acao.status}`);
    return false;
  }

  return true;
}

/**
 * Executor de ações da IA
 * Mapeia ações estruturadas para funções do sistema
 */
export class ExecutorAcoes {
  constructor(abrirModal, setClienteSelecionado, CLI, ORC, PAG) {
    this.abrirModal = abrirModal;
    this.setClienteSelecionado = setClienteSelecionado;
    this.CLI = CLI;
    this.ORC = ORC;
    this.PAG = PAG;
  }

  executar(acao) {
    if (!validarAcao(acao)) {
      console.error('Ação inválida:', acao);
      return {
        sucesso: false,
        mensagem: 'Ação recebida em formato inválido'
      };
    }

    console.log('🤖 Executando ação:', acao);

    // Roteamento por módulo e ação
    const chave = `${acao.modulo}_${acao.acao}`;
    
    switch (chave) {
      case 'novo_pedido_abrir_modal':
        return this.abrirModalNovoPedido(acao.payload);
      
      case 'novo_pedido_validar_dados':
        return this.validarDadosPedido(acao.payload);
      
      case 'lista_clientes_abrir_modal':
        return this.abrirModalClientes();
      
      case 'lista_clientes_consultar':
        return this.consultarCliente(acao.payload);
      
      case 'pedidos_abrir_modal':
        return this.abrirModalPedidos(acao.payload);
      
      case 'saldo_consultar':
        return this.consultarSaldo(acao.payload);
      
      case 'catalogo_abrir_modal':
        return this.abrirModalCatalogo();
      
      case 'agenda_abrir_modal':
        return this.abrirModalAgenda();
      
      case 'documentos_abrir_modal':
        return this.abrirModalDocumentos(acao.payload);
      
      default:
        console.warn('Ação não mapeada:', chave);
        return {
          sucesso: false,
          mensagem: `Ação ${chave} ainda não implementada`
        };
    }
  }

  // ═══════════════════════════════════════
  // AÇÕES DE PEDIDO
  // ═══════════════════════════════════════

  abrirModalNovoPedido(payload) {
    // Se vier com cliente no payload, seleciona ele
    if (payload.cliente) {
      const clienteEncontrado = this.buscarClientePorNome(payload.cliente);
      if (clienteEncontrado) {
        this.setClienteSelecionado(clienteEncontrado);
      }
    } else {
      this.setClienteSelecionado(null);
    }

    this.abrirModal('pedido');
    
    return {
      sucesso: true,
      mensagem: 'Modal de novo pedido aberto'
    };
  }

  validarDadosPedido(payload) {
    // Armazena dados parciais no contexto (para futuras implementações)
    return {
      sucesso: true,
      mensagem: 'Dados armazenados, aguardando complemento do usuário',
      dadosParciais: payload
    };
  }

  // ═══════════════════════════════════════
  // AÇÕES DE CLIENTES
  // ═══════════════════════════════════════

  abrirModalClientes() {
    this.abrirModal('selecionarCliente');
    return {
      sucesso: true,
      mensagem: 'Modal de clientes aberto'
    };
  }

  consultarCliente(payload) {
    const cliente = this.buscarClientePorNome(payload.cliente);
    
    if (!cliente) {
      return {
        sucesso: false,
        mensagem: `Cliente ${payload.cliente} não encontrado`,
        dados: null
      };
    }

    return {
      sucesso: true,
      mensagem: 'Cliente encontrado',
      dados: cliente
    };
  }

  // ═══════════════════════════════════════
  // AÇÕES DE PEDIDOS
  // ═══════════════════════════════════════

  abrirModalPedidos(payload) {
    // Se vier com filtro de cliente
    if (payload.cliente) {
      const clienteEncontrado = this.buscarClientePorNome(payload.cliente);
      if (clienteEncontrado) {
        this.setClienteSelecionado(clienteEncontrado);
      }
    } else {
      this.setClienteSelecionado(null);
    }

    this.abrirModal('pedidos');
    
    return {
      sucesso: true,
      mensagem: 'Modal de pedidos aberto'
    };
  }

  // ═══════════════════════════════════════
  // AÇÕES DE SALDO
  // ═══════════════════════════════════════

  consultarSaldo(payload) {
    if (payload.cliente) {
      // Saldo de cliente específico
      const cliente = this.buscarClientePorNome(payload.cliente);
      
      if (!cliente) {
        return {
          sucesso: false,
          mensagem: `Cliente ${payload.cliente} não encontrado`
        };
      }

      const saldo = this.calcularSaldoCliente(cliente.id);
      
      return {
        sucesso: true,
        mensagem: 'Saldo consultado',
        dados: {
          cliente: cliente.nome,
          saldo,
          formatado: this.formatarMoeda(saldo)
        }
      };
    } else {
      // Saldo geral (todos os clientes)
      const saldoGeral = this.calcularSaldoGeral();
      
      return {
        sucesso: true,
        mensagem: 'Saldo geral consultado',
        dados: {
          saldoTotal: saldoGeral,
          formatado: this.formatarMoeda(saldoGeral)
        }
      };
    }
  }

  // ═══════════════════════════════════════
  // OUTRAS AÇÕES
  // ═══════════════════════════════════════

  abrirModalCatalogo() {
    this.abrirModal('catalogo');
    return { sucesso: true, mensagem: 'Catálogo aberto' };
  }

  abrirModalAgenda() {
    this.abrirModal('agenda');
    return { sucesso: true, mensagem: 'Agenda aberta' };
  }

  abrirModalDocumentos(payload) {
    if (payload.cliente) {
      const cliente = this.buscarClientePorNome(payload.cliente);
      if (cliente) {
        this.setClienteSelecionado(cliente);
      }
    }
    this.abrirModal('gerarDocumento');
    return { sucesso: true, mensagem: 'Modal de documentos aberto' };
  }

  // ═══════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════

  buscarClientePorNome(nome) {
    if (!nome || !this.CLI) return null;
    
    const nomeLimpo = nome.toLowerCase().trim();
    
    return Object.values(this.CLI).find(cliente => 
      cliente.nome.toLowerCase().includes(nomeLimpo) ||
      nomeLimpo.includes(cliente.nome.toLowerCase())
    );
  }

  calcularSaldoCliente(clienteId) {
    // Total de pedidos
    const totalPedidos = Object.values(this.ORC || {})
      .filter(p => p.clienteId === clienteId)
      .reduce((acc, p) => acc + (p.total || 0), 0);

    // Total de pagamentos
    const totalPagamentos = Object.values(this.PAG || {})
      .filter(p => p.clienteId === clienteId)
      .reduce((acc, p) => acc + (p.valor || 0), 0);

    return totalPedidos - totalPagamentos;
  }

  calcularSaldoGeral() {
    const totalPedidos = Object.values(this.ORC || {})
      .reduce((acc, p) => acc + (p.total || 0), 0);

    const totalPagamentos = Object.values(this.PAG || {})
      .reduce((acc, p) => acc + (p.valor || 0), 0);

    return totalPedidos - totalPagamentos;
  }

  formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}

/**
 * Simulador de resposta da IA (para testes sem API externa)
 * Remove isso quando integrar com Claude/GPT real
 */
export function simularRespostaIA(mensagem, contexto) {
  const msg = mensagem.toLowerCase();

  // ═══════════════════════════════════════
  // PEDIDO COMPLETO (com extração de dados)
  // ═══════════════════════════════════════
  
  // Detecta se é um pedido completo
  const padraoCompleto = /pedido|orçamento|orcamento/i;
  
  if (padraoCompleto.test(mensagem)) {
    // ═══════════════════════════════════════
    // EXTRAÇÃO DE CLIENTE (nome completo)
    // ═══════════════════════════════════════
    const regexCliente = /(?:para\s+(?:o\s+)?cliente|cliente)\s+([a-záàâãéêíóôõúç]+(?:\s+[a-záàâãéêíóôõúç]+)*?)(?:\s+do\s+telefone|\s+da\s+rua|,|$)/i;
    const matchCliente = mensagem.match(regexCliente);
    const cliente = matchCliente ? matchCliente[1].trim().split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ') : null;
    
    // ═══════════════════════════════════════
    // EXTRAÇÃO DE TELEFONE
    // ═══════════════════════════════════════
    const regexTelefone = /(?:telefone|fone|cel|celular)[\s:]+(\d[\d\s\-\(\)]+\d)/i;
    const matchTelefone = mensagem.match(regexTelefone);
    const telefone = matchTelefone ? matchTelefone[1].replace(/[\s\-\(\)]/g, '') : null;
    
    // ═══════════════════════════════════════
    // EXTRAÇÃO DE ENDEREÇO
    // ═══════════════════════════════════════
    const regexEndereco = /(?:da\s+rua|rua|av|avenida|endereço)[\s:]+([^\,]+?)(?:,|fiz|executei|realizei|$)/i;
    const matchEndereco = mensagem.match(regexEndereco);
    const endereco = matchEndereco ? matchEndereco[1].trim() : null;
    
    // ═══════════════════════════════════════
    // EXTRAÇÃO DE MATERIAL/SERVIÇO
    // ═══════════════════════════════════════
    // Busca por: "fiz X", "instalação de X", "com X", "de X"
    const regexMaterial = /(?:fiz|realizei|executei|instalação\s+de|instalacao\s+de|com|de)\s+([a-záàâãéêíóôõúç\s]+?)(?:\s+hoje|\s+ontem|\s+amanhã|e\s+custou|custou|com\s+valor|no\s+valor|,|$)/i;
    const matchMaterial = mensagem.match(regexMaterial);
    const material = matchMaterial ? matchMaterial[1].trim() : null;
    
    // ═══════════════════════════════════════
    // EXTRAÇÃO DE VALOR
    // ═══════════════════════════════════════
    // Busca por: "custou X", "valor de X", "R$ X", etc
    const regexValor = /(?:custou|valor|preço|preco|custa)\s+(?:de\s+)?(?:r\$\s*)?(\d+(?:\.\d{3})*(?:,\d{2})?|mil|dois\s+mil|três\s+mil|cem|duzentos|trezentos)/i;
    const matchValor = mensagem.match(regexValor);
    let valor = null;
    
    if (matchValor) {
      const valorTexto = matchValor[1].toLowerCase();
      if (valorTexto === 'mil') valor = 1000;
      else if (valorTexto.includes('dois mil')) valor = 2000;
      else if (valorTexto.includes('três mil') || valorTexto.includes('tres mil')) valor = 3000;
      else if (valorTexto === 'cem') valor = 100;
      else if (valorTexto === 'duzentos') valor = 200;
      else if (valorTexto === 'trezentos') valor = 300;
      else {
        // Remove pontos e substitui vírgula por ponto
        valor = parseFloat(valorTexto.replace(/\./g, '').replace(',', '.'));
      }
    }
    
    // ═══════════════════════════════════════
    // EXTRAÇÃO DE DATA
    // ═══════════════════════════════════════
    const regexData = /(?:executado|entregue|realizado|feito|fiz|para|dia)\s+(hoje|ontem|amanhã|amanha|\d+)/i;
    const matchData = mensagem.match(regexData);
    let data = null;
    
    if (matchData) {
      const dataTexto = matchData[1].toLowerCase();
      const hoje = new Date();
      
      if (dataTexto === 'hoje') {
        data = hoje.toISOString().split('T')[0];
      } else if (dataTexto === 'ontem') {
        const ontem = new Date(hoje);
        ontem.setDate(ontem.getDate() - 1);
        data = ontem.toISOString().split('T')[0];
      } else if (dataTexto === 'amanhã' || dataTexto === 'amanha') {
        const amanha = new Date(hoje);
        amanha.setDate(amanha.getDate() + 1);
        data = amanha.toISOString().split('T')[0];
      } else if (/^\d+$/.test(dataTexto)) {
        const dia = parseInt(dataTexto);
        const mes = hoje.getMonth();
        const ano = hoje.getFullYear();
        data = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      }
    }
    
    // Se temos cliente E material E valor, consideramos completo
    if (cliente && material && valor) {
      return `Perfeito! Vou criar o pedido com os seguintes dados:

📋 **Resumo do Pedido:**
• **Cliente:** ${cliente}
${telefone ? `• **Telefone:** ${telefone}` : ''}
${endereco ? `• **Endereço:** ${endereco}` : ''}
• **Serviço/Material:** ${material}
• **Valor:** R$ ${valor.toFixed(2).replace('.', ',')}
${data ? `• **Data:** ${data}` : ''}

Abrindo formulário para confirmação... ✓

§§§ACTION§§§
{
  "modulo": "novo_pedido",
  "acao": "abrir_modal",
  "status": "executar",
  "payload": {
    "cliente": "${cliente}",
    ${telefone ? `"telefone": "${telefone}",` : ''}
    ${endereco ? `"endereco": "${endereco}",` : ''}
    "itens": [{
      "material": "${material}",
      "quantidade": 1,
      "preco": ${valor}
    }],
    ${data ? `"data": "${data}",` : ''}
    "total": ${valor},
    "observacoes": "Pedido criado via IA"
  },
  "faltando": [],
  "mensagemInterna": "Pedido completo extraído da frase"
}`;
    }
    
    // Se falta algum dado, solicita
    const faltando = [];
    if (!cliente) faltando.push('cliente');
    if (!material) faltando.push('material/serviço');
    if (!valor) faltando.push('valor');
    
    return `Entendi que você quer criar um pedido! 

${cliente ? `✓ Cliente: ${cliente}` : '❌ Preciso saber o nome do cliente'}
${telefone ? `✓ Telefone: ${telefone}` : ''}
${endereco ? `✓ Endereço: ${endereco}` : ''}
${material ? `✓ Material/Serviço: ${material}` : '❌ Preciso saber qual material/serviço'}
${valor ? `✓ Valor: R$ ${valor.toFixed(2).replace('.', ',')}` : '❌ Preciso saber o valor'}

Por favor, informe os dados faltantes.

§§§ACTION§§§
{
  "modulo": "novo_pedido",
  "acao": "validar_dados",
  "status": "validando",
  "payload": {
    ${cliente ? `"cliente": "${cliente}",` : ''}
    ${material ? `"itens": [{"material": "${material}", "quantidade": 1}],` : ''}
    ${valor ? `"total": ${valor}` : ''}
  },
  "faltando": ${JSON.stringify(faltando)},
  "mensagemInterna": "Aguardando dados complementares"
}`;
  }

  // ═══════════════════════════════════════
  // COMANDOS SIMPLES
  // ═══════════════════════════════════════

  // Novo pedido (sem dados)
  if (msg.includes('novo pedido') || msg.includes('vender')) {
    return `Entendido! Vou iniciar um novo pedido.

Para criar o pedido completo, preciso de algumas informações. Você pode me dizer:
- Para qual cliente?
- Quais itens/materiais?
- Quantidades?

§§§ACTION§§§
{
  "modulo": "novo_pedido",
  "acao": "abrir_modal",
  "status": "executar",
  "payload": {},
  "faltando": ["cliente", "itens"],
  "mensagemInterna": "Abrir modal de novo pedido"
}`;
  }

  // Lista de clientes
  if (msg.includes('lista') && msg.includes('cliente')) {
    return `Abrindo a lista de clientes cadastrados... ✓

§§§ACTION§§§
{
  "modulo": "lista_clientes",
  "acao": "abrir_modal",
  "status": "executar",
  "payload": {},
  "faltando": [],
  "mensagemInterna": "Abrir modal de lista de clientes"
}`;
  }

  // Ver pedidos
  if (msg.includes('pedido')) {
    return `Abrindo a lista de pedidos... ✓

§§§ACTION§§§
{
  "modulo": "pedidos",
  "acao": "abrir_modal",
  "status": "executar",
  "payload": {},
  "faltando": [],
  "mensagemInterna": "Abrir modal de pedidos"
}`;
  }

  // Saldo
  if (msg.includes('saldo') || msg.includes('deve')) {
    return `Consultando saldo...

§§§ACTION§§§
{
  "modulo": "saldo",
  "acao": "consultar",
  "status": "executar",
  "payload": {
    "tipo": "geral"
  },
  "faltando": [],
  "mensagemInterna": "Consultar saldo geral"
}`;
  }

  // Catálogo
  if (msg.includes('catalogo') || msg.includes('catálogo')) {
    return `Abrindo o catálogo de produtos e serviços... ✓

§§§ACTION§§§
{
  "modulo": "catalogo",
  "acao": "abrir_modal",
  "status": "executar",
  "payload": {},
  "faltando": [],
  "mensagemInterna": "Abrir modal de catálogo"
}`;
  }

  // Resposta padrão (sem ação específica)
  return `Entendi sua solicitação. Como posso ajudar especificamente?

Posso:
- Criar novo pedido
- Listar clientes
- Ver pedidos
- Consultar saldo
- Abrir catálogo

§§§ACTION§§§
{
  "modulo": "info",
  "acao": "info",
  "status": "info",
  "payload": {},
  "faltando": [],
  "mensagemInterna": "Resposta informativa"
}`;
}
