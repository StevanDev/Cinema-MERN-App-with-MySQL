import React, { useState } from 'react'
import AdminMovies from './AdminMovies.jsx'
import AdminHalls from './AdminHalls.jsx'
import AdminScreenings from './AdminScreenings.jsx'

export default function Admin() {
    const [tab, setTab] = useState('movies')

    return (
        <div style={{ padding: 20 }}>
            <h2>Admin panel</h2>
            <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
                <button onClick={() => setTab('movies')} disabled={tab === 'movies'}>Filmovi</button>
                <button onClick={() => setTab('halls')} disabled={tab === 'halls'}>Sale</button>
                <button onClick={() => setTab('screenings')} disabled={tab === 'screenings'}>Projekcije</button>
            </div>

            {tab === 'movies' && <AdminMovies />}
            {tab === 'halls' && <AdminHalls />}
            {tab === 'screenings' && <AdminScreenings />}
        </div>
    )
}
