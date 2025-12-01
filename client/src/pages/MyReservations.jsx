import React, { useEffect, useState } from 'react'
import api from '../api'

export default function MyReservations() {
    const [items, setItems] = useState([])
    const [msg, setMsg] = useState('')

    useEffect(() => {
        setMsg('')
        api.get('/api/reservations/mine')
            .then(res => setItems(res.data || []))
            .catch(err => setMsg(err.response?.data?.message || 'Greška'))
    }, [])

    const fmt = (d) => new Date(d).toLocaleString()

    return (
        <div style={{ padding: 20 }}>
            <h2>Moje rezervacije</h2>
            {msg && <p style={{ color: 'red' }}>{msg}</p>}
            {!items.length && <p>Jos uvek nema rezervacija.</p>}
            <ul>
                {items.map(r => (
                    <li key={r.id}>
                        #{r.id} — projekcija: {r.screening?.id} ({r.screening?.starts_at ? fmt(r.screening.starts_at) : '—'}) — ukupno: {Number(r.total_price).toFixed(2)} RSD
                    </li>
                ))}
            </ul>
        </div>
    )
}
