import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Modal from './Modal';
import DescontoModal from './DescontoModal';
import SelecionarClienteModal from './SelecionarClienteModal';
import SelecionarServicoModal from './SelecionarServicoModal';
import MaterialModal from './MaterialModal';
import PagamentoModal from './PagamentoModal';
import CustoModal from './CustoModal';
import CalendarioComAgenda from './CalendarioComAgenda';
import { uid, hoje } from '../../utils/helpers';
import { formatarMoeda } from '../../infrastructure/formatters';

function PedidoModal({ isOpen, onClose, cliente: clienteInicial, ORC, setORC, AGENDA, pedidoExistente, CLI, setCLI }) {
  const [clienteSelecionado, setClienteSelecionado] = useState(clienteInicial || null);
  const [showClienteModal, setShowClienteModal] = useState(false);
  
  // Gera número do pedido automaticamente
  const numeroPedido = useMemo(() => {
    // Se já existe pedido, usa o número dele
    if (pedidoExistente?.numero) {
      return pedidoExistente.numero;
    }
    
    const orcamentos = ORC ? Object.values(ORC) : [];
    const ano = new Date().getFullYear();
    const proximoNumero = orcamentos.filter(o => o.numero?.includes(ano)).length + 1;
    return `${String(proximoNumero).padStart(3, '0')}-${ano}`;
  }, [ORC, pedidoExistente]);

  const [formData, setFormData] = useState({
    numero: numeroPedido,
    status: 'aguardando',
    referencia: '',
    validadeOrcamento: '',
    prazoExecucao: '',
    horarioInicio: '',
    horarioTermino: '',
    observacoes: '',
    servicos: [],
    materiais: [],
    desconto: '',
    taxaEntrega: 0,
    outrasTaxas: 0,
    condicoesPagamento: '',
    meiosPagamento: '',
    garantia: '',
    clausulasContratuais: '',
    informacoesAdicionais: '',
    anotacoes: '',
    relatorio: '',
    fotos: [],
    pagamentos: [],
    custos: []
  });

  const [secoes, setSecoes] = useState({
    informacoesBasicas: true, // Cliente sempre visível
    informacoesDetalhadas: false, // Começa minimizado
    compromissos: false,
    pedido: false,
    detalhes: false,
    fotos: false
  });

  // Estados dos modais
  const [modalSelecionarServico, setModalSelecionarServico] = useState(false);
  const [modalMaterial, setModalMaterial] = useState({ isOpen: false, editando: null });
  const [modalPagamento, setModalPagamento] = useState({ isOpen: false, editando: null });
  const [modalCusto, setModalCusto] = useState({ isOpen: false, editando: null });
  const [modalDesconto, setModalDesconto] = useState({ isOpen: false });
  
  // Estados dos calendários
  const [calendarioAberto, setCalendarioAberto] = useState(null); // 'validade', 'prazo', null
  
  // Estados para fotos
  const [mostrarOpcoesFoto, setMostrarOpcoesFoto] = useState(false);
  const [galeriaAberta, setGaleriaAberta] = useState(false);
  const [fotoSelecionada, setFotoSelecionada] = useState(0);

  // Atualiza cliente quando props mudam
  useEffect(() => {
    if (clienteInicial) {
      setClienteSelecionado(clienteInicial);
    }
  }, [clienteInicial]);

  useEffect(() => {
    if (isOpen) {
      // Se tem pedido existente, carrega os dados dele
      if (pedidoExistente) {
        setFormData({
          numero: pedidoExistente.numero || numeroPedido,
          status: pedidoExistente.status || 'aguardando',
          referencia: pedidoExistente.referencia || '',
          validadeOrcamento: pedidoExistente.validadeOrcamento || '',
          prazoExecucao: pedidoExistente.prazoExecucao || '',
          horarioInicio: pedidoExistente.horarioInicio || '',
          horarioTermino: pedidoExistente.horarioTermino || '',
          observacoes: pedidoExistente.observacoes || '',
          servicos: pedidoExistente.servicos || [],
          materiais: pedidoExistente.materiais || [],
          desconto: pedidoExistente.desconto !== undefined && pedidoExistente.desconto !== null ? pedidoExistente.desconto : '',
          taxaEntrega: pedidoExistente.taxaEntrega || 0,
          outrasTaxas: pedidoExistente.outrasTaxas || 0,
          condicoesPagamento: pedidoExistente.condicoesPagamento || '',
          meiosPagamento: pedidoExistente.meiosPagamento || '',
          garantia: pedidoExistente.garantia || '',
          clausulasContratuais: pedidoExistente.clausulasContratuais || '',
          informacoesAdicionais: pedidoExistente.informacoesAdicionais || '',
          anotacoes: pedidoExistente.anotacoes || '',
          relatorio: pedidoExistente.relatorio || '',
          fotos: pedidoExistente.fotos || [],
          pagamentos: pedidoExistente.pagamentos || [],
          custos: pedidoExistente.custos || []
        });
        
        // Carrega cliente do pedido existente
        if (pedidoExistente.clienteId && CLI) {
          const cliente = Object.values(CLI).find(c => c.id === pedidoExistente.clienteId);
          if (cliente) {
            setClienteSelecionado(cliente);
          }
        }
      } else {
        // Novo pedido
        setFormData({
          numero: numeroPedido,
          status: 'aguardando',
          referencia: '',
          validadeOrcamento: '',
          prazoExecucao: '',
          horarioInicio: '',
          horarioTermino: '',
          observacoes: '',
          servicos: [],
          materiais: [],
          desconto: '',
          taxaEntrega: 0,
          outrasTaxas: 0,
          condicoesPagamento: '',
          meiosPagamento: '',
          garantia: '',
          clausulasContratuais: '',
          informacoesAdicionais: '',
          anotacoes: '',
          relatorio: '',
          fotos: [],
          pagamentos: [],
          custos: []
        });
        setClienteSelecionado(clienteInicial || null);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, numeroPedido, pedidoExistente, clienteInicial]);

  const toggleSecao = (secao) => {
    setSecoes(prev => ({ ...prev, [secao]: !prev[secao] }));
  };

  const updateFormData = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const preencherReferenciaDoCliente = useCallback((cliente) => {
    if (!cliente || !cliente.endereco) return;

    const endereco = cliente.endereco;
    const enderecoCompleto = [
      endereco.logradouro,
      endereco.numero,
      endereco.complemento,
      endereco.bairro,
      endereco.cidade,
      endereco.estado
    ].filter(Boolean).join(', ');

    if (enderecoCompleto) {
      updateFormData('referencia', enderecoCompleto);
    }
  }, [updateFormData]);

  // Handlers para Cliente
  const handleAbrirSelecionarCliente = () => {
    setShowClienteModal(true);
  };

  const handleClienteSelecionado = (cliente) => {
    setClienteSelecionado(cliente);
    setShowClienteModal(false);
    preencherReferenciaDoCliente(cliente);
  };

  useEffect(() => {
    if (clienteInicial && isOpen) {
      setClienteSelecionado(clienteInicial);
      preencherReferenciaDoCliente(clienteInicial);
    }
  }, [clienteInicial, isOpen]);

  // Handlers para Serviços
  /*
  const handleAbrirSelecionarServico = () => {
    setModalSelecionarServico(true);
  };
  */

  const handleAdicionarServico = (servico) => {
    updateFormData('servicos', [...formData.servicos, servico]);
    setModalSelecionarServico(false);
  };

  /*
  const handleRemoverServico = (id) => {
    if (window.confirm('Remover este serviço?')) {
      const novosServicos = formData.servicos.filter(s => s.id !== id);
      updateFormData('servicos', novosServicos);
    }
  };
  */

  // Handlers para Materiais
  /*
  const handleAbrirMaterialModal = (material = null) => {
    setModalMaterial({ isOpen: true, editando: material });
  };
  */

  const handleSalvarMaterial = (material) => {
    if (modalMaterial.editando) {
      // Editando
      const novosMateriais = formData.materiais.map(m => 
        m.id === material.id ? material : m
      );
      updateFormData('materiais', novosMateriais);
    } else {
      // Adicionando
      updateFormData('materiais', [...formData.materiais, material]);
    }
    setModalMaterial({ isOpen: false, editando: null });
  };

  /*
  const handleRemoverMaterial = (id) => {
    if (window.confirm('Remover este material?')) {
      const novosMateriais = formData.materiais.filter(m => m.id !== id);
      updateFormData('materiais', novosMateriais);
    }
  };
  */

  // Handlers para Pagamentos
  /*
  const handleAbrirPagamentoModal = (pagamento = null) => {
    setModalPagamento({ isOpen: true, editando: pagamento });
  };
  */

  const handleSalvarPagamento = (pagamento) => {
    if (modalPagamento.editando) {
      // Editando
      const novosPagamentos = formData.pagamentos.map(p => 
        p.id === pagamento.id ? pagamento : p
      );
      updateFormData('pagamentos', novosPagamentos);
    } else {
      // Adicionando
      updateFormData('pagamentos', [...formData.pagamentos, pagamento]);
    }
    setModalPagamento({ isOpen: false, editando: null });
  };

  /*
  const handleRemoverPagamento = (id) => {
    if (window.confirm('Remover este pagamento?')) {
      const novosPagamentos = formData.pagamentos.filter(p => p.id !== id);
      updateFormData('pagamentos', novosPagamentos);
    }
  };
  */

  // Handlers para Custos
  /*
  const handleAbrirCustoModal = (custo = null) => {
    setModalCusto({ isOpen: true, editando: custo });
  };
  */

  const handleSalvarCusto = (custo) => {
    if (modalCusto.editando) {
      // Editando
      const novosCustos = formData.custos.map(c => 
        c.id === custo.id ? custo : c
      );
      updateFormData('custos', novosCustos);
    } else {
      // Adicionando
      updateFormData('custos', [...formData.custos, custo]);
    }
    setModalCusto({ isOpen: false, editando: null });
  };

  /*
  const handleRemoverCusto = (id) => {
    if (window.confirm('Remover este custo?')) {
      const novosCustos = formData.custos.filter(c => c.id !== id);
      updateFormData('custos', novosCustos);
    }
  };
  */

  // Handlers para Fotos
  const handleSelecionarFoto = async (origem) => {
    setMostrarOpcoesFoto(false);
    
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      if (origem === 'camera') {
        input.capture = 'environment'; // Abre câmera no mobile
      }
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const novaFoto = {
              id: uid(),
              url: event.target.result,
              nome: file.name,
              data: hoje(),
              tamanho: file.size
            };
            updateFormData('fotos', [...formData.fotos, novaFoto]);
          };
          reader.readAsDataURL(file);
        }
      };
      
      input.click();
    } catch (error) {
      console.error('Erro ao selecionar foto:', error);
      alert('Erro ao selecionar foto. Tente novamente.');
    }
  };

  const handleAbrirGaleria = (index = 0) => {
    setFotoSelecionada(index);
    setGaleriaAberta(true);
  };

  const handleRemoverFoto = (id) => {
    if (window.confirm('Remover esta foto?')) {
      const novasFotos = formData.fotos.filter(f => f.id !== id);
      updateFormData('fotos', novasFotos);
      
      // Se estava na galeria e removeu a última foto, fecha
      if (galeriaAberta && novasFotos.length === 0) {
        setGaleriaAberta(false);
      }
      // Se removeu a foto atual, ajusta o índice
      else if (galeriaAberta && fotoSelecionada >= novasFotos.length) {
        setFotoSelecionada(Math.max(0, novasFotos.length - 1));
      }
    }
  };

  const navegarGaleria = (direcao) => {
    const novoIndex = fotoSelecionada + direcao;
    if (novoIndex >= 0 && novoIndex < formData.fotos.length) {
      setFotoSelecionada(novoIndex);
    }
  };

  // Calcula totais
  const calcularTotais = () => {
    const totalServicos = formData.servicos.reduce((acc, s) => acc + (s.valorUnitario * s.quantidade), 0);
    const totalMateriais = formData.materiais.reduce((acc, m) => acc + (m.valorUnitario * m.quantidade), 0);
    const subtotal = totalServicos + totalMateriais;
    const descontoNum = parseFloat(formData.desconto) || 0;
    const total = subtotal - descontoNum;
    
    const totalRecebido = formData.pagamentos
      .filter(p => p.status === 'recebido')
      .reduce((acc, p) => acc + p.valor, 0);
    
    const totalCustos = formData.custos.reduce((acc, c) => acc + c.valor, 0);
    const resultado = totalRecebido - totalCustos;

    return { totalServicos, totalMateriais, subtotal, total, totalRecebido, totalCustos, resultado };
  };

  const totais = calcularTotais();

  // Calcula status financeiro
  /*
  const calcularStatusFinanceiro = () => {
    const valorPedido = totais.total;
    const valorRecebido = totais.totalRecebido;
    const percentualRecebido = valorPedido > 0 ? (valorRecebido / valorPedido) * 100 : 0;

    if (valorRecebido >= valorPedido) {
      return { status: 'quitado', label: 'Quitado', cor: '#10b981', icon: '✓', percentual: 100 };
    } else if (valorRecebido > 0) {
      return { status: 'parcial', label: 'Parcialmente pago', cor: '#f5a623', icon: '⏳', percentual: percentualRecebido };
    } else {
      return { status: 'pendente', label: 'Pagamento pendente', cor: '#f06070', icon: '●', percentual: 0 };
    }
  };
  */

  // const statusFinanceiro = calcularStatusFinanceiro();

  const handleSalvarPedido = () => {
    if (!clienteSelecionado) {
      alert('⚠️ Selecione um cliente antes de salvar o pedido!');
      return;
    }

    const descontoNum = parseFloat(formData.desconto) || 0;
    const pedido = {
      id: pedidoExistente?.id || uid(),
      numero: formData.numero,
      clienteId: clienteSelecionado.id,
      clienteNome: clienteSelecionado.nome,
      clienteTelefone: clienteSelecionado.whatsapp || clienteSelecionado.telefone,
      ...formData,
      desconto: descontoNum,
      criadoEm: pedidoExistente?.criadoEm || hoje(),
      atualizadoEm: hoje(),
      timestamp: Date.now(),
      total: totais.total
    };

    console.log('💾 Salvando pedido:', { 
      id: pedido.id, 
      numero: pedido.numero, 
      status: pedido.status,
      formDataStatus: formData.status 
    });

    const novoORC = { ...ORC, [pedido.id]: pedido };
    setORC(novoORC);
    
    const acao = pedidoExistente ? 'atualizado' : 'salvo';
    const statusInfo = statusOpcoes.find(s => s.valor === formData.status);
    alert(`✅ Pedido ${formData.numero} ${acao} com sucesso!\nStatus: ${statusInfo?.label || formData.status}`);
    // setStatusAlterado(false); // Comentado - variável não usada
    onClose();
  };

  /*
  const handleGerarDocumento = () => {
    if (!clienteSelecionado) {
      alert('⚠️ Selecione um cliente antes de gerar o documento!');
      return;
    }

    // Primeiro salva o pedido
    const pedido = {
      id: pedidoExistente?.id || uid(),
      numero: formData.numero,
      clienteId: clienteSelecionado.id,
      clienteNome: clienteSelecionado.nome,
      clienteTelefone: clienteSelecionado.whatsapp || clienteSelecionado.telefone,
      ...formData,
      criadoEm: pedidoExistente?.criadoEm || hoje(),
      atualizadoEm: hoje(),
      timestamp: Date.now(),
      total: totais?.total || 0
    };

    const novoORC = { ...ORC, [pedido.id]: pedido };
    setORC(novoORC);

    // Calcula valores com segurança
    const totalServicos = formData.servicos.reduce((acc, s) => {
      const valor = (s.valorUnitario || s.preco || 0);
      const qtd = (s.quantidade || 1);
      return acc + (valor * qtd);
    }, 0);

    const totalMateriais = formData.materiais.reduce((acc, m) => {
      const valor = (m.valorUnitario || m.preco || 0);
      const qtd = (m.quantidade || 1);
      return acc + (valor * qtd);
    }, 0);

    const subtotal = totalServicos + totalMateriais;
    const desconto = parseFloat(formData.desconto) || 0;
    const valorTotal = subtotal - desconto;

    const totalPago = formData.pagamentos.reduce((sum, p) => sum + (p.valor || 0), 0);
    const valorPendente = valorTotal - totalPago;

    // Gera o documento HTML
    const docHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Pedido ${formData.numero} - ${clienteSelecionado.nome}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 40px;
      color: #333;
      background: white;
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #6c63ff;
    }
    .logo h1 {
      font-size: 32px;
      color: #6c63ff;
      margin-bottom: 5px;
    }
    .logo p {
      color: #666;
      font-size: 14px;
    }
    .header {
      margin-bottom: 30px;
      text-align: center;
    }
    .header h2 {
      font-size: 24px;
      color: #333;
      margin-bottom: 10px;
    }
    .header .info {
      font-size: 14px;
      color: #666;
    }
    .bloco {
      margin-bottom: 30px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }
    .bloco-titulo {
      background: #6c63ff;
      color: white;
      padding: 12px 20px;
      font-size: 18px;
      font-weight: 600;
    }
    .bloco-conteudo {
      padding: 20px;
    }
    .info-linha {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .info-linha:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #666;
      width: 150px;
    }
    .info-valor {
      flex: 1;
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th {
      background: #f5f5f5;
      padding: 10px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #ddd;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .total-linha {
      font-weight: 600;
      font-size: 16px;
      background: #f9f9f9;
    }
    .destaque {
      background: #fff3cd;
      padding: 15px;
      border-radius: 6px;
      margin-top: 15px;
      border-left: 4px solid #ffc107;
    }
    .destaque strong {
      color: #856404;
    }
    .sucesso {
      background: #d4edda;
      border-left-color: #28a745;
    }
    .sucesso strong {
      color: #155724;
    }
    @media print {
      body { padding: 20px; }
      .bloco { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <!-- Logo -->
  <div class="logo">
    <h1>⚡ Mestre.IA</h1>
    <p>Gestão Inteligente de Serviços</p>
  </div>

  <!-- Header -->
  <div class="header">
    <h2>Pedido Nº ${formData.numero}</h2>
    <div class="info">
      <strong>Status:</strong> ${statusOpcoes.find(s => s.valor === formData.status)?.label || formData.status} | 
      <strong>Data:</strong> ${pedido.criadoEm}
      ${formData.referencia ? ` | <strong>Ref:</strong> ${formData.referencia}` : ''}
    </div>
  </div>

  <!-- Bloco 1: Dados do Cliente -->
  <div class="bloco">
    <div class="bloco-titulo">📋 Dados do Cliente</div>
    <div class="bloco-conteudo">
      <div class="info-linha">
        <div class="info-label">Nome:</div>
        <div class="info-valor">${clienteSelecionado.nome}</div>
      </div>
      <div class="info-linha">
        <div class="info-label">Telefone:</div>
        <div class="info-valor">${clienteSelecionado.telefone || clienteSelecionado.whatsapp || 'Não informado'}</div>
      </div>
      ${clienteSelecionado.whatsapp ? `
      <div class="info-linha">
        <div class="info-label">WhatsApp:</div>
        <div class="info-valor">${clienteSelecionado.whatsapp}</div>
      </div>
      ` : ''}
      ${clienteSelecionado.endereco ? `
      <div class="info-linha">
        <div class="info-label">Endereço:</div>
        <div class="info-valor">${clienteSelecionado.endereco}</div>
      </div>
      ` : ''}
      ${clienteSelecionado.email ? `
      <div class="info-linha">
        <div class="info-label">E-mail:</div>
        <div class="info-valor">${clienteSelecionado.email}</div>
      </div>
      ` : ''}
    </div>
  </div>

  <!-- Bloco 2: Orçamento -->
  <div class="bloco">
    <div class="bloco-titulo">💰 Orçamento</div>
    <div class="bloco-conteudo">
      ${formData.servicos.length > 0 ? `
        <h3 style="margin-bottom: 10px; color: #666; font-size: 16px;">Serviços</h3>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th style="text-align: center;">Qtd</th>
              <th style="text-align: right;">Valor Unit.</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${formData.servicos.map(s => {
              const valorUnit = s.valorUnitario || s.preco || 0;
              const qtd = s.quantidade || 1;
              return `
              <tr>
                <td>${s.descricao}</td>
                <td style="text-align: center;">${qtd} ${s.unidade || ''}</td>
                <td style="text-align: right;">R$ ${valorUnit.toFixed(2).replace('.', ',')}</td>
                <td style="text-align: right;">R$ ${(valorUnit * qtd).toFixed(2).replace('.', ',')}</td>
              </tr>
              `;
            }).join('')}
            <tr class="total-linha">
              <td colspan="3" style="text-align: right;">Subtotal Serviços:</td>
              <td style="text-align: right;">R$ ${totalServicos.toFixed(2).replace('.', ',')}</td>
            </tr>
          </tbody>
        </table>
      ` : '<p style="color: #999;">Nenhum serviço adicionado</p>'}

      ${formData.materiais.length > 0 ? `
        <h3 style="margin: 20px 0 10px 0; color: #666; font-size: 16px;">Materiais</h3>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th style="text-align: center;">Qtd</th>
              <th style="text-align: right;">Valor Unit.</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${formData.materiais.map(m => {
              const valorUnit = m.valorUnitario || m.preco || 0;
              const qtd = m.quantidade || 1;
              return `
              <tr>
                <td>${m.descricao}</td>
                <td style="text-align: center;">${qtd}</td>
                <td style="text-align: right;">R$ ${valorUnit.toFixed(2).replace('.', ',')}</td>
                <td style="text-align: right;">R$ ${(valorUnit * qtd).toFixed(2).replace('.', ',')}</td>
              </tr>
              `;
            }).join('')}
            <tr class="total-linha">
              <td colspan="3" style="text-align: right;">Subtotal Materiais:</td>
              <td style="text-align: right;">R$ ${totalMateriais.toFixed(2).replace('.', ',')}</td>
            </tr>
          </tbody>
        </table>
      ` : ''}

      ${desconto > 0 ? `
        <div style="margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 6px;">
          <div style="display: flex; justify-content: space-between;">
            <strong>Desconto:</strong>
            <strong style="color: #28a745;">- R$ ${desconto.toFixed(2).replace('.', ',')}</strong>
          </div>
        </div>
      ` : ''}

      <div style="margin-top: 20px; padding: 15px; background: #6c63ff; color: white; border-radius: 6px; text-align: center;">
        <div style="font-size: 14px; margin-bottom: 5px;">VALOR TOTAL</div>
        <div style="font-size: 28px; font-weight: bold;">R$ ${valorTotal.toFixed(2).replace('.', ',')}</div>
      </div>

      ${formData.condicoesPagamento ? `
        <div style="margin-top: 15px;">
          <strong>Condições de Pagamento:</strong>
          <p style="margin-top: 5px; color: #666;">${formData.condicoesPagamento}</p>
        </div>
      ` : ''}

      ${formData.informacoesAdicionais ? `
        <div style="margin-top: 15px;">
          <strong>Informações Adicionais:</strong>
          <p style="margin-top: 5px; color: #666;">${formData.informacoesAdicionais}</p>
        </div>
      ` : ''}
    </div>
  </div>

  <!-- Bloco 3: Pagamentos -->
  <div class="bloco">
    <div class="bloco-titulo">💳 Pagamentos e Pendências</div>
    <div class="bloco-conteudo">
      ${formData.pagamentos.length > 0 ? `
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Forma de Pagamento</th>
              <th style="text-align: right;">Valor</th>
            </tr>
          </thead>
          <tbody>
            ${formData.pagamentos.map(p => `
              <tr>
                <td>${p.data || 'Não informado'}</td>
                <td>${p.forma || 'Não informado'}</td>
                <td style="text-align: right;">R$ ${(p.valor || 0).toFixed(2).replace('.', ',')}</td>
              </tr>
            `).join('')}
            <tr class="total-linha">
              <td colspan="2" style="text-align: right;">Total Pago:</td>
              <td style="text-align: right;">R$ ${totalPago.toFixed(2).replace('.', ',')}</td>
            </tr>
          </tbody>
        </table>
      ` : '<p style="color: #999;">Nenhum pagamento registrado</p>'}

      ${valorPendente > 0 ? `
        <div class="destaque">
          <strong>⚠️ Valor Pendente:</strong> R$ ${valorPendente.toFixed(2).replace('.', ',')}
        </div>
      ` : valorPendente === 0 && totalPago > 0 ? `
        <div class="destaque sucesso">
          <strong>✓ Pagamento Concluído!</strong> Não há valores pendentes.
        </div>
      ` : ''}
    </div>
  </div>

  <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center; color: #999; font-size: 12px;">
    <p>Documento gerado em ${hoje()} via Mestre.IA</p>
  </div>
</body>
</html>
    `;

    // Abre em nova janela para impressão
    const janelaImpressao = window.open('', '_blank');
    janelaImpressao.document.write(docHTML);
    janelaImpressao.document.close();
    
    // Aguarda carregar e abre o diálogo de impressão
    setTimeout(() => {
      janelaImpressao.print();
    }, 500);
  };
  */

  // Status disponíveis
  const statusOpcoes = [
    { valor: 'pendente', label: 'Pendente', cor: '#f5a623' },
    { valor: 'aguardando', label: 'Aguardando aprovação', cor: '#f5a623' },
    { valor: 'aprovado', label: 'Aprovado', cor: '#4a90e2' },
    { valor: 'em_andamento', label: 'Em andamento', cor: '#4a90e2' },
    { valor: 'aguardando_pagamento', label: 'Aguardando pagamento', cor: '#4a90e2' },
    { valor: 'concluido', label: 'Concluído', cor: '#10b981' },
    { valor: 'garantia', label: 'Garantia', cor: '#10b981' },
    { valor: 'cancelado', label: 'Cancelado', cor: '#f06070' }
  ];

  // const statusAtual = statusOpcoes.find(s => s.valor === formData.status) || statusOpcoes[0];

  // Botões do footer (fixos no rodapé)
  const footerButtons = (
    <>
      <button
        onClick={onClose}
        style={{
          padding: '12px 24px',
          background: 'var(--bg3)',
          border: 'none',
          borderRadius: '8px',
          color: 'var(--text)',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        Cancelar
      </button>
      <button
        onClick={handleSalvarPedido}
        style={{
          padding: '12px 24px',
          background: 'var(--accent)',
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        Salvar Pedido
      </button>
    </>
  );

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        titulo={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span>Pedido n. {formData.numero}</span>
            <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: '400' }}>{hoje()}</span>
          </div>
        }
        footer={footerButtons}
      >
        <div style={{ marginBottom: '16px' }}>
          {/* SEÇÃO: Cliente e Referência (SEMPRE VISÍVEL) */}
          <div style={{ marginBottom: '16px', paddingLeft: '8px', paddingRight: '8px' }}>
            {/* Campo Selecionar Cliente */}
            <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
              Selecione ou adicione um cliente
            </label>
            <button
              onClick={handleAbrirSelecionarCliente}
              style={{
                width: '100%',
                padding: '10px 12px',
                marginBottom: '12px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: clienteSelecionado ? 'var(--text)' : 'var(--muted)',
                fontSize: '14px',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              {clienteSelecionado ? clienteSelecionado.nome : 'Selecione o cliente...'}
            </button>

            {/* Referência */}
            <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
              Referência
            </label>
            <input
              type="text"
              value={formData.referencia}
              onChange={(e) => updateFormData('referencia', e.target.value)}
              placeholder="Observações importantes"
              style={{
                width: '100%',
                padding: '10px 12px',
                marginBottom: '12px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)',
                fontSize: '14px'
              }}
            />
          </div>

          {/* SEÇÃO: Informações Básicas (Validade, Prazo, Horários, etc) */}
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={() => toggleSecao('informacoesDetalhadas')}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--bg2)',
                border: 'none',
                borderRadius: '8px',
                color: 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '15px',
                fontWeight: '600',
                marginBottom: secoes.informacoesDetalhadas ? '12px' : '0'
              }}
            >
              <span>Informações Básicas</span>
              <span style={{ 
                fontSize: '18px', 
                transition: 'transform 0.2s',
                transform: secoes.informacoesDetalhadas ? 'rotate(90deg)' : 'rotate(0)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--bg3)'
              }}>
                &gt;
              </span>
            </button>

            {secoes.informacoesDetalhadas && (
              <div style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                {/* Validade do orçamento */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                    Validade do orçamento
                  </label>
                  <input
                    type="text"
                    value={formData.validadeOrcamento ? new Date(formData.validadeOrcamento + 'T00:00:00').toLocaleDateString('pt-BR') : ''}
                    onClick={() => setCalendarioAberto('validade')}
                    readOnly
                    placeholder="Clique para selecionar"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                {/* Prazo de execução */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                    Prazo de execução
                  </label>
                  <input
                    type="text"
                    value={formData.prazoExecucao ? new Date(formData.prazoExecucao + 'T00:00:00').toLocaleDateString('pt-BR') : ''}
                    onClick={() => setCalendarioAberto('prazo')}
                    readOnly
                    placeholder="Clique para selecionar"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                {/* Horário de início */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                    Horário de início
                  </label>
                  <input
                    type="time"
                    value={formData.horarioInicio}
                    onChange={(e) => updateFormData('horarioInicio', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Horário de término */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                    Horário de término
                  </label>
                  <input
                    type="time"
                    value={formData.horarioTermino}
                    onChange={(e) => updateFormData('horarioTermino', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Duração do serviço (calculado automaticamente) */}
                {formData.horarioInicio && formData.horarioTermino && (
                  <div style={{
                    padding: '10px 12px',
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: 'var(--muted)',
                    marginBottom: '12px'
                  }}>
                    Duração do serviço: {(() => {
                      const [h1, m1] = formData.horarioInicio.split(':').map(Number);
                      const [h2, m2] = formData.horarioTermino.split(':').map(Number);
                      const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
                      const hours = Math.floor(diff / 60);
                      const mins = diff % 60;
                      return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
                    })()}
                  </div>
                )}

                {/* Observações */}
                <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                  Observações
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => updateFormData('observacoes', e.target.value)}
                  placeholder="Observações gerais sobre o pedido..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    marginBottom: '12px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                />
              </div>
            )}
          </div>

          {/* SEÇÃO: Compromissos */}
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={() => toggleSecao('compromissos')}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--bg2)',
                border: 'none',
                borderRadius: '8px',
                color: 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '15px',
                fontWeight: '600',
                marginBottom: secoes.compromissos ? '12px' : '0'
              }}
            >
              <span>Compromissos</span>
              <span style={{ 
                fontSize: '18px', 
                transition: 'transform 0.2s',
                transform: secoes.compromissos ? 'rotate(90deg)' : 'rotate(0)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--bg3)'
              }}>
                &gt;
              </span>
            </button>

            {secoes.compromissos && (
              <div style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                {/* Marcar visita técnica */}
                <button
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '10px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>🔧</span>
                    <span>Marcar visita técnica</span>
                  </div>
                  <span style={{
                    width: '32px',
                    height: '32px',
                    background: 'var(--accent)',
                    border: 'none',
                    borderRadius: '50%',
                    color: '#fff',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    +
                  </span>
                </button>

                {/* Marcar compromisso */}
                <button
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '10px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>📅</span>
                    <span>Marcar compromisso</span>
                  </div>
                  <span style={{
                    width: '32px',
                    height: '32px',
                    background: 'var(--accent)',
                    border: 'none',
                    borderRadius: '50%',
                    color: '#fff',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    +
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* SEÇÃO: Pedido (Serviços, Materiais, Desconto, Taxas) */}
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={() => toggleSecao('pedido')}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--bg2)',
                border: 'none',
                borderRadius: '8px',
                color: 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '15px',
                fontWeight: '600',
                marginBottom: secoes.pedido ? '12px' : '0'
              }}
            >
              <span>Pedido</span>
              <span style={{ 
                fontSize: '18px', 
                transition: 'transform 0.2s',
                transform: secoes.pedido ? 'rotate(90deg)' : 'rotate(0)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--bg3)'
              }}>
                &gt;
              </span>
            </button>

            {secoes.pedido && (
              <div style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                {/* Botão Serviços */}
                <button
                  onClick={() => setModalSelecionarServico(true)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '10px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>📋</span>
                    <span>Serviços</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {formData.servicos.length > 0 && (
                      <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '600' }}>
                        R$ {totais.totalServicos.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                    <span style={{
                      width: '32px',
                      height: '32px',
                      background: 'var(--accent)',
                      border: 'none',
                      borderRadius: '50%',
                      color: '#fff',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      +
                    </span>
                  </div>
                </button>

                {/* Lista de serviços */}
                {formData.servicos.length > 0 && (
                  <div style={{ marginBottom: '12px', marginLeft: '28px' }}>
                    {formData.servicos.map((servico, idx) => (
                      <div key={idx} style={{
                        padding: '8px',
                        marginBottom: '6px',
                        background: 'var(--bg3)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontWeight: '600' }}>{servico.nome}</div>
                          <div style={{ color: 'var(--muted)', marginTop: '2px' }}>
                            {servico.quantidade}x R$ {(servico.valorUnitario || servico.preco || 0).toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                        <div style={{ fontWeight: '600', color: 'var(--accent)' }}>
                          R$ {((servico.valorUnitario || servico.preco || 0) * servico.quantidade).toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Botão Materiais */}
                <button
                  onClick={() => setModalMaterial({ isOpen: true, editando: null })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '10px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>📦</span>
                    <span>Materiais</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {formData.materiais.length > 0 && (
                      <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '600' }}>
                        R$ {totais.totalMateriais.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                    <span style={{
                      width: '32px',
                      height: '32px',
                      background: 'var(--accent)',
                      border: 'none',
                      borderRadius: '50%',
                      color: '#fff',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      +
                    </span>
                  </div>
                </button>

                {/* Lista de materiais */}
                {formData.materiais.length > 0 && (
                  <div style={{ marginBottom: '12px', marginLeft: '28px' }}>
                    {formData.materiais.map((material, idx) => (
                      <div key={idx} style={{
                        padding: '8px',
                        marginBottom: '6px',
                        background: 'var(--bg3)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontWeight: '600' }}>{material.nome}</div>
                          <div style={{ color: 'var(--muted)', marginTop: '2px' }}>
                            {material.quantidade}x R$ {(material.valorUnitario || 0).toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                        <div style={{ fontWeight: '600', color: 'var(--accent)' }}>
                          R$ {((material.valorUnitario || 0) * material.quantidade).toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Desconto */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--text)', fontWeight: '600' }}>Desconto</div>
                      <div style={{ fontSize: '14px', color: formData.desconto ? 'var(--accent)' : 'var(--muted)' }}>
                        {formData.desconto === '' || formData.desconto === null || formData.desconto === undefined ? '_' : formatarMoeda(formData.desconto)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', marginTop: '26px' }}>
                    <button
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--accent)',
                        border: 'none',
                        borderRadius: '50%',
                        color: '#fff',
                        fontSize: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onClick={() => setModalDesconto({ isOpen: true })}
                    >
                      +
                    </button>
                    {formData.desconto && formData.desconto > 0 && (
                      <button
                        style={{
                          width: '40px',
                          height: '40px',
                          background: '#dc3545',
                          border: 'none',
                          borderRadius: '50%',
                          color: '#fff',
                          fontSize: '20px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => updateFormData('desconto', '')}
                        title="Remover desconto"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Taxa de entrega */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                      Taxa de entrega (R$)
                    </label>
                    <input
                      type="number"
                      value={formData.taxaEntrega}
                      onChange={(e) => updateFormData('taxaEntrega', parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                      step="0.01"
                      min="0"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text)',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <button
                    style={{
                      marginTop: '26px',
                      width: '40px',
                      height: '40px',
                      background: 'var(--accent)',
                      border: 'none',
                      borderRadius: '50%',
                      color: '#fff',
                      fontSize: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Outras taxas */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                      Outras taxas (R$)
                    </label>
                    <input
                      type="number"
                      value={formData.outrasTaxas}
                      onChange={(e) => updateFormData('outrasTaxas', parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                      step="0.01"
                      min="0"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text)',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <button
                    style={{
                      marginTop: '26px',
                      width: '40px',
                      height: '40px',
                      background: 'var(--accent)',
                      border: 'none',
                      borderRadius: '50%',
                      color: '#fff',
                      fontSize: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Total */}
                <div style={{
                  padding: '14px',
                  background: 'var(--bg3)',
                  border: '2px solid var(--accent)',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '15px', fontWeight: '600' }}>Total</span>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--accent)' }}>
                    R$ {(totais.subtotal - (parseFloat(formData.desconto) || 0) + formData.taxaEntrega + formData.outrasTaxas).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* SEÇÃO: Detalhes */}
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={() => toggleSecao('detalhes')}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--bg2)',
                border: 'none',
                borderRadius: '8px',
                color: 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '15px',
                fontWeight: '600',
                marginBottom: secoes.detalhes ? '12px' : '0'
              }}
            >
              <span>Detalhes</span>
              <span style={{ 
                fontSize: '18px', 
                transition: 'transform 0.2s',
                transform: secoes.detalhes ? 'rotate(90deg)' : 'rotate(0)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--bg3)'
              }}>
                &gt;
              </span>
            </button>

            {secoes.detalhes && (
              <div style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                {/* Condições de pagamento */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                      Condições de pagamento
                    </label>
                    <textarea
                      value={formData.condicoesPagamento}
                      onChange={(e) => updateFormData('condicoesPagamento', e.target.value)}
                      placeholder="Ex: Sinal de 50% e restante após conclusão..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text)',
                        fontSize: '14px',
                        minHeight: '60px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  <button
                    style={{
                      marginTop: '26px',
                      width: '40px',
                      height: '40px',
                      background: 'var(--accent)',
                      border: 'none',
                      borderRadius: '50%',
                      color: '#fff',
                      fontSize: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Meios de pagamento */}
                <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                  Meios de pagamento
                </label>
                <div style={{
                  padding: '10px 12px',
                  marginBottom: '12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--muted)',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}>
                  Boleto, transferência bancária, dinheiro, cheque, cartão de créd...
                </div>

                {/* Garantia */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                      Garantia
                    </label>
                    <textarea
                      value={formData.garantia}
                      onChange={(e) => updateFormData('garantia', e.target.value)}
                      placeholder="Informações sobre garantia..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text)',
                        fontSize: '14px',
                        minHeight: '60px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  <button
                    style={{
                      marginTop: '26px',
                      width: '40px',
                      height: '40px',
                      background: 'var(--accent)',
                      border: 'none',
                      borderRadius: '50%',
                      color: '#fff',
                      fontSize: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Cláusulas contratuais */}
                <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                  Cláusulas contratuais
                </label>
                <div style={{
                  padding: '10px 12px',
                  marginBottom: '12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--muted)',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}>
                  Adicionar cláusulas
                </div>

                {/* Informações adicionais */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                      Informações adicionais
                    </label>
                    <textarea
                      value={formData.informacoesAdicionais}
                      onChange={(e) => updateFormData('informacoesAdicionais', e.target.value)}
                      placeholder="Informações extras..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text)',
                        fontSize: '14px',
                        minHeight: '60px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  <button
                    style={{
                      marginTop: '26px',
                      width: '40px',
                      height: '40px',
                      background: 'var(--accent)',
                      border: 'none',
                      borderRadius: '50%',
                      color: '#fff',
                      fontSize: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Anotações */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                      Anotações
                    </label>
                    <textarea
                      value={formData.anotacoes}
                      onChange={(e) => updateFormData('anotacoes', e.target.value)}
                      placeholder="Anotações internas..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text)',
                        fontSize: '14px',
                        minHeight: '60px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  <button
                    style={{
                      marginTop: '26px',
                      width: '40px',
                      height: '40px',
                      background: 'var(--accent)',
                      border: 'none',
                      borderRadius: '50%',
                      color: '#fff',
                      fontSize: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Relatório */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                      Relatório
                    </label>
                    <textarea
                      value={formData.relatorio}
                      onChange={(e) => updateFormData('relatorio', e.target.value)}
                      placeholder="Relatório do serviço..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text)',
                        fontSize: '14px',
                        minHeight: '60px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  <button
                    style={{
                      marginTop: '26px',
                      width: '40px',
                      height: '40px',
                      background: 'var(--accent)',
                      border: 'none',
                      borderRadius: '50%',
                      color: '#fff',
                      fontSize: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SEÇÃO: Fotos */}
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={() => toggleSecao('fotos')}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--bg2)',
                border: 'none',
                borderRadius: '8px',
                color: 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '15px',
                fontWeight: '600',
                marginBottom: secoes.fotos ? '12px' : '0'
              }}
            >
              <span>Fotos</span>
              <span style={{ 
                fontSize: '18px', 
                transition: 'transform 0.2s',
                transform: secoes.fotos ? 'rotate(90deg)' : 'rotate(0)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--bg3)'
              }}>
                &gt;
              </span>
            </button>

            {secoes.fotos && (
              <div style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                {/* Botão inserir foto */}
                <button
                  onClick={() => setMostrarOpcoesFoto(true)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '10px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>🖼️</span>
                    <span>Inserir foto</span>
                  </div>
                  <span style={{
                    width: '32px',
                    height: '32px',
                    background: 'var(--accent)',
                    border: 'none',
                    borderRadius: '50%',
                    color: '#fff',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    +
                  </span>
                </button>

                {/* Grid de miniaturas (thumbnails) */}
                {formData.fotos.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth <= 480 ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    {formData.fotos.map((foto, idx) => (
                      <div 
                        key={foto.id} 
                        onClick={() => handleAbrirGaleria(idx)}
                        style={{
                          position: 'relative',
                          width: '100%',
                          paddingBottom: '100%',
                          background: 'var(--bg3)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: '2px solid transparent',
                          transition: 'border 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.border = '2px solid var(--accent)'}
                        onMouseLeave={(e) => e.currentTarget.style.border = '2px solid transparent'}
                      >
                        <img 
                          src={foto.url} 
                          alt={`Foto ${idx + 1}`} 
                          style={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover' 
                          }} 
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* NOTA: Botão "Salvar Pedido" agora está no FOOTER FIXO do Modal */}
      {/* Veja abaixo onde é passado para o Modal */}

      {/* Modal Selecionar Cliente */}
      <SelecionarClienteModal
        isOpen={showClienteModal}
        onClose={() => setShowClienteModal(false)}
        CLI={CLI}
        setCLI={setCLI}
        onClienteSelecionado={handleClienteSelecionado}
        ORC={ORC}
      />

      {/* Modals de adicionar itens */}
      <SelecionarServicoModal
        isOpen={modalSelecionarServico}
        onClose={() => setModalSelecionarServico(false)}
        onAdicionarServico={handleAdicionarServico}
      />

      <MaterialModal
        isOpen={modalMaterial.isOpen}
        onClose={() => setModalMaterial({ isOpen: false, editando: null })}
        onSalvar={handleSalvarMaterial}
        materialEditando={modalMaterial.editando}
      />

      <PagamentoModal
        isOpen={modalPagamento.isOpen}
        onClose={() => setModalPagamento({ isOpen: false, editando: null })}
        onSalvar={handleSalvarPagamento}
        pagamentoEditando={modalPagamento.editando}
      />

      <DescontoModal
        isOpen={modalDesconto.isOpen}
        onClose={() => setModalDesconto({ isOpen: false })}
        onApply={(valor) => { updateFormData('desconto', valor); setModalDesconto({ isOpen: false }); }}
        onRemove={() => { updateFormData('desconto', ''); setModalDesconto({ isOpen: false }); }}
        totais={totais}
      />

      <CustoModal
        isOpen={modalCusto.isOpen}
        onClose={() => setModalCusto({ isOpen: false, editando: null })}
        onSalvar={handleSalvarCusto}
        custoEditando={modalCusto.editando}
      />

      {/* Modal Calendário - Validade */}
      {calendarioAberto === 'validade' && (
        <CalendarioComAgenda
          isOpen={true}
          onClose={() => setCalendarioAberto(null)}
          onSelecionarData={(data) => updateFormData('validadeOrcamento', data)}
          dataSelecionada={formData.validadeOrcamento}
          AGENDA={AGENDA || []}
          ORC={ORC || {}}
          CLI={CLI || {}}
          setCLI={setCLI}
          setORC={setORC}
        />
      )}

      {/* Modal Calendário - Prazo */}
      {calendarioAberto === 'prazo' && (
        <CalendarioComAgenda
          isOpen={true}
          onClose={() => setCalendarioAberto(null)}
          onSelecionarData={(data) => updateFormData('prazoExecucao', data)}
          dataSelecionada={formData.prazoExecucao}
          AGENDA={AGENDA || []}
          ORC={ORC || {}}
          CLI={CLI || {}}
          setCLI={setCLI}
          setORC={setORC}
        />
      )}

      {/* Popup de seleção: Camera ou Galeria */}
      {mostrarOpcoesFoto && (
        <div
          onClick={() => setMostrarOpcoesFoto(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              border: '1px solid var(--border)'
            }}
          >
            {/* Título */}
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--text)',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              📸 Adicionar Foto
            </div>

            {/* Botões das opções */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => handleSelecionarFoto('camera')}
                style={{
                  padding: '16px',
                  background: 'var(--accent)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '24px' }}>📷</span>
                <span>Tirar Foto</span>
              </button>

              <button
                onClick={() => handleSelecionarFoto('galeria')}
                style={{
                  padding: '16px',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '24px' }}>🖼️</span>
                <span>Escolher da Galeria</span>
              </button>
            </div>

            {/* Botão cancelar */}
            <button
              onClick={() => setMostrarOpcoesFoto(false)}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '16px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal Galeria de Fotos */}
      {galeriaAberta && formData.fotos.length > 0 && (
        <div
          onClick={() => setGaleriaAberta(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }}
        >
          {/* Header com contador e botões */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#fff',
            fontSize: '16px',
            zIndex: 10001
          }}>
            <span>Foto {fotoSelecionada + 1} de {formData.fotos.length}</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoverFoto(formData.fotos[fotoSelecionada].id);
                }}
                style={{
                  padding: '8px 16px',
                  background: '#d32f2f',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🗑️ Excluir
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setGaleriaAberta(false);
                }}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ✕ Fechar
              </button>
            </div>
          </div>

          {/* Imagem principal */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90%',
              maxHeight: '70vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={formData.fotos[fotoSelecionada].url}
              alt={`Foto ${fotoSelecionada + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
          </div>

          {/* Botões de navegação */}
          {formData.fotos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navegarGaleria('anterior');
                }}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '50px',
                  height: '50px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  color: '#fff',
                  fontSize: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navegarGaleria('proximo');
                }}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '50px',
                  height: '50px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  color: '#fff',
                  fontSize: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ›
              </button>
            </>
          )}

          {/* Info da foto na parte inferior */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            color: '#fff',
            fontSize: '13px',
            textAlign: 'center',
            background: 'rgba(0,0,0,0.5)',
            padding: '10px',
            borderRadius: '6px'
          }}>
            <div>{formData.fotos[fotoSelecionada].nome}</div>
            <div style={{ opacity: 0.7, marginTop: '4px' }}>
              {formData.fotos[fotoSelecionada].data} • {(formData.fotos[fotoSelecionada].tamanho / 1024).toFixed(0)} KB
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PedidoModal;
