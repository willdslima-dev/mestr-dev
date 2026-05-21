# 📊 Sistema SINAPI - Integração Completa

## O que é SINAPI?

O **SINAPI** (Sistema Nacional de Pesquisa de Custos e Índices da Construção Civil) é a tabela oficial da **Caixa Econômica Federal** com preços de referência para serviços e materiais da construção civil.

## ✨ Funcionalidades Implementadas

### 1. 📋 Catálogo SINAPI Completo
- **10 serviços reais** da tabela SINAPI cadastrados
- Categorias: Alvenaria, Revestimento, Pintura, Contrapiso, Impermeabilização, Esquadrias, Forro, Estrutura
- Códigos oficiais (ex: 74209/001, 87623, 88486)
- Preços atualizados (Maio/2026)
- Composições detalhadas com insumos

### 2. 🔍 Busca e Filtros
- **Busca por texto**: código, descrição ou categoria
- **Filtro por categoria**: Todas, Alvenaria, Revestimento, etc.
- Interface intuitiva com 2 abas:
  - 📊 **Tabela SINAPI**: serviços oficiais
  - ✏️ **Personalizado**: criar serviços customizados

### 3. 📦 Composição Automática de Materiais

**Como funciona:**

Quando você seleciona um serviço SINAPI, o sistema **automaticamente adiciona os materiais** necessários na aba de Materiais do pedido.

**Exemplo Prático:**

Se você adicionar o serviço:
```
ALVENARIA DE VEDACAO - 10m²
```

O sistema automaticamente adiciona aos materiais:
- ✅ 136 UN de Blocos Cerâmicos (R$ 1,45/un)
- ✅ 0,118 m³ de Argamassa (R$ 312,86/m³)

**Materiais excluídos automaticamente:**
- Mão de obra (pedreiro, servente, marceneiro, etc)
- Equipamentos (betoneira, etc)

### 4. ✏️ Materiais Editáveis

Todos os materiais adicionados automaticamente são **totalmente editáveis**:

- ✅ **Editar quantidade**: Se você já tem parte do material
- ✅ **Editar valor**: Se conseguiu um preço melhor
- ✅ **Excluir material**: Se já tem o material em estoque
- ✅ **Adicionar novos**: Materiais extras não previstos

**Use Case Real:**
```
Serviço: Pintura Látex - 50m²
Materiais auto-adicionados:
  - 13L de Tinta Látex
  - 8,5 un de Lixas

Você pode:
  - Reduzir para 10L de tinta (já tem 3L em estoque)
  - Excluir lixas (tem sobra de outra obra)
  - Adicionar fita crepe manualmente
```

### 5. 💰 Precificação Inteligente

- **Valor SINAPI**: Usa o custo oficial da tabela
- **Valor personalizado**: Pode sobrescrever o valor se negociar desconto
- **Cálculo automático**: Quantidade × Valor Unitário
- **Total do pedido**: Soma serviços + materiais

## 🔧 Estrutura dos Dados

### Serviço SINAPI
```javascript
{
  codigo: '74209/001',
  descricao: 'ALVENARIA DE VEDACAO...',
  unidade: 'm²',
  custoUnitario: 89.67,
  categoria: 'Alvenaria',
  insumos: [
    { 
      codigo: '00004302',
      descricao: 'BLOCO CERAMICO...',
      unidade: 'UN',
      coeficiente: 13.6,  // quantidade por m²
      precoUnitario: 1.45
    }
  ]
}
```

### Material Auto-gerado
```javascript
{
  id: 'mat_123456',
  codigo: '00004302',
  nome: 'BLOCO CERAMICO...',
  unidadeMedida: 'UN',
  quantidade: 136,  // 13.6 × 10m²
  valorUnitario: 1.45,
  valorTotal: 197.20,
  origem: 'SINAPI',
  codigoServico: '74209/001',
  editavel: true  // Permite edição/exclusão
}
```

## 📁 Arquivos Criados

1. **`src/utils/sinapi.js`**
   - Base de dados SINAPI
   - Funções de busca e filtro
   - Função `obterMateriaisDoServico()` - extrai materiais

2. **`src/components/modals/SelecionarServicoModalSINAPI.js`**
   - Interface de seleção de serviços
   - Abas SINAPI / Personalizado
   - Busca e filtros
   - Pré-visualização de total

3. **`PedidoModal.js` (atualizado)**
   - Importa `obterMateriaisDoServico()`
   - `handleAdicionarServico()` modificado
   - Adiciona materiais automaticamente quando serviço é SINAPI

## 🚀 Como Usar

### Passo 1: Adicionar Serviço
1. No pedido, clique em "➕ Adicionar Serviço"
2. Selecione aba "📊 Tabela SINAPI"
3. Use a busca ou filtro por categoria
4. Clique no serviço desejado
5. Defina a quantidade
6. (Opcional) Use valor personalizado
7. Clique em "✅ Adicionar Serviço"

### Passo 2: Materiais Adicionados Automaticamente
- Os materiais aparecem automaticamente na aba "Materiais"
- Cada material tem origem "SINAPI" identificada
- Vinculado ao código do serviço

### Passo 3: Ajustar Materiais (Opcional)
- Clique em um material para editar
- Ajuste quantidade se tiver material em estoque
- Ajuste valor se conseguiu desconto
- Ou exclua se não precisar comprar

### Passo 4: Adicionar Materiais Extras
- Clique em "➕ Adicionar Material"
- Adicione itens não previstos no SINAPI
- Ex: Fita crepe, panos de limpeza, etc.

## 💡 Exemplos de Uso Real

### Exemplo 1: Reforma de Apartamento
```
Serviços adicionados:
1. Pintura Látex (80m²)
   → Materiais auto: 20,8L tinta + 13,6 lixas
   
2. Revestimento Cerâmico (25m²)
   → Materiais auto: 27,5m² cerâmica + 137kg argamassa + 25kg rejunte

Ajustes feitos:
- Reduziu tinta para 18L (tinha 3L em estoque)
- Excluiu 5kg de rejunte (sobra de obra anterior)
- Adicionou manualmente: Fita crepe (5 rolos)
```

### Exemplo 2: Construção Nova
```
Serviços adicionados:
1. Alvenaria de Vedação (120m²)
   → Materiais auto: 1.632 blocos + 1,42m³ argamassa
   
2. Contrapiso (80m²)
   → Materiais auto: 1.344kg cimento + 6,72m³ areia

Todos os materiais mantidos (obra do zero, sem estoque)
```

## 🎯 Benefícios

✅ **Agilidade**: Não precisa cadastrar materiais manualmente  
✅ **Precisão**: Quantidades baseadas em composições reais  
✅ **Preços atualizados**: Tabela SINAPI oficial  
✅ **Flexibilidade**: Pode editar tudo depois  
✅ **Profissionalismo**: Orçamentos com base técnica  
✅ **Economia**: Identifica o que já tem em estoque  

## 📝 Notas Importantes

- Os valores SINAPI são **referência**, não obrigatórios
- Você pode usar valores personalizados
- Materiais de mão de obra não são adicionados (já incluídos no serviço)
- A quantidade de materiais é calculada automaticamente pelo coeficiente
- Todos os materiais podem ser editados ou excluídos

## 🔄 Próximas Melhorias Possíveis

- [ ] Importar tabela SINAPI completa (Excel/PDF)
- [ ] Atualização automática de preços
- [ ] Comparação de preços (SINAPI vs Real pago)
- [ ] Histórico de preços
- [ ] Sugestões de materiais alternativos
- [ ] Controle de estoque integrado
