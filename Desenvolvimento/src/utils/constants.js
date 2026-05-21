// ============================================
// CONSTANTES - DADOS DE TESTE
// ============================================

import { uid } from './helpers';
import { servicosSINAPI, obterMateriaisDoServico } from './sinapi';

// ============================================
// CLIENTES DE TESTE - COM ENDEREÇOS REAIS
// ============================================
export const CLIENTES_TESTE = [
  { 
    nome: 'Leonardo Fernandes', 
    telefone: '(11) 98765-4321', 
    whatsapp: '(11) 98765-4321',
    email: 'leonardo.fernandes@email.com',
    cpfCnpj: '123.456.789-01',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Rua Joaquim das Neves', 
      numero: '145', 
      complemento: 'Apto 12', 
      bairro: 'Vila Caldas', 
      cidade: 'Carapicuíba', 
      estado: 'SP', 
      cep: '06310-420' 
    } 
  },
  { 
    nome: 'Beatriz Almeida', 
    telefone: '(11) 97654-3210', 
    whatsapp: '(11) 97654-3210',
    email: 'beatriz.almeida@email.com',
    cpfCnpj: '234.567.890-12',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Avenida dos Autonomistas', 
      numero: '2876', 
      complemento: '', 
      bairro: 'Centro', 
      cidade: 'Osasco', 
      estado: 'SP', 
      cep: '06020-010' 
    } 
  },
  { 
    nome: 'Gabriel Oliveira', 
    telefone: '(11) 96543-2109', 
    whatsapp: '(11) 96543-2109',
    email: 'gabriel.oliveira@email.com',
    cpfCnpj: '345.678.901-23',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Rua Professor Paulo Pirozzi', 
      numero: '89', 
      complemento: 'Casa 2', 
      bairro: 'Vila Dirce', 
      cidade: 'Carapicuíba', 
      estado: 'SP', 
      cep: '06320-150' 
    } 
  },
  { 
    nome: 'Isabela Rodrigues', 
    telefone: '(11) 95432-1098', 
    whatsapp: '(11) 95432-1098',
    email: 'isabela.rodrigues@email.com',
    cpfCnpj: '456.789.012-34',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Rua Antônio Agu', 
      numero: '567', 
      complemento: 'Bloco A', 
      bairro: 'Vila Yara', 
      cidade: 'Osasco', 
      estado: 'SP', 
      cep: '06026-010' 
    } 
  },
  { 
    nome: 'Henrique Costa', 
    telefone: '(11) 94321-0987', 
    whatsapp: '(11) 94321-0987',
    email: 'henrique.costa@email.com',
    cpfCnpj: '567.890.123-45',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Avenida Rui Barbosa', 
      numero: '1234', 
      complemento: '', 
      bairro: 'Centro', 
      cidade: 'Carapicuíba', 
      estado: 'SP', 
      cep: '06310-100' 
    } 
  },
  { 
    nome: 'Mariana Souza', 
    telefone: '(11) 93210-9876', 
    whatsapp: '(11) 93210-9876',
    email: 'mariana.souza@email.com',
    cpfCnpj: '678.901.234-56',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Avenida João Batista Soares', 
      numero: '456', 
      complemento: 'Apto 25', 
      bairro: 'Jardim Piratininga', 
      cidade: 'Osasco', 
      estado: 'SP', 
      cep: '06088-130' 
    } 
  },
  { 
    nome: 'Rafael Mendes', 
    telefone: '(11) 92109-8765', 
    whatsapp: '(11) 92109-8765',
    email: 'rafael.mendes@email.com',
    cpfCnpj: '789.012.345-67',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Rua Manoel Rodrigues', 
      numero: '321', 
      complemento: '', 
      bairro: 'Jardim Ana Estela', 
      cidade: 'Carapicuíba', 
      estado: 'SP', 
      cep: '06334-100' 
    } 
  },
  { 
    nome: 'Laura Santos', 
    telefone: '(11) 91098-7654', 
    whatsapp: '(11) 91098-7654',
    email: 'laura.santos@email.com',
    cpfCnpj: '890.123.456-78',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Rua Narciso Sturlini', 
      numero: '789', 
      complemento: 'Casa 1', 
      bairro: 'Bela Vista', 
      cidade: 'Osasco', 
      estado: 'SP', 
      cep: '06053-030' 
    } 
  },
  { 
    nome: 'Felipe Martins', 
    telefone: '(11) 90987-6543', 
    whatsapp: '(11) 90987-6543',
    email: 'felipe.martins@email.com',
    cpfCnpj: '901.234.567-89',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Rua Benedito Alves Turíbio', 
      numero: '234', 
      complemento: 'Apto 5', 
      bairro: 'Cohab 5', 
      cidade: 'Carapicuíba', 
      estado: 'SP', 
      cep: '06345-000' 
    } 
  },
  { 
    nome: 'Camila Lima', 
    telefone: '(11) 89876-5432', 
    whatsapp: '(11) 89876-5432',
    email: 'camila.lima@email.com',
    cpfCnpj: '012.345.678-90',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Rua Rosalina da Cruz Santos', 
      numero: '678', 
      complemento: '', 
      bairro: 'Jardim das Flores', 
      cidade: 'Osasco', 
      estado: 'SP', 
      cep: '06110-110' 
    } 
  },
  { 
    nome: 'Lucas Pereira', 
    telefone: '(11) 88765-4321', 
    whatsapp: '(11) 88765-4321',
    email: 'lucas.pereira@email.com',
    cpfCnpj: '111.222.333-44',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Rua Joaquim das Neves', 
      numero: '567', 
      complemento: 'Bloco B', 
      bairro: 'Vila Caldas', 
      cidade: 'Carapicuíba', 
      estado: 'SP', 
      cep: '06310-420' 
    } 
  },
  { 
    nome: 'Júlia Carvalho', 
    telefone: '(11) 87654-3210', 
    whatsapp: '(11) 87654-3210',
    email: 'julia.carvalho@email.com',
    cpfCnpj: '222.333.444-55',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Avenida dos Autonomistas', 
      numero: '4321', 
      complemento: 'Sala 10', 
      bairro: 'Centro', 
      cidade: 'Osasco', 
      estado: 'SP', 
      cep: '06020-010' 
    } 
  },
  { 
    nome: 'Rodrigo Silva', 
    telefone: '(11) 86543-2109', 
    whatsapp: '(11) 86543-2109',
    email: 'rodrigo.silva@email.com',
    cpfCnpj: '333.444.555-66',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Rua Professor Paulo Pirozzi', 
      numero: '432', 
      complemento: '', 
      bairro: 'Vila Dirce', 
      cidade: 'Carapicuíba', 
      estado: 'SP', 
      cep: '06320-150' 
    } 
  },
  { 
    nome: 'Larissa Gomes', 
    telefone: '(11) 85432-1098', 
    whatsapp: '(11) 85432-1098',
    email: 'larissa.gomes@email.com',
    cpfCnpj: '444.555.666-77',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Rua Antônio Agu', 
      numero: '876', 
      complemento: 'Apto 32', 
      bairro: 'Vila Yara', 
      cidade: 'Osasco', 
      estado: 'SP', 
      cep: '06026-010' 
    } 
  },
  { 
    nome: 'Matheus Barbosa', 
    telefone: '(11) 84321-0987', 
    whatsapp: '(11) 84321-0987',
    email: 'matheus.barbosa@email.com',
    cpfCnpj: '555.666.777-88',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Avenida Rui Barbosa', 
      numero: '765', 
      complemento: 'Casa 3', 
      bairro: 'Centro', 
      cidade: 'Carapicuíba', 
      estado: 'SP', 
      cep: '06310-100' 
    } 
  },
  { 
    nome: 'Amanda Rocha', 
    telefone: '(11) 83210-9876', 
    whatsapp: '(11) 83210-9876',
    email: 'amanda.rocha@email.com',
    cpfCnpj: '666.777.888-99',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Avenida João Batista Soares', 
      numero: '234', 
      complemento: '', 
      bairro: 'Jardim Piratininga', 
      cidade: 'Osasco', 
      estado: 'SP', 
      cep: '06088-130' 
    } 
  },
  { 
    nome: 'Vinícius Pinto', 
    telefone: '(11) 82109-8765', 
    whatsapp: '(11) 82109-8765',
    email: 'vinicius.pinto@email.com',
    cpfCnpj: '777.888.999-00',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Rua Manoel Rodrigues', 
      numero: '543', 
      complemento: 'Apto 18', 
      bairro: 'Jardim Ana Estela', 
      cidade: 'Carapicuíba', 
      estado: 'SP', 
      cep: '06334-100' 
    } 
  },
  { 
    nome: 'Carolina Ribeiro', 
    telefone: '(11) 81098-7654', 
    whatsapp: '(11) 81098-7654',
    email: 'carolina.ribeiro@email.com',
    cpfCnpj: '888.999.000-11',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Rua Narciso Sturlini', 
      numero: '123', 
      complemento: '', 
      bairro: 'Bela Vista', 
      cidade: 'Osasco', 
      estado: 'SP', 
      cep: '06053-030' 
    } 
  },
  { 
    nome: 'Thiago Araújo', 
    telefone: '(11) 80987-6543', 
    whatsapp: '(11) 80987-6543',
    email: 'thiago.araujo@email.com',
    cpfCnpj: '999.000.111-22',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Rua Benedito Alves Turíbio', 
      numero: '987', 
      complemento: 'Casa 2', 
      bairro: 'Cohab 5', 
      cidade: 'Carapicuíba', 
      estado: 'SP', 
      cep: '06345-000' 
    } 
  },
  { 
    nome: 'Bianca Castro', 
    telefone: '(11) 79876-5432', 
    whatsapp: '(11) 79876-5432',
    email: 'bianca.castro@email.com',
    cpfCnpj: '000.111.222-33',
    tipoCliente: 'fisica',
    endereco: { 
      logradouro: 'Rua Rosalina da Cruz Santos', 
      numero: '345', 
      complemento: 'Apto 7', 
      bairro: 'Jardim das Flores', 
      cidade: 'Osasco', 
      estado: 'SP', 
      cep: '06110-110' 
    } 
  }
];

