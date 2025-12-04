import React, { useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import PropertyCard from '../components/PropertyCard'

export default function SearchPage() {
    const { properties } = useAuth()
    const [qLocation, setQLocation] = useState('')
    const [type, setType] = useState('')
    const [bedrooms, setBedrooms] = useState('')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [sort, setSort] = useState('price-asc')

    const results = useMemo(() => {
        let res = properties || []
        if (type) res = res.filter(r => r.type === type)
        if (bedrooms) res = res.filter(r => r.bedrooms && r.bedrooms >= Number(bedrooms))
        if (minPrice) res = res.filter(r => r.price >= Number(minPrice))
        if (maxPrice) res = res.filter(r => r.price <= Number(maxPrice))
        if (sort === 'price-asc') res = res.sort((a, b) => a.price - b.price)
        if (sort === 'price-desc') res = res.sort((a, b) => b.price - a.price)
        if (sort === 'bedrooms-desc') res = res.sort((a, b) => (b.bedrooms || 0) - (a.bedrooms || 0))
        return res
    }, [properties, type, bedrooms, minPrice, maxPrice, sort])

    return (
        <div className="grid">
            <div className="card">
                <h3>Filters</h3>
                <div className="grid">
                    <input value={qLocation} onChange={e => setQLocation(e.target.value)} placeholder="Location (free text)" />
                    <select value={type} onChange={e => setType(e.target.value)}>
                        <option value="">Any type</option>
                        <option>Apartment</option>
                        <option>House</option>
                    </select>
                    <input type="number" value={bedrooms} onChange={e => setBedrooms(e.target.value)} placeholder="Min bedrooms" />
                    <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min price" />
                    <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max price" />
                    <select value={sort} onChange={e => setSort(e.target.value)}>
                        <option value="price-asc">Price ↑</option>
                        <option value="price-desc">Price ↓</option>
                        <option value="bedrooms-desc">Bedrooms ↓</option>
                    </select>
                </div>
            </div>

            <div>
                <h3>Results ({results.length})</h3>
                <div className="props-grid">
                    {results.map(p => <PropertyCard key={p.id} p={p} />)}
                </div>
            </div>
        </div>
    )
}
