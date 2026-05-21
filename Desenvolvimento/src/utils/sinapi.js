// Base de dados SINAPI - Sistema Nacional de Pesquisa de Custos e Índices da Construção Civil
// Fonte: Caixa Econômica Federal
// Atualização: Maio/2026

export const servicosSINAPI = {
  // ALVENARIA E ESTRUTURAS
  '74209/001': {
    codigo: '74209/001',
    descricao: 'ALVENARIA DE VEDACAO DE BLOCOS CERAMICOS FURADOS NA HORIZONTAL DE 9X19X19CM (ESPESSURA 9CM) DE PAREDES COM AREA LIQUIDA MAIOR OU IGUAL A 6M² COM VÃOS E ARGAMASSA DE ASSENTAMENTO COM PREPARO EM BETONEIRA.',
    unidade: 'm²',
    custoUnitario: 89.67,
    categoria: 'Alvenaria',
    insumos: [
      { codigo: '00004302', descricao: 'BLOCO CERAMICO DE VEDACAO COM FUROS NA HORIZONTAL, 9 X 19 X 19 CM - 4,5 MPA', unidade: 'UN', coeficiente: 13.6, precoUnitario: 1.45 },
      { codigo: '00000381', descricao: 'ARGAMASSA TRAÇO 1:2:8 (CIMENTO, CAL E AREIA MÉDIA) PARA EMBOÇO/MASSA ÚNICA/ASSENTAMENTO DE ALVENARIA DE VEDAÇÃO, PREPARO MECÂNICO. AF_06/2014', unidade: 'm³', coeficiente: 0.0118, precoUnitario: 312.86 },
      { codigo: '00000485', descricao: 'PEDREIRO COM ENCARGOS COMPLEMENTARES', unidade: 'h', coeficiente: 1.01, precoUnitario: 24.47 },
      { codigo: '00000479', descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES', unidade: 'h', coeficiente: 0.51, precoUnitario: 17.33 }
    ]
  },
  
  '87623': {
    codigo: '87623',
    descricao: 'REVESTIMENTO CERÂMICO PARA PAREDES INTERNAS COM PLACAS TIPO ESMALTADA EXTRA DE DIMENSÕES 33X45 CM APLICADAS EM AMBIENTES DE ÁREA MAIOR QUE 10 M² - AF_05/2016',
    unidade: 'm²',
    custoUnitario: 92.34,
    categoria: 'Revestimento',
    insumos: [
      { codigo: '00036051', descricao: 'PLACA CERAMICA ESMALTADA EXTRA 33X45CM', unidade: 'm²', coeficiente: 1.1, precoUnitario: 42.50 },
      { codigo: '00044494', descricao: 'ARGAMASSA COLANTE AC-I', unidade: 'KG', coeficiente: 5.5, precoUnitario: 0.85 },
      { codigo: '00046493', descricao: 'REJUNTE ACRILICO', unidade: 'KG', coeficiente: 1.0, precoUnitario: 4.20 },
      { codigo: '00000485', descricao: 'PEDREIRO COM ENCARGOS COMPLEMENTARES', unidade: 'h', coeficiente: 1.24, precoUnitario: 24.47 },
      { codigo: '00000479', descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES', unidade: 'h', coeficiente: 0.62, precoUnitario: 17.33 }
    ]
  },

  '88486': {
    codigo: '88486',
    descricao: 'PINTURA LATEX ACRILICA STANDARD, 02 DEMAOS, APLICACAO MANUAL',
    unidade: 'm²',
    custoUnitario: 18.76,
    categoria: 'Pintura',
    insumos: [
      { codigo: '00039710', descricao: 'TINTA LATEX ACRILICA STANDARD, COR BRANCA', unidade: 'L', coeficiente: 0.26, precoUnitario: 28.50 },
      { codigo: '00040932', descricao: 'LIXA EM FOLHA PARA PAREDE OU MADEIRA, NUMERO 120', unidade: 'UN', coeficiente: 0.17, precoUnitario: 2.10 },
      { codigo: '00000485', descricao: 'PEDREIRO COM ENCARGOS COMPLEMENTARES', unidade: 'h', coeficiente: 0.24, precoUnitario: 24.47 },
      { codigo: '00000479', descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES', unidade: 'h', coeficiente: 0.12, precoUnitario: 17.33 }
    ]
  },

  '92559': {
    codigo: '92559',
    descricao: 'CONTRAPISO EM ARGAMASSA TRAÇO 1:4 (CIMENTO E AREIA), PREPARO MANUAL, APLICADO EM ATÉ 2 CAMADAS SOBRE LAJE, ESPESSURA 3CM. AF_01/2020',
    unidade: 'm²',
    custoUnitario: 44.23,
    categoria: 'Contrapiso',
    insumos: [
      { codigo: '00000194', descricao: 'CIMENTO PORTLAND COMPOSTO CP II-32', unidade: 'KG', coeficiente: 16.8, precoUnitario: 0.68 },
      { codigo: '00000377', descricao: 'AREIA MEDIA - POSTO JAZIDA/FORNECEDOR (SEM TRANSPORTE)', unidade: 'm³', coeficiente: 0.084, precoUnitario: 90.00 },
      { codigo: '00000485', descricao: 'PEDREIRO COM ENCARGOS COMPLEMENTARES', unidade: 'h', coeficiente: 0.83, precoUnitario: 24.47 },
      { codigo: '00000479', descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES', unidade: 'h', coeficiente: 0.83, precoUnitario: 17.33 }
    ]
  },

  '74157/004': {
    codigo: '74157/004',
    descricao: 'CHAPISCO APLICADO EM ALVENARIAS E ESTRUTURAS DE CONCRETO INTERNAS, COM COLHER DE PEDREIRO. ARGAMASSA TRAÇO 1:3 COM PREPARO EM BETONEIRA. AF_06/2014',
    unidade: 'm²',
    custoUnitario: 8.95,
    categoria: 'Revestimento',
    insumos: [
      { codigo: '00000194', descricao: 'CIMENTO PORTLAND COMPOSTO CP II-32', unidade: 'KG', coeficiente: 2.52, precoUnitario: 0.68 },
      { codigo: '00000377', descricao: 'AREIA MEDIA - POSTO JAZIDA/FORNECEDOR (SEM TRANSPORTE)', unidade: 'm³', coeficiente: 0.0057, precoUnitario: 90.00 },
      { codigo: '00000485', descricao: 'PEDREIRO COM ENCARGOS COMPLEMENTARES', unidade: 'h', coeficiente: 0.11, precoUnitario: 24.47 },
      { codigo: '00000479', descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES', unidade: 'h', coeficiente: 0.11, precoUnitario: 17.33 }
    ]
  },

  '87879': {
    codigo: '87879',
    descricao: 'EMBOÇO, PARA RECEBIMENTO DE PINTURA, EM ARGAMASSA TRAÇO 1:2:8, PREPARO MECÂNICO COM BETONEIRA 400 L, APLICADO MANUALMENTE EM PANOS CEGOS DE FACHADA (SEM PRESENÇA DE VÃOS), ESPESSURA DE 20MM. AF_06/2014',
    unidade: 'm²',
    custoUnitario: 31.45,
    categoria: 'Revestimento',
    insumos: [
      { codigo: '00000381', descricao: 'ARGAMASSA TRAÇO 1:2:8 (CIMENTO, CAL E AREIA MÉDIA) PARA EMBOÇO/MASSA ÚNICA/ASSENTAMENTO DE ALVENARIA DE VEDAÇÃO, PREPARO MECÂNICO. AF_06/2014', unidade: 'm³', coeficiente: 0.023, precoUnitario: 312.86 },
      { codigo: '00000485', descricao: 'PEDREIRO COM ENCARGOS COMPLEMENTARES', unidade: 'h', coeficiente: 0.60, precoUnitario: 24.47 },
      { codigo: '00000479', descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES', unidade: 'h', coeficiente: 0.30, precoUnitario: 17.33 }
    ]
  },

  '94971': {
    codigo: '94971',
    descricao: 'IMPERMEABILIZACAO DE SUPERFICIE COM MANTA ASFALTICA, INCLUSIVE APLICACAO DE PRIMER ASFALTICO - ESPESSURA DE 3 MM',
    unidade: 'm²',
    custoUnitario: 67.89,
    categoria: 'Impermeabilização',
    insumos: [
      { codigo: '00037628', descricao: 'MANTA ASFALTICA, ESTRUTURADA EM FILME DE POLIETILENO, ACABAMENTO EM POLIETILENO - 3MM', unidade: 'm²', coeficiente: 1.1, precoUnitario: 32.80 },
      { codigo: '00037631', descricao: 'PRIMER ASFALTICO', unidade: 'L', coeficiente: 0.6, precoUnitario: 18.50 },
      { codigo: '00037630', descricao: 'GAS GLP (P13)', unidade: 'KG', coeficiente: 0.15, precoUnitario: 7.80 },
      { codigo: '00000485', descricao: 'PEDREIRO COM ENCARGOS COMPLEMENTARES', unidade: 'h', coeficiente: 0.50, precoUnitario: 24.47 },
      { codigo: '00000479', descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES', unidade: 'h', coeficiente: 0.50, precoUnitario: 17.33 }
    ]
  },

  '100756': {
    codigo: '100756',
    descricao: 'INSTALACAO DE PORTA DE MADEIRA, EXCLUSIVE FORNECIMENTO E ACABAMENTO',
    unidade: 'UN',
    custoUnitario: 156.34,
    categoria: 'Esquadrias',
    insumos: [
      { codigo: '00034664', descricao: 'PORTA DE MADEIRA SEMI-OCA COM ACABAMENTO BRANCO, DIMENSÕES 210X82CM (COM GUARNIÇÃO E FECHADURA)', unidade: 'UN', coeficiente: 1.0, precoUnitario: 380.00 },
      { codigo: '00034774', descricao: 'DOBRADIÇA AÇO, 3 1/2" X 3"', unidade: 'UN', coeficiente: 3.0, precoUnitario: 12.50 },
      { codigo: '00033733', descricao: 'PARAFUSO SEXTAVADO COM ROSCA SOBERBA, ACO ZINCADO, D= 4,2 MM, C= 32 MM', unidade: 'UN', coeficiente: 12.0, precoUnitario: 0.35 },
      { codigo: '00000485', descricao: 'MARCENEIRO COM ENCARGOS COMPLEMENTARES', unidade: 'h', coeficiente: 2.4, precoUnitario: 24.47 },
      { codigo: '00000479', descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES', unidade: 'h', coeficiente: 0.6, precoUnitario: 17.33 }
    ]
  },

  '91370': {
    codigo: '91370',
    descricao: 'EXECUÇÃO DE FORRO EM RÉGUAS DE PVC, INCLUSIVE ESTRUTURA DE FIXAÇÃO',
    unidade: 'm²',
    custoUnitario: 78.45,
    categoria: 'Forro',
    insumos: [
      { codigo: '00039447', descricao: 'FORRO EM REGUA PVC, INCLUSIVE COMPLEMENTOS', unidade: 'm²', coeficiente: 1.05, precoUnitario: 42.00 },
      { codigo: '00040245', descricao: 'PERFIL DE ALUMINIO PARA FORRO DE PVC', unidade: 'm', coeficiente: 2.8, precoUnitario: 8.50 },
      { codigo: '00000485', descricao: 'MARCENEIRO COM ENCARGOS COMPLEMENTARES', unidade: 'h', coeficiente: 0.80, precoUnitario: 24.47 },
      { codigo: '00000479', descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES', unidade: 'h', coeficiente: 0.40, precoUnitario: 17.33 }
    ]
  },

  '73925/001': {
    codigo: '73925/001',
    descricao: 'CONCRETO FCK = 25MPA, TRAÇO 1:2,3:2,7 (CIMENTO/ AREIA MEDIA/ BRITA 1) - PREPARO MECANICO COM BETONEIRA 400 L. AF_07/2016',
    unidade: 'm³',
    custoUnitario: 428.56,
    categoria: 'Estrutura',
    insumos: [
      { codigo: '00000194', descricao: 'CIMENTO PORTLAND COMPOSTO CP II-32', unidade: 'KG', coeficiente: 358.0, precoUnitario: 0.68 },
      { codigo: '00000377', descricao: 'AREIA MEDIA - POSTO JAZIDA/FORNECEDOR (SEM TRANSPORTE)', unidade: 'm³', coeficiente: 0.56, precoUnitario: 90.00 },
      { codigo: '00000385', descricao: 'BRITA 1 - POSTO PEDREIRA/FORNECEDOR (SEM TRANSPORTE)', unidade: 'm³', coeficiente: 0.66, precoUnitario: 95.00 },
      { codigo: '00000519', descricao: 'BETONEIRA 400 L, MOTOR ELETRICO 2 HP - CHP DIURNO', unidade: 'h', coeficiente: 1.0, precoUnitario: 4.35 }
    ]
  }
};

// Categorias para filtros
export const categoriasSINAPI = [
  'Todas',
  'Alvenaria',
  'Revestimento',
  'Pintura',
  'Contrapiso',
  'Impermeabilização',
  'Esquadrias',
  'Forro',
  'Estrutura'
];

// Função para buscar serviço por código
export const buscarServicoPorCodigo = (codigo) => {
  return servicosSINAPI[codigo] || null;
};

// Função para buscar serviços por categoria
export const buscarServicosPorCategoria = (categoria) => {
  if (categoria === 'Todas') {
    return Object.values(servicosSINAPI);
  }
  return Object.values(servicosSINAPI).filter(s => s.categoria === categoria);
};

// Função para buscar serviços por texto
export const buscarServicos = (texto) => {
  const textoLower = texto.toLowerCase();
  return Object.values(servicosSINAPI).filter(s => 
    s.codigo.toLowerCase().includes(textoLower) ||
    s.descricao.toLowerCase().includes(textoLower) ||
    s.categoria.toLowerCase().includes(textoLower)
  );
};

// Função para calcular custo total de insumos
export const calcularCustoInsumos = (servico, quantidade = 1) => {
  if (!servico || !servico.insumos) return 0;
  
  return servico.insumos.reduce((total, insumo) => {
    return total + (insumo.precoUnitario * insumo.coeficiente * quantidade);
  }, 0);
};

// Função para obter materiais de um serviço (excluindo mão de obra)
export const obterMateriaisDoServico = (servico, quantidadeServico = 1) => {
  if (!servico || !servico.insumos) return [];
  
  // Filtrar apenas materiais (excluir mão de obra como pedreiro, servente, etc)
  const materiaisFiltrados = servico.insumos.filter(insumo => 
    !insumo.descricao.toLowerCase().includes('pedreiro') &&
    !insumo.descricao.toLowerCase().includes('servente') &&
    !insumo.descricao.toLowerCase().includes('ajudante') &&
    !insumo.descricao.toLowerCase().includes('marceneiro') &&
    !insumo.descricao.toLowerCase().includes('pintor') &&
    !insumo.descricao.toLowerCase().includes('eletricista') &&
    !insumo.descricao.toLowerCase().includes('encanador') &&
    !insumo.descricao.toLowerCase().includes('betoneira') &&
    !insumo.descricao.toLowerCase().includes('equipamento')
  );
  
  return materiaisFiltrados.map(insumo => ({
    codigo: insumo.codigo,
    nome: insumo.descricao,
    unidadeMedida: insumo.unidade,
    quantidade: parseFloat((insumo.coeficiente * quantidadeServico).toFixed(4)),
    valorUnitario: insumo.precoUnitario,
    valorTotal: parseFloat((insumo.precoUnitario * insumo.coeficiente * quantidadeServico).toFixed(2)),
    origem: 'SINAPI',
    codigoServico: servico.codigo
  }));
};
