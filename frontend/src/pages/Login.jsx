import { useState } from "react";
import api from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      // obtener token CSRF antes del login
      await api.get("/sanctum/csrf-cookie");
  
      // enviar login
      await api.post("/login", form);
  
      // obtener datos del usuario logueado
      const res = await api.get("/me");
  
      // guardar en localStorage
      localStorage.setItem("user", JSON.stringify(res.data));
  
      console.log("Usuario autenticado:", res.data);
      alert("Sesión iniciada correctamente");
  
      // redirigir o recargar
      window.location.href = "/services"; // o a donde quieras
    } catch (err) {
      console.error("Error de login:", err);
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };
  
  return (
    <div class="min-w-screen min-h-screen bg-white flex items-center justify-center px-5 py-5">
      <div
        class="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden"
        style={{ maxWidth: "1000px" }}
      >
        <div class="md:flex w-full">
          <div class="hidden md:block w-1/2 bg-indigo-800 py-10 px-10">
            {/* Imagen o ilustración opcional */}
          </div>
          <div class="w-full md:w-1/2 py-10 px-5 md:px-10">
            <div class="text-center mb-10">
              <h1 class="font-bold text-3xl text-gray-900">LOGIN</h1>
              <p>Enter your credentials to login</p>
            </div>
            <form onSubmit={handleSubmit}>
              {error && <p class="text-red-500 mb-3">{error}</p>}

              <div class="flex -mx-3">  
                <div class="w-full px-3 mb-5">
                  <label class="text-xs font-semibold px-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    class="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                    placeholder="johnsmith@example.com"
                    required
                  />
                </div>
              </div>

              <div class="flex -mx-3">
                <div class="w-full px-3 mb-12">
                  <label class="text-xs font-semibold px-1">Password</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    class="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
                    placeholder="************"
                    required
                  />
                </div>
              </div>

              <div class="flex -mx-3">
                <div class="w-full px-3 mb-5">
                  <button
                    type="submit"
                    class="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
                  >
                    LOGIN
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
