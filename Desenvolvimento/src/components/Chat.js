import React, { useEffect, useRef } from 'react';
import './Chat.css';

function Chat({ mensagens, typing }) {
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensagens, typing]);

  const renderConteudo = (msg) => {
    if (msg.conteudo.tipo === 'card') {
      return (
        <>
          {msg.conteudo.texto && <div className="bubble">{msg.conteudo.texto}</div>}
          <div dangerouslySetInnerHTML={{ __html: msg.conteudo.card }} />
        </>
      );
    }
    return <div className="bubble">{msg.conteudo.conteudo || msg.conteudo}</div>;
  };

  return (
    <div className="chat" ref={chatRef}>
      {mensagens.map((msg) => (
        <div key={msg.id} className={`msg ${msg.isUser ? 'user' : 'bot'}`}>
          <div className="avatar">{msg.isUser ? '👤' : '⚡'}</div>
          <div className="msg-body">
            {renderConteudo(msg)}
            <div className="msg-time">{msg.hora}</div>
          </div>
        </div>
      ))}
      {typing && (
        <div className="msg bot" id="typing">
          <div className="avatar">⚡</div>
          <div className="msg-body">
            <div className="bubble">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
