import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Al cargar el Navbar, comprobamos si hay sesión
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me"); // Esto requiere sesión activa
        setUser(res.data);
      } catch (err) {
        console.log("No hay usuario logueado");
      } finally {
        setLoading(false); // para que se quite el spinner
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout"); // Llama al backend para cerrar sesión
      localStorage.removeItem("user"); // Limpia el usuario
      window.location.reload(); // Recarga la app para que desaparezca el formulario
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  }; 
  

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-blue-300 transition">
          Freelucy
        </Link>

        <div className="flex items-center gap-4 text-sm sm:text-base">
          <Link to="/" className="hover:text-blue-300 transition">Inicio</Link>
          <Link to="/services" className="hover:text-blue-300 transition">Servicios</Link>

          {loading ? (
            <div className="animate-spin border-t-2 border-b-2 border-white w-6 h-6 rounded-full"></div>
          ) : user ? (
            <>
              <span className="font-semibold hidden sm:inline">Bienvenido, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition text-sm sm:text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-300 transition">Login</Link>
              <Link to="/register" className="hover:text-blue-300 transition">Registro</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
