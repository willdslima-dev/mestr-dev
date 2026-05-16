// ARQUIVO COMENTADO - PARA IMPLEMENTAÇÃO FUTURA DA IA
// Este arquivo não está sendo usado no momento

/*
import React, { useState, useEffect } from 'react';
import Modal from './Modal';

function IAModal({ isOpen, onClose }) {
  const [chaveIA, setChaveIA] = useState('');
  const [status, setStatus] = useState('off');
  const [testando, setTestando] = useState(false);

  useEffect(() => {
    // Carregar chave salva
    const chaveSalva = localStorage.getItem('oc_ia_key') || '';
    setChaveIA(chaveSalva);
    setStatus(chaveSalva ? 'on' : 'off');
  }, [isOpen]);

  const salvarChave = () => {
    try {
      localStorage.setItem('oc_ia_key', chaveIA);
      setStatus('on');
      alert('✅ Chave da IA salva com sucesso!');
    } catch (e) {
      alert('❌ Erro ao salvar chave: ' + e.message);
    }
  };

  const removerChave = () => {
    if (window.confirm('Deseja realmente remover a chave da IA?')) {
      localStorage.removeItem('oc_ia_key');
      setChaveIA('');
      setStatus('off');
    }
  };

  const testarChave = async () => {
    if (!chaveIA) {
      alert('Por favor, insira uma chave antes de testar.');
      return;
    }

    setTestando(true);
    
    try {
      // Implementar chamada de teste aqui
      // const resposta = await callGemini('teste', 'gemini-2.5-flash');
      
      // Simulação:
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('✅ Chave válida! IA funcionando.');
      setStatus('on');
    } catch (error) {
      alert('❌ Erro ao testar chave: ' + error.message);
      setStatus('off');
    } finally {
      setTestando(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="🤖 Configuração da IA">
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          borderRadius: '10px',
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          fontSize: '13px',
          marginBottom: '12px'
        }}>
          <span>Status da IA:</span>
          <span className={`ia-badge ${status === 'on' ? 'ia-on' : 'ia-off'}`}>
            {status === 'on' ? '✓ ATIVA' : '✗ INATIVA'}
          </span>
        </div>

        <label style={{
          fontSize: '13px',
          color: 'var(--muted)',
          marginBottom: '8px',
          display: 'block'
        }}>
          Chave da API (Google AI Studio):
        </label>
        
        <input
          type="password"
          value={chaveIA}
          onChange={(e) => setChaveIA(e.target.value)}
          placeholder="AIzaSy..."
          style={{
            width: '100%',
            padding: '12px',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            color: 'var(--text)',
            fontSize: '13px',
            fontFamily: 'monospace',
            letterSpacing: '0.5px',
            marginBottom: '8px'
          }}
        />

        <p style={{
          fontSize: '11px',
          color: 'var(--muted)',
          lineHeight: '1.5',
          marginBottom: '12px'
        }}>
          💡 Obtenha sua chave gratuita em:{' '}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent2)', textDecoration: 'none' }}
          >
            AI Studio
          </a>
        </p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button
            onClick={salvarChave}
            disabled={!chaveIA}
            style={{
              flex: 1,
              padding: '13px',
              borderRadius: '12px',
              border: 'none',
              background: 'var(--accent)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: chaveIA ? 'pointer' : 'not-allowed',
              transition: '0.15s',
              opacity: chaveIA ? 1 : 0.5
            }}
          >
            💾 Salvar Chave
          </button>
          
          <button
            onClick={testarChave}
            disabled={!chaveIA || testando}
            style={{
              flex: 1,
              padding: '13px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              background: 'var(--bg3)',
              color: 'var(--text)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: chaveIA && !testando ? 'pointer' : 'not-allowed',
              transition: '0.15s',
              opacity: chaveIA && !testando ? 1 : 0.5
            }}
          >
            {testando ? '⏳ Testando...' : '🧪 Testar'}
          </button>
        </div>

        {chaveIA && (
          <button
            onClick={removerChave}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--red)',
              fontSize: '12px',
              cursor: 'pointer',
              padding: '4px 0',
              textAlign: 'left'
            }}
          >
            🗑️ Remover chave
          </button>
        )}
      </div>

      <button className="modal-close" onClick={onClose}>
        Fechar
      </button>
    </Modal>
  );
}

export default IAModal;
*/

// Para usar este componente no futuro:
// 1. Descomente todo o código acima
// 2. Implemente a função callGemini() ou similar
// 3. Descomentar no App.js a importação e uso do IAModal
// 4. Descomentar no MenuModal.js o botão de configuração

export default null;
