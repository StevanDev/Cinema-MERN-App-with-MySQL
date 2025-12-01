import React, { useEffect, useState } from 'react'
import api from '../api'

const initial = {
    title: '',
    description: '',
    duration_min: 90,
    genre: '',
    rating: 5,
    poster_url: ''
}

export default function AdminMovies() {
    const [items, setItems] = useState([])
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [limit] = useState(10)
    const [sort, setSort] = useState('createdAt')
    const [order, setOrder] = useState('desc')
    const [form, setForm] = useState(initial)
    const [editId, setEditId] = useState(null)
    const [msg, setMsg] = useState('')

    const load = async () => {
        setMsg('')
        try {
            const { data } = await api.get(`/api/movies?page=${page}&limit=${limit}&sort=${sort}&order=${order}`)
            setItems(data.items); setTotal(data.total)
        } catch (e) {
            setMsg(e.response?.data?.message || 'Greska pri ucitavanju filmova')
        }
    }

    useEffect(() => { load() }, [page, sort, order])

    const resetForm = () => { setForm(initial); setEditId(null) }

    const submit = async (e) => {
        e.preventDefault()
        setMsg('')
        try {
            if (editId) {
                await api.put(`/api/movies/${editId}`, {
                    ...form,
                    duration_min: Number(form.duration_min),
                    rating: form.rating === '' ? null : Number(form.rating)
                })
            } else {
                await api.post('/api/movies', {
                    ...form,
                    duration_min: Number(form.duration_min),
                    rating: form.rating === '' ? null : Number(form.rating)
                })
            }
            resetForm()
            await load()
        } catch (err) {
            const m = err.response?.data?.message || 'Greska'
            const d = err.response?.data?.details?.join(', ')
            setMsg(d ? `${m}: ${d}` : m)
        }
    }

    const onEdit = (m) => {
        setEditId(m.id)
        setForm({
            title: m.title || '',
            description: m.description || '',
            duration_min: m.duration_min || 90,
            genre: m.genre || '',
            rating: m.rating ?? '',
            poster_url: m.poster_url || ''
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const onDelete = async (id) => {
        if (!confirm('Obrisi film?')) return
        try { await api.delete(`/api/movies/${id}`); await load() }
        catch (e) { setMsg(e.response?.data?.message || 'Greska pri brisanju') }
    }

    const pages = Math.ceil(total / limit) || 1

    return (
        <div>
            <h3>{editId ? 'Izmena filma' : 'Novi film'}</h3>
            <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 600, marginBottom: 16 }}>
                <input placeholder="Naslov" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                <textarea placeholder="Opis" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
                <div style={{ display: 'flex', gap: 8 }}>
                    <input type="number" min="1" placeholder="Trajanje (min)" value={form.duration_min} onChange={e => setForm({ ...form, duration_min: e.target.value })} required />
                    <input placeholder="Zanr" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} />
                    <input type="number" step="0.1" min="0" max="10" placeholder="Ocena (0-10)" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} />
                </div>
                <input placeholder="Poster URL (opciono)" value={form.poster_url} onChange={e => setForm({ ...form, poster_url: e.target.value })} />
                <div style={{ display: 'flex', gap: 8 }}>
                    <button type="submit">{editId ? 'Sacuvaj izmene' : 'Dodaj film'}</button>
                    {editId && <button type="button" onClick={resetForm}>Otkazi</button>}
                </div>
            </form>

            {msg && <p style={{ color: '#c0392b' }}>{msg}</p>}

            <div style={{ margin: '12px 0', display: 'flex', gap: 8, alignItems: 'center' }}>
                <label>Sort:</label>
                <select value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="createdAt">Datum</option>
                    <option value="title">Naslov</option>
                    <option value="duration_min">Trajanje</option>
                    <option value="rating">Ocena</option>
                    <option value="id">ID</option>
                </select>
                <select value={order} onChange={e => setOrder(e.target.value)}>
                    <option value="desc">Desc</option>
                    <option value="asc">Asc</option>
                </select>
            </div>

            <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 900 }}>
                <thead>
                    <tr>
                        <th>ID</th><th>Naslov</th><th>Zanr</th><th>Min</th><th>Ocena</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(m => (
                        <tr key={m.id}>
                            <td>{m.id}</td>
                            <td>{m.title}</td>
                            <td>{m.genre || '—'}</td>
                            <td>{m.duration_min}</td>
                            <td>{m.rating ?? '—'}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <button onClick={() => onEdit(m)}>Izmeni</button>{' '}
                                <button onClick={() => onDelete(m.id)}>Obriši</button>
                            </td>
                        </tr>
                    ))}
                    {!items.length && <tr><td colSpan="6">Nema filmova.</td></tr>}
                </tbody>
            </table>

            <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
                <span>Strana {page}/{pages}</span>
                <button disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
        </div>
    )
}