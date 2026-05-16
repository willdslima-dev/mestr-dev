import { useState } from 'react';

// Hook para gerenciar contexto da conversa
export function useContexto() {
  const [CTX, setCTX] = useState({
    tipo: null,       // 'criar', 'add', 'pag', etc
    nome: null,       // nome do cliente
    orcId: null,      // ID do orçamento
    intent: null,     // intenção detectada
    pendMedidas: []   // medidas pendentes
  });

  const updateContexto = (novoCTX) => {
    setCTX(prev => ({ ...prev, ...novoCTX }));
  };

  const resetContexto = () => {
    setCTX({
      tipo: null,
      nome: null,
      orcId: null,
      intent: null,
      pendMedidas: []
    });
  };

  return {
    CTX,
    updateContexto,
    resetContexto
  };
}
