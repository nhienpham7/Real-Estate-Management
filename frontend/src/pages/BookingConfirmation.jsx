import React from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function BookingConfirmation() {
    const { state } = useLocation()
    const { user } = useAuth()
    if (!state) return <div>No booking data</div>
    const { property, start, end, nights, total, paymentMethod, selectedCard } = state
    const card = user?.cards?.find(c => c.id === selectedCard)

    return (
        <div className="card">
            <h3>Booking confirmation</h3>
            <div>Property: <strong>{property.title}</strong></div>
            <div>Dates: {start} → {end} ({nights} nights)</div>
            <div>Total: ${total}</div>
            <div>Payment: {paymentMethod} {paymentMethod === 'card' && card ? `(**** ${card.number.slice(-4)})` : ''}</div>
            <div style={{ marginTop: 12 }} className="muted">(This demo stores no payments. This is a mock confirmation.)</div>
        </div>
    )
}
