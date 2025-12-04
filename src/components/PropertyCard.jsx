import React from 'react'
import { Link } from 'react-router-dom'

export default function PropertyCard({ p }) {
    return (
        <div className="prop-card card">
            <div style={{ fontWeight: 600 }}>{p.title}</div>
            <div className="muted">{p.type} • ${p.price}/night</div>
            <div style={{ marginTop: 8 }}>
                <Link to={`/property/${p.id}`} className="link">View</Link>
            </div>
        </div>
    )
}
