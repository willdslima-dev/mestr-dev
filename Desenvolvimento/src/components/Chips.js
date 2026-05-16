import React, { useState } from 'react';
import './Chips.css';

function Chips({ onChipClick }) {
  const [chips] = useState([
    '📋 Novo pedido',
    '👥 Lista de clientes',
    '📦 Pedidos'
  ]);

  return (
    <div className="chips">
      {chips.map((chip, index) => (
        <div 
          key={index} 
          className="chip" 
          onClick={() => onChipClick(chip)}
        >
          {chip}
        </div>
      ))}
    </div>
  );
}

export default Chips;