// ============================================
// PEDIDOS DE TESTE
// ============================================
// Função para gerar pedidos aleatórios para cada cliente
export const gerarPedidosAleatorios = (clientes) => {
  const pedidos = {};
  const servicosExemplo = [
    { nome: 'Instalação Elétrica', valorUnitario: 850, quantidade: 1 },
    { nome: 'Pintura Residencial', valorUnitario: 1200, quantidade: 1 },
    { nome: 'Reforma de Banheiro', valorUnitario: 3500, quantidade: 1 },
    { nome: 'Instalação de Ar Condicionado', valorUnitario: 450, quantidade: 1 },
    { nome: 'Manutenção Hidráulica', valorUnitario: 380, quantidade: 1 },
    { nome: 'Troca de Piso', valorUnitario: 2800, quantidade: 1 },
    { nome: 'Instalação de Forro', valorUnitario: 1500, quantidade: 1 },
    { nome: 'Montagem de Móveis', valorUnitario: 250, quantidade: 1 },
    { nome: 'Instalação Hidráulica', valorUnitario: 450, quantidade: 1 },
    { nome: 'Gesso', valorUnitario: 600, quantidade: 1 },
    { nome: 'Reboco', valorUnitario: 900, quantidade: 1 }
  ];

  const materiaisExemplo = [
    { nome: 'Fio 2.5mm (rolo)', valorUnitario: 120, quantidade: 2 },
    { nome: 'Tinta Latex 18L', valorUnitario: 180, quantidade: 3 },
    { nome: 'Cerâmica Branca (m²)', valorUnitario: 45, quantidade: 10 },
    { nome: 'Cimento (saco 50kg)', valorUnitario: 35, quantidade: 8 },
    { nome: 'Parafusos Diversos', valorUnitario: 45, quantidade: 2 },
    { nome: 'Areia (m³)', valorUnitario: 80, quantidade: 5 },
    { nome: 'Tijolo (milheiro)', valorUnitario: 800, quantidade: 1 },
    { nome: 'Massa Corrida', valorUnitario: 45, quantidade: 4 },
    { nome: 'Gesso em Pó', valorUnitario: 25, quantidade: 6 }
  ];

  const statusPossiveis = [
    'pendente',
    'aguardando',
    'aprovado',
    'em_andamento',
    'aguardando_pagamento',
    'concluido',
    'garantia',
    'cancelado'
  ];

  const referencias = [
    'Reforma da sala',
    'Pintura do quarto',
    'Conserto banheiro',
    'Ampliação cozinha',
    'Reforma completa',
    'Construção quintal',
    'Instalação elétrica',
    'Troca de pisos',
    'Construção garagem',
    'Muro lateral'
  ];

  const ano = new Date().getFullYear();
  let proximoNum = 1;

  // Converte servicosSINAPI em array para facilitar seleção aleatória
  const servicosSINAPIArray = Object.values(servicosSINAPI);

  Object.entries(clientes).forEach(([clienteId, cliente], index) => {
    // Cada cliente terá de 1 a 3 pedidos
    const numPedidos = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numPedidos; i++) {
      const pedidoId = uid();
      
      // 70% chance de usar serviços SINAPI, 30% serviços personalizados
      const usarSINAPI = Math.random() > 0.3;
      
      // Seleciona serviços aleatórios (1 a 3)
      const numServicos = Math.floor(Math.random() * 3) + 1;
      const servicos = [];
      const materiaisGerados = [];
      
      for (let j = 0; j < numServicos; j++) {
        if (usarSINAPI && servicosSINAPIArray.length > 0) {
          // Serviço SINAPI
          const servicoSINAPI = servicosSINAPIArray[Math.floor(Math.random() * servicosSINAPIArray.length)];
          const quantidade = Math.floor(Math.random() * 50) + 10; // 10 a 60 m² ou unidades
          
          const servico = {
            id: uid(),
            nome: servicoSINAPI.descricao.substring(0, 60) + (servicoSINAPI.descricao.length > 60 ? '...' : ''),
            descricao: servicoSINAPI.descricao,
            valorUnitario: servicoSINAPI.custoUnitario,
            quantidade: quantidade,
            unidadeMedida: servicoSINAPI.unidade,
            origem: 'SINAPI',
            codigoSINAPI: servicoSINAPI.codigo,
            insumos: servicoSINAPI.insumos
          };
          servicos.push(servico);
          
          // Gera materiais automaticamente desse serviço
          const materiaisDoServico = obterMateriaisDoServico(servicoSINAPI, quantidade);
          materiaisDoServico.forEach(mat => {
            materiaisGerados.push({
              ...mat,
              id: uid(),
              editavel: true
            });
          });
        } else {
          // Serviço personalizado
          const servico = servicosExemplo[Math.floor(Math.random() * servicosExemplo.length)];
          servicos.push({
            id: uid(),
            nome: servico.nome,
            valorUnitario: servico.valorUnitario,
            quantidade: servico.quantidade,
            origem: 'personalizado'
          });
        }
      }

      // Se não gerou materiais do SINAPI, adiciona alguns materiais manuais
      const materiais = materiaisGerados.length > 0 ? materiaisGerados : (() => {
        const numMateriais = Math.floor(Math.random() * 4) + 2;
        const mats = [];
        for (let k = 0; k < numMateriais; k++) {
          const material = materiaisExemplo[Math.floor(Math.random() * materiaisExemplo.length)];
          mats.push({
            id: uid(),
            nome: material.nome,
            valorUnitario: material.valorUnitario,
            quantidade: Math.floor(Math.random() * 10) + 1,
            unidadeMedida: 'un',
            origem: 'manual'
          });
        }
        return mats;
      })();

      // Calcula valores
      // const totalServicos = servicos.reduce((sum, s) => sum + (s.valorUnitario * s.quantidade), 0);
      // const totalMateriais = materiais.reduce((sum, m) => sum + (m.valorUnitario * m.quantidade), 0);
      const desconto = Math.random() > 0.7 ? Math.floor(Math.random() * 200) + 50 : 0;
      // const valorTotal = totalServicos + totalMateriais - desconto; // Calculado dinamicamente no frontend

      // Data aleatória nos últimos 60 dias
      const diasAtras = Math.floor(Math.random() * 60);
      const data = new Date();
      data.setDate(data.getDate() - diasAtras);
      const dataFormatada = data.toISOString().split('T')[0];

      // Status aleatório
      const status = statusPossiveis[Math.floor(Math.random() * statusPossiveis.length)];

      // Fotos fictícias (algumas pedidos terão fotos)
      const numFotos = Math.random() > 0.5 ? Math.floor(Math.random() * 4) + 1 : 0;
      const fotos = [];
      for (let f = 0; f < numFotos; f++) {
        const fotoTipo = ['work', 'before', 'after', 'detail'][f % 4];
        fotos.push({
          id: `foto-${pedidoId}-${f}`,
          url: `https://picsum.photos/800/600?random=${pedidoId}-${f}`,
          nome: `foto-${fotoTipo}-${f + 1}.jpg`,
          data: dataFormatada,
          tamanho: Math.floor(Math.random() * 3000000) + 500000 // 500KB a 3.5MB
        });
      }

      pedidos[pedidoId] = {
        id: pedidoId,
        numero: `${String(proximoNum).padStart(3, '0')}-${ano}`,
        clienteId: clienteId,
        clienteNome: cliente.nome,
        clienteTelefone: cliente.whatsapp || cliente.telefone || '',
        status: status,
        referencia: referencias[Math.floor(Math.random() * referencias.length)],
        servicos: servicos,
        materiais: materiais,
        desconto: desconto,
        taxaEntrega: 0,
        outrasTaxas: 0,
        pagamentos: [],
        custos: [],
        fotos: fotos,
        criadoEm: dataFormatada,
        atualizadoEm: dataFormatada,
        timestamp: Date.now() + i
      };

      proximoNum++;
    }
  });

  return pedidos;
};

// ============================================
// FUNÇÃO PARA POPULAR DADOS DE TESTE
// ============================================
export const popularDadosTeste = () => {
  // Cria objeto de clientes com IDs únicos
  const clientesObj = {};
  CLIENTES_TESTE.forEach((cliente, index) => {
    const id = `cli_${Date.now()}_${index}`;
    clientesObj[id] = { id, ...cliente };
  });

  // Gera pedidos aleatórios para os clientes
  const pedidos = gerarPedidosAleatorios(clientesObj);

  // Salva no localStorage
  localStorage.setItem('oc_cli', JSON.stringify(clientesObj));
  localStorage.setItem('oc_orc', JSON.stringify(pedidos));

  return {
    clientes: clientesObj,
    pedidos: pedidos,
    totalClientes: Object.keys(clientesObj).length,
    totalPedidos: Object.keys(pedidos).length
  };
};
