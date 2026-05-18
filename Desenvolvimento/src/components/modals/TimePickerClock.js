import React, { useState } from 'react';

function TimePickerClock({ value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Converte valor HH:MM para objeto {hours, minutes}
  const parseTime = (timeStr) => {
    if (!timeStr) return { hours: 0, minutes: 0 };
    const [h, m] = timeStr.split(':').map(Number);
    return { hours: h || 0, minutes: m || 0 };
  };

  const time = parseTime(value);

  // Converte objeto {hours, minutes} para string HH:MM
  const formatTime = (h, m) => {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Incrementa hora
  const incrementHour = () => {
    const newHour = (time.hours + 1) % 24;
    onChange(formatTime(newHour, time.minutes));
  };

  // Decrementa hora
  const decrementHour = () => {
    const newHour = time.hours === 0 ? 23 : time.hours - 1;
    onChange(formatTime(newHour, time.minutes));
  };

  // Incrementa minuto
  const incrementMinute = () => {
    let newMinute = time.minutes + 5;
    let newHour = time.hours;
    if (newMinute >= 60) {
      newMinute = 0;
      newHour = (newHour + 1) % 24;
    }
    onChange(formatTime(newHour, newMinute));
  };

  // Decrementa minuto
  const decrementMinute = () => {
    let newMinute = time.minutes - 5;
    let newHour = time.hours;
    if (newMinute < 0) {
      newMinute = 55;
      newHour = newHour === 0 ? 23 : newHour - 1;
    }
    onChange(formatTime(newHour, newMinute));
  };

  // Permite digitação direta
  const handleDirectInput = (e) => {
    const inputValue = e.target.value;
    if (/^\d{0,2}:\d{0,2}$/.test(inputValue) || inputValue === '') {
      // Valida formato HH:MM
      if (inputValue.length === 5 && inputValue.includes(':')) {
        const [h, m] = inputValue.split(':').map(Number);
        if (h >= 0 && h < 24 && m >= 0 && m < 60) {
          onChange(inputValue);
        }
      } else if (inputValue === '') {
        onChange('');
      }
    }
  };

  const handleConfirm = () => {
    setIsOpen(false);
  };

  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
        {label}
      </label>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={value}
          onChange={handleDirectInput}
          placeholder="--:--"
          style={{
            flex: 1,
            padding: '10px 12px',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text)',
            fontSize: '14px',
            cursor: 'pointer',
            textAlign: 'center',
            fontFamily: 'monospace',
            fontWeight: '600'
          }}
          onClick={() => setIsOpen(!isOpen)}
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: '10px 16px',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500'
          }}
        >
          🕐
        </button>
      </div>

      {/* Modal do relógio digital */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '320px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: 'var(--text)', marginTop: 0, marginBottom: '24px', textAlign: 'center', fontSize: '16px' }}>
              Selecione a hora
            </h3>

            {/* Display digital grande */}
            <div style={{
              textAlign: 'center',
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'var(--primary)',
              marginBottom: '32px',
              fontFamily: 'monospace',
              letterSpacing: '4px',
              background: 'var(--bg3)',
              padding: '16px',
              borderRadius: '8px',
              border: '2px solid var(--border)'
            }}>
              {formatTime(time.hours, time.minutes)}
            </div>

            {/* Controles digitais */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              {/* Horas */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px', fontWeight: '600' }}>
                  HORAS
                </div>
                <button
                  onClick={incrementHour}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}
                >
                  ▲
                </button>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'var(--text)',
                  fontFamily: 'monospace',
                  padding: '12px',
                  background: 'var(--bg3)',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  marginBottom: '8px'
                }}>
                  {String(time.hours).padStart(2, '0')}
                </div>
                <button
                  onClick={decrementHour}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '700'
                  }}
                >
                  ▼
                </button>
              </div>

              {/* Minutos */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px', fontWeight: '600' }}>
                  MINUTOS
                </div>
                <button
                  onClick={incrementMinute}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}
                >
                  ▲
                </button>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'var(--text)',
                  fontFamily: 'monospace',
                  padding: '12px',
                  background: 'var(--bg3)',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  marginBottom: '8px'
                }}>
                  {String(time.minutes).padStart(2, '0')}
                </div>
                <button
                  onClick={decrementMinute}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '700'
                  }}
                >
                  ▼
                </button>
              </div>
            </div>

            {/* Botões de ação */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  padding: '10px 16px',
                  background: 'var(--bg3)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: '10px 16px',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimePickerClock;
