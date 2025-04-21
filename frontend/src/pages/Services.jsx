import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Services() {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const isFreelance = user?.role?.name === "freelance";

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    api
      .get("/api/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Error al cargar servicios:", err));
  };

  const handleInputChange = (e) => {
    setNewService({
      ...newService,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateService = async (e) => {
    e.preventDefault();

    try {
      await api.get("/sanctum/csrf-cookie");

      const formData = new FormData();
      formData.append("title", newService.title);
      formData.append("description", newService.description);
      formData.append("price", newService.price);
      if (image) formData.append("image", image);
      if (video) formData.append("video", video);

      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      await api.post("/api/services", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-XSRF-TOKEN": decodeURIComponent(csrfToken),
        },
      });

      fetchServices();
      setNewService({ title: "", description: "", price: "" });
      setImage(null);
      setVideo(null);
    } catch (error) {
      if (error.response?.status === 422) {
        console.log("Errores de validación:", error.response.data.errors);
        alert("Errores:\n" + JSON.stringify(error.response.data.errors, null, 2));
      } else {
        console.error("Error general:", error);
      }
    }
  };

  const handleContract = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Servicios disponibles</h1>

      {isFreelance && (
        <form onSubmit={handleCreateService} className="bg-white shadow-md rounded p-6 mb-10 max-w-xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">Sube tu servicio</h2>
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={newService.title}
            onChange={handleInputChange}
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Descripción"
            value={newService.description}
            onChange={handleInputChange}
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Precio (€)"
            value={newService.price}
            onChange={handleInputChange}
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full mb-4" />
          <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} className="w-full mb-4" />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
            Publicar servicio
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <div
            key={`${service.id ?? index}-${Math.random()}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
          >
            <div className="relative">
              {service.image_url && (
                <img
                  src={`http://localhost:8000${service.image_url}`}
                  alt={service.title}
                  className="w-full h-44 object-cover"
                />
              )}
              {service.video_url && (
                <video controls className="w-full h-44 object-cover">
                  <source src={`http://localhost:8000${service.video_url}`} type="video/mp4" />
                </video>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span className="font-semibold text-black">{service.user?.name || "Usuario"}</span>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">Nivel 1</span>
              </div>
              <h3 className="text-md font-semibold leading-tight text-gray-800 mb-1 truncate">{service.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-black">{service.price} €</span>
                <button
                  onClick={() => handleContract(service)}
                  className="text-sm text-violet-600 font-medium hover:underline"
                >
                  Contratar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de contacto */}
      {showModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4">Contactar con el anunciante</h2>
            <p className="mb-2"><strong>Usuario:</strong> {selectedService.user?.name || "Anónimo"}</p>
            <p className="mb-4"><strong>Email:</strong> {selectedService.user?.email || "No disponible"}</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
