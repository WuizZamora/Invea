import React, { useState } from "react";
import "../css/ChatWidget.css";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hola 👋 Soy una herramienta en desarrollo, actualmente no sirvo :c" }
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (input.trim() === "") return;

    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    // Simulación de respuesta del bot
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Soy una herramienta en desarrollo, actualmente no sirvo :c" }
      ]);
    }, 1000);
  };

  return (
    <div className={`chat-widget ${isOpen ? "open" : ""}`}>
      <div className="chat-header" onClick={toggleChat}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
          alt="Bot"
          className="chat-avatar"
        />
        <div>
          <strong>Soporte</strong>
          <div className="chat-subtitle">Haz clic para {isOpen ? "cerrar" : "abrir"}</div>
        </div>
      </div>

      {isOpen && (
        <div className="chat-body">
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.from}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Escribe algo..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
