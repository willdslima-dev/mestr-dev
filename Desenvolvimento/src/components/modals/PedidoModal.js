import React, { useState, useEffect, useMemo } from 'react';
import Modal from './Modal';
import DescontoModal from './DescontoModal';
import SelecionarClienteModal from './SelecionarClienteModal';
import SelecionarServicoModal from './SelecionarServicoModal';
import MaterialModal from './MaterialModal';
import PagamentoModal from './PagamentoModal';
import CustoModal from './CustoModal';
import CalendarioComAgenda from './CalendarioComAgenda';
import TimePickerClock from './TimePickerClock';
import PaymentMethodSelector from './PaymentMethodSelector';
import StatusSelector from './StatusSelector';
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
    garantiaPeriodo: '',
    garantiaUnidade: 'meses',
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

  // Visibilidade de pickers controlados por +
  const [showHorarioInicioPicker, setShowHorarioInicioPicker] = useState(false);
  const [showHorarioTerminoPicker, setShowHorarioTerminoPicker] = useState(false);
  const [showCondicoesOptions, setShowCondicoesOptions] = useState(false);
  const [showTaxaEntregaEditor, setShowTaxaEntregaEditor] = useState(false);
  const [showOutrasTaxasEditor, setShowOutrasTaxasEditor] = useState(false);
  const [taxaEntregaPrev, setTaxaEntregaPrev] = useState(0);
  const [outrasTaxasPrev, setOutrasTaxasPrev] = useState(0);
  const [showStatusEditor, setShowStatusEditor] = useState(false);
  const [showObservacoesEditor, setShowObservacoesEditor] = useState(false);
  const [showGarantiaEditor, setShowGarantiaEditor] = useState(false);
  const [garantiaPeriodoPrev, setGarantiaPeriodoPrev] = useState('');
  const [garantiaUnidadePrev, setGarantiaUnidadePrev] = useState('meses');
  const [showInformacoesEditor, setShowInformacoesEditor] = useState(false);

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
      // Busca o pedido mais atualizado do ORC, não do prop
      let pedidoParaEditar = pedidoExistente;
      
      if (pedidoExistente && ORC && ORC[pedidoExistente.id]) {
        // Use o pedido do ORC se existir (versão mais atualizada)
        pedidoParaEditar = ORC[pedidoExistente.id];
      }
      
      // Se tem pedido para editar, carrega os dados dele
      if (pedidoParaEditar) {
        // Try to parse garantia like '12 meses' into fields
        let garantiaPeriodo = '';
        let garantiaUnidade = 'meses';
        if (pedidoParaEditar.garantia && typeof pedidoParaEditar.garantia === 'string') {
          const parts = pedidoParaEditar.garantia.split(' ');
          if (parts.length >= 2) {
            garantiaPeriodo = parts[0];
            garantiaUnidade = parts[1];
          } else {
            garantiaPeriodo = pedidoParaEditar.garantia;
          }
        }

        setFormData({
          numero: pedidoParaEditar.numero || numeroPedido,
          status: pedidoParaEditar.status || 'aguardando',
          referencia: pedidoParaEditar.referencia || '',
          validadeOrcamento: pedidoParaEditar.validadeOrcamento || '',
          prazoExecucao: pedidoParaEditar.prazoExecucao || '',
          horarioInicio: pedidoParaEditar.horarioInicio || '',
          horarioTermino: pedidoParaEditar.horarioTermino || '',
          observacoes: pedidoParaEditar.observacoes || '',
          servicos: pedidoParaEditar.servicos || [],
          materiais: pedidoParaEditar.materiais || [],
          desconto: pedidoParaEditar.desconto !== undefined && pedidoParaEditar.desconto !== null ? pedidoParaEditar.desconto : '',
          taxaEntrega: pedidoParaEditar.taxaEntrega || 0,
          outrasTaxas: pedidoParaEditar.outrasTaxas || 0,
          condicoesPagamento: pedidoParaEditar.condicoesPagamento || '',
          meiosPagamento: pedidoParaEditar.meiosPagamento || '',
          garantia: pedidoParaEditar.garantia || '',
          garantiaPeriodo: pedidoParaEditar.garantiaPeriodo || garantiaPeriodo,
          garantiaUnidade: pedidoParaEditar.garantiaUnidade || garantiaUnidade,
          clausulasContratuais: pedidoParaEditar.clausulasContratuais || '',
          informacoesAdicionais: pedidoParaEditar.informacoesAdicionais || '',
          anotacoes: pedidoParaEditar.anotacoes || '',
          relatorio: pedidoParaEditar.relatorio || '',
          fotos: pedidoParaEditar.fotos || [],
          pagamentos: pedidoParaEditar.pagamentos || [],
          custos: pedidoParaEditar.custos || []
        });
        
        // Carrega cliente do pedido existente
        if (pedidoParaEditar.clienteId && CLI) {
          const cliente = Object.values(CLI).find(c => c.id === pedidoParaEditar.clienteId);
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
  }, [isOpen, numeroPedido, pedidoExistente, ORC, clienteInicial]);

  const toggleSecao = (secao) => {
    setSecoes(prev => ({ ...prev, [secao]: !prev[secao] }));
  };

  const updateFormData = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const salvarGarantia = () => {
    const p = formData.garantiaPeriodo || garantiaPeriodoPrev || '';
    const u = formData.garantiaUnidade || garantiaUnidadePrev || 'meses';
    const texto = p === '0' ? 'Sem garantia' : (p ? `${p} ${u}` : '');
    updateFormData('garantia', texto);
    setShowGarantiaEditor(false);
  };

  const cancelarGarantiaEditor = () => {
    updateFormData('garantiaPeriodo', garantiaPeriodoPrev || '');
    updateFormData('garantiaUnidade', garantiaUnidadePrev || 'meses');
    setShowGarantiaEditor(false);
  };

  const abrirGarantiaEditor = () => {
    setGarantiaPeriodoPrev(formData.garantiaPeriodo || '');
    setGarantiaUnidadePrev(formData.garantiaUnidade || 'meses');
    setShowGarantiaEditor(true);
  };

  const removerGarantia = () => {
    updateFormData('garantia', '');
    updateFormData('garantiaPeriodo', '');
    updateFormData('garantiaUnidade', 'meses');
    setShowGarantiaEditor(false);
  };

  const garantiaBoxStyle = {
    marginTop: '8px',
    padding: '10px 12px',
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '13px',
    color: 'var(--muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px'
  };

  // Handlers para Cliente
  const handleAbrirSelecionarCliente = () => {
    setShowClienteModal(true);
  };

  const handleClienteSelecionado = (cliente) => {
    setClienteSelecionado(cliente);
    setShowClienteModal(false);

    if (cliente && cliente.endereco) {
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
    }
  };

  useEffect(() => {
    if (clienteInicial && isOpen && clienteInicial.endereco) {
      setClienteSelecionado(clienteInicial);
      const endereco = clienteInicial.endereco;
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

    // Respeitar escolha do usuário: usar formData.status se definido, caso contrário padrão 'aguardando'
    pedido.status = formData.status || 'aguardando';

    // Salva dataConclusao automaticamente quando status muda para concluido ou garantia
    const statusAnterior = pedidoExistente?.status;
    const statusAtual = pedido.status;
    if ((statusAtual === 'concluido' || statusAtual === 'garantia') && !pedidoExistente?.dataConclusao) {
      pedido.dataConclusao = hoje();
    } else if (pedidoExistente?.dataConclusao) {
      // Mantém a data de conclusão já registrada
      pedido.dataConclusao = pedidoExistente.dataConclusao;
    }

    console.log('💾 Salvando pedido:', { 
      id: pedido.id, 
      numero: pedido.numero, 
      status: pedido.status,
      formDataStatus: formData.status 
    });

    const novoORC = { ...ORC, [pedido.id]: pedido };
    setORC(novoORC);
    
    const acao = pedidoExistente ? 'atualizado' : 'salvo';
    const statusInfo = statusOpcoes.find(s => s.valor === pedido.status);
    alert(`✅ Pedido ${formData.numero} ${acao} com sucesso!\nStatus: ${statusInfo?.label || pedido.status}`);
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

            {/* Status do Pedido - editável somente se for pedido existente */}
            {pedidoExistente ? (
              <StatusSelector
                value={formData.status}
                onChange={(value) => updateFormData('status', value)}
                label="Status do Pedido"
              />
            ) : (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                  Status do Pedido
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {!showStatusEditor ? (
                    <>
                      <div style={{ padding: '6px 10px', background: formData.status === 'aprovado' ? '#10b981' : '#f5a623', color: '#fff', borderRadius: '10px', fontWeight: 700, fontSize: '13px' }}>
                        {formData.status === 'aprovado' ? '✅ Aprovado' : '⏳ Aguardando aprovação'}
                      </div>
                      <button
                        title="Editar status"
                        onClick={() => setShowStatusEditor(true)}
                        style={{
                          width: '28px',
                          height: '28px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          border: '1px solid var(--border)',
                          background: 'transparent',
                          color: 'var(--text)',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        ✎
                      </button>
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StatusSelector
                        value={formData.status}
                        onChange={(value) => { updateFormData('status', value); setShowStatusEditor(false); }}
                        label={null}
                      />
                      <button onClick={() => setShowStatusEditor(false)} style={{ padding: '6px 8px', borderRadius: '6px', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}>✕</button>
                    </div>
                  )}
                </div>
              </div>
            )}
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
                {/* Validade do orçamento - mostrar apenas se preenchido ou editor aberto */}
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                      Validade do orçamento
                    </label>
                    {(formData.validadeOrcamento || calendarioAberto === 'validade') && (
                      <div style={{ padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--muted)' }}>
                        {formData.validadeOrcamento ? new Date(formData.validadeOrcamento + 'T00:00:00').toLocaleDateString('pt-BR') : 'Clique para selecionar'}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setCalendarioAberto('validade')}
                    title="Selecionar validade"
                    style={{ width: '44px', height: '44px', background: 'var(--accent)', border: 'none', borderRadius: '50%', color: '#fff', fontSize: '20px', cursor: 'pointer' }}
                  >
                    +
                  </button>
                </div>

                {/* Prazo de execução - mostrar apenas se preenchido ou editor aberto */}
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                      Prazo de execução
                    </label>
                    {(formData.prazoExecucao || calendarioAberto === 'prazo') && (
                      <div style={{ padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--muted)' }}>
                        {formData.prazoExecucao ? new Date(formData.prazoExecucao + 'T00:00:00').toLocaleDateString('pt-BR') : 'Clique para selecionar'}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setCalendarioAberto('prazo')}
                    title="Selecionar prazo"
                    style={{ width: '44px', height: '44px', background: 'var(--accent)', border: 'none', borderRadius: '50%', color: '#fff', fontSize: '20px', cursor: 'pointer' }}
                  >
                    +
                  </button>
                </div>

                {/* Horário de início - renderiza só se preenchido ou picker aberto */}
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                      Horário de início
                    </label>
                    {(formData.horarioInicio || showHorarioInicioPicker) && (
                      <div>
                        <div style={{ padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--muted)' }}>
                          {formData.horarioInicio || 'Selecione o horário'}
                        </div>
                        {showHorarioInicioPicker && (
                          <div style={{ marginTop: '8px' }}>
                            <TimePickerClock
                              value={formData.horarioInicio}
                              onChange={(value) => updateFormData('horarioInicio', value)}
                              label={null}
                              hideInput={true}
                              autoOpen={true}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowHorarioInicioPicker(prev => !prev)}
                    title="Selecionar horário de início"
                    style={{ width: '44px', height: '44px', background: 'var(--accent)', border: 'none', borderRadius: '50%', color: '#fff', fontSize: '20px', cursor: 'pointer' }}
                  >
                    +
                  </button>
                </div>

                {/* Horário de término - renderiza só se preenchido ou picker aberto */}
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                      Horário de término
                    </label>
                    {(formData.horarioTermino || showHorarioTerminoPicker) && (
                      <div>
                        <div style={{ padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--muted)' }}>
                          {formData.horarioTermino || 'Selecione o horário'}
                        </div>
                        {showHorarioTerminoPicker && (
                          <div style={{ marginTop: '8px' }}>
                            <TimePickerClock
                              value={formData.horarioTermino}
                              onChange={(value) => updateFormData('horarioTermino', value)}
                              label={null}
                              hideInput={true}
                              autoOpen={true}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowHorarioTerminoPicker(prev => !prev)}
                    title="Selecionar horário de término"
                    style={{ width: '44px', height: '44px', background: 'var(--accent)', border: 'none', borderRadius: '50%', color: '#fff', fontSize: '20px', cursor: 'pointer' }}
                  >
                    +
                  </button>
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

                {/* Observações - só mostra a caixa se o usuário clicar no + */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                    Observações
                  </label>
                  {(formData.observacoes || showObservacoesEditor) && (
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
                  )}
                  <div style={{ marginTop: '6px' }}>
                    {!showObservacoesEditor && (
                      <button onClick={() => setShowObservacoesEditor(true)} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer' }}>+</button>
                    )}
                  </div>
                </div>
                {/* Garantia - abre editor com número + unidade (meses/dias) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                      Garantia
                    </label>
                    {showGarantiaEditor && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="number" min="0" value={formData.garantiaPeriodo || garantiaPeriodoPrev || ''} onChange={(e) => updateFormData('garantiaPeriodo', e.target.value)} placeholder="0" style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                        <select value={formData.garantiaUnidade || garantiaUnidadePrev} onChange={(e) => updateFormData('garantiaUnidade', e.target.value)} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
                          <option value="meses">Meses</option>
                          <option value="dias">Dias</option>
                        </select>
                      </div>
                    )}

                    {formData.garantia && !showGarantiaEditor && (
                      <div style={garantiaBoxStyle}>
                        <span>Garantia: {formData.garantia}</span>
                        <button
                          type="button"
                          onClick={removerGarantia}
                          title="Remover garantia"
                          style={{
                            padding: '4px 8px',
                            background: 'transparent',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            color: 'var(--text)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            flexShrink: 0
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    {!showGarantiaEditor && (
                      <button onClick={abrirGarantiaEditor} style={{ marginTop: formData.garantia ? '0' : '26px', width: '40px', height: '40px', background: 'var(--accent)', border: 'none', borderRadius: '50%', color: '#fff', fontSize: '20px', cursor: 'pointer', flexShrink: 0 }}>+</button>
                    )}
                    {showGarantiaEditor && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '26px' }}>
                        <button onClick={cancelarGarantiaEditor} style={{ padding: '8px 10px', borderRadius: '8px', background: '#6c757d', color: '#fff', border: 'none', cursor: 'pointer' }}>✕</button>
                        <button onClick={salvarGarantia} style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer' }}>✔</button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Marcar visita técnica */}
                <button
                  onClick={() => setCalendarioAberto('validade')}
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
                  onClick={() => setCalendarioAberto('validade')}
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

                {/* Taxa de entrega - só mostra input se já tiver valor ou se usuário clicou + */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                      Taxa de entrega (R$)
                    </label>
                    {(formData.taxaEntrega > 0 || showTaxaEntregaEditor) && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="number"
                          value={formData.taxaEntrega}
                          onChange={(e) => updateFormData('taxaEntrega', parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                          step="0.01"
                          min="0"
                          style={{
                            flex: 1,
                            padding: '10px 12px',
                            background: 'var(--bg)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--text)',
                            fontSize: '14px'
                          }}
                        />
                        <button onClick={() => { updateFormData('taxaEntrega', taxaEntregaPrev || 0); setShowTaxaEntregaEditor(false); }} style={{ padding: '8px 10px', borderRadius: '8px', background: '#6c757d', color: '#fff', border: 'none' }}>✕</button>
                        <button onClick={() => setShowTaxaEntregaEditor(false)} style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', border: 'none' }}>✔</button>
                      </div>
                    )}
                  </div>
                  <button
                    style={{
                      marginTop: (formData.taxaEntrega > 0 || showTaxaEntregaEditor) ? '0' : '26px',
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
                    onClick={() => {
                      setTaxaEntregaPrev(formData.taxaEntrega || 0);
                      setShowTaxaEntregaEditor(true);
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Outras taxas - só mostra input se já tiver valor ou se usuário clicou + */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                      Outras taxas (R$)
                    </label>
                    {(formData.outrasTaxas > 0 || showOutrasTaxasEditor) && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="number"
                          value={formData.outrasTaxas}
                          onChange={(e) => updateFormData('outrasTaxas', parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                          step="0.01"
                          min="0"
                          style={{
                            flex: 1,
                            padding: '10px 12px',
                            background: 'var(--bg)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--text)',
                            fontSize: '14px'
                          }}
                        />
                        <button onClick={() => { updateFormData('outrasTaxas', outrasTaxasPrev || 0); setShowOutrasTaxasEditor(false); }} style={{ padding: '8px 10px', borderRadius: '8px', background: '#6c757d', color: '#fff', border: 'none' }}>✕</button>
                        <button onClick={() => setShowOutrasTaxasEditor(false)} style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', border: 'none' }}>✔</button>
                      </div>
                    )}
                  </div>
                  <button
                    style={{
                      marginTop: (formData.outrasTaxas > 0 || showOutrasTaxasEditor) ? '0' : '26px',
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
                    onClick={() => {
                      setOutrasTaxasPrev(formData.outrasTaxas || 0);
                      setShowOutrasTaxasEditor(true);
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
                {/* Condições de pagamento - mostrar apenas resumo; painel aparece ao clicar + */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                      Condições de pagamento
                    </label>
                    <div style={{ padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: formData.condicoesPagamento ? 'var(--text)' : 'var(--muted)' }}>
                      {formData.condicoesPagamento ? formData.condicoesPagamento : '—'}
                    </div>
                  </div>
                  <button
                    style={{
                      marginTop: '0',
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
                    onClick={() => setShowCondicoesOptions(prev => !prev)}
                  >
                    +
                  </button>
                </div>
                {showCondicoesOptions && (
                  <div style={{ marginTop: '8px', padding: '12px', background: 'var(--bg3)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <button onClick={() => updateFormData('condicoesPagamento', 'À vista')} style={{ padding: '8px 12px', background: formData.condicoesPagamento === 'À vista' ? 'var(--accent)' : 'var(--bg)', color: formData.condicoesPagamento === 'À vista' ? '#fff' : 'var(--text)', border: formData.condicoesPagamento === 'À vista' ? 'none' : '1px solid var(--border)', borderRadius: '8px' }}>À vista</button>
                      <button onClick={() => updateFormData('condicoesPagamento', 'Sinal')} style={{ padding: '8px 12px', background: formData.condicoesPagamento === 'Sinal' ? 'var(--accent)' : 'var(--bg)', color: formData.condicoesPagamento === 'Sinal' ? '#fff' : 'var(--text)', border: formData.condicoesPagamento === 'Sinal' ? 'none' : '1px solid var(--border)', borderRadius: '8px' }}>Sinal</button>
                      <button onClick={() => updateFormData('condicoesPagamento', 'Parcelado')} style={{ padding: '8px 12px', background: formData.condicoesPagamento === 'Parcelado' ? 'var(--accent)' : 'var(--bg)', color: formData.condicoesPagamento === 'Parcelado' ? '#fff' : 'var(--text)', border: formData.condicoesPagamento === 'Parcelado' ? 'none' : '1px solid var(--border)', borderRadius: '8px' }}>Parcelas</button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input placeholder='Detalhes (ex: 50% sinal)' value={formData.condicoesPagamento} onChange={(e) => updateFormData('condicoesPagamento', e.target.value)} style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                      <button onClick={() => setShowCondicoesOptions(false)} style={{ padding: '8px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px' }}>Salvar</button>
                    </div>
                  </div>
                )}

                {/* Meios de pagamento */}
                <PaymentMethodSelector
                  value={formData.meiosPagamento}
                  onChange={(value) => updateFormData('meiosPagamento', value)}
                  label="Meios de pagamento"
                />

                {/* Garantia - editor via '+' e resumo abaixo após salvar */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                      Garantia
                    </label>

                      {showGarantiaEditor && (
                        <div style={{ marginTop: '8px', padding: '12px', background: 'var(--bg3)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <button onClick={() => { updateFormData('garantiaPeriodo', '0'); updateFormData('garantiaUnidade', 'meses'); }} style={{ padding: '8px 12px', background: (formData.garantiaPeriodo === '0') ? 'var(--accent)' : 'var(--bg)', color: (formData.garantiaPeriodo === '0') ? '#fff' : 'var(--text)', border: (formData.garantiaPeriodo === '0') ? 'none' : '1px solid var(--border)', borderRadius: '8px' }}>Sem garantia</button>
                          <button onClick={() => { updateFormData('garantiaPeriodo', '3'); updateFormData('garantiaUnidade', 'meses'); }} style={{ padding: '8px 12px', background: (formData.garantiaPeriodo === '3' && formData.garantiaUnidade === 'meses') ? 'var(--accent)' : 'var(--bg)', color: (formData.garantiaPeriodo === '3' && formData.garantiaUnidade === 'meses') ? '#fff' : 'var(--text)', border: (formData.garantiaPeriodo === '3' && formData.garantiaUnidade === 'meses') ? 'none' : '1px solid var(--border)', borderRadius: '8px' }}>3 meses</button>
                          <button onClick={() => { updateFormData('garantiaPeriodo', '12'); updateFormData('garantiaUnidade', 'meses'); }} style={{ padding: '8px 12px', background: (formData.garantiaPeriodo === '12' && formData.garantiaUnidade === 'meses') ? 'var(--accent)' : 'var(--bg)', color: (formData.garantiaPeriodo === '12' && formData.garantiaUnidade === 'meses') ? '#fff' : 'var(--text)', border: (formData.garantiaPeriodo === '12' && formData.garantiaUnidade === 'meses') ? 'none' : '1px solid var(--border)', borderRadius: '8px' }}>12 meses</button>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input placeholder='Período' value={formData.garantiaPeriodo || garantiaPeriodoPrev || ''} onChange={(e) => updateFormData('garantiaPeriodo', e.target.value)} style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                          <select value={formData.garantiaUnidade || garantiaUnidadePrev} onChange={(e) => updateFormData('garantiaUnidade', e.target.value)} style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
                            <option value="meses">Meses</option>
                            <option value="dias">Dias</option>
                          </select>
                            <button onClick={cancelarGarantiaEditor} style={{ padding: '8px 12px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '8px' }}>✕</button>
                            <button onClick={salvarGarantia} style={{ padding: '8px 12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px' }}>Salvar</button>
                          </div>
                        </div>
                      )}

                      {formData.garantia && !showGarantiaEditor && (
                        <div style={garantiaBoxStyle}>
                          <span>Garantia: {formData.garantia}</span>
                          <button
                            type="button"
                            onClick={removerGarantia}
                            title="Remover garantia"
                            style={{
                              padding: '4px 8px',
                              background: 'transparent',
                              border: '1px solid var(--border)',
                              borderRadius: '6px',
                              color: 'var(--text)',
                              cursor: 'pointer',
                              fontSize: '12px',
                              flexShrink: 0
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>

                    {!showGarantiaEditor && (
                      <button
                        onClick={abrirGarantiaEditor}
                        style={{
                          marginTop: formData.garantia ? '0' : '26px',
                          width: '40px',
                          height: '40px',
                          background: 'var(--accent)',
                          border: 'none',
                          borderRadius: '50%',
                          color: '#fff',
                          fontSize: '20px',
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>

                {/* Informações adicionais - abrir área livre ao clicar + */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                      Informações adicionais
                    </label>
                    {(formData.informacoesAdicionais || showInformacoesEditor) && (
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
                    )}
                  </div>
                  <div>
                    {!showInformacoesEditor && (
                      <button onClick={() => setShowInformacoesEditor(true)} style={{ marginTop: (formData.informacoesAdicionais ? '0' : '26px'), width: '40px', height: '40px', background: 'var(--accent)', border: 'none', borderRadius: '50%', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>+</button>
                    )}
                  </div>
                </div>

                {/* Removed Anotações and Relatório per request - not rendered */}
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