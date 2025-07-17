import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/AdminChat.css";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}`);

const AdminChat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");

  // Carga la lista de usuarios con último mensaje
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/userchat`,{credentials: 'include'})
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(console.error);
  }, []);

  // Cuando seleccionas un usuario, carga su historial real
  const handleSelectUser = async (user) => {
    setSelectedUser(null); // Limpia temporalmente para mostrar loader si quieres

    try {
      const res = await fetch(`${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/chat/${user.id}`,{credentials: 'include'});
      const messages = await res.json();

      // Mapear mensajes para usar la misma estructura que antes
      const mappedMessages = messages.map((msg) => ({
        from: msg.remitente,
        text: msg.mensaje,
      }));

      setSelectedUser({ ...user, messages: mappedMessages });
    } catch (err) {
      console.error("Error al cargar mensajes", err);
    }
  };

  // Escuchar mensajes entrantes por socket
  useEffect(() => {
    socket.on("mensaje", (data) => {
      // Actualizar sólo si el mensaje es del usuario seleccionado
      if (selectedUser && data.Fk_IDUsuario === selectedUser.id) {
        setSelectedUser((prev) => ({
          ...prev,
          messages: [...prev.messages, { from: data.remitente, text: data.mensaje }],
        }));
      }

      // Actualizar último mensaje en la lista de usuarios
        setUsers((prevUsers) => {
        const existingUser = prevUsers.find((u) => u.id === data.Fk_IDUsuario);
        let updatedUsers;

        if (existingUser) {
            updatedUsers = prevUsers.map((u) =>
            u.id === data.Fk_IDUsuario
                ? { ...u, lastMessage: data.mensaje }
                : u
            );
        } else {
            updatedUsers = [
                ...prevUsers,
                {
                    id: data.Fk_IDUsuario,
                    nombre: data.nombre || "Nuevo usuario",
                    lastMessage: data.mensaje,
                },
            ];
        }

        // Ordenar por más reciente (puedes usar timestamp si tienes)
        return updatedUsers.sort((a, b) => (a.id === data.Fk_IDUsuario ? -1 : b.id === data.Fk_IDUsuario ? 1 : 0));
        });
    });

    return () => {
      socket.off("mensaje");
    };
  }, [selectedUser]);

    // Enviar mensaje al backend
    const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    const data = {
        Fk_IDUsuario: selectedUser.id,
        mensaje: message,
        remitente: "admin",
    };

    socket.emit("mensaje", data);

    // No actualizar aquí el estado local, solo limpia el input
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
                  <strong>{user.nombre}</strong>
                  <div className="text-muted small">{user.lastMessage}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat panel */}
          <div className="col-md-8 d-flex flex-column p-3">
            {selectedUser ? (
              <>
                <div
                  className="flex-grow-1 overflow-auto mb-3"
                  style={{ maxHeight: "70vh" }}
                >
                  {selectedUser.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`mb-2 text-${
                        msg.from === "admin" ? "end" : "start"
                      }`}
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
