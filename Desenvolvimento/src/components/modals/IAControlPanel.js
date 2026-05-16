import React, { useState, useEffect } from 'react';
import { validarConfiguracao, obterChaveAPI, salvarChaveAPI, removerChaveAPI, testarChaveAPI } from '../../services/geminiService';
import './IAControlPanel.css';

function IAControlPanel({ isOpen, onClose, onChaveAlterada }) {
  const [config, setConfig] = useState({ configurada: false });
  const [chaveAPI, setChaveAPI] = useState('');
  const [testando, setTestando] = useState(false);
  const [mensagemTeste, setMensagemTeste] = useState('');

  useEffect(() => {
    const status = validarConfiguracao();
    setConfig(status);
    const chave = obterChaveAPI();
    setChaveAPI(chave);
  }, []);

  if (!isOpen) return null;

  const handleSalvarChave = async () => {
    if (!chaveAPI || chaveAPI.trim().length === 0) {
      setMensagemTeste('❌ Digite uma chave válida');
      return;
    }
    setTestando(true);
    setMensagemTeste('🔄 Testando...');
    const resultado = await testarChaveAPI(chaveAPI.trim());
    if (resultado.sucesso) {
      salvarChaveAPI(chaveAPI.trim());
      setMensagemTeste(resultado.mensagem);
      if (onChaveAlterada) onChaveAlterada(true);
      setTimeout(() => {
        setConfig(validarConfiguracao());
        setMensagemTeste('');
      }, 2000);
    } else {
      setMensagemTeste(resultado.mensagem);
    }
    setTestando(false);
  };

  const handleRemoverChave = () => {
    if (window.confirm('Remover chave da API?')) {
      removerChaveAPI();
      setChaveAPI('');
      setMensagemTeste('');
      setConfig(validarConfiguracao());
      if (onChaveAlterada) onChaveAlterada(false);
    }
  };

  return (
    <div className="ia-control-panel-overlay" onClick={onClose}>
      <div className="ia-control-panel" onClick={(e) => e.stopPropagation()} style={{maxWidth: '680px'}}>
        <div className="panel-header">
          <h2>✨ Inteligência Artificial</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        <div className="panel-body">
          {config.configurada && (
            <div className="alert alert-success" style={{marginBottom: '20px'}}>
              <p>✅ <strong>IA Gemini ativa</strong> — linguagem natural habilitada</p>
            </div>
          )}
          
          <section className="panel-section">
            <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--muted)'}}>
              Chave da API Gemini (Google)
            </label>
            <input 
              type="password" 
              className="api-key-input" 
              value={chaveAPI} 
              onChange={(e) => setChaveAPI(e.target.value)} 
              placeholder="••••••••••••••••••••" 
              disabled={testando}
              style={{marginBottom: '12px'}}
            />
            
            {config.configurada && (
              <button 
                onClick={handleRemoverChave}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f06070',
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: '4px 0',
                  marginBottom: '12px',
                  display: 'block'
                }}
              >
                🗑 Remover chave
              </button>
            )}
            
            <p style={{fontSize: '13px', color: 'var(--muted)', marginBottom: '12px', lineHeight: '1.6'}}>
              Obtenha sua chave gratuita em <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent)'}}>aistudio.google.com</a>.<br/>
              A chave fica salva só no seu dispositivo. Com ela ativada, o app entende linguagem completamente natural — "joão 5 disjuntores", "maria pagou metade" etc.
            </p>

            <div style={{display: 'flex', gap: '12px'}}>
              <button 
                className="btn-save-key" 
                onClick={handleSalvarChave} 
                disabled={testando}
                style={{flex: 1}}
              >
                {testando ? '⏳ Testando...' : 'Salvar e ativar'}
              </button>
              <button 
                onClick={handleSalvarChave}
                disabled={testando}
                style={{
                  padding: '12px 20px',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Testar ⚡
              </button>
            </div>

            {mensagemTeste && (
              <div 
                className={`test-message ${mensagemTeste.includes('✅') ? 'success' : 'error'}`}
                style={{marginTop: '12px'}}
              >
                {mensagemTeste}
              </div>
            )}
          </section>
        </div>
        
        <div className="panel-footer">
          <button className="btn-primary" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default IAControlPanel;
