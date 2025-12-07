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
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '16px',

        }}>
            <div className="card" style={{ 
                maxWidth: 460, 
                width: '100%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ 
                        fontSize: '32px', 
                        fontWeight: '700', 
                        margin: '0 0 8px 0',
                        color: '#111'
                    }}>
                        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p style={{ 
                        color: '#80706bff', 
                        margin: 0,
                        fontSize: '15px'
                    }}>
                        {mode === 'login' ? 'Sign in to continue to your account' : 'Register to get started'}
                    </p>
                </div>
                
                <form onSubmit={submit} className="grid" style={{ gap: '20px' }}>
                    <label style={{ display: 'block' }}>
                        <div style={{ 
                            marginBottom: '8px', 
                            fontWeight: '500',
                            fontSize: '14px',
                            color: '#51373bff'
                        }}>

                        </div>
                        <select 
                            value={role} 
                            onChange={e => setRole(e.target.value)}
                            style={{ 
                                width: '100%',
                                padding: '12px',
                                fontSize: '15px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                background: '#fff'
                            }}
                        >
                            <option value="renter">Renter - Looking for properties</option>
                            <option value="agent">Agent - Managing properties</option>
                        </select>
                    </label>
                    
                    <label style={{ display: 'block' }}>
                        <div style={{ 
                            marginBottom: '8px', 
                            fontWeight: '500',
                            fontSize: '14px',
                            color: '#374151'
                        }}>
                            Full Name
                        </div>
                        <input 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="Enter your name"
                            style={{ 
                                width: '100%',
                                padding: '12px',
                                fontSize: '15px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db'
                            }}
                        />
                    </label>
                    
                    <label style={{ display: 'block' }}>
                        <div style={{ 
                            marginBottom: '8px', 
                            fontWeight: '500',
                            fontSize: '14px',
                            color: '#374151'
                        }}>
                            Email Address
                        </div>
                        <input 
                            type="email"
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            placeholder="you@example.com"
                            style={{ 
                                width: '100%',
                                padding: '12px',
                                fontSize: '15px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db'
                            }}
                        />
                    </label>
                    
                    {error && (
                        <div style={{ 
                            color: '#a03939ff', 
                            background: '#fef2f2',
                            padding: '12px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            border: '1px solid #fecaca'
                        }}>
                            {error}
                        </div>
                    )}
                    
                    <button 
                        type="submit"
                        style={{ 
                            width: '100%',
                            padding: '14px',
                            fontSize: '16px',
                            fontWeight: '600',
                            borderRadius: '8px',
                            marginTop: '8px'
                        }}
                    >
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                    
                    <div style={{ 
                        textAlign: 'center',
                        marginTop: '8px'
                    }}>
                        <span style={{ color: '#6b7280', fontSize: '14px' }}>
                            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        </span>
                        <button 
                            type="button" 
                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                            style={{ 
                                background: 'transparent',
                                color: 'rgb(91 71 28)',
                                fontWeight: '600',
                                fontSize: '14px',
                                padding: '0',
                                textDecoration: 'underline'
                            }}
                        >
                            {mode === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
