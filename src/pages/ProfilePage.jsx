import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function AddressForm({ onSave, initial }) {
    const [line, setLine] = useState(initial?.line || '')
    const [city, setCity] = useState(initial?.city || '')
    const [zip, setZip] = useState(initial?.zip || '')
    const [error, setError] = useState(null)
    return (
        <form onSubmit={e => { e.preventDefault(); setError(null); if (!line || !city) return setError('Line and city required'); onSave({ line, city, zip }) }} className="grid">
            <input value={line} onChange={e => setLine(e.target.value)} placeholder="Address line" />
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
            <input value={zip} onChange={e => setZip(e.target.value)} placeholder="ZIP" />
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div className="row"><button type="submit">Save address</button></div>
        </form>
    )
}

function CardForm({ onSave, addresses, initial }) {
    const [number, setNumber] = useState(initial?.number || '')
    const [name, setName] = useState(initial?.name || '')
    const [billingAddressId, setBillingAddressId] = useState(initial?.billingAddressId || (addresses[0]?.id || ''))
    const [error, setError] = useState(null)
    const submit = () => {
        setError(null)
        if (!number || number.replace(/\s+/g, '').length < 12) return setError('Enter a valid card number (min 12 digits)')
        if (!name) return setError('Cardholder name required')
        if (!billingAddressId) return setError('Select a billing address')
        const result = onSave({ number, name, billingAddressId })
        if (result && result.error) setError(result.error)
    }
    return (
        <div>
            <div className="grid">
                <input value={number} onChange={e => setNumber(e.target.value)} placeholder="Card number" />
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Cardholder name" />
                <select value={billingAddressId} onChange={e => setBillingAddressId(e.target.value)}>
                    {addresses.map(a => <option key={a.id} value={a.id}>{a.line} — {a.city}</option>)}
                </select>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <div className="row"><button onClick={submit} disabled={addresses.length === 0}>Add card</button></div>
                {addresses.length === 0 && <div className="muted">Add an address before adding a card</div>}
            </div>
        </div>
    )
}

export default function ProfilePage() {
    const { user, addAddress, updateAddress, deleteAddress, addCard, updateCard, deleteCard } = useAuth()
    const [editing, setEditing] = useState(null)

    if (!user) return <div>Please sign in</div>

    return (
        <div className="grid">
            <div className="card">
                <h3>Addresses</h3>
                <AddressForm onSave={(a) => { addAddress(a); setEditing(null); }} initial={editing} />
                <div style={{ marginTop: 12 }}>
                    {user.addresses.length === 0 && <div className="muted">No addresses yet</div>}
                    {user.addresses.map(a => (
                        <div key={a.id} className="row" style={{ justifyContent: 'space-between', padding: '6px 0' }}>
                            <div>{a.line}, {a.city} ({a.zip})</div>
                            <div>
                                <button onClick={() => setEditing(a)}>Edit</button>
                                <button onClick={() => deleteAddress(a.id)} style={{ background: '#b91c1c', marginLeft: 8 }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card">
                <h3>Payment Cards</h3>
                <CardForm addresses={user.addresses} onSave={(c) => addCard(c)} />
                <div style={{ marginTop: 12 }}>
                    {(!user.cards || user.cards.length === 0) && <div className="muted">No cards saved</div>}
                    {(user.cards || []).map(c => (
                        <div key={c.id} className="row" style={{ justifyContent: 'space-between', padding: '6px 0' }}>
                            <div>**** {c.number.slice(-4)} — {c.name} <div className="muted">Billing: {(user.addresses.find(a => a.id === c.billingAddressId)?.line) || 'deleted address'}</div></div>
                            <div>
                                <button onClick={() => { const res = updateCard(c.id, {}); if (res && res.error) alert(res.error); }}>Edit</button>
                                <button onClick={() => deleteCard(c.id)} style={{ background: '#b91c1c', marginLeft: 8 }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
