import React, { useEffect, useState } from 'react'
import api from '../api'

const initial = { name: '', rows: 8, seats_per_row: 12 }

export default function AdminHalls() {
    const [items, setItems] = useState([])
    const [form, setForm] = useState(initial)
    const [editId, setEditId] = useState(null)
    const [msg, setMsg] = useState('')

    const load = async () => {
        setMsg('')
        try {
            const { data } = await api.get('/api/halls')
            setItems(data || [])
        } catch (e) {
            setMsg(e.response?.data?.message || 'Greska pri ucitavanju sala')
        }
    }
    useEffect(() => { load() }, [])

    const resetForm = () => { setForm(initial); setEditId(null) }

    const submit = async (e) => {
        e.preventDefault()
        setMsg('')
        try {
            const payload = {
                name: form.name,
                rows: Number(form.rows),
                seats_per_row: Number(form.seats_per_row)
            }
            if (editId) await api.put(`/api/halls/${editId}`, payload)
            else await api.post('/api/halls', payload)
            resetForm(); await load()
        } catch (err) {
            setMsg(err.response?.data?.message || 'Greska')
        }
    }

    const onEdit = (h) => {
        setEditId(h.id)
        setForm({ name: h.name, rows: h.rows, seats_per_row: h.seats_per_row })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const onDelete = async (id) => {
        if (!confirm('Obrisi salu?')) return
        try { await api.delete(`/api/halls/${id}`); await load() }
        catch (e) { setMsg(e.response?.data?.message || 'Greska pri brisanju') }
    }

    return (
        <div>
            <h3>{editId ? 'Izmena sale' : 'Nova sala'}</h3>
            <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 600, marginBottom: 16 }}>
                <input placeholder="Naziv" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <div style={{ display: 'flex', gap: 8 }}>
                    <input type="number" min="1" placeholder="Broj redova" value={form.rows} onChange={e => setForm({ ...form, rows: e.target.value })} required />
                    <input type="number" min="1" placeholder="Sedista po redu" value={form.seats_per_row} onChange={e => setForm({ ...form, seats_per_row: e.target.value })} required />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button type="submit">{editId ? 'Sacuvaj' : 'Dodaj'}</button>
                    {editId && <button type="button" onClick={resetForm}>Otkazi</button>}
                </div>
            </form>

            {msg && <p style={{ color: '#c0392b' }}>{msg}</p>}

            <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 700 }}>
                <thead>
                    <tr><th>ID</th><th>Naziv</th><th>Redova</th><th>Sedista/red</th><th></th></tr>
                </thead>
                <tbody>
                    {items.map(h => (
                        <tr key={h.id}>
                            <td>{h.id}</td>
                            <td>{h.name}</td>
                            <td>{h.rows}</td>
                            <td>{h.seats_per_row}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <button onClick={() => onEdit(h)}>Izmeni</button>{' '}
                                <button onClick={() => onDelete(h.id)}>Obriši</button>
                            </td>
                        </tr>
                    ))}
                    {!items.length && <tr><td colSpan="5">Nema sala.</td></tr>}
                </tbody>
            </table>
        </div>
    )
}
