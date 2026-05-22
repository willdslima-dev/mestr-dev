# 🏗️ Sistema de Orçamentos com SINAPI

Sistema completo de gerenciamento de orçamentos e pedidos com integração da Tabela SINAPI (Caixa Econômica Federal).

## 🚀 Início Rápido

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm start
```
Abre em [http://localhost:3000](http://localhost:3000)

### Build de Produção
```bash
npm run build
```
Gera build otimizado na pasta `build/`

## 📦 Funcionalidades Principais

### 🎯 Gestão de Clientes
- Cadastro completo
- Histórico de pedidos
- Saldo e pagamentos
- Busca avançada

### 📋 Orçamentos e Pedidos
- Criação de orçamentos
- Tabela SINAPI integrada (252 serviços)
- Catálogo de materiais
- Serviços personalizados
- Cálculo automático de materiais por serviço
- Revisão antes de adicionar

### 💰 Financeiro
- Controle de pagamentos
- Múltiplas formas de pagamento
- Parcelamento
- Descontos
- Relatórios

### 📊 Tabela SINAPI 2026-04
- 252 serviços pré-carregados
- 11 categorias
- Valores atualizados
- Busca por código/descrição
- Filtro por categoria
- Materiais calculados automaticamente
- Quantidades arredondadas inteligentemente

### 📄 Documentos
- Geração de orçamentos
- Impressão de pedidos
- Exportação

### 🗓️ Agenda
- Agendamento de serviços
- Calendário integrado
- Notificações

## 🛠️ Tecnologias

- **React** 18.3.1
- **React Scripts** 5.0.1
- **LocalStorage** para persistência
- **CSS Variables** para temas
- **Modo Escuro** nativo

## 📱 Responsivo

- ✅ Desktop (1920px+)
- ✅ Laptop (1366px+)
- ✅ Tablet (768px+)
- ✅ Mobile Portrait (<480px)
- ✅ Mobile Landscape

## 🎨 Interface

- Modo escuro otimizado
- Modais padronizados
- Animações suaves
- Scrollbar customizada
- Botões fixos
- Uma barra de rolagem por modal

## 📂 Estrutura

```
src/
├── components/
│   ├── modals/           # Modais da aplicação
│   ├── forms/            # Componentes de formulário
│   └── ...
├── utils/
│   ├── sinapi.js         # Tabela SINAPI (252 serviços)
│   ├── catalogo.js       # Catálogo de materiais
│   ├── helpers.js        # Funções auxiliares
│   └── ...
├── hooks/
│   ├── useDB.js          # Persistência local
│   ├── useTheme.js       # Controle de tema
│   └── useContexto.js    # Estado global
└── App.js                # Componente principal
```

## 🔧 Scripts Disponíveis

- `npm start` - Inicia desenvolvimento
- `npm run build` - Build de produção
- `npm test` - Executa testes

## 💾 Dados

Os dados são salvos automaticamente no **LocalStorage** do navegador:
- `oc_clientes` - Clientes
- `oc_orcamentos` - Orçamentos
- `oc_pagamentos` - Pagamentos
- `oc_agenda` - Agenda
- `oc_custos` - Custos

## 🎯 Próximos Passos

1. Instalar dependências: `npm install`
2. Iniciar aplicação: `npm start`
3. Acessar: http://localhost:3000
4. Começar a usar!

## 📝 Notas

- Build gerado em: `build/`
- SINAPI atualizado: Abril/2026
- Total de serviços: 252
- Total de materiais sugeridos: 650+

---

**Desenvolvido com ❤️ para construção civil**
