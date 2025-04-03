import { useEffect, useState } from "react";
import axios from "axios";

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/services")
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error("Error al obtener servicios:", error);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Servicios disponibles</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service.id} className="bg-white rounded shadow p-4 border border-gray-100 hover:shadow-md transition">
            <h2 className="text-xl font-semibold">{service.title}</h2>
            <p className="text-gray-600 mt-2 mb-4">{service.description}</p>
            <span className="text-green-600 font-bold">{service.price} €</span>
          </div>
        ))}
      </div>
    </div>
  );
}
