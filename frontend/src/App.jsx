import './App.css';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white">
          ¡Tailwind está funcionando! 🚀
        </h1>
      </div>
    </AuthProvider>
  );
}

export default App;
