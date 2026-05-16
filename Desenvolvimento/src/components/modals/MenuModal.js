import React from 'react';
import Modal from './Modal';
import { popularDadosTeste } from '../../utils/constants';

function MenuModal({ isOpen, onClose, onAbrirCatalogo, onAbrirItens, onAbrirConfig, onAbrirIA }) {
  const handleExportar = () => {
    const data = {
      clientes: localStorage.getItem('oc_cli') || '{}',
      orcamentos: localStorage.getItem('oc_orc') || '{}',
      pagamentos: localStorage.getItem('oc_pag') || '[]',
      agenda: localStorage.getItem('oc_agenda') || '[]',
      custos: localStorage.getItem('oc_custos') || '[]'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mestre-ia-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const popularClientesComEnderecos = () => {
    if (!window.confirm('🏠 Popular com 20 clientes e pedidos aleatórios de teste?\n\n✅ Clientes com endereços reais de Carapicuíba e Osasco\n✅ Pedidos aleatórios para cada cliente')) {
      return;
    }

    const resultado = popularDadosTeste();
    
    alert(`✅ Dados populados com sucesso!\n\n👥 ${resultado.totalClientes} clientes\n📋 ${resultado.totalPedidos} pedidos\n\nRecarregando...`);
    window.location.reload();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="⚙️ Menu">
      <div className="modal-row">
        <button className="modal-btn" onClick={onAbrirItens}>
          📝 Editar Itens
        </button>
        <button className="modal-btn" onClick={onAbrirCatalogo}>
          📚 Catálogo
        </button>
      </div>
      
      <div className="modal-row">
        <button className="modal-btn" onClick={onAbrirConfig}>
          🎨 Aparência
        </button>
        <button className="modal-btn" onClick={onAbrirIA}>
          🤖 Configurar IA
        </button>
        <button className="modal-btn" onClick={handleExportar}>
          💾 Exportar
        </button>
      </div>

      <div className="modal-row">
        <button className="modal-btn" onClick={popularClientesComEnderecos} style={{ background: '#4CAF50' }}>
          🏠 Popular Clientes
        </button>
        <button className="modal-btn" onClick={() => {
          if (window.confirm('Deseja limpar apenas clientes inválidos?')) {
            // Limpa apenas clientes inválidos
            const cli = JSON.parse(localStorage.getItem('oc_cli') || '{}');
            const clientesValidos = {};
            Object.keys(cli).forEach(key => {
              if (cli[key].nome && cli[key].nome.trim() !== '') {
                clientesValidos[key] = cli[key];
              }
            });
            localStorage.setItem('oc_cli', JSON.stringify(clientesValidos));
            window.location.reload();
          }
        }}>
          🧹 Limpar Inválidos
        </button>
        <button className="modal-btn" onClick={() => {
          if (window.confirm('Deseja realmente limpar todos os dados?')) {
            localStorage.clear();
            window.location.reload();
          }
        }}>
          🗑️ Limpar Tudo
        </button>
      </div>
      
      <button className="modal-close" onClick={onClose}>Fechar</button>
    </Modal>
  );
}

export default MenuModal;
