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

  // Obtener usuario desde localStorage y verificar si es freelance
  const user = JSON.parse(localStorage.getItem("user"));
const isFreelance = user?.role?.name === "freelance";



  useEffect(() => {
    fetchServices();
    const savedLocal = JSON.parse(localStorage.getItem("localServices")) || [];
    setServices(prev => [...prev, ...savedLocal]);
  }, []);

  const fetchServices = () => {
    api.get("/api/services")
      .then(res => setServices(res.data))
      .catch(err => console.error("Error al cargar servicios:", err));
  };

  const handleInputChange = (e) => {
    setNewService({
      ...newService,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateService = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", newService.title);
    formData.append("description", newService.description);
    formData.append("price", newService.price);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    api.post("/api/services", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
      .then(() => {
        fetchServices();

        const localServices = JSON.parse(localStorage.getItem("localServices")) || [];
        const newLocalService = {
          id: Date.now(),
          title: newService.title,
          description: newService.description,
          price: newService.price,
          image_url: image ? URL.createObjectURL(image) : null,
          video_url: video ? URL.createObjectURL(video) : null,
        };
        localServices.push(newLocalService);
        localStorage.setItem("localServices", JSON.stringify(localServices));

        setNewService({ title: "", description: "", price: "" });
        setImage(null);
        setVideo(null);
      })
      .catch(error => console.error("Error al crear servicio:", error));
  };

  const handleContract = (id) => {
    api.post(`/api/services/${id}/contract`)
      .then(() => alert("Servicio contratado correctamente"))
      .catch(error => console.error("Error al contratar servicio:", error));
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Servicios disponibles</h1>

      {/* Formulario solo si el usuario es freelance */}
      {isFreelance && (
        <form onSubmit={handleCreateService} className="bg-white shadow-md rounded p-6 mb-10 max-w-xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">Sube tu servicio</h2>
          <input type="text" name="title" placeholder="Título" value={newService.title} onChange={handleInputChange} className="w-full mb-4 p-2 border rounded" required />
          <textarea name="description" placeholder="Descripción" value={newService.description} onChange={handleInputChange} className="w-full mb-4 p-2 border rounded" required />
          <input type="number" name="price" placeholder="Precio (€)" value={newService.price} onChange={handleInputChange} className="w-full mb-4 p-2 border rounded" required />
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full mb-4" />
          <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} className="w-full mb-4" />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">Publicar servicio</button>
        </form>
      )}

      {/* Cards tipo Fiverr */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {services.map(service => (
          <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
            <div className="relative">
              {service.image_url && (
                <img src={service.image_url} alt={service.title} className="w-full h-44 object-cover" />
              )}
              {service.video_url && (
                <video controls className="w-full h-44 object-cover">
                  <source src={service.video_url} type="video/mp4" />
                </video>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span className="font-semibold text-black">Usuario</span>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">Nivel 1</span>
              </div>
              <h3 className="text-md font-semibold leading-tight text-gray-800 mb-1 truncate">{service.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-black">{service.price} €</span>
                <button onClick={() => handleContract(service.id)} className="text-sm text-violet-600 font-medium hover:underline">Contratar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
