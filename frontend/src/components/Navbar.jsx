import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/me")
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      setUser(null);
      alert("Sesión cerrada");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-blue-300 transition">
          Freelucy
        </Link>

        {/* Menú */}
        <div className="flex items-center gap-4 text-sm sm:text-base">
          <Link to="/" className="hover:text-blue-300 transition">Inicio</Link>
          <Link to="/services" className="hover:text-blue-300 transition">Servicios</Link>

          {user ? (
            <>
              <span className="font-semibold hidden sm:inline">Hola, {user.name}</span>
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
