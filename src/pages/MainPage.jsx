import { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from "react-router-dom"
import logo from '../assets/carcardsLogo.png'

export default function MainPage() {
    const navigation = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        
        if (!token) {
            navigation('/login')
            return
        }
        
        if (userData) {
            try {
                setUser(JSON.parse(userData))
            } catch (e) {
                console.error("Error parsing user data:", e)
            }
        }
        setLoading(false)
    }, [navigation])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigation('/')
    }

    const goToHome = () => {
        navigation('/')
    }

    const buttonStyle = {
        width: '400px',
        padding: '25px 0',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        borderRadius: '20px',
        border: 'none',
        backgroundColor: '#1a1a1a',
        color: 'white',
        cursor: 'pointer',
        margin: '15px 0',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        border: '1px solid #333'
    }

    if (loading) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#0a0a0a' }}>
                <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="vh-100 d-flex flex-column">
            <nav className="navbar navbar-dark bg-secondary">
                <div className="container-fluid d-flex align-items-center position-relative">
                    <button 
                        onClick={goToHome}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                        <img src={logo} alt="Car Cards Logo" style={{ height: '40px', width: 'auto' }} />
                    </button>

                    <span className="navbar-text fs-3 text-white position-absolute start-50 translate-middle-x">
                        Car Cards
                    </span>

                    <div className="ms-auto d-flex align-items-center">
                        {user && (
                            <span className="text-white me-3" style={{ color: '#888' }}>{user.username}</span>
                        )}
                        <button
                            className="btn btn-outline-light"
                            onClick={handleLogout}
                            style={{ borderRadius: '50%', width: '40px', height: '40px' }}
                        >
                            ↪
                        </button>
                    </div>
                </div>
            </nav>

            <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                <div className="text-center">
                    <h2 className="mb-5" style={{ fontSize: '2.5rem', fontWeight: '300', color: '#fff' }}>
                        What would you like to do?
                    </h2>
                    
                    <button 
                        style={buttonStyle}
                        onClick={() => navigation('/mycards')}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#2c3e50'
                            e.target.style.borderColor = '#3498db'
                            e.target.style.transform = 'scale(1.05)'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#1a1a1a'
                            e.target.style.borderColor = '#333'
                            e.target.style.transform = 'scale(1)'
                        }}
                    >
                        🃏 My Cards
                    </button>

                    <button 
                        style={buttonStyle}
                        onClick={() => navigation('/market')}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#2c3e50'
                            e.target.style.borderColor = '#e67e22'
                            e.target.style.transform = 'scale(1.05)'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#1a1a1a'
                            e.target.style.borderColor = '#333'
                            e.target.style.transform = 'scale(1)'
                        }}
                    >
                        🏪 Market
                    </button>

                    <button 
                        style={buttonStyle}
                        onClick={() => navigation('/openpacks')}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#2c3e50'
                            e.target.style.borderColor = '#27ae60'
                            e.target.style.transform = 'scale(1.05)'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#1a1a1a'
                            e.target.style.borderColor = '#333'
                            e.target.style.transform = 'scale(1)'
                        }}
                    >
                        🎁 Open Packs
                    </button>
                </div>
            </div>
        </div>
    )
}