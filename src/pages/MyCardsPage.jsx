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
    const [showNotifications, setShowNotifications] = useState(false)

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

    const goToMain = () => {
        navigation('/main')
    }

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications)
    }

    // Értesítések minta adatok
    const notifications = [
        { id: 1, message: "New card available in market!", time: "2 min ago", read: false },
        { id: 2, message: "Your offer was accepted", time: "1 hour ago", read: false },
        { id: 3, message: "Daily bonus available", time: "3 hours ago", read: true },
        { id: 4, message: "New pack available!", time: "5 hours ago", read: true }
    ]

    const unreadCount = notifications.filter(n => !n.read).length

    // Kártya stílus - 5x3-as rács
    const cardContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '20px',
        padding: '20px'
    }

    const cardStyle = {
        backgroundColor: '#ffffff',
        borderRadius: '15px',
        overflow: 'hidden',
        border: '1px solid #ddd',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    }

    const imageStyle = {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
        borderBottom: '1px solid #eee'
    }

    const contentStyle = {
        padding: '15px',
        color: '#333',
        flex: 1
    }

    const carNameStyle = {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '5px',
        color: '#333'
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
        color: '#666',
        fontSize: '0.8rem'
    }

    const specValueStyle = {
        color: '#333',
        fontWeight: '500'
    }

    return (
        <div className="vh-100 d-flex flex-column">
            {/* Egységes navbar - változatlan */}
            <nav className="navbar" style={{ 
                height: '70px', 
                minHeight: '70px',
                backgroundColor: '#d1d1d1',
                position: 'relative',
                zIndex: 1000
            }}>
                <div className="container-fluid d-flex align-items-center justify-content-between px-4" style={{ height: '100%' }}>
                    {/* Bal oldali logo */}
                    <button 
                        onClick={goToMain}
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            padding: 0, 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <img 
                            src={logo} 
                            alt="Car Cards Logo" 
                            style={{ height: '50px', width: 'auto' }} 
                        />
                    </button>

                    {/* Középen a My Cards szöveg */}
                    <span style={{ 
                        fontSize: '2rem', 
                        fontWeight: '500',
                        color: '#000000',
                        lineHeight: '1',
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}>
                        My Cards
                    </span>

                    {/* Jobb oldali ikonok */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {/* Csengő ikon értesítésekkel */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={toggleNotifications}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#000000',
                                    fontSize: '1.8rem',
                                    cursor: 'pointer',
                                    width: '50px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                    transition: 'background-color 0.3s ease',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent'
                                }}
                            >
                                🔔
                                {unreadCount > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        backgroundColor: 'red',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold'
                                    }}>
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Értesítési ablak - világos változat */}
                            {showNotifications && (
                                <div style={{
                                    position: 'absolute',
                                    top: '60px',
                                    right: '0',
                                    width: '300px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #ddd',
                                    borderRadius: '10px',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                    zIndex: 1001,
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        padding: '15px',
                                        borderBottom: '1px solid #ddd',
                                        backgroundColor: '#f5f5f5'
                                    }}>
                                        <h4 style={{ margin: 0, color: '#333', fontSize: '1.1rem' }}>Notifications</h4>
                                    </div>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {notifications.length > 0 ? (
                                            notifications.map(notif => (
                                                <div key={notif.id} style={{
                                                    padding: '12px 15px',
                                                    borderBottom: '1px solid #eee',
                                                    backgroundColor: notif.read ? '#ffffff' : '#f0f7ff',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#e8e8e8'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = notif.read ? '#ffffff' : '#f0f7ff'}
                                                >
                                                    <div style={{ color: '#333', fontSize: '0.95rem', marginBottom: '4px' }}>
                                                        {notif.message}
                                                    </div>
                                                    <div style={{ color: '#666', fontSize: '0.8rem' }}>
                                                        {notif.time}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                                No notifications
                                            </div>
                                        )}
                                    </div>
                                    <div style={{
                                        padding: '10px 15px',
                                        borderTop: '1px solid #ddd',
                                        backgroundColor: '#f5f5f5',
                                        textAlign: 'center'
                                    }}>
                                        <button
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#3498db',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                            onClick={() => alert('Mark all as read')}
                                        >
                                            Mark all as read
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Felhasználónév */}
                        {user && (
                            <span style={{ color: '#000000', fontSize: '1rem', fontWeight: '500' }}>
                                {user.username}'s Collection
                            </span>
                        )}

                        {/* Kijelentkezés gomb */}
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#000000',
                                fontSize: '1.8rem',
                                cursor: 'pointer',
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent'
                            }}
                        >
                            ↪
                        </button>
                    </div>
                </div>
            </nav>

            {/* Világos háttér */}
            <div className="flex-grow-1" style={{ overflowY: 'auto', backgroundColor: '#f5f5f5' }}>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-4">
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '300', color: '#333', marginBottom: '20px' }}>
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
                                            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'
                                            e.currentTarget.style.borderColor = '#3498db'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)'
                                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'
                                            e.currentTarget.style.borderColor = '#ddd'
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
                                            
                                            {/* További infók */}
                                            <div style={{ 
                                                marginTop: '10px', 
                                                fontSize: '0.8rem', 
                                                color: '#666',
                                                borderTop: '1px solid #eee',
                                                paddingTop: '8px'
                                            }}>
                                                <div>Torque: {card.torque || 'N/A'} Nm</div>
                                                <div>Weight: {card.weight || 'N/A'} kg</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Ha nincs elég kártya */}
                            {cards.length === 0 && (
                                <div className="text-center mt-5">
                                    <h4 style={{ fontSize: '2rem', fontWeight: '300', color: '#333' }}>No cards in your collection yet</h4>
                                    <p style={{ color: '#666' }}>Open packs or trade with other players to get cards!</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}