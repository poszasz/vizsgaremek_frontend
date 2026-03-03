import { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from "react-router-dom"
import logo from '../assets/carcardsLogo.png'
import { getMyCards } from "../api"

export default function MyCardsPage() {
    const navigation = useNavigate()
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        
        if (!token) {
            navigation('/login')
            return
        }
        
        setUser(JSON.parse(userData || '{}'))
        loadCards()
    }, [])

    const loadCards = async () => {
        setLoading(true)
        const res = await getMyCards()
        if (res.result) {
            setCards(res.cards)
        }
        setLoading(false)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigation('/')
    }

    const goToHome = () => {
        navigation('/')
    }

    const goToMain = () => {
        navigation('/main')
    }

    // Kártya stílus - 5x3-as rács
    const cardContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '20px',
        padding: '20px'
    }

    const cardStyle = {
        backgroundColor: '#1a1a1a',
        borderRadius: '15px',
        overflow: 'hidden',
        border: '1px solid #333',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    }

    const imageStyle = {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
        borderBottom: '1px solid #333'
    }

    const contentStyle = {
        padding: '15px',
        color: 'white',
        flex: 1
    }

    const carNameStyle = {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '5px',
        color: '#fff'
    }

    const carManufacturerStyle = {
        fontSize: '1rem',
        color: '#aaa',
        marginBottom: '10px'
    }

    const specsStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        fontSize: '0.9rem',
        marginTop: '10px'
    }

    const specItemStyle = {
        display: 'flex',
        flexDirection: 'column'
    }

    const specLabelStyle = {
        color: '#888',
        fontSize: '0.8rem'
    }

    const specValueStyle = {
        color: '#fff',
        fontWeight: '500'
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
                        My Cards
                    </span>

                    <div className="ms-auto d-flex align-items-center">
                        {user && (
                            <span className="text-white me-3">{user.username}'s Collection</span>
                        )}
                        <button
                            className="btn btn-outline-light me-2"
                            onClick={goToMain}
                        >
                            ← Back
                        </button>
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

            <div className="flex-grow-1" style={{ overflowY: 'auto', backgroundColor: '#0a0a0a' }}>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-4">
                            <h3 className="text-white mb-4">
                                You have {cards.length} car{cards.length !== 1 ? 's' : ''} in your collection
                            </h3>
                            
                            {/* 5x3-as rács */}
                            <div style={cardContainerStyle}>
                                {cards.map(card => (
                                    <div 
                                        key={card.id} 
                                        style={cardStyle}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)'
                                            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)'
                                            e.currentTarget.style.borderColor = '#4a4a4a'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)'
                                            e.currentTarget.style.boxShadow = 'none'
                                            e.currentTarget.style.borderColor = '#333'
                                        }}
                                    >
                                        {/* Kép */}
                                        <img 
                                            src={card.image_url || 'https://via.placeholder.com/300x200?text=No+Image'} 
                                            alt={`${card.manufacturer} ${card.name}`}
                                            style={imageStyle}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'
                                            }}
                                        />
                                        
                                        {/* Tartalom */}
                                        <div style={contentStyle}>
                                            <div style={carNameStyle}>
                                                {card.manufacturer} {card.name}
                                            </div>
                                            
                                            {/* Főbb specifikációk */}
                                            <div style={specsStyle}>
                                                <div style={specItemStyle}>
                                                    <span style={specLabelStyle}>Engine</span>
                                                    <span style={specValueStyle}>{card.engine || 'N/A'}</span>
                                                </div>
                                                <div style={specItemStyle}>
                                                    <span style={specLabelStyle}>HP</span>
                                                    <span style={specValueStyle}>{card.horsepower || 'N/A'} hp</span>
                                                </div>
                                                <div style={specItemStyle}>
                                                    <span style={specLabelStyle}>Fuel</span>
                                                    <span style={specValueStyle}>{card.fuel || 'N/A'}</span>
                                                </div>
                                                <div style={specItemStyle}>
                                                    <span style={specLabelStyle}>Gearbox</span>
                                                    <span style={specValueStyle}>{card.gearbox || 'N/A'}</span>
                                                </div>
                                                <div style={specItemStyle}>
                                                    <span style={specLabelStyle}>0-100</span>
                                                    <span style={specValueStyle}>{card.acceleration || 'N/A'}s</span>
                                                </div>
                                                <div style={specItemStyle}>
                                                    <span style={specLabelStyle}>Top Speed</span>
                                                    <span style={specValueStyle}>{card.top_speed || 'N/A'} km/h</span>
                                                </div>
                                            </div>
                                            
                                            {/* További infók (opcionális, hover-re vagy kattintásra) */}
                                            <div style={{ 
                                                marginTop: '10px', 
                                                fontSize: '0.8rem', 
                                                color: '#666',
                                                borderTop: '1px solid #333',
                                                paddingTop: '8px'
                                            }}>
                                                <div>Torque: {card.torque || 'N/A'} Nm</div>
                                                <div>Weight: {card.weight || 'N/A'} kg</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Ha nincs elég kártya, üres helyek */}
                            {cards.length === 0 && (
                                <div className="text-center text-white mt-5">
                                    <h4>No cards in your collection yet</h4>
                                    <p>Open packs or trade with other players to get cards!</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}