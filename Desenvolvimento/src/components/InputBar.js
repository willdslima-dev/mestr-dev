import React, { useState, useRef, useEffect } from 'react';
import './InputBar.css';

function InputBar({ onSend }) {
  const [texto, setTexto] = useState('');
  const [gravando, setGravando] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Web Speech API (opcional, comentar se não quiser por enquanto)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'pt-BR';
      recognitionRef.current.continuous = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTexto(transcript);
        setGravando(false);
      };

      recognitionRef.current.onerror = () => {
        setGravando(false);
      };

      recognitionRef.current.onend = () => {
        setGravando(false);
      };
    }
  }, []);

  const handleSend = () => {
    if (texto.trim()) {
      onSend(texto.trim());
      setTexto('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setTexto(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const toggleAudio = () => {
    if (recognitionRef.current) {
      if (!gravando) {
        recognitionRef.current.start();
        setGravando(true);
      } else {
        recognitionRef.current.stop();
        setGravando(false);
      }
    }
  };

  return (
    <div className="input-bar">
      <div className="input-wrap">
        <textarea
          ref={textareaRef}
          value={texto}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          rows="1"
        />
      </div>
      {texto.trim() ? (
        <button 
          className="btn-send" 
          onClick={handleSend}
        >
          ➤
        </button>
      ) : (
        <button 
          className={`btn-mic ${gravando ? 'rec' : ''}`}
          onClick={toggleAudio}
          title={gravando ? 'Parar gravação' : 'Gravar áudio'}
        >
          🎤
        </button>
      )}
    </div>
  );
}

export default InputBar;
