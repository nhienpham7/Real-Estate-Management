import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PropertyDetail() {
    const { id } = useParams()
    const { properties, user } = useAuth()
    const prop = properties.find(p => p.id === id)
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('card')
    const [selectedCard, setSelectedCard] = useState(user?.cards?.[0]?.id || '')
    const nav = useNavigate()

    if (!prop) return <div>Property not found</div>

    const nights = (start && end) ? ((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) : 0
    const total = nights > 0 ? nights * prop.price : 0

    const goConfirm = () => {
        // pass booking details in state
        nav('/confirm', { state: { property: prop, start, end, nights, total, paymentMethod, selectedCard } })
    }

    return (
        <div className="grid">
            <div className="card">
                <h3>{prop.title}</h3>
                <div className="muted">{prop.type} • ${prop.price}/night</div>
                <p style={{ marginTop: 8 }}>Details: {prop.bedrooms ? prop.bedrooms + ' bedrooms' : ''} {prop.lotSize ? `${prop.lotSize} sqft` : ''}</p>
            </div>

            <div className="card">
                <h4>Book</h4>
                <label>Start date<input type="date" value={start} onChange={e => setStart(e.target.value)} /></label>
                <label>End date<input type="date" value={end} onChange={e => setEnd(e.target.value)} /></label>
                <div className="muted">Nights: {nights > 0 ? nights : '-'}</div>
                <div style={{ marginTop: 8 }}>Total: ${total}</div>

                <div style={{ marginTop: 12 }}>
                    <div>Payment</div>
                    <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                        <option value="card">Card</option>
                        <option value="paypal">PayPal</option>
                    </select>
                    {paymentMethod === 'card' && (
                        <select value={selectedCard} onChange={e => setSelectedCard(e.target.value)}>
                            {user?.cards?.map(c => <option key={c.id} value={c.id}>**** {c.number.slice(-4)} — {c.name}</option>)}
                        </select>
                    )}
                </div>

                <div className="row" style={{ marginTop: 12 }}>
                    <button disabled={!start || !end || nights <= 0} onClick={goConfirm}>Continue</button>
                </div>
            </div>
        </div>
    )
}
