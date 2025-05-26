import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get(`/api/services/${id}`)
      .then((res) => {
        setService(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar el servicio:", err);
        setLoading(false);
      });
  }, [id]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      Swal.fire("Campo vacío", "Escribe un mensaje antes de enviarlo.", "warning");
      return;
    }

    try {
      await api.post("/api/messages", {
        receiver_id: service.user.id,
        content: message,
      });
      Swal.fire("Enviado", "Mensaje enviado correctamente ✅", "success");
      setMessage("");
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      Swal.fire("Error", "No se pudo enviar el mensaje.", "error");
    }
  };

  if (loading) return <p className="text-center mt-32">Cargando...</p>;
  if (!service) return <p className="text-center text-red-600 mt-32">Servicio no encontrado</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-32 mb-24">
      <h1 className="text-3xl font-bold text-center mb-6">{service.title}</h1>

      {service.image_url && (
        <img
          src={`http://localhost:8000${service.image_url}`}
          alt={service.title}
          className="w-full max-h-96 object-cover mb-6 rounded"
        />
      )}

      <p className="text-gray-700 text-lg mb-4">{service.description}</p>
      <p className="text-xl font-semibold mb-6">Precio: {service.price} €</p>

      {service.video_url && (
        <video controls className="w-full max-h-96 object-cover mb-4 rounded">
          <source src={`http://localhost:8000${service.video_url}`} type="video/mp4" />
        </video>
      )}

      <div className="bg-gray-50 p-4 rounded shadow-inner">
        <p><strong>Publicado por:</strong> {service.user?.name || "Usuario anónimo"}</p>
        <p><strong>Email:</strong> {service.user?.email || "No disponible"}</p>

        <div className="mt-6 flex gap-4">
       
          <button
            onClick={handleSendMessage}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded"
          >
            Enviar mensaje
          </button>
        </div>

        <textarea
          className="w-full mt-4 p-2 border rounded"
          rows={3}
          placeholder="Escribe tu mensaje para el freelance..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
    </div>
  );
}
