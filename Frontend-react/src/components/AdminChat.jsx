import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/AdminChat.css";

const mockUsers = [
  {
    id: 1,
    name: "Usuario 1",
    lastMessage: "Tengo un problema...",
    messages: [
      { from: "user", text: "Hola, ¿hay alguien ahí?" },
      { from: "admin", text: "Hola, ¿en qué puedo ayudarte?" },
      { from: "user", text: "Tengo un problema..." },
    ],
  },
  {
    id: 2,
    name: "Usuario 2",
    lastMessage: "Gracias por la ayuda",
    messages: [
      { from: "user", text: "Necesito soporte" },
      { from: "admin", text: "Claro, dime." },
      { from: "user", text: "Gracias por la ayuda" },
    ],
  },
];

const AdminChat = () => {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        const newMessages = [...user.messages, { from: "admin", text: message }];
        return { ...user, messages: newMessages, lastMessage: message };
      }
      return user;
    });

    setUsers(updatedUsers);
    setSelectedUser({ ...selectedUser, messages: [...selectedUser.messages, { from: "admin", text: message }] });
    setMessage("");
  };

  return (
    <div className="Chat">   
        <div className="container-fluid" style={{ height: "88vh" }}>
            <div className="row h-100 border">
                {/* Sidebar */}
                <div className="col-md-4 border-end p-3 overflow-auto">
                <h5>Usuarios</h5>
                <ul className="list-group">
                    {users.map((user) => (
                    <li
                        key={user.id}
                        className={`list-group-item list-group-item-action ${
                        selectedUser?.id === user.id ? "active" : ""
                        }`}
                        onClick={() => handleSelectUser(user)}
                        style={{ cursor: "pointer" }}
                    >
                        <strong>{user.name}</strong>
                        <div className="text-muted small">{user.lastMessage}</div>
                    </li>
                    ))}
                </ul>
                </div>

                {/* Chat panel */}
                <div className="col-md-8 d-flex flex-column p-3">
                {selectedUser ? (
                    <>
                    <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: "70vh" }}>
                        {selectedUser.messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`mb-2 text-${msg.from === "admin" ? "end" : "start"}`}
                        >
                            <span
                            className={`p-2 rounded d-inline-block ${
                                msg.from === "admin" ? "bg-primary text-white" : "bg-light"
                            }`}
                            >
                            {msg.text}
                            </span>
                        </div>
                        ))}
                    </div>
                    <div className="d-flex">
                        <input
                        type="text"
                        className="form-control me-2"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Escribe una respuesta..."
                        />
                        <button className="btn btn-primary" onClick={handleSendMessage}>
                        Enviar
                        </button>
                    </div>
                    </>
                ) : (
                    <div className="text-center my-auto">
                    <h5>Selecciona un usuario para comenzar</h5>
                    </div>
                )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminChat;
