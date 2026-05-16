import React, { useState, useMemo } from 'react';
import FormModal from './templates/FormModal';
import { formatarMoeda } from '../../infrastructure/formatters';

function DescontoModal({ isOpen, onClose, onApply, totais = { totalServicos: 0, totalMateriais: 0, subtotal: 0, totalRecebido: 0 } }) {
  const [preset, setPreset] = useState(null); // 5 | 10 | 'outro'
  const [porcentagemCustom, setPorcentagemCustom] = useState('');
  const [reaisValue, setReaisValue] = useState('');
  const [modo, setModo] = useState('porcentagem'); // 'porcentagem' | 'reais'

  const pending = Math.max(0, (totais.subtotal || 0) - (totais.totalRecebido || 0));

  const percent = useMemo(() => {
    if (preset === 5) return 5;
    if (preset === 10) return 10;
    if (preset === 'outro') return parseFloat(porcentagemCustom) || 0;
    return 0;
  }, [preset, porcentagemCustom]);

  const descontoCalculado = useMemo(() => {
    if (modo === 'reais') {
      const reais = parseFloat(reaisValue);
      if (!isNaN(reais) && reais > 0) {
        return Math.min(Math.round(reais * 100) / 100, pending);
      }
      return 0;
    }

    // modo porcentagem: usa porcentagem sobre o pendente
    const p = percent || 0;
    return Math.round((pending * (p / 100)) * 100) / 100;
  }, [reaisValue, percent, pending, modo]);

  const handleApply = () => {
    if (descontoCalculado <= 0) {
      alert('Informe um desconto válido.');
      return;
    }

    onApply(descontoCalculado);
    onClose();
  };

  const footerButtons = (
    <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
      <button onClick={onClose} style={{ flex: 1, padding: '14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancelar</button>
      <button onClick={handleApply} style={{ flex: 1, padding: '14px', background: descontoCalculado > 0 ? 'var(--accent)' : 'var(--bg3)', border: 'none', borderRadius: '8px', color: descontoCalculado > 0 ? 'white' : 'var(--text-secondary)', fontSize: '14px', fontWeight: '600', cursor: descontoCalculado > 0 ? 'pointer' : 'not-allowed' }}>{descontoCalculado > 0 ? `Aplicar ${formatarMoeda(descontoCalculado)}` : 'Aplicar'}</button>
    </div>
  );

  return (
    <FormModal isOpen={isOpen} onClose={onClose} titulo={'Desconto'} onSave={handleApply} customFooter={footerButtons} isValid={descontoCalculado > 0}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Valor pendente do cliente</div>
        <div style={{ padding: '12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '700' }}>{formatarMoeda(pending)}</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Este é o valor atual ainda em aberto para o pedido</div>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Defina o desconto</div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="radio" name="modo" checked={modo === 'porcentagem'} onChange={() => { setModo('porcentagem'); setReaisValue(''); }} /> Porcentagem
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="radio" name="modo" checked={modo === 'reais'} onChange={() => { setModo('reais'); setPreset(null); setPorcentagemCustom(''); }} /> Reais (R$)
          </label>
        </div>

        {modo === 'porcentagem' && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => { setPreset(5); setPorcentagemCustom(''); }} style={{ padding: '8px 12px' }}>5%</button>
              <button type="button" onClick={() => { setPreset(10); setPorcentagemCustom(''); }} style={{ padding: '8px 12px' }}>10%</button>
              <button type="button" onClick={() => { setPreset('outro'); }} style={{ padding: '8px 12px' }}>Outro %</button>
            </div>
            <div style={{ flex: 1 }}>
              {preset === 'outro' ? (
                <input type="number" placeholder="Informe %" value={porcentagemCustom} onChange={(e) => setPorcentagemCustom(e.target.value)} step="0.1" min="0" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }} />
              ) : (
                <div style={{ color: 'var(--muted)', fontSize: '13px' }}>Selecione uma opção ou escolha "Outro %"</div>
              )}
            </div>
          </div>
        )}

        {modo === 'reais' && (
          <div>
            <input type="number" placeholder="R$ 0,00" value={reaisValue} onChange={(e) => setReaisValue(e.target.value)} step="0.01" min="0" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }} />
          </div>
        )}

        <div style={{ padding: '10px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Desconto calculado:</div>
          <div style={{ fontSize: '16px', fontWeight: '700' }}>{formatarMoeda(descontoCalculado)}</div>
        </div>
      </div>
    </FormModal>
  );
}

export default DescontoModal;
