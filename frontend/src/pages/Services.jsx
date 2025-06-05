import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
  const navigate = useNavigate();

  const goToDetail = (id) => {
    navigate(`/services/${id}`);
  };

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

      Swal.fire({
        icon: "success",
        title: "¡Servicio publicado!",
        text: "Tu servicio ha sido creado correctamente.",
        confirmButtonColor: "#6366f1",
      });
    } catch (error) {
      if (error.response?.status === 422) {
        const errores = Object.values(error.response.data.errors)
          .map((err) => `• ${err.join(", ")}`)
          .join("<br>");
        Swal.fire({
          icon: "error",
          title: "Error de validación",
          html: errores,
          confirmButtonColor: "#ef4444",
        });
      } else {
        console.error("Error general:", error);
        Swal.fire({
          icon: "error",
          title: "Error inesperado",
          text: "Ocurrió un error al crear el servicio.",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  const handleContract = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };
const handleDeleteService = async (serviceId, e) => {
  e.stopPropagation();

  try {
    await api.delete(`/api/services/${serviceId}`, { withCredentials: true });

    Swal.fire({
      icon: "success",
      title: "Eliminado",
      text: "El servicio fue eliminado correctamente.",
    });

    fetchServices(); // Actualiza la lista
  } catch (error) {
    console.error("Error al eliminar servicio:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo eliminar el servicio.",
    });
  }
};



  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <h1 className="text-3xl font-bold mb-6 text-center">Servicios disponibles</h1>

      {user && isFreelance && (
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

          <div className="mb-4">
            <label className="block font-semibold mb-1">Imagen del servicio:</label>
            <div className="relative">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded transition"
              >
                Seleccionar imagen
              </label>
              {image && <span className="ml-2 text-sm text-gray-700">{image.name}</span>}
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Video opcional:</label>
            <div className="relative">
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => setVideo(e.target.files[0])}
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded transition"
              >
                Seleccionar video
              </label>
              {video && <span className="ml-2 text-sm text-gray-700">{video.name}</span>}
            </div>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 w-full"
          >
            Publicar servicio
          </button>
        </form>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <div
            key={`${service.id ?? index}-${Math.random()}`}
            onClick={() => goToDetail(service.id)}
            className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
          >
            <div className="relative w-full h-48 bg-gray-100">
              {service.image_url && (
                <img
                  src={`http://localhost:8000${service.image_url}`}
                  alt={service.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              )}
              {service.video_url && (
                <video controls className="w-full h-full object-cover rounded-t-lg">
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

                <div className="flex gap-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContract(service);
                    }}
                    className="text-white bg-emerald-500 hover:bg-emerald-600 font-medium py-1 px-3 rounded transition-all duration-200"
                  >
                    Contratar
                  </button>

                  {isFreelance && service.user?.id === user?.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteService(service.id, e);
                      }}
                      className="text-white bg-red-500 hover:bg-red-600 font-medium py-1 px-3 rounded transition-all duration-200"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>


              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/services/${service.id}`);
                }}
                className="text-violet-600 font-medium hover:underline mt-2"
              >
                Valoraciones
              </button>
            </div>
          </div>
        ))}
      </div>


      {showModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4">Contactar con el anunciante</h2>
            <p className="mb-2"><strong>Usuario:</strong> {selectedService.user?.name || "Anónimo"}</p>
            <p className="mb-4"><strong>Email:</strong> {selectedService.user?.email || "No disponible"}</p>

            <textarea
              rows={4}
              placeholder="Escribe tu mensaje o solicitud..."
              className="w-full border rounded p-2 mb-4"
              value={selectedService.comment || ""}
              onChange={(e) =>
                setSelectedService({ ...selectedService, comment: e.target.value })
              }
            />

            <button
              onClick={async () => {
                try {
                  const body = {
                    receiver_id: selectedService.user.id,
                    content: selectedService.comment,
                  };
                  await api.post("/api/messages", body);
                  Swal.fire("¡Enviado!", "Mensaje enviado correctamente ✅", "success");
                  setShowModal(false);
                } catch (err) {
                  console.error("Error al enviar mensaje:", err);
                  Swal.fire("Error", "No se pudo enviar el mensaje", "error");
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded w-full mb-2"
            >
              Enviar mensaje
            </button>

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
