import React, { useEffect, useState } from 'react'
import api from '../api'

const initial = { movieId: '', hallId: '', starts_at: '', price: 350 }

export default function AdminScreenings() {
    const [items, setItems] = useState([])
    const [movies, setMovies] = useState([])
    const [halls, setHalls] = useState([])
    const [form, setForm] = useState(initial)
    const [editId, setEditId] = useState(null)
    const [msg, setMsg] = useState('')

    const load = async () => {
        setMsg('')
        try {
            const { data } = await api.get('/api/screenings')
            setItems(data || [])
        } catch (e) {
            setMsg(e.response?.data?.message || 'Greška pri učitavanju projekcija')
        }
    }

    const loadRefs = async () => {
        try {
            const m = await api.get('/api/movies?limit=999&sort=title&order=asc')
            setMovies(m.data?.items || [])
        } catch { }
        try {
            const h = await api.get('/api/halls')
            setHalls(h.data || [])
        } catch { }
    }

    useEffect(() => { load(); loadRefs() }, [])

    const resetForm = () => { setForm(initial); setEditId(null) }

    const toLocalInput = (iso) => {
        if (!iso) return ''
        const dt = new Date(iso)
        const pad = (n) => String(n).padStart(2, '0')
        return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`
    }
    const fromLocalInput = (val) => (val ? new Date(val).toISOString() : '')

    const submit = async (e) => {
        e.preventDefault()
        setMsg('')
        const payload = {
            movieId: Number(form.movieId),
            hallId: Number(form.hallId),
            starts_at: fromLocalInput(form.starts_at),
            price: Number(form.price)
        }
        try {
            if (editId) await api.put(`/api/screenings/${editId}`, payload)
            else await api.post('/api/screenings', payload)
            resetForm(); await load()
        } catch (err) {
            setMsg(err.response?.data?.message || 'Greska')
        }
    }

    const onEdit = (s) => {
        setEditId(s.id)
        setForm({
            movieId: s.movieId || s.movie?.id || '',
            hallId: s.hallId || s.hall?.id || '',
            starts_at: toLocalInput(s.starts_at),
            price: s.price
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const onDelete = async (id) => {
        if (!confirm('Obrisi projekciju?')) return
        try { await api.delete(`/api/screenings/${id}`); await load() }
        catch (e) { setMsg(e.response?.data?.message || 'Greska pri brisanju') }
    }

    const fmt = (d) => new Date(d).toLocaleString()

    return (
        <div>
            <h3>{editId ? 'Izmena projekcije' : 'Nova projekcija'}</h3>
            <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 700, marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    <select value={form.movieId} onChange={e => setForm({ ...form, movieId: e.target.value })} required>
                        <option value="">-- film --</option>
                        {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                    </select>
                    <select value={form.hallId} onChange={e => setForm({ ...form, hallId: e.target.value })} required>
                        <option value="">-- sala --</option>
                        {halls.map(h => <option key={h.id} value={h.id}>{h.name} ({h.rows}x{h.seats_per_row})</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input type="datetime-local" value={form.starts_at} onChange={e => setForm({ ...form, starts_at: e.target.value })} required />
                    <input type="number" step="0.01" min="0" placeholder="Cena" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button type="submit">{editId ? 'Sačuvaj' : 'Dodaj'}</button>
                    {editId && <button type="button" onClick={resetForm}>Otkaži</button>}
                </div>
            </form>

            {msg && <p style={{ color: '#c0392b' }}>{msg}</p>}

            <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 1000 }}>
                <thead>
                    <tr>
                        <th>ID</th><th>Film</th><th>Sala</th><th>Pocetak</th><th>Cena</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(s => (
                        <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{s.movie?.title || s.movieId}</td>
                            <td>{s.hall?.name || s.hallId}</td>
                            <td>{s.starts_at ? fmt(s.starts_at) : '—'}</td>
                            <td>{Number(s.price).toFixed(2)} RSD</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <button onClick={() => onEdit(s)}>Izmeni</button>{' '}
                                <button onClick={() => onDelete(s.id)}>Obrisi</button>
                            </td>
                        </tr>
                    ))}
                    {!items.length && <tr><td colSpan="6">Nema projekcija.</td></tr>}
                </tbody>
            </table>
        </div>
    )
}
