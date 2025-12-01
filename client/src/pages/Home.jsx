import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Home() {
  const nav = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    nav('/')
  }

  return <div style={{ padding: 20 }}>
    <h1>Bioskop</h1>
    <nav style={{ display: 'flex', gap: 12, margin: '12px 0' }}>
      <Link to="/movies">Filmovi</Link>
      {user && <Link to="/reservations">Moje rezervacije</Link>}
      {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
      {!user && <Link to="/login">Login</Link>}
      {!user && <Link to="/register">Registracija</Link>}
      {user && <button onClick={logout}>Odjava</button>}
    </nav>
    {user
      ? <p>Ulogovan: {user.email} ({user.role})</p>
      : <p>Dobrodosao! Prijavi se ili napravi nalog.</p>}
  </div>
}