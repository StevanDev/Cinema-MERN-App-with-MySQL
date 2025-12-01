import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('')
    const nav = useNavigate()

    const submit = async (e) => {
        e.preventDefault()
        setMsg('')
        try {
            await api.post('/api/auth/register', { email, password })
            setMsg('Uspesna registracija. Preusmeravam na login...')
            setTimeout(() => nav('/login'), 800)
        } catch (err) {
            const m = err.response?.data?.message || 'Greska pri registraciji'
            const details = err.response?.data?.details?.join(', ')
            setMsg(details ? `${m}: ${details}` : m)
        }
    }

    return (
        <div style={{ padding: 20, maxWidth: 420 }}>
            <h2>Registracija</h2>
            <form onSubmit={submit}>
                <div style={{ marginBottom: 12 }}>
                    <label>Email</label><br />
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" type="email" required />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>Lozinka (min 6)</label><br />
                    <input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" minLength={6} required />
                </div>
                <button>Registruj se</button>
            </form>
            {msg && <p style={{ color: msg.startsWith('Uspeš') ? 'green' : 'red' }}>{msg}</p>}
            <p style={{ marginTop: 10 }}>Imas nalog? <Link to="/login">Prijavi se</Link></p>
        </div>
    )
}
