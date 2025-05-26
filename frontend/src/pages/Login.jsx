import { useState } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
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

      if (isLogin) {
        const res = await api.post("/login", form);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        Swal.fire({
          icon: "success",
          title: "¡Acceso exitoso!",
          text: "Bienvenido a Freelucy 🎉",
          confirmButtonColor: "#6366f1",
        }).then(() => {
          window.location.href = "/services"; // Redirige donde desees después de login
        });
      } else {
        await api.post("/register", form);
        Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: "Bienvenido a Freelucy 🎉",
          confirmButtonColor: "#6366f1",
        }).then(() => {
          setIsLogin(true); // Vuelve a mostrar el login después del registro exitoso
        });
      }
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Ocurrió un error al procesar la solicitud",
        confirmButtonColor: "#ef4444",
      });
      setError(err.response?.data?.message || "Error al procesar");
    }
  };

  return (
<div className="min-w-screen min-h-screen bg-white flex items-center justify-center px-5 py-5">
  <div className="w-full max-w-4xl bg-gray-100 text-gray-500 rounded-3xl shadow-xl flex overflow-hidden">
    {/* Imagen de fondo */}
    <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/images/9ecacf84-ab50-4771-8c07-17f3975ed007.png')" }}>
      <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
        {/* Puedes agregar contenido aquí si es necesario */}
      </div>
    </div>

    {/* Formulario de login */}
    <div className="w-1/2 py-8 px-5 md:px-10">
      <div className="text-center mb-6">
        <h1 className="font-bold text-2xl text-gray-900">{isLogin ? "Iniciar sesión" : "Registro"}</h1>
        <p>{isLogin ? "Ingresa tus credenciales" : "Crea una cuenta nueva"}</p>
      </div>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        {!isLogin && (
          <div className="flex -mx-3">
            <div className="w-full px-3 mb-4">
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
        )}
        <div className="flex -mx-3">
          <div className="w-full px-3 mb-4">
            <label className="text-xs font-semibold px-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
              placeholder="Correo electrónico"
              required
            />
          </div>
        </div>
        <div className="flex -mx-3">
          <div className="w-full px-3 mb-4">
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
        {!isLogin && (
          <div className="flex -mx-3">
            <div className="w-full px-3 mb-6">
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
        )}
        <div className="flex -mx-3">
          <div className="w-full px-3 mb-5">
            <button
              type="submit"
              className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
            >
              {isLogin ? "Iniciar sesión" : "Registrarse ahora"}
            </button>
          </div>
        </div>
      </form>
      <div className="text-center mt-4">
        {isLogin ? (
          <p>
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => setIsLogin(false)}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        ) : (
          <p>
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => setIsLogin(true)}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Inicia sesión aquí
            </button>
          </p>
        )}
      </div>
    </div>
  </div>
</div>

  );
}
