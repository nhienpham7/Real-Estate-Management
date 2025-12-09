import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem('rem_user')
            return raw ? JSON.parse(raw) : null
        } catch (e) {
            return null
        }
    })
    const [properties, setProperties] = useState(() => {
        try {
            const raw = localStorage.getItem('rem_properties')
            if (raw) return JSON.parse(raw)
        } catch (e) { }
        // seed sample data
        return [
            { id: 'p1', title: 'Seaside Apartment', type: 'Apartment', bedrooms: 2, price: 120, agentId: 'a1', nightsAvailable: 365 },
            { id: 'p2', title: 'Cozy House', type: 'House', bedrooms: 3, price: 200, agentId: 'a1', lotSize: 500 }
        ]
    })

    // persist user and properties to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('rem_user', JSON.stringify(user))
        } catch (e) { }
    }, [user])

    useEffect(() => {
        try {
            localStorage.setItem('rem_properties', JSON.stringify(properties))
        } catch (e) { }
    }, [properties])

    const login = ({ email, role, name }) => {
        const u = { id: Date.now().toString(), email, role, name, addresses: [], cards: [] }
        setUser(u)
        return u
    }

    const logout = () => setUser(null)

    const addAddress = (addr) => {
        if (!user) return { error: 'Not logged in' }
        const a = { ...addr, id: Date.now().toString() }
        setUser(u => ({ ...u, addresses: [...(u.addresses || []), a] }))
        return a
    }

    const updateAddress = (id, updated) => {
        setUser(u => ({ ...u, addresses: u.addresses.map(a => a.id === id ? { ...a, ...updated } : a) }))
    }

    const deleteAddress = (id) => {
        setUser(u => {
            if (!u) return u
            const addresses = (u.addresses || []).filter(a => a.id !== id)
            const cards = (u.cards || []).filter(c => c.billingAddressId !== id)
            return { ...u, addresses, cards }
        })
    }

    const addCard = (card) => {
        if (!user) return { error: 'Not logged in' }
        const c = { ...card, id: Date.now().toString() }
        setUser(u => {
            // Check billing address exists in the current state
            const has = (u.addresses || []).find(a => a.id === card.billingAddressId)
            if (!has) {
                console.error('Billing address not found')
                return u // return unchanged if address doesn't exist
            }
            return { ...u, cards: [...(u.cards || []), c] }
        })
        return c
    }

    const updateCard = (id, updated) => {
        if (updated.billingAddressId && !(user.addresses || []).find(a => a.id === updated.billingAddressId)) {
            return { error: 'Billing address must be one of your saved addresses' }
        }
        setUser(u => ({ ...u, cards: (u.cards || []).map(c => c.id === id ? { ...c, ...updated } : c) }))
        return {}
    }

    const deleteCard = (id) => {
        setUser(u => ({ ...u, cards: (u.cards || []).filter(c => c.id !== id) }))
    }

    // properties CRUD
    const addProperty = (prop) => {
        const p = { ...prop, id: Date.now().toString() }
        setProperties(prev => [p, ...prev])
        return p
    }
    const updateProperty = (id, updated) => setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p))
    const deleteProperty = (id) => setProperties(prev => prev.filter(p => p.id !== id))

    return (
        <AuthContext.Provider value={{ user, login, logout, addAddress, updateAddress, deleteAddress, addCard, updateCard, deleteCard, properties, addProperty, updateProperty, deleteProperty }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}