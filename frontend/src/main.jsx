import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail' 
import Login from './pages/Login'
import Register from './pages/Register'
import Layout from './components/Layout'
import './index.css'
import Reviews from './pages/Reviews';
import Inbox from "./pages/Inbox";
import Profile from './pages/Profile';








ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reviews/:id" element={<Reviews />} /> 
          <Route path="inbox" element={<Inbox />} />
          <Route path="profile" element={<Profile />} />

        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
