import React, { useState, useMemo, useEffect } from 'react';
import SelectModal from './templates/SelectModal';
import FormModal from './templates/FormModal';
import Notificacao from '../Notificacao';
import { uid, hoje, proprio } from '../../utils/helpers';
import './SelecionarClienteModal.css';

function SelecionarClienteModal({ 
  isOpen, 
  onClose, 
  CLI, 
  setCLI, 
  onClienteSelecionado, 
  ORC, 
  clienteParaEditar = null, 
  modoEdicaoDireta = false 
}) {
  const [modo, setModo] = useState(modoEdicaoDireta ? 'editar' : 'selecionar');
  const [mensagem, setMensagem] = useState(null);
  const [clienteEditando, setClienteEditando] = useState(clienteParaEditar);
  
  // Form data para novo/editar cliente
  const [formData, setFormData] = useState({
    nome: '',
    comoConseguiu: '',
    tipoCliente: 'fisica',
    cpfCnpj: '',
    email: '',
    telefone: '',
    whatsapp: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    aniversario: '',
    anotacoes: ''
  });

  // Carrega dados do cliente quando em modo edição
  useEffect(() => {
    if (isOpen && clienteParaEditar && modoEdicaoDireta) {
      setClienteEditando(clienteParaEditar);
      setFormData({
        nome: clienteParaEditar.nome || '',
        comoConseguiu: clienteParaEditar.comoConseguiu || '',
        tipoCliente: clienteParaEditar.tipoCliente || 'fisica',
        cpfCnpj: clienteParaEditar.cpfCnpj || '',
        email: clienteParaEditar.email || '',
        telefone: clienteParaEditar.telefone || '',
        whatsapp: clienteParaEditar.whatsapp || '',
        cep: clienteParaEditar.endereco?.cep || '',
        logradouro: clienteParaEditar.endereco?.logradouro || '',
        numero: clienteParaEditar.endereco?.numero || '',
        complemento: clienteParaEditar.endereco?.complemento || '',
        bairro: clienteParaEditar.endereco?.bairro || '',
        cidade: clienteParaEditar.endereco?.cidade || '',
        estado: clienteParaEditar.endereco?.estado || '',
        aniversario: clienteParaEditar.aniversario || '',
        anotacoes: clienteParaEditar.anotacoes || ''
      });
      setModo('editar');
    }
    
    if (!isOpen) {
      setClienteEditando(null);
      setModo(modoEdicaoDireta ? 'editar' : 'selecionar');
      resetForm();
    }
  }, [isOpen, clienteParaEditar, modoEdicaoDireta]);

  const resetForm = () => {
    setFormData({
      nome: '',
      comoConseguiu: '',
      tipoCliente: 'fisica',
      cpfCnpj: '',
      email: '',
      telefone: '',
      whatsapp: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      aniversario: '',
      anotacoes: ''
    });
  };

  const updateFormData = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  // Formata CPF: 000.000.000-00
  const formatarCPF = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length === 0) return '';
    if (numeros.length <= 3) return numeros;
    if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
    if (numeros.length <= 9) return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
  };

  // Formata CNPJ: 00.000.000/0000-00
  const formatarCNPJ = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length === 0) return '';
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 5) return `${numeros.slice(0, 2)}.${numeros.slice(2)}`;
    if (numeros.length <= 8) return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5)}`;
    if (numeros.length <= 12) return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8)}`;
    return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8, 12)}-${numeros.slice(12, 14)}`;
  };

  const handleCpfCnpjChange = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    let formatado = '';
    
    if (formData.tipoCliente === 'fisica') {
      formatado = formatarCPF(valor);
    } else {
      formatado = formatarCNPJ(valor);
    }
    
    updateFormData('cpfCnpj', formatado);
  };

  // Formata telefone: (11) 90000-0000
  const formatarTelefone = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length === 0) return '';
    if (numeros.length <= 2) return `(${numeros}`;
    if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 3)}${numeros.slice(3, 7)}-${numeros.slice(7, 11)}`;
  };

  const handleTelefoneChange = (campo, valor) => {
    updateFormData(campo, formatarTelefone(valor));
  };

  // Auto-preenche (11) 9 ao clicar no campo vazio
  const handleTelefoneFocus = (campo) => {
    if (!formData[campo] || formData[campo].trim() === '') {
      updateFormData(campo, '(11) 9');
    }
  };

  // Limpa campo se saiu sem digitar (só tem (11) 9)
  const handleTelefoneBlur = (campo) => {
    const valor = formData[campo] || '';
    const numeros = valor.replace(/\D/g, '');
    
    // Se tem só "119" (não digitou nada além do auto-preenchido), limpa
    if (numeros.length <= 3) {
      updateFormData(campo, '');
    }
  };

  // Abre WhatsApp Web
  const abrirWhatsApp = (numero) => {
    const numeros = numero.replace(/\D/g, '');
    if (numeros.length >= 10) {
      const numeroCompleto = numeros.startsWith('55') ? numeros : `55${numeros}`;
      window.open(`https://wa.me/${numeroCompleto}`, '_blank');
    }
  };

  // Buscar CEP
  const buscarCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || ''
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  // Lista de clientes
  const clientes = CLI ? Object.values(CLI).filter(cli => cli.nome && cli.nome.trim() !== '') : [];

  // Clientes sugeridos: 2 últimos cadastrados + 2 com mais pedidos
  const clientesSugeridos = useMemo(() => {
    if (clientes.length === 0) return [];

    // 1. Pega os 2 últimos clientes cadastrados (usa timestamp ou criadoEm)
    const ordenadosPorData = [...clientes].sort((a, b) => {
      const timestampA = a.timestamp || new Date(a.criadoEm || 0).getTime();
      const timestampB = b.timestamp || new Date(b.criadoEm || 0).getTime();
      return timestampB - timestampA; // Mais recente primeiro
    });
    const ultimosCadastrados = ordenadosPorData.slice(0, 2);
    const idsUltimosCadastrados = ultimosCadastrados.map(c => c.id);

    // 2. Conta quantos pedidos cada cliente tem
    const orcamentos = ORC ? Object.values(ORC) : [];
    const clientesComPedidos = clientes.map(cli => {
      const numPedidos = orcamentos.filter(o => o.clienteId === cli.id).length;
      return { cliente: cli, numPedidos };
    });

    // 3. Ordena por quantidade de pedidos (maior para menor), excluindo os 2 últimos cadastrados
    const ordenadosPorPedidos = clientesComPedidos
      .filter(c => !idsUltimosCadastrados.includes(c.cliente.id))
      .sort((a, b) => b.numPedidos - a.numPedidos)
      .slice(0, 2)
      .map(c => c.cliente);

    // 4. Combina: 2 últimos cadastrados + 2 com mais pedidos
    const sugeridos = [...ultimosCadastrados, ...ordenadosPorPedidos].filter(Boolean);

    return sugeridos.slice(0, 4); // Garante no máximo 4
  }, [clientes, ORC]);

  // Clientes ordenados alfabeticamente
  const todosClientesOrdenados = useMemo(() => {
    return [...clientes].sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
  }, [clientes]);

  // Handlers
  const handleSelecionarExistente = (cliente) => {
    onClienteSelecionado(cliente);
    onClose();
  };

  const handleEditarCliente = (cliente, event) => {
    event.stopPropagation(); // Impede que selecione o cliente
    setClienteEditando(cliente);
    setFormData({
      nome: cliente.nome || '',
      comoConseguiu: cliente.comoConseguiu || '',
      tipoCliente: cliente.tipoCliente || 'fisica',
      cpfCnpj: cliente.cpfCnpj || '',
      email: cliente.email || '',
      telefone: cliente.telefone || '',
      whatsapp: cliente.whatsapp || '',
      cep: cliente.endereco?.cep || '',
      logradouro: cliente.endereco?.logradouro || '',
      numero: cliente.endereco?.numero || '',
      complemento: cliente.endereco?.complemento || '',
      bairro: cliente.endereco?.bairro || '',
      cidade: cliente.endereco?.cidade || '',
      estado: cliente.endereco?.estado || '',
      aniversario: cliente.aniversario || '',
      anotacoes: cliente.anotacoes || ''
    });
    setModo('editar');
  };

  const handleExcluirCliente = (cliente, event) => {
    event.stopPropagation(); // Impede que selecione o cliente
    
    if (!window.confirm(`Tem certeza que deseja excluir o cliente "${cliente.nome}"?`)) {
      return;
    }

    // Remove do CLI
    const novoCLI = { ...CLI };
    const chave = cliente.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    delete novoCLI[chave];
    
    setCLI(novoCLI);
    
    setMensagem({
      tipo: 'sucesso',
      texto: `Cliente "${cliente.nome}" excluído com sucesso!`
    });
  };

  const handleCriarNovo = () => {
    if (!formData.nome.trim()) {
      setMensagem({ tipo: 'erro', texto: '⚠️ Digite o nome do cliente' });
      return;
    }

    const chave = formData.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    if (CLI[chave] && modo !== 'editar') {
      setMensagem({ tipo: 'erro', texto: '⚠️ Cliente já existe!' });
      return;
    }

    // Se telefone não foi preenchido, usa o WhatsApp
    const telefoneFinal = formData.telefone.trim() || formData.whatsapp.trim();
    
    const dadosCliente = {
      id: clienteEditando?.id || uid(),
      nome: proprio(formData.nome),
      comoConseguiu: formData.comoConseguiu,
      tipoCliente: formData.tipoCliente,
      cpfCnpj: formData.cpfCnpj,
      email: formData.email,
      telefone: telefoneFinal,
      whatsapp: formData.whatsapp,
      endereco: {
        cep: formData.cep,
        logradouro: formData.logradouro,
        numero: formData.numero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado
      },
      aniversario: formData.aniversario,
      anotacoes: formData.anotacoes,
      criadoEm: clienteEditando?.criadoEm || hoje(),
      timestamp: clienteEditando?.timestamp || Date.now()
    };

    setCLI({ ...CLI, [chave]: dadosCliente });
    onClienteSelecionado(dadosCliente);
    onClose();
    resetForm();
  };

  // Validação do formulário
  const formValido = formData.nome.trim().length >= 3;

  // Renderiza conforme modo
  if (modo === 'novo' || modo === 'editar') {
    return (
      <>
        <Notificacao mensagem={mensagem} onFechar={() => setMensagem(null)} />
        
        <FormModal
          isOpen={isOpen}
          onClose={() => {
            setModo('selecionar');
            resetForm();
            if (!modoEdicaoDireta) {
              // Se não é modo edição direta, mantém modal aberto para seleção
            } else {
              onClose(); // Se é modo edição direta, fecha tudo
            }
          }}
          titulo={modo === 'editar' ? 'Editar Cliente' : 'Novo Cliente'}
          onSave={handleCriarNovo}
          saveLabel={modo === 'editar' ? 'Salvar Alterações' : 'Criar Cliente'}
          isValid={formValido}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Nome */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Nome <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => updateFormData('nome', e.target.value)}
                placeholder="Nome completo"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Tipo Cliente */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Tipo de Cliente
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['fisica', 'juridica'].map(tipo => (
                  <button
                    key={tipo}
                    onClick={() => updateFormData('tipoCliente', tipo)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: formData.tipoCliente === tipo ? 'var(--accent)' : 'var(--bg3)',
                      border: 'none',
                      borderRadius: '8px',
                      color: formData.tipoCliente === tipo ? 'white' : 'var(--text)',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {tipo === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </button>
                ))}
              </div>
            </div>

            {/* CPF/CNPJ */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                {formData.tipoCliente === 'fisica' ? 'CPF' : 'CNPJ'}
              </label>
              <input
                type="text"
                value={formData.cpfCnpj}
                onChange={(e) => handleCpfCnpjChange(e.target.value)}
                placeholder={formData.tipoCliente === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                maxLength={formData.tipoCliente === 'fisica' ? 14 : 18}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* WhatsApp e Telefone - WHATSAPP PRIMEIRO */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: window.innerWidth <= 480 ? '1fr' : '1fr 1fr', 
              gap: '12px' 
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  WhatsApp
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => handleTelefoneChange('whatsapp', e.target.value)}
                    onFocus={() => handleTelefoneFocus('whatsapp')}
                    onBlur={() => handleTelefoneBlur('whatsapp')}
                    placeholder="(11) 90000-0000"
                    maxLength={15}
                    style={{
                      width: '100%',
                      padding: '12px',
                      paddingRight: formData.whatsapp && formData.whatsapp.replace(/\D/g, '').length >= 10 ? '45px' : '12px',
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '14px'
                    }}
                  />
                  {/* Botão WhatsApp - aparece quando preenchido */}
                  {formData.whatsapp && formData.whatsapp.replace(/\D/g, '').length >= 10 && (
                    <button
                      type="button"
                      onClick={() => abrirWhatsApp(formData.whatsapp)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#25D366',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#128C7E'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#25D366'}
                      title="Abrir WhatsApp"
                    >
                      <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="white"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => handleTelefoneChange('telefone', e.target.value)}
                  onFocus={() => handleTelefoneFocus('telefone')}
                  onBlur={() => handleTelefoneBlur('telefone')}
                  placeholder="(11) 90000-0000"
                  maxLength={15}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                E-mail
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="email@exemplo.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* CEP - SEM BOTÃO BUSCAR */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                CEP
              </label>
              <input
                type="text"
                value={formData.cep}
                onChange={(e) => updateFormData('cep', e.target.value)}
                onBlur={(e) => buscarCEP(e.target.value)}
                placeholder="00000-000"
                maxLength={9}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Endereço */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: window.innerWidth <= 480 ? '1fr' : '3fr 1fr', 
              gap: '12px' 
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Logradouro
                </label>
                <input
                  type="text"
                  value={formData.logradouro}
                  onChange={(e) => updateFormData('logradouro', e.target.value)}
                  placeholder="Rua, Avenida..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Número
                </label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => updateFormData('numero', e.target.value)}
                  placeholder="Nº"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* Complemento, Bairro */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: window.innerWidth <= 480 ? '1fr' : '1fr 1fr', 
              gap: '12px' 
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Complemento
                </label>
                <input
                  type="text"
                  value={formData.complemento}
                  onChange={(e) => updateFormData('complemento', e.target.value)}
                  placeholder="Apto, Bloco..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Bairro
                </label>
                <input
                  type="text"
                  value={formData.bairro}
                  onChange={(e) => updateFormData('bairro', e.target.value)}
                  placeholder="Bairro"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* Cidade, Estado */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: window.innerWidth <= 480 ? '1fr' : '2fr 1fr', 
              gap: '12px' 
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => updateFormData('cidade', e.target.value)}
                  placeholder="Cidade"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Estado
                </label>
                <input
                  type="text"
                  value={formData.estado}
                  onChange={(e) => updateFormData('estado', e.target.value)}
                  placeholder="UF"
                  maxLength={2}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '14px',
                    textTransform: 'uppercase'
                  }}
                />
              </div>
            </div>

            {/* Anotações */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Anotações
              </label>
              <textarea
                value={formData.anotacoes}
                onChange={(e) => updateFormData('anotacoes', e.target.value)}
                placeholder="Observações sobre o cliente..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Botão Excluir - APENAS NO MODO EDITAR */}
            {modo === 'editar' && clienteEditando && (
              <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <button
                  onClick={() => {
                    if (window.confirm(`Tem certeza que deseja excluir o cliente "${clienteEditando.nome}"?`)) {
                      // Remove do CLI
                      const novoCLI = { ...CLI };
                      const chave = clienteEditando.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                      delete novoCLI[chave];
                      
                      setCLI(novoCLI);
                      
                      setMensagem({
                        tipo: 'sucesso',
                        texto: `Cliente "${clienteEditando.nome}" excluído com sucesso!`
                      });

                      // Fecha o modal
                      onClose();
                      resetForm();
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#f06070',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#d94858'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f06070'}
                >
                  🗑️ Excluir Cliente
                </button>
              </div>
            )}
          </div>
        </FormModal>
      </>
    );
  }

  // Proteção contra CLI inválido
  if (!CLI) {
    return null;
  }

  // Modo seleção
  return (
    <>
      <Notificacao mensagem={mensagem} onFechar={() => setMensagem(null)} />
      
      <SelectModal
        isOpen={isOpen}
        onClose={onClose}
        titulo="Selecionar Cliente"
        mode="single"
        items={todosClientesOrdenados}
        recentItems={clientesSugeridos}
        recentLabel="📌 Recentes e Frequentes"
        onSelect={handleSelecionarExistente}
        renderItem={(cliente, isRecente = false) => {
          // Versão SIMPLIFICADA para recentes (sem botões)
          if (isRecente) {
            return (
              <div>
                <div style={{ 
                  fontWeight: '600', 
                  fontSize: '13px',
                  marginBottom: '4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {cliente.nome}
                </div>
                {cliente.telefone && (
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    📱 {cliente.telefone}
                  </div>
                )}
              </div>
            );
          }

          // Versão COMPLETA para lista (com botão editar no topo e WhatsApp no lugar)
          return (
            <div style={{ position: 'relative' }}>
              {/* Botão Editar - FORA DO CARD, COLADO NO CANTO */}
              <button
                onClick={(e) => handleEditarCliente(cliente, e)}
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#1a1a1a',
                  border: '2px solid var(--border)',
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  transition: 'all 0.15s',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1a1a1a';
                  e.currentTarget.style.color = 'var(--accent)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title="Editar cliente"
              >
                ✏️
              </button>

              {/* Info do cliente */}
              <div>
                {/* Nome */}
                <div style={{ fontWeight: '600', marginBottom: '6px', fontSize: '15px' }}>
                  {cliente.nome}
                </div>
                
                {/* Telefone */}
                {cliente.telefone && (
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    📱 {cliente.telefone}
                  </div>
                )}
                
                {/* Endereço completo - bem pequeno - SEMPRE TENTA MOSTRAR */}
                {(() => {
                  const enderecoParts = [];
                  
                  if (cliente.endereco) {
                    if (cliente.endereco.logradouro) enderecoParts.push(cliente.endereco.logradouro);
                    if (cliente.endereco.numero) enderecoParts.push(`nº ${cliente.endereco.numero}`);
                    if (cliente.endereco.complemento) enderecoParts.push(cliente.endereco.complemento);
                    if (cliente.endereco.bairro) enderecoParts.push(cliente.endereco.bairro);
                    if (cliente.endereco.cidade || cliente.endereco.estado) {
                      enderecoParts.push(
                        [cliente.endereco.cidade, cliente.endereco.estado].filter(Boolean).join('/')
                      );
                    }
                    if (cliente.endereco.cep) enderecoParts.push(cliente.endereco.cep);
                  }
                  
                  return enderecoParts.length > 0 ? (
                    <div style={{ 
                      fontSize: '11px', 
                      color: 'var(--text-secondary)', 
                      opacity: 0.7,
                      lineHeight: '1.4'
                    }}>
                      {enderecoParts.join(' • ')}
                    </div>
                  ) : null;
                })()}
              </div>
              
              {/* Botão WhatsApp - NO CANTO INFERIOR DIREITO */}
              {cliente.whatsapp && cliente.whatsapp.replace(/\D/g, '').length >= 10 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    abrirWhatsApp(cliente.whatsapp);
                  }}
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#25D366',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#128C7E'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#25D366'}
                  title="Abrir WhatsApp"
                >
                  <svg 
                    width="22" 
                    height="22" 
                    viewBox="0 0 24 24" 
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </button>
              )}
            </div>
          );
        }}
        onAdd={() => {
          setModo('novo');
          resetForm();
        }}
        addLabel="Adicionar Novo Cliente"
        searchPlaceholder="Buscar por nome, telefone ou email..."
        emptyMessage={clientes.length === 0 
          ? "Nenhum cliente cadastrado ainda. Clique em 'Adicionar Novo Cliente' para começar!" 
          : "Nenhum cliente encontrado com esse filtro"}
      />
    </>
  );
}

export default SelecionarClienteModal;
