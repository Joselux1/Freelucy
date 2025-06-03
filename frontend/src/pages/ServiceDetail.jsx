import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    Promise.all([
      api.get(`/api/services/${id}`),
      api.get(`/api/services/${id}/reviews`)
    ])
      .then(([resService, resReviews]) => {
        setService(resService.data);
        setReviews(resReviews.data.reviews || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar el servicio o las valoraciones:", err);
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
      Swal.fire("Enviado", "Mensaje enviado correctamente ", "success");
      setMessage("");
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      Swal.fire("Error", "No se pudo enviar el mensaje.", "error");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/services/${id}/reviews`, {
        rating,
        comment,
      });
      Swal.fire("Gracias", "Tu valoración ha sido registrada ", "success");
      setRating("");
      setComment("");

      const res = await api.get(`/api/services/${id}/reviews`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error("Error al enviar valoración:", err);
      Swal.fire("Error", "No se pudo enviar la valoración", "error");
    }
  };

  if (loading) return <p className="text-center mt-32">Cargando...</p>;
  if (!service) return <p className="text-center text-red-600 mt-32">Servicio no encontrado</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-32 mb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Columna principal */}
      <div className="md:col-span-2 bg-white shadow rounded p-6">
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

        <div>
          <h2 className="text-2xl font-semibold mb-4">Valoraciones del servicio</h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500">Este servicio aún no tiene valoraciones.</p>
          ) : (
            <div className="space-y-4 mb-8">
              {reviews.map((r) => (
                <div key={r.id} className="border rounded p-4 shadow-sm">
                  <p className="font-semibold">{r.user.name}</p>
                  <p className="text-yellow-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                  <p>{r.comment}</p>
                </div>
              ))}
            </div>
          )}

          {user ? (
            <div className="bg-white p-4 border rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Deja tu valoración</h3>
              <form onSubmit={handleSubmitReview} className="space-y-3">
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="">Selecciona una puntuación</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} estrella{n > 1 && "s"}</option>
                  ))}
                </select>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border rounded p-2"
                  rows={3}
                  placeholder="Escribe tu comentario"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded"
                >
                  Enviar valoración
                </button>
              </form>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              Debes{" "}
              <a href="/login" className="text-indigo-600 hover:underline">iniciar sesión</a> para dejar una valoración.
            </p>
          )}
        </div>
      </div>

      {/* Columna lateral */}
      <div className="bg-gray-50 p-6 rounded shadow-md h-fit">
        <h3 className="text-lg font-semibold mb-2">Anunciante</h3>
        <p className="mb-1"><strong>Nombre:</strong> {service.user?.name || "Usuario anónimo"}</p>
        <p className="mb-6"><strong>Email:</strong> {service.user?.email || "No disponible"}</p>

        <h4 className="text-md font-semibold mb-2">Enviar mensaje</h4>
        {user ? (
          <>
            <textarea
              className="w-full mb-3 p-2 border rounded"
              rows={4}
              placeholder="Escribe tu mensaje para el freelance..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded"
            >
              Enviar mensaje
            </button>
          </>
        ) : (
          <p className="text-sm text-gray-500">
            Inicia sesión para contactar con el anunciante.{" "}
            <a href="/login" className="text-indigo-600 hover:underline">Ir a login</a>
          </p>
        )}
      </div>
    </div>
  );
}
