import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function Movies() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 5

  useEffect(() => {
    api.get(`/api/movies?page=${page}&limit=${limit}&sort=createdAt&order=desc`)
      .then(res => { setItems(res.data.items); setTotal(res.data.total) })
  }, [page])

  const pages = Math.ceil(total / limit)

  return <div style={{ padding: 20 }}>
    <h2>Filmovi</h2>
    {!items.length && <p>Nema filmova (jos). Dodaj preko admin panela ili importuj seed.</p>}
    <ul>
      {items.map(m => (
        <li key={m.id}>
          <Link to={`/movies/${m.id}`}>{m.title}</Link> ({m.duration_min} min) — {m.genre}
        </li>
      ))}
    </ul>
    <div style={{ display: 'flex', gap: 8 }}>
      <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
      <span>Strana {page}/{pages || 1}</span>
      <button disabled={page === pages || items.length < limit} onClick={() => setPage(p => p + 1)}>Next</button>
    </div>
  </div>
}
