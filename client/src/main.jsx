import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Movies from './pages/Movies.jsx'
import MovieDetails from './pages/MovieDetails.jsx'
import MyReservations from './pages/MyReservations.jsx'
import Admin from './pages/Admin.jsx'

const Protected = ({ children, role }) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (!token) return <Navigate to="/login" />
  if (role && user?.role !== role) return <Navigate to="/" />
  return children
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      <Route path="/reservations" element={<Protected><MyReservations /></Protected>} />
      <Route path="/admin" element={<Protected role="admin"><Admin /></Protected>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
)
