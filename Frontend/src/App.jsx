import React from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import AgentDashboard from './pages/AgentDashboard'
import SearchPage from './pages/SearchPage'
import PropertyDetail from './pages/PropertyDetail'
import BookingConfirmation from './pages/BookingConfirmation'
import ContactPage from './pages/ContactPage'

function TopBar() {
    const { user, logout } = useAuth()
    const nav = useNavigate()
    const [showUserMenu, setShowUserMenu] = React.useState(false)

    return (
        <div className="topbar">
            <div className="top-inner">
                <div className="brand" onClick={() => nav('/')} style={{ cursor: 'pointer' }}>Real Estate</div>
                <nav>
                    <form className="top-search" onSubmit={(e) => { e.preventDefault(); const q = e.target.elements.q.value; if (q) nav(`/search?q=${encodeURIComponent(q)}`) }}>
                        <input name="q" placeholder="Search location or point of interest" aria-label="top search" />
                        <button type="submit">🔍</button>
                    </form>
                    <Link to="/contact" className="nav-link">Contact</Link>
                    {!user ? (
                        <Link to="/auth" className="nav-link">Login</Link>
                    ) : (
                        <div className="user-menu-wrapper">
                            <div className="user-name" onClick={() => setShowUserMenu(!showUserMenu)}>
                                {user.name}
                            </div>
                            {showUserMenu && (
                                <div className="user-dropdown">
                                    <Link to="/profile" className="dropdown-item">Profile</Link>
                                    {user.role === 'agent' && <Link to="/agent" className="dropdown-item">Dashboard</Link>}
                                    <button className="dropdown-item dropdown-logout" onClick={() => { logout(); setShowUserMenu(false); nav('/') }}>Sign out</button>
                                </div>
                            )}
                        </div>
                    )}
                </nav>
            </div>
        </div>
    )
}

function Private({ children, role }) {
    const { user } = useAuth()
    if (!user) return <Navigate to="/auth" />
    if (role && user.role !== role) return <div className="container">Access denied for role</div>
    return children
}

export default function App() {
    return (
        <div>
            <TopBar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/profile" element={<Private><ProfilePage /></Private>} />
                    <Route path="/agent" element={<Private role="agent"><AgentDashboard /></Private>} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/property/:id" element={<PropertyDetail />} />
                    <Route path="/confirm" element={<Private><BookingConfirmation /></Private>} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
            </div>
        </div>
    )
}

function Home() {
    const nav = useNavigate()
    const [q, setQ] = React.useState('')
    const submit = (e) => {
        e?.preventDefault()
        // navigate to search with query param
        nav('/search')
    }

    return (
        <div className="hero-wrap">
            <div className="hero">
                <div className="hero-bg">
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <h1 className="hero-title">Discover Your Dream Home</h1>
                        <div className="hero-sub muted">Find rentals and properties from local agents</div>
                        <div className="hero-search-wrap">
                            <form className="big-search" onSubmit={submit}>
                                <input 
                                    type="text" 
                                    placeholder="Search by location..." 
                                    value={q} 
                                    onChange={(e) => setQ(e.target.value)}
                                    aria-label="Search properties"
                                />
                                <button type="submit" className="btn-search">🔍</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}