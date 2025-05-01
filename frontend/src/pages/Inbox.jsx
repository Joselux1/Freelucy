import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Inbox() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.get("/api/messages/received")
      .then(res => setMessages(res.data))
      .catch(err => console.error("Failed to load messages:", err));
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6"> Bandeja de entrada 📥</h1>

      {messages.length === 0 ? (
        <p className="text-gray-600">No tienes mensajes en este momento.</p>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className="bg-white shadow rounded p-4 mb-4">
            <div className="text-sm text-gray-500 mb-1">
              <span className="font-semibold">From:</span> {msg.sender.name}
              <span className="ml-4 text-xs">{new Date(msg.created_at).toLocaleString()}</span>
            </div>
            <p className="text-gray-800">{msg.content}</p>
          </div>
        ))
      )}
    </div>
  );
}
