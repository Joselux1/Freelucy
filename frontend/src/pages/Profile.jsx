import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    api.get("/me").then((res) => {
      const userData = res.data.user ?? res.data; // soporte para ambas formas
      setUser(userData);
      setName(userData.name);

      if (userData.avatar) {
        setPreview(`http://localhost:8000${userData.avatar}`);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (avatar instanceof File) {
      formData.append("avatar", avatar);
    }

    try {
      await api.get("/sanctum/csrf-cookie");

      const res = await api.post("/api/profile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data.user);
      setPreview(`http://localhost:8000${res.data.user.avatar}`);
      alert("¡Perfil actualizado correctamente!");
    } catch (err) {
      console.error("❌ Error:", err);
      alert(
        "Error al actualizar el perfil.\n" +
          (err.response?.data?.message ?? "Error desconocido")
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Editar perfil</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Foto de perfil</label>
          {preview && (
            <img
              src={
                preview instanceof File
                  ? URL.createObjectURL(preview)
                  : `${preview}?t=${Date.now()}`
              }
              alt="Avatar"
              className="w-24 h-24 rounded-full mb-2 object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setAvatar(file);
              setPreview(file);
            }}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
