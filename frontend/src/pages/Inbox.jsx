import { useEffect, useState } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get("/api/messages/received", { withCredentials: true });
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const handleReply = async (receiverId) => {
    if (!replyContent.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Mensaje vacío',
        text: 'Escribe un mensaje antes de enviar.',
      });
      return;
    }

    try {
      await api.post(
        "/api/messages",
        {
          receiver_id: receiverId,
          content: replyContent,
        },
        { withCredentials: true }
      );

      Swal.fire({
        icon: 'success',
        title: '¡Respuesta enviada!',
        showConfirmButton: false,
        timer: 1500,
      });

      setReplyContent("");
      setReplyTo(null);
      fetchMessages();
    } catch (err) {
      console.error("Error al enviar respuesta:", err);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se pudo enviar la respuesta.',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-32 p-6"> {/* ← Ajustado aquí */}
      <h1 className="text-2xl font-bold mb-6">Bandeja de entrada 📥</h1>

      {messages.length === 0 ? (
        <p className="text-gray-600">No tienes mensajes en este momento.</p>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className="bg-white shadow rounded p-4 mb-4">
            <div className="text-sm text-gray-500 mb-1">
              <span className="font-semibold">From:</span>{" "}
              {msg.sender ? msg.sender.name : "Usuario eliminado"}
              <span className="ml-4 text-xs">
                {new Date(msg.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-800 mb-2">{msg.content}</p>

            {msg.sender && (
              <button
                className="text-blue-600 text-sm underline"
                onClick={() => {
                  setReplyTo(msg.id);
                  setReplyContent("");
                }}
              >
                Responder
              </button>
            )}

            {replyTo === msg.id && msg.sender && (
              <div className="mt-2">
                <textarea
                  className="w-full p-2 border rounded mb-2"
                  rows={3}
                  placeholder="Escribe tu respuesta..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReply(msg.sender.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Enviar
                  </button>
                  <button
                    onClick={() => {
                      setReplyTo(null);
                      setReplyContent("");
                    }}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
