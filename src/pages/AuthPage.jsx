import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
    const { login } = useAuth()
    const [mode, setMode] = useState('login')
    const [role, setRole] = useState('renter')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const nav = useNavigate()

    const submit = (e) => {
        e.preventDefault()
        setError(null)
        if (!email || !email.includes('@')) return setError('Please enter a valid email')
        if (mode === 'register' && !name) return setError('Please enter your name')
        const u = login({ email, role, name: name || email.split('@')[0] })
        if (u) {
            if (role === 'agent') nav('/agent')
            else nav('/profile')
        }
    }

    return (
        <div className="card" style={{ maxWidth: 520 }}>
            <h3>{mode === 'login' ? 'Sign in / Sign up' : 'Register'}</h3>
            <form onSubmit={submit} className="grid">
                <label>
                    Role
                    <select value={role} onChange={e => setRole(e.target.value)}>
                        <option value="renter">Renter</option>
                        <option value="agent">Agent</option>
                    </select>
                </label>
                <label>
                    Name
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Display name" />
                </label>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <label>
                    Email
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                </label>
                <div className="row">
                    <button type="submit">Continue</button>
                    <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ background: '#666' }}>Toggle</button>
                </div>
            </form>
        </div>
    )
}
