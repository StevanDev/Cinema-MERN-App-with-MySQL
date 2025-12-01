import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Login() {
  const [email, setEmail] = useState('admin@admin.com')
  const [password, setPassword] = useState('admin123')
  const [msg, setMsg] = useState('')
  const nav = useNavigate()
  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      nav('/')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Greška')
    }
  }
  return <div style={{ padding: 20 }}>
    <h2>Login</h2>
    <form onSubmit={submit}>
      <div><input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" /></div>
      <div><input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" /></div>
      <button>Prijava</button>
    </form>
    {msg && <p style={{ color: 'red' }}>{msg}</p>}
  </div>
}
