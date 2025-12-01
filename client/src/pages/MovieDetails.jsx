import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

export default function MovieDetails() {
    const { id } = useParams()
    const nav = useNavigate()

    const [movie, setMovie] = useState(null)
    const [screenings, setScreenings] = useState([])
    const [selectedId, setSelectedId] = useState(null)
    const [selectedSeats, setSelectedSeats] = useState([])
    const [takenSeats, setTakenSeats] = useState([])
    const [msg, setMsg] = useState('')

    useEffect(() => {
        setMsg('')
        api.get(`/api/movies/${id}`)
            .then(res => setMovie(res.data))
            .catch(() => setMsg('Greska pri ucitavanju filma'))

        api.get(`/api/screenings?movie_id=${id}`)
            .then(res => {
                setScreenings(res.data || [])
                if (res.data?.length) setSelectedId(res.data[0].id)
            })
            .catch(() => setMsg('Greska pri ucitavanju projekcija'))
    }, [id])

    const sel = useMemo(
        () => screenings.find(s => s.id === Number(selectedId)),
        [screenings, selectedId]
    )

    const rows = sel?.hall?.rows || 0
    const cols = sel?.hall?.seats_per_row || 0

    const isTaken = (r, c) => takenSeats.some(s => s.row_no === r && s.seat_no === c)
    const isSelected = (r, c) => selectedSeats.some(s => s.row_no === r && s.seat_no === c)

    const toggleSeat = (r, c) => {
        if (isTaken(r, c)) return
        setSelectedSeats(prev =>
            prev.some(s => s.row_no === r && s.seat_no === c)
                ? prev.filter(s => !(s.row_no === r && s.seat_no === c))
                : [...prev, { row_no: r, seat_no: c }]
        )
    }

    const reserve = async () => {
        setMsg('')
        if (!sel) return
        if (!localStorage.getItem('token')) { nav('/login'); return }

        try {
            const { data } = await api.post('/api/reservations', {
                screening_id: sel.id,
                seats: selectedSeats
            })
            setMsg(`Rezervisano! Ukupna cena: ${Number(data.total_price).toFixed(2)} RSD`)
            setTakenSeats([])
            setSelectedSeats([])
        } catch (err) {
            if (err.response?.status === 409) {
                const seats = err.response?.data?.seats || []
                setTakenSeats(seats)
                setMsg('Neka sedista su zauzeta — oznacena su crveno. Izaberi druga pa probaj ponovo.')
            } else if (err.response?.status === 401) {
                nav('/login')
            } else {
                setMsg(err.response?.data?.message || 'Greska pri rezervaciji')
            }
        }
    }

    const fmt = (d) => new Date(d).toLocaleString()

    if (!movie) return <div style={{ padding: 20 }}>Ucitavanje…</div>

    return (
        <div style={{ padding: 20 }}>
            <h2>{movie.title}</h2>
            <p>{movie.description}</p>
            <p><b>Zanr:</b> {movie.genre || '—'} | <b>Trajanje:</b> {movie.duration_min} min | <b>Ocena:</b> {movie.rating ?? '—'}</p>

            <div style={{ margin: '16px 0' }}>
                <label><b>Projekcija:</b>{' '}</label>
                {screenings.length ? (
                    <select value={selectedId || ''} onChange={e => {
                        setSelectedId(Number(e.target.value))
                        setSelectedSeats([])
                        setTakenSeats([])
                    }}>
                        {screenings.map(s => (
                            <option key={s.id} value={s.id}>
                                {fmt(s.starts_at)} — {s.hall?.name} — {Number(s.price).toFixed(2)} RSD
                            </option>
                        ))}
                    </select>
                ) : <span> Nema zakazanih projekcija.</span>}
            </div>

            {sel && (
                <>
                    <div style={{ marginBottom: 8 }}>
                        <b>Sala:</b> {sel.hall?.name} ({rows} x {cols})
                    </div>
                    <div style={{ display: 'inline-block', padding: 10, border: '1px solid #ddd', borderRadius: 8 }}>
                        {[...Array(rows)].map((_, rIdx) => {
                            const r = rIdx + 1
                            return (
                                <div key={r} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                                    <div style={{ width: 22, textAlign: 'right', opacity: 0.6 }}>{r}</div>
                                    {[...Array(cols)].map((__, cIdx) => {
                                        const c = cIdx + 1
                                        const taken = isTaken(r, c)
                                        const selected = isSelected(r, c)
                                        const bg = taken ? '#e74c3c' : selected ? '#3498db' : '#ecf0f1'
                                        const cursor = taken ? 'not-allowed' : 'pointer'
                                        return (
                                            <div
                                                key={`${r}-${c}`}
                                                onClick={() => toggleSeat(r, c)}
                                                title={`Red ${r}, Sed ${c}`}
                                                style={{
                                                    width: 22, height: 22, borderRadius: 4, background: bg,
                                                    border: '1px solid #bdc3c7', cursor
                                                }}
                                            />
                                        )
                                    })}
                                </div>
                            )
                        })}
                        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
                            Legenda: <span style={{ background: '#ecf0f1', border: '1px solid #bdc3c7', padding: '2px 6px', borderRadius: 4 }}>slobodno</span>{' '}
                            <span style={{ background: '#3498db', border: '1px solid #bdc3c7', padding: '2px 6px', borderRadius: 4, color: '#fff' }}>izabrano</span>{' '}
                            <span style={{ background: '#e74c3c', border: '1px solid #bdc3c7', padding: '2px 6px', borderRadius: 4, color: '#fff' }}>zauzeto</span>
                        </div>
                    </div>

                    <div style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button disabled={!selectedSeats.length} onClick={reserve}>Rezervisi {selectedSeats.length ? `(${selectedSeats.length})` : ''}</button>
                        {msg && <span style={{ color: msg.startsWith('Rezerv') ? 'green' : '#c0392b' }}>{msg}</span>}
                    </div>
                </>
            )}
        </div>
    )
}
