import React, { useState, useRef } from 'react';

function TimePickerClock({ value, onChange, label, hideInput = false, autoOpen = false }) {
  const [isOpen, setIsOpen] = useState(autoOpen || false);
  const [isDraggingHour, setIsDraggingHour] = useState(false);
  const [isDraggingMinute, setIsDraggingMinute] = useState(false);
  const startYRef = useRef(0);
  const startValueRef = useRef(0);
  
  React.useEffect(() => {
    if (autoOpen) setIsOpen(true);
  }, [autoOpen]);
  
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

  // Funções de drag/swipe para horas
  const handleHourTouchStart = (e) => {
    setIsDraggingHour(true);
    startYRef.current = e.touches ? e.touches[0].clientY : e.clientY;
    startValueRef.current = time.hours;
  };

  const handleHourTouchMove = (e) => {
    if (!isDraggingHour) return;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = startYRef.current - currentY;
    const steps = Math.floor(deltaY / 20); // 20px = 1 hora
    
    if (steps !== 0) {
      let newHour = (startValueRef.current + steps) % 24;
      if (newHour < 0) newHour += 24;
      onChange(formatTime(newHour, time.minutes));
      startYRef.current = currentY;
      startValueRef.current = newHour;
    }
  };

  const handleHourTouchEnd = () => {
    setIsDraggingHour(false);
  };

  // Funções de drag/swipe para minutos
  const handleMinuteTouchStart = (e) => {
    setIsDraggingMinute(true);
    startYRef.current = e.touches ? e.touches[0].clientY : e.clientY;
    startValueRef.current = time.minutes;
  };

  const handleMinuteTouchMove = (e) => {
    if (!isDraggingMinute) return;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = startYRef.current - currentY;
    const steps = Math.floor(deltaY / 15); // 15px = 5 minutos
    
    if (steps !== 0) {
      let newMinute = startValueRef.current + (steps * 5);
      let newHour = time.hours;
      
      while (newMinute >= 60) {
        newMinute -= 60;
        newHour = (newHour + 1) % 24;
      }
      while (newMinute < 0) {
        newMinute += 60;
        newHour = newHour === 0 ? 23 : newHour - 1;
      }
      
      onChange(formatTime(newHour, newMinute));
      startYRef.current = currentY;
      startValueRef.current = newMinute;
    }
  };

  const handleMinuteTouchEnd = () => {
    setIsDraggingMinute(false);
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

      {!hideInput && (
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
      )}

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
            zIndex: 10000,
            padding: '16px'
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: 'clamp(20px, 5vw, 32px)',
              width: '100%',
              maxWidth: '380px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ 
              color: 'var(--text)', 
              marginTop: 0, 
              marginBottom: 'clamp(16px, 4vw, 24px)', 
              textAlign: 'center', 
              fontSize: 'clamp(14px, 4vw, 16px)' 
            }}>
              Selecione a hora
            </h3>

            {/* Display digital grande */}
            <div style={{
              textAlign: 'center',
              fontSize: 'clamp(36px, 10vw, 48px)',
              fontWeight: 'bold',
              color: 'var(--primary)',
              marginBottom: 'clamp(20px, 5vw, 32px)',
              fontFamily: 'monospace',
              letterSpacing: 'clamp(2px, 1vw, 4px)',
              background: 'var(--bg3)',
              padding: 'clamp(12px, 3vw, 16px)',
              borderRadius: '8px',
              border: '2px solid var(--border)'
            }}>
              {formatTime(time.hours, time.minutes)}
            </div>

            <div style={{
              fontSize: 'clamp(11px, 2.5vw, 13px)',
              color: 'var(--muted)',
              textAlign: 'center',
              marginBottom: '16px',
              fontStyle: 'italic'
            }}>
              💡 Dica: Deslize para cima/baixo nos números
            </div>

            {/* Controles digitais */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(12px, 3vw, 16px)', marginBottom: 'clamp(16px, 4vw, 24px)' }}>
              {/* Horas */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: 'var(--muted)', marginBottom: '8px', fontWeight: '600' }}>
                  HORAS
                </div>
                <button
                  onClick={incrementHour}
                  style={{
                    width: '100%',
                    padding: 'clamp(10px, 2.5vw, 12px)',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    fontWeight: '700',
                    marginBottom: '8px',
                    touchAction: 'manipulation'
                  }}
                >
                  ▲
                </button>
                <div 
                  style={{
                    fontSize: 'clamp(20px, 5vw, 24px)',
                    fontWeight: 'bold',
                    color: 'var(--text)',
                    fontFamily: 'monospace',
                    padding: 'clamp(12px, 3vw, 16px)',
                    background: isDraggingHour ? 'var(--primary)20' : 'var(--bg3)',
                    borderRadius: '6px',
                    border: isDraggingHour ? '2px solid var(--primary)' : '1px solid var(--border)',
                    marginBottom: '8px',
                    cursor: 'ns-resize',
                    userSelect: 'none',
                    touchAction: 'none',
                    transition: 'all 0.2s'
                  }}
                  onTouchStart={handleHourTouchStart}
                  onTouchMove={handleHourTouchMove}
                  onTouchEnd={handleHourTouchEnd}
                  onMouseDown={handleHourTouchStart}
                  onMouseMove={handleHourTouchMove}
                  onMouseUp={handleHourTouchEnd}
                  onMouseLeave={handleHourTouchEnd}
                >
                  {String(time.hours).padStart(2, '0')}
                </div>
                <button
                  onClick={decrementHour}
                  style={{
                    width: '100%',
                    padding: 'clamp(10px, 2.5vw, 12px)',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    fontWeight: '700',
                    touchAction: 'manipulation'
                  }}
                >
                  ▼
                </button>
              </div>

              {/* Minutos */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: 'var(--muted)', marginBottom: '8px', fontWeight: '600' }}>
                  MINUTOS
                </div>
                <button
                  onClick={incrementMinute}
                  style={{
                    width: '100%',
                    padding: 'clamp(10px, 2.5vw, 12px)',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    fontWeight: '700',
                    marginBottom: '8px',
                    touchAction: 'manipulation'
                  }}
                >
                  ▲
                </button>
                <div 
                  style={{
                    fontSize: 'clamp(20px, 5vw, 24px)',
                    fontWeight: 'bold',
                    color: 'var(--text)',
                    fontFamily: 'monospace',
                    padding: 'clamp(12px, 3vw, 16px)',
                    background: isDraggingMinute ? 'var(--primary)20' : 'var(--bg3)',
                    borderRadius: '6px',
                    border: isDraggingMinute ? '2px solid var(--primary)' : '1px solid var(--border)',
                    marginBottom: '8px',
                    cursor: 'ns-resize',
                    userSelect: 'none',
                    touchAction: 'none',
                    transition: 'all 0.2s'
                  }}
                  onTouchStart={handleMinuteTouchStart}
                  onTouchMove={handleMinuteTouchMove}
                  onTouchEnd={handleMinuteTouchEnd}
                  onMouseDown={handleMinuteTouchStart}
                  onMouseMove={handleMinuteTouchMove}
                  onMouseUp={handleMinuteTouchEnd}
                  onMouseLeave={handleMinuteTouchEnd}
                >
                  {String(time.minutes).padStart(2, '0')}
                </div>
                <button
                  onClick={decrementMinute}
                  style={{
                    width: '100%',
                    padding: 'clamp(10px, 2.5vw, 12px)',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    fontWeight: '700',
                    touchAction: 'manipulation'
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
