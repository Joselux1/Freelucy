import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { BsEnvelopeFill } from "react-icons/bs";
import api from "../api/axios";

const defaultImage = "https://picsum.photos/200/300";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      try {
        const res = await api.get("/me");
        setUser(res.data);

        const msgRes = await api.get("/api/messages/received");
        const unread = msgRes.data.some(msg => !msg.read);
        setHasMessages(unread);
      } catch {
        console.log("Usuario no autenticado");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndMessages();

    // Escucha si desde Inbox se han marcado como leídos
    const checkIfRead = setInterval(() => {
      if (localStorage.getItem("messagesRead") === "true") {
        setHasMessages(false);
        localStorage.removeItem("messagesRead");
      }
    }, 500);

    return () => clearInterval(checkIfRead);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout", {}, { withCredentials: true });
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white text-black-800 shadow z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-[#34d399] transition">
          freelucy
        </Link>

        <div className="flex items-center gap-4 text-sm sm:text-base">
          <Link to="/" className="hover:text-[#34d399] transition">Inicio</Link>
          <Link to="/services" className="hover:text-[#34d399] transition">Servicios</Link>

          {loading ? (
            <div className="animate-spin border-t-2 border-b-2 border-gray-400 w-6 h-6 rounded-full"></div>
          ) : user ? (
            <div className="relative flex items-center gap-2">
              <button onClick={() => navigate("/profile")} className="focus:outline-none">
                <img
                  src={user?.avatar ? `http://localhost:8000${user.avatar}` : defaultImage}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover hover:ring-2 hover:ring-gray-300 transition"
                />
              </button>

              <button
                onClick={() => setShowMenu(!showMenu)}
                className="focus:outline-none text-xl"
              >
                <FiMenu />
              </button>

              {/* ICONO DE MENSAJE */}
              {hasMessages && (
                <button
                  onClick={() => {
                    navigate("/inbox");
                    setHasMessages(false);
                    setShowMenu(false);
                    localStorage.setItem("messagesRead", "true");
                  }}
                  className="relative focus:outline-none"
                  title="Tienes mensajes nuevos"
                >
                  <BsEnvelopeFill className="text-red-500 text-lg animate-bounce" />
                </button>
              )}

              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white text-gray-800 rounded shadow z-50">
                  <button
                    onClick={() => { navigate("/profile"); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Configuración de perfil
                  </button>
                  <button
                    onClick={() => {
                      navigate("/inbox");
                      setHasMessages(false);
                      setShowMenu(false);
                      localStorage.setItem("messagesRead", "true");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Bandeja de Entrada
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-[#34d399] transition">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
