/**
 * MODAL TEMPLATES - Sistema de Templates Reutilizáveis
 * 
 * Em vez de usar Handlebars (que não é React-friendly), criamos
 * templates especializados como componentes React compostos.
 * 
 * Isso mantém:
 * - ✅ Reatividade do React
 * - ✅ Type safety
 * - ✅ Componentes reutilizáveis
 * - ✅ Sem bibliotecas extras
 * - ✅ Padrão consistente
 */

export { default as FormModal } from './FormModal';
export { default as ListModal } from './ListModal';
export { default as SelectModal } from './SelectModal';
