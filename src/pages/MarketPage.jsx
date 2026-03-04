import { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from "react-router-dom"
import logo from '../assets/carcardsLogo.png'
import { getMarketOffers, acceptOffer } from "../api"

export default function MarketPage() {
    const navigation = useNavigate()
    const [offers, setOffers] = useState([])
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
        loadOffers()
    }, [])

    const loadOffers = async () => {
        setLoading(true)
        const res = await getMarketOffers()
        if (res.result) {
            setOffers(res.offers)
        }
        setLoading(false)
    }

    const handleAcceptOffer = async (offerId) => {
        const res = await acceptOffer(offerId)
        if (res.result) {
            alert("Offer accepted! Check your cards.")
            loadOffers()
        } else {
            alert(res.message || "Failed to accept offer")
        }
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

                    {/* Középen a Market szöveg */}
                    <span style={{ 
                        fontSize: '2rem', 
                        fontWeight: '500',
                        color: '#000000',
                        lineHeight: '1',
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}>
                        Market
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

                            {/* Értesítési ablak */}
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
                                {user.username}
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
            <div className="flex-grow-1 container-fluid p-4" style={{ overflowY: 'auto', backgroundColor: '#f5f5f5' }}>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="row mb-4">
                            <div className="col-12">
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '300', color: '#333' }}>
                                    Available Offers ({offers.length})
                                </h3>
                            </div>
                        </div>
                        
                        <div className="row">
                            {offers.map(offer => (
                                <div key={offer.id} className="col-md-4 mb-4">
                                    <div style={{
                                        backgroundColor: '#ffffff',
                                        color: '#333',
                                        borderRadius: '15px',
                                        padding: '20px',
                                        border: '1px solid #ddd',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.02)'
                                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'
                                        e.currentTarget.style.borderColor = '#e67e22'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)'
                                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'
                                        e.currentTarget.style.borderColor = '#ddd'
                                    }}>
                                        <h4 className="mb-3" style={{ color: '#e67e22' }}>{offer.card_name}</h4>
                                        <p><strong style={{ color: '#666' }}>Seller:</strong> {offer.seller_username}</p>
                                        <p><strong style={{ color: '#666' }}>Type:</strong> {offer.card_type}</p>
                                        <p><strong style={{ color: '#666' }}>Rarity:</strong> {offer.rarity}</p>
                                        <p><strong style={{ color: '#666' }}>Price:</strong> <span style={{ color: '#e67e22', fontWeight: 'bold' }}>{offer.price} coins</span></p>
                                        
                                        {offer.seller_id !== user?.id && (
                                            <button
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    marginTop: '15px',
                                                    backgroundColor: '#3498db',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '30px',
                                                    fontSize: '1rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = '#2980b9'
                                                    e.target.style.transform = 'scale(1.02)'
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = '#3498db'
                                                    e.target.style.transform = 'scale(1)'
                                                }}
                                                onClick={() => handleAcceptOffer(offer.id)}
                                            >
                                                Buy for {offer.price} coins
                                            </button>
                                        )}
                                        
                                        {offer.seller_id === user?.id && (
                                            <p style={{ color: '#e67e22', textAlign: 'center', marginTop: '15px' }}>Your offer</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {offers.length === 0 && (
                            <div className="text-center mt-5">
                                <h4 style={{ fontSize: '2rem', fontWeight: '300', color: '#333' }}>No offers available</h4>
                                <p style={{ color: '#666' }}>Check back later or create your own offer!</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}