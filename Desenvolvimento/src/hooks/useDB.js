import { useState, useEffect } from 'react';

// Hook para gerenciar dados do localStorage (DB)
export function useDB() {
  const [CLI, setCLI] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem('oc_cli') || '{}');
      // Limpa clientes inválidos
      const clientesValidos = {};
      Object.keys(data).forEach(key => {
        if (data[key].nome && data[key].nome.trim() !== '') {
          clientesValidos[key] = data[key];
        }
      });
      return clientesValidos;
    } catch {
      return {};
    }
  });

  const [ORC, setORC] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('oc_orc') || '{}');
    } catch {
      return {};
    }
  });

  const [PAG, setPAG] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('oc_pag') || '[]');
    } catch {
      return [];
    }
  });

  const [AGENDA, setAGENDA] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('oc_agenda') || '[]');
    } catch {
      return [];
    }
  });

  const [CUSTOS, setCUSTOS] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('oc_custos') || '[]');
    } catch {
      return [];
    }
  });

  const saveAll = () => {
    try {
      localStorage.setItem('oc_cli', JSON.stringify(CLI));
      localStorage.setItem('oc_orc', JSON.stringify(ORC));
      localStorage.setItem('oc_pag', JSON.stringify(PAG));
      localStorage.setItem('oc_agenda', JSON.stringify(AGENDA));
      localStorage.setItem('oc_custos', JSON.stringify(CUSTOS));
    } catch (e) {
      console.error('Erro ao salvar dados:', e);
    }
  };

  const saveCli = () => {
    try {
      localStorage.setItem('oc_cli', JSON.stringify(CLI));
    } catch (e) {
      console.error('Erro ao salvar clientes:', e);
    }
  };

  const saveOrc = () => {
    try {
      localStorage.setItem('oc_orc', JSON.stringify(ORC));
    } catch (e) {
      console.error('Erro ao salvar orçamentos:', e);
    }
  };

  const savePag = () => {
    try {
      localStorage.setItem('oc_pag', JSON.stringify(PAG));
    } catch (e) {
      console.error('Erro ao salvar pagamentos:', e);
    }
  };

  const saveAgenda = () => {
    try {
      localStorage.setItem('oc_agenda', JSON.stringify(AGENDA));
    } catch (e) {
      console.error('Erro ao salvar agenda:', e);
    }
  };

  const saveCustos = () => {
    try {
      localStorage.setItem('oc_custos', JSON.stringify(CUSTOS));
    } catch (e) {
      console.error('Erro ao salvar custos:', e);
    }
  };

  // Auto-save quando os dados mudarem
  useEffect(() => {
    saveCli();
  }, [CLI]);

  useEffect(() => {
    saveOrc();
  }, [ORC]);

  useEffect(() => {
    savePag();
  }, [PAG]);

  useEffect(() => {
    saveAgenda();
  }, [AGENDA]);

  useEffect(() => {
    saveCustos();
  }, [CUSTOS]);

  return {
    CLI,
    ORC,
    PAG,
    AGENDA,
    CUSTOS,
    setCLI,
    setORC,
    setPAG,
    setAGENDA,
    setCUSTOS,
    saveAll,
    saveCli,
    saveOrc,
    savePag,
    saveAgenda,
    saveCustos
  };
}
