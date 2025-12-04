import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function PropertyForm({ onSave, initial }) {
    const [title, setTitle] = useState(initial?.title || '')
    const [type, setType] = useState(initial?.type || 'Apartment')
    const [bedrooms, setBedrooms] = useState(initial?.bedrooms || 1)
    const [price, setPrice] = useState(initial?.price || 100)
    const [lotSize, setLotSize] = useState(initial?.lotSize || 0)

    const submit = (e) => {
        e.preventDefault()
        const base = { title, type, price: Number(price) }
        if (type === 'Apartment') base.bedrooms = Number(bedrooms)
        if (type === 'House') base.lotSize = Number(lotSize)
        onSave(base)
    }

    return (
        <form onSubmit={submit} className="card grid">
            <h3>{initial ? 'Edit property' : 'Add property'}</h3>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
            <select value={type} onChange={e => setType(e.target.value)}>
                <option>Apartment</option>
                <option>House</option>
            </select>
            {type === 'Apartment' && <input type="number" value={bedrooms} onChange={e => setBedrooms(e.target.value)} placeholder="Bedrooms" />}
            {type === 'House' && <input type="number" value={lotSize} onChange={e => setLotSize(e.target.value)} placeholder="Lot size" />}
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price per night" />
            <div className="row"><button type="submit">Save</button></div>
        </form>
    )
}

export default function AgentDashboard() {
    const { properties, addProperty, updateProperty, deleteProperty, user } = useAuth()
    const [editing, setEditing] = useState(null)

    const handleSave = (data) => {
        if (editing) updateProperty(editing.id, data)
        else addProperty({ ...data, agentId: user.id })
        setEditing(null)
    }

    return (
        <div className="grid">
            <PropertyForm onSave={handleSave} initial={editing} />

            <div className="card">
                <h3>Your properties</h3>
                <div className="props-grid">
                    {properties.filter(p => p.agentId === user?.id).length === 0 && <div className="muted">No properties yet</div>}
                    {properties.filter(p => p.agentId === user?.id).map(p => (
                        <div key={p.id} className="prop-card">
                            <div><strong>{p.title}</strong></div>
                            <div className="muted">{p.type} • ${p.price}/night • {p.bedrooms ? p.bedrooms + 'bd' : ''} {p.lotSize ? p.lotSize + 'sqft' : ''}</div>
                            <div className="row" style={{ marginTop: 8 }}>
                                <button onClick={() => setEditing(p)}>Edit</button>
                                <button onClick={() => deleteProperty(p.id)} style={{ background: '#b91c1c' }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
