import './App.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import MainLayout from './layouts/MainLayout';
import ReviewList from "./pages/ReviewList";





function ReviewsTest() {
  return <div style={{ padding: "2rem" }}> Ruta activa /reviews/:id</div>;
}


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<div className="text-center mt-10 text-3xl text-purple-600">Bienvenido a Freelucy 🚀</div>} />
            <Route path="services" element={<Services />} />
            <Route path="services/:id" element={<ServiceDetail />} />
             <Route path="/reviews/:id" element={<ReviewList />} />
            </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
