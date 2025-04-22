import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="text-center">Cargando...</p>;
  if (!service) return <p className="text-center text-red-600">Servicio no encontrado</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h1 className="text-2xl font-bold mb-4">{service.title}</h1>
      <p className="text-gray-700 mb-2">{service.description}</p>
      <p className="text-lg font-semibold mb-4">Precio: {service.price} €</p>

      {service.image_url && (
        <img
          src={`http://localhost:8000${service.image_url}`}
          alt={service.title}
          className="w-full max-h-96 object-cover mb-4"
        />
      )}

      {service.video_url && (
        <video controls className="w-full max-h-96 object-cover mb-4">
          <source src={`http://localhost:8000${service.video_url}`} type="video/mp4" />
        </video>
      )}

      <div className="mt-4">
        <p><strong>Publicado por:</strong> {service.user?.name || "Usuario anónimo"}</p>
        <p><strong>Email:</strong> {service.user?.email || "No disponible"}</p>
      </div>
    </div>
  );
}
