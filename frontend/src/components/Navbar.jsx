import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Navbar() {
  const [user, setUser] = useState(null);

  // Al cargar el componente, obtenemos el usuario si está logueado
  useEffect(() => {
    api.get("/me")
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  // Función para cerrar sesión
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
    <nav className="bg-blue-800 text-white px-6 py-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Freelucy</h1>
        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-blue-300">Inicio</Link>
          <Link to="/services" className="hover:text-blue-300">Servicios</Link>

          {user ? (
            <>
              <span className="font-semibold">Hola, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-300">Login</Link>
              <Link to="/register" className="hover:text-blue-300">Registro</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
