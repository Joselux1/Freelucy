import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function Reviews() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get(`/api/services/${id}/reviews`)
      .then(res => setReviews(res.data.reviews))
      .catch(err => console.error("Error cargando reviews:", err));
  }, [id]);

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Valoraciones del servicio</h1>
      {reviews.map((r) => (
        <div key={r.id} className="bg-white p-4 rounded shadow mb-3">
          <p className="font-semibold">{r.user.name}</p>
          <p>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
  
}
