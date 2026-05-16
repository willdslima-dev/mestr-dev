# DevCom - Sistema de Gestão com IA

Sistema React de gestão empresarial com IA integrada (Gemini API) para processamento de linguagem natural.

## Stack

- React 18.2
- LocalStorage (persistência)
- Gemini API (IA - opcional)

## Instalação

```bash
npm install
npm start
```

## Estrutura

```
src/
├── components/       # Componentes React (Chat, Header, Modals, Forms)
├── services/        # geminiService.js (integração IA)
├── hooks/           # useDB, useContexto, useTheme
├── utils/           # helpers, processador, catalogo, documentos
└── domain/          # entidades de negócio
```

## Funcionalidades

- Gestão de pedidos, clientes e catálogo
- Chat com IA para criar/editar pedidos por linguagem natural
- Geração de documentos (PDF simulado)
- Agenda e calendário
- Temas claro/escuro

## IA (Opcional)

1. Obter chave: [Google AI Studio](https://aistudio.google.com/app/apikey)
2. No app: Configurações → Painel IA → Colar chave
3. Sistema funciona sem IA, mas perde processamento de linguagem natural

## Build

```bash
npm run build
```

Gera pasta `build/` com arquivos estáticos para deploy

| Recurso | Descrição |
|---------|-----------|
| 🗣️ **Linguagem Natural** | Digite como você fala, sistema entende |
| 🎯 **Ações Automáticas** | Abre modais, consulta dados, cria pedidos |
| 🧠 **Dois Modos de IA** | Simulador grátis ou Claude API inteligente |
| ✅ **Validação Inteligente** | Pede dados faltantes automaticamente |
| 🔄 **Contexto Persistente** | Lembra da conversa anterior |
| 📊 **7 Módulos Integrados** | Pedidos, Clientes, Saldo, Catálogo, etc |

---

## 💬 Exemplos de Comandos

| Você diz | Sistema faz |
|----------|-------------|
| `novo pedido` | Abre modal de pedido |
| `lista de clientes` | Mostra todos os clientes |
| `quanto João deve?` | Calcula e exibe saldo |
| `ver pedidos desta semana` | Filtra e mostra pedidos |
| `abre catálogo` | Abre catálogo de produtos |
| `Vender 50 tijolos para João dia 20` | Cria pedido com dados preenchidos |

📚 **Mais exemplos:** [README_IA.md](./README_IA.md)

---

## 📋 Funcionalidades

### ✅ Versão Atual (2.0)

#### 🤖 IA e Inteligência
- ✨ Núcleo de IA operacional integrado
- 🧠 Processamento de linguagem natural
- 🎯 Executor de ações automático
- ✅ Validação inteligente de dados
- 🔄 Parser de respostas estruturadas
- 📊 Painel de controle da IA

#### 💼 Gestão de Negócios
- 👥 Cadastro e gestão de clientes
- 📝 Criação e edição de pedidos/orçamentos
- 💰 Controle de pagamentos
- 📊 Relatórios e saldos
- 📅 Agenda de compromissos
- 📚 Catálogo de serviços customizável
- � Geração de documentos

#### 🛠️ Técnico
- �💾 Persistência local (localStorage)
- 📱 Design responsivo (mobile-first)
- 🎨 Temas claro/escuro/auto
- � Variáveis de ambiente protegidas
- 🧪 Scripts de teste automatizados
- 📚 Documentação completa (4.500+ linhas)

### � Roadmap Futuro

- [ ] Histórico de conversa persistente
- [ ] Confirmações automáticas
- [ ] Análises preditivas
- [ ] Multi-idioma
- [ ] Integração WhatsApp
- [ ] Voz para texto

---

## 🎯 Modos de Operação

### 🧪 Modo Simulador (Padrão - Grátis)

```javascript
// Respostas simuladas, sem API externa
// ✅ Zero configuração
// ✅ Perfeito para desenvolvimento
// ✅ Comandos básicos funcionam
```

**Comandos reconhecidos:**
- novo pedido, lista clientes, ver pedidos
- saldo, catálogo, agenda

### 🚀 Modo Claude API (Inteligente - Opcional)

```javascript
// IA real da Anthropic (Claude 3.5 Sonnet)
// ✅ Entende frases complexas
// ✅ Mantém contexto da conversa
// ✅ Extrai dados automaticamente
// 💰 ~$0.001 por mensagem
```

**Configure em 2 minutos:** [INTEGRACAO_IA_REAL.md](./INTEGRACAO_IA_REAL.md)

---

## 📚 Documentação

| Documento | Para quem | O que tem |
|-----------|-----------|-----------|
| **[INDEX.md](./INDEX.md)** | 📖 Índice geral | Navegue em toda documentação |
| **[QUICKSTART.md](./QUICKSTART.md)** | 🚀 Iniciantes | Comece em 5 minutos |
| **[README_IA.md](./README_IA.md)** | 👨‍💻 Desenvolvedores | Documentação técnica completa |
| **[INTEGRACAO_IA_REAL.md](./INTEGRACAO_IA_REAL.md)** | 🔌 Integradores | Como ativar Claude/GPT |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | �️ Arquitetos | Diagramas e fluxos |
| **[CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)** | 🎨 Personalizadores | Adapte ao seu negócio |
| **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** | 📊 Gerentes | Resumo técnico |
| **[DELIVERY_REPORT.md](./DELIVERY_REPORT.md)** | 📦 Stakeholders | Relatório executivo |

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────┐
│  USUÁRIO (Linguagem Natural)                    │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│  CHAT (Interface)                               │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│  IA (Simulador ou Claude)                       │
│  → Retorna: Texto + JSON de Ação                │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│  PARSER + VALIDADOR                             │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│  EXECUTOR DE AÇÕES                              │
│  → Mapeia para módulos do sistema               │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│  MÓDULOS (Pedidos, Clientes, Saldo, etc)       │
└─────────────────────────────────────────────────┘
```

📊 **Detalhes completos:** [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 🛠️ Estrutura do Projeto

```
src/
├── components/
│   ├── Chat.js                    # Interface do chat
│   ├── modals/
│   │   ├── PedidoModal.js         # Criar/editar pedidos
│   │   ├── ClienteAcoesModal.js   # Ações de cliente
│   │   ├── IAControlPanel.js      # 🆕 Painel de controle IA
│   │   └── ...
│
├── utils/
│   ├── iaCore.js                  # 🆕 Núcleo da IA
│   ├── processador.js             # Processamento manual (legacy)
│   └── ...
│
├── services/
│   └── claudeService.js           # 🆕 Integração Claude API
│
├── hooks/
│   ├── useDB.js                   # Banco de dados local
│   └── useContexto.js             # Contexto da conversa
│
└── App.js                         # 🔄 Atualizado com IA
"saldo João" - Consulta saldo
"ver orçamento Maria" - Exibe orçamentos
"listar clientes" - Lista todos os clientes
"relatório" - Mostra resumo geral
```

## 📁 Estrutura do projeto

```
src/
├── components/          # Componentes React
│   ├── Header.js       # Cabeçalho do app
│   ├── Chat.js         # Área de conversação
│   ├── InputBar.js     # Barra de entrada
│   ├── Chips.js        # Ações rápidas
│   └── modals/         # Modais (Agenda, Menu, etc)
├── hooks/              # React Hooks customizados
│   ├── useDB.js        # Gerenciamento de dados
│   └── useContexto.js  # Contexto da conversa
├── utils/              # Utilitários
│   ├── helpers.js      # Funções auxiliares
│   ├── catalogo.js     # Catálogo de serviços
│   └── processador.js  # Lógica de processamento
├── App.js              # Componente principal
└── index.js            # Entry point
```

## 🎨 Tecnologias

- **React 18** - Framework principal
- **CSS3** - Estilização customizada
- **LocalStorage** - Persistência de dados
- **Web Speech API** - Reconhecimento de voz

## 🔧 Observações importantes

### IA/Gemini
Todo o código relacionado à integração com Gemini foi **comentado** para permitir implementação futura customizada. Os arquivos afetados:
- `src/App.js` - Modal de IA comentado
- `src/components/modals/MenuModal.js` - Botão de configuração IA comentado
- Funções de chamada à API Gemini não foram incluídas

### LocalStorage
Todos os dados são salvos localmente no navegador. Para exportar dados:
1. Clique no menu (☰)
2. Selecione "Exportar Dados"
3. Um arquivo JSON será baixado

### Responsividade
O design é otimizado para:
- 📱 Mobile: 320px - 520px
- 💻 Desktop: Centralizado com largura máxima de 520px

## 🛠️ Próximos passos

1. Implementar lógica de IA customizada (substituir Gemini)
2. Adicionar testes unitários
3. Melhorar validações de entrada
4. Implementar backend (opcional)
5. PWA (Progressive Web App)

## 📝 Licença

Projeto desenvolvido para uso pessoal/educacional.

---

Desenvolvido com ⚡ por **Mestre.IA Team**
