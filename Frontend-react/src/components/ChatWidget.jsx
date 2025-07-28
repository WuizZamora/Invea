import React, { useState, useEffect, useRef } from "react";
import { useUsuario } from "../context/UserContext";
import { io } from "socket.io-client";
import "../css/ChatWidget.css";

const socket = io(`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}`); // Cambia al puerto de tu backend si es diferente

const ChatWidget = () => {
  const { usuario } = useUsuario();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Escucha mensajes del servidor
    socket.on("mensaje", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup
    return () => {
      socket.off("mensaje");
    };
  }, []);

  const toggleChat = async () => {
    setIsOpen(!isOpen);

    if (!isOpen && usuario?.id) {
      // Cargar historial cuando se abre el chat
      try {
        const res = await fetch(`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/chat/${usuario.id}`,{credentials: 'include'});
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error al cargar historial", err);
      }
    }
  };

  const handleSend = () => {
    if (input.trim() === "") return;

    const mensaje = {
      Fk_IDUsuario: usuario.id,
      nombre: usuario.nombre,
      mensaje: input,
      remitente: "user",
    };

    socket.emit("mensaje", mensaje);

    // No actualices el estado local aquí, lo hará el socket
    setInput("");
  };

  useEffect(() => {
    // Scroll al final cada vez que hay un nuevo mensaje
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
              <div key={idx} className={`chat-message ${msg.remitente}`}>
                {msg.mensaje}
              </div>
            ))}
            <div ref={messagesEndRef} />
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
