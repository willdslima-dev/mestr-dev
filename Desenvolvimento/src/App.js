import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Chat from './components/Chat';
import Chips from './components/Chips';
import InputBar from './components/InputBar';
import AgendaModal from './components/modals/AgendaModal';
import MenuModal from './components/modals/MenuModal';
import ItensModal from './components/modals/ItensModal';
import CatalogoModal from './components/modals/CatalogoModal';
import ConfigModal from './components/modals/ConfigModal';
import SelecionarClienteModal from './components/modals/SelecionarClienteModal';
import ClienteAcoesModal from './components/modals/ClienteAcoesModal';
import GerarDocumentoModal from './components/modals/GerarDocumentoModal';
import PedidoModal from './components/modals/PedidoModal';
import PedidosModal from './components/modals/PedidosModal';
import IAControlPanel from './components/modals/IAControlPanel';
import { useDB } from './hooks/useDB';
import { useContexto } from './hooks/useContexto';
import { useTheme } from './hooks/useTheme';
import { processarMensagem } from './utils/processador';
import { gerarDocumentoPedido, gerarDocumentoConsolidado } from './utils/documentos';
import { parsearRespostaIA, ExecutorAcoes, simularRespostaIA } from './utils/iaCore';

function App() {
  const [mensagens, setMensagens] = useState([]);
  const [typing, setTyping] = useState(false);
  const [modals, setModals] = useState({
    agenda: false,
    menu: false,
    itens: false,
    catalogo: false,
    config: false,
    selecionarCliente: false,
    clienteAcoes: false,
    gerarDocumento: false,
    pedido: false,
    pedidos: false,
    iaControl: false
  });

  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  
  // IA: Verifica se tem chave configurada
  const [iaAtiva, setIaAtiva] = useState(() => {
    try {
      const chave = localStorage.getItem('devcom_ia_key');
      return !!(chave && chave.length > 0);
    } catch {
      return false;
    }
  });

  const { CLI, ORC, PAG, AGENDA, CUSTOS, setCLI, setORC, setPAG } = useDB();
  const { CTX, updateContexto } = useContexto();
  const { theme, toggleTheme, setAutoTheme } = useTheme();
  const [inicializado, setInicializado] = useState(false);

  useEffect(() => {
    // Mensagem inicial - apenas uma vez
    if (!inicializado) {
      const statusIA = iaAtiva 
        ? '🤖 IA ativa' 
        : 'pronto para ajudar';
      addMensagem({
        tipo: 'texto',
        conteudo: `👋 Olá! Sou o Mestre.IA, ${statusIA}.\n\nComo posso ajudar você hoje?`
      }, false);
      setInicializado(true);
    }
  }, [inicializado, iaAtiva]);

  const addMensagem = (conteudo, isUser = false) => {
    const novaMensagem = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      conteudo,
      isUser,
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setMensagens(prev => [...prev, novaMensagem]);
  };

  const abrirModal = (nome) => {
    setModals(prev => ({ ...prev, [nome]: true }));
  };

  const fecharModal = (nome) => {
    setModals(prev => ({ ...prev, [nome]: false }));
  };

  const handleEnviar = (texto) => {
    // Adiciona mensagem do usuário
    addMensagem({ tipo: 'texto', conteudo: texto }, true);
    
    // Mostra typing indicator
    setTyping(true);
    
    // Simula processamento
    setTimeout(() => {
      try {
        // ═══════════════════════════════════════
        // NOVA ARQUITETURA: IA ou LOCAL
        // ═══════════════════════════════════════
        
        if (iaAtiva) {
          // ────────────────────────────────────
          // MODO IA: Usa Gemini API
          // ────────────────────────────────────
          
          // 1. Gera resposta da IA (simulada por enquanto)
          const respostaIA = simularRespostaIA(texto, { CLI, ORC, PAG });
          
          // 2. Parseia resposta (separa texto humano de ação)
          const { textoHumano, acao } = parsearRespostaIA(respostaIA);
          
          // 3. Exibe texto humano no chat
          setTyping(false);
          addMensagem({ tipo: 'texto', conteudo: textoHumano }, false);
          
          // 4. Executa ação se houver
          if (acao && acao.status === 'executar') {
            const executor = new ExecutorAcoes(
              abrirModal,
              setClienteSelecionado,
              CLI,
              ORC,
              PAG
            );
            
            const resultado = executor.executar(acao);
            console.log('📊 Resultado da execução:', resultado);
            
            // Se a ação retornou dados (ex: saldo), exibe no chat
            if (resultado.sucesso && resultado.dados) {
              setTimeout(() => {
                if (acao.modulo === 'saldo' && resultado.dados.formatado) {
                  const msgSaldo = resultado.dados.cliente 
                    ? `💰 **${resultado.dados.cliente}** tem saldo de **${resultado.dados.formatado}** ${resultado.dados.saldo >= 0 ? '(a receber)' : '(devendo)'}`
                    : `💰 Saldo total do sistema: **${resultado.dados.formatado}**`;
                  
                  addMensagem({ tipo: 'texto', conteudo: msgSaldo }, false);
                }
              }, 300);
            }
          }
          
        } else {
          // ────────────────────────────────────
          // MODO LOCAL: Usa regex/padrões
          // ────────────────────────────────────
          
          const resposta = processarMensagem(
            texto,
            CLI,
            ORC,
            PAG,
            setCLI,
            setORC,
            setPAG
          );
          
          setTyping(false);
          
          // Se a resposta tem tipo card, exibe
          if (resposta.tipo === 'card') {
            addMensagem(resposta, false);
          } else {
            addMensagem({ tipo: 'texto', conteudo: resposta.conteudo || resposta }, false);
          }
        }
        
      } catch (error) {
        setTyping(false);
        addMensagem({
          tipo: 'texto',
          conteudo: '❌ Desculpe, ocorreu um erro ao processar sua mensagem.'
        }, false);
        console.error('Erro ao processar:', error);
      }
    }, 800);
  };

  const handleChipClick = (texto) => {
    // Remove emojis e limpa o texto
    const comando = texto.replace(/[^\w\s]/gi, '').trim().toLowerCase();
    
    // Se for "novo pedido", abre modal de pedido SEM cliente pré-selecionado
    if (comando.includes('novo pedido') || comando.includes('novo orcamento')) {
      setClienteSelecionado(null); // Limpa cliente selecionado
      abrirModal('pedido');
      return;
    }
    
    // Se for "lista de clientes", abre modal de seleção de cliente
    if (comando.includes('lista de clientes') || comando.includes('listar clientes')) {
      abrirModal('selecionarCliente');
      return;
    }
    
    // Se for "pedidos", abre modal de pedidos
    if (comando.includes('pedidos')) {
      abrirModal('pedidos');
      return;
    }
    
    handleEnviar(comando);
  };

  return (
    <div className="app">
      <Header 
        onMenuClick={() => abrirModal('menu')}
        onAgendaClick={() => abrirModal('agenda')}
        theme={theme}
        onThemeToggle={toggleTheme}
        iaAtiva={iaAtiva}
      />
      <Chat mensagens={mensagens} typing={typing} />
      <Chips onChipClick={handleChipClick} />
      <InputBar onSend={handleEnviar} />

      <AgendaModal 
        isOpen={modals.agenda} 
        onClose={() => fecharModal('agenda')}
        agenda={AGENDA}
      />
      <MenuModal 
        isOpen={modals.menu} 
        onClose={() => fecharModal('menu')}
        onAbrirCatalogo={() => { fecharModal('menu'); abrirModal('catalogo'); }}
        onAbrirItens={() => { fecharModal('menu'); abrirModal('itens'); }}
        onAbrirConfig={() => { fecharModal('menu'); abrirModal('config'); }}
        onAbrirIA={() => { fecharModal('menu'); abrirModal('iaControl'); }}
      />
      <ItensModal 
        isOpen={modals.itens} 
        onClose={() => fecharModal('itens')}
        ORC={ORC}
        CLI={CLI}
      />
      <CatalogoModal 
        isOpen={modals.catalogo} 
        onClose={() => fecharModal('catalogo')}
      />
      <ConfigModal
        isOpen={modals.config}
        onClose={() => fecharModal('config')}
        theme={theme}
        onThemeChange={(newTheme) => {
          document.documentElement.setAttribute('data-theme', newTheme);
          localStorage.setItem('theme', newTheme);
          window.location.reload();
        }}
        onAutoTheme={() => {
          setAutoTheme();
          fecharModal('config');
        }}
      />
      <SelecionarClienteModal
        isOpen={modals.selecionarCliente}
        onClose={() => fecharModal('selecionarCliente')}
        CLI={CLI}
        setCLI={setCLI}
        ORC={ORC}
        onClienteSelecionado={(cliente) => {
          setClienteSelecionado(cliente);
          fecharModal('selecionarCliente');
          abrirModal('clienteAcoes');
        }}
      />
      <ClienteAcoesModal
        isOpen={modals.clienteAcoes}
        onClose={() => {
          fecharModal('clienteAcoes');
          setClienteSelecionado(null);
        }}
        cliente={clienteSelecionado}
        CLI={CLI}
        ORC={ORC}
        PAG={PAG}
        setCLI={setCLI}
        setPAG={setPAG}
        onNovoPedido={() => {
          fecharModal('clienteAcoes');
          abrirModal('pedido');
        }}
      />
      <GerarDocumentoModal
        isOpen={modals.gerarDocumento}
        onClose={() => {
          fecharModal('gerarDocumento');
          setClienteSelecionado(null);
        }}
        cliente={clienteSelecionado}
        pedidos={ORC ? Object.values(ORC).filter(p => p.clienteId === clienteSelecionado?.id) : []}
        onGerarDocumento={(pedidoIds, tipo) => {
          const pedidosSelecionados = Object.values(ORC).filter(p => pedidoIds.includes(p.id));
          
          if (tipo === 'todos') {
            // Documento único com todos os pedidos
            const html = gerarDocumentoConsolidado(pedidosSelecionados, clienteSelecionado);
            const janela = window.open('', '_blank');
            janela.document.write(html);
            janela.document.close();
            setTimeout(() => janela.print(), 500);
          } else {
            // Documentos separados
            pedidosSelecionados.forEach((pedido, index) => {
              const html = gerarDocumentoPedido(pedido, clienteSelecionado);
              const janela = window.open('', '_blank');
              janela.document.write(html);
              janela.document.close();
              setTimeout(() => janela.print(), 500 + (index * 300));
            });
          }
          
          fecharModal('gerarDocumento');
          setClienteSelecionado(null);
        }}
      />
      <PedidoModal
        isOpen={modals.pedido}
        onClose={() => {
          fecharModal('pedido');
          setClienteSelecionado(null);
        }}
        cliente={clienteSelecionado}
        CLI={CLI}
        setCLI={setCLI}
        ORC={ORC}
        setORC={setORC}
        AGENDA={AGENDA}
      />
      <PedidosModal
        isOpen={modals.pedidos}
        onClose={() => {
          fecharModal('pedidos');
          setClienteSelecionado(null);
        }}
        clienteFiltro={clienteSelecionado}
        ORC={ORC}
        setORC={setORC}
      />
      <IAControlPanel
        isOpen={modals.iaControl}
        onClose={() => fecharModal('iaControl')}
        onChaveAlterada={(temChave) => {
          // Atualiza estado da IA quando chave for salva/removida
          setIaAtiva(temChave);
          
          // Mensagem de feedback
          const statusMsg = temChave 
            ? '✅ IA Gemini ativada! Agora usando inteligência artificial.' 
            : '💻 IA desativada. Voltando para modo local (regex).';
          
          addMensagem({
            tipo: 'texto',
            conteudo: statusMsg
          }, false);
          
          // Recarrega mensagem inicial
          setInicializado(false);
        }}
      />
    </div>
  );
}

export default App;
