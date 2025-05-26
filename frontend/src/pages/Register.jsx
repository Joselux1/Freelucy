import { useState } from "react";
import api from "../api/axios";
import Swal from "sweetalert2"; 

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/register", form);

      Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Bienvenido a Freelucy 🎉",
        confirmButtonColor: "#6366f1",
      }).then(() => {
        window.location.href = "/login"; // redirigir después de cerrar alerta
      });

    } catch (err) {
      console.error("Error al registrar:", err);

      Swal.fire({
        icon: "error",
        title: "Uyy...",
        text: err.response?.data?.message || "Error al registrar usuario",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="min-w-screen min-h-screen bg-white flex items-center justify-center px-5 py-5">
      <div className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden" style={{ maxWidth: "1000px" }}>
        <div className="md:flex w-full">
          <div className="hidden md:block w-1/2 bg-indigo-800 py-10 px-10">
            {/* SVG aquí si quieres */}
          </div>
          <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
            <div className="text-center mb-10">
              <h1 className="font-bold text-3xl text-gray-900">Registro</h1>
              <p>Ingresa tus datos para registrarte</p>
            </div>
            <form onSubmit={handleSubmit}>
              {error && <p className="text-red-500 mb-3">{error}</p>}
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                  <label className="text-xs font-semibold px-1">Nombre</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                    placeholder="Nombre"
                    required
                  />
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                  <label className="text-xs font-semibold px-1">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                    placeholder="Ingrese su correo electrónico"
                    required
                  />
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                  <label className="text-xs font-semibold px-1">Password</label>
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type="password"
                    className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                    placeholder="************"
                    required
                  />
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-12">
                  <label className="text-xs font-semibold px-1">Confirmar Password</label>
                  <input
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    type="password"
                    className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                    placeholder="************"
                    required
                  />
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                  <button
                    type="submit"
                    className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
                  >
                    Registrarse ahora
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
