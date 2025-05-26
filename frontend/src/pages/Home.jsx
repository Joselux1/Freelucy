import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [botInput, setBotInput] = useState('');
  const [botMessages, setBotMessages] = useState([]);
  const [showBot, setShowBot] = useState(false);
  const navigate = useNavigate();

  const botOptions = [
   
    'servicios',
    'precio',
    'soporte',
    'ayuda',
    'contacto',
    'horario'
  ];

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch(`http://localhost:8000/api/search?query=${query}`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err.message || 'Error desconocido');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);
  useEffect(() => {
  if (showBot && botMessages.length === 0) {
    setBotMessages([{ text: '¡Hola! ¿En qué puedo ayudarte hoy?', fromUser: false }]);
  }
}, [showBot]);

  const handleBotSend = async () => {
    if (!botInput.trim()) return;

    setBotMessages(prev => [...prev, { text: botInput, fromUser: true }]);

    try {
      const res = await fetch('http://localhost:8000/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: botInput }),
      });

      const data = await res.json();
      setBotMessages(prev => [...prev, { text: data.reply, fromUser: false }]);
    } catch (error) {
      setBotMessages(prev => [...prev, { text: 'Error al contactar al bot.', fromUser: false }]);
    }

    setBotInput('');
  };

  const handleBotOptionClick = async (option) => {
    setBotMessages(prev => [...prev, { text: option, fromUser: true }]);

    try {
      const res = await fetch('http://localhost:8000/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: option }),
      });

      const data = await res.json();
      setBotMessages(prev => [...prev, { text: data.reply, fromUser: false }]);
    } catch (error) {
      setBotMessages(prev => [...prev, { text: 'Error al contactar al bot.', fromUser: false }]);
    }
  };

  return (
    <>
      {/* Sección con video de fondo */}
      <div className="relative w-full h-[calc(100vh-80px)] text-white overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="/images/1.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>

        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Encuentra el servicio <span className="text-green-300">freelance</span> perfecto
          </h1>
          <p className="text-lg sm:text-xl mb-6">Con la confianza de Freelucy</p>

          <div className="flex justify-center w-full sm:w-96">
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              className="w-full px-4 py-2 rounded-lg text-black outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {loading && <div className="mt-4 text-white">Buscando...</div>}
          {error && <div className="mt-4 text-white">Sin resultados..</div>}

          {results.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 w-full sm:w-96 text-black">
              <h3 className="text-xl font-semibold mb-2">Resultados:</h3>
              <ul className="divide-y divide-gray-300">
                {results.map((service) => (
                  <li
                    key={service.id}
                    className="py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => navigate(`/services/${service.id}`)}
                  >
                    <div className="font-bold text-lg">{service.title}</div>
                    <div className="text-gray-700">{service.description}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!loading && !error && results.length === 0 && query && (
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 w-full sm:w-96 text-black">
              <h3 className="text-xl font-semibold mb-2">Resultados:</h3>
              <p>No se encontraron servicios que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sección informativa */}
      <section className="flex flex-col items-center justify-center py-16 bg-gray-100 px-4">
        <h2 className="text-3xl font-bold mb-4 text-center">¿Por qué elegir Freelucy?</h2>
        <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl">
          Conectamos a freelancers y clientes de manera eficiente y segura.
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-xs w-full">
            <h3 className="text-xl font-semibold mb-2">Variedad de Servicios</h3>
            <p className="text-gray-600">
              Encuentra freelancers en diversas áreas: diseño, desarrollo, marketing y más.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-xs w-full">
            <h3 className="text-xl font-semibold mb-2">Seguridad y Confianza</h3>
            <p className="text-gray-600">
              Garantizamos transacciones seguras y protección de datos.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-xs w-full">
            <h3 className="text-xl font-semibold mb-2">Soporte 24/7</h3>
            <p className="text-gray-600">
              Nuestro equipo está disponible para ayudarte en cualquier momento.
            </p>
          </div>
        </div>
      </section>

      {/* Botón flotante del bot */}
      <button
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg z-50"
        onClick={() => setShowBot(!showBot)}
      >
        {showBot ? 'Cerrar Ayuda' : 'Abrir Ayuda'}
      </button>

      {/* Chat Bot desplegable */}
      {showBot && (
        <div className="fixed bottom-20 right-6 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-40">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2 text-center">Chat con el bot</h2>

            {/* Opciones predefinidas */}
            <div className="mb-4 flex flex-wrap gap-2 justify-center">
              {botOptions.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleBotOptionClick(option)}
                  className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition"
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="h-60 overflow-y-auto mb-2 border rounded p-2 bg-gray-50">
              {botMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 p-2 rounded ${
                    msg.fromUser ? 'bg-green-100 text-right' : 'bg-gray-100 text-left'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                className="flex-1 p-2 border rounded-l"
                value={botInput}
                onChange={(e) => setBotInput(e.target.value)}
                placeholder="Escribe tu pregunta..."
              />
              <button
                onClick={handleBotSend}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-r"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
