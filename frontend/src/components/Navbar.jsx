import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me");
        setUser(res.data);
      } catch (err) {
        console.log("No hay usuario logueado");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("user");
      window.location.reload();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-blue-300 transition">
          freelucy
        </Link>

        <div className="flex items-center gap-4 text-sm sm:text-base">
          <Link to="/" className="hover:text-blue-300 transition">Inicio</Link>
          <Link to="/services" className="hover:text-blue-300 transition">Servicios</Link>

          {loading ? (
            <div className="animate-spin border-t-2 border-b-2 border-white w-6 h-6 rounded-full"></div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 focus:outline-none"
              >
              <img
                src={user?.avatar ? `http://localhost:8000${user.avatar}` : defaultImage}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />

                <span className="font-semibold hidden sm:inline">{user.name}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow z-50">
                  <button
                    onClick={() => { navigate("/profile"); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100" >          
                  Configuración de perfil
                  </button>
                  <button
                    onClick={() => { navigate("/inbox"); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100" >
                    Bandeja de Entrada
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100" >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
