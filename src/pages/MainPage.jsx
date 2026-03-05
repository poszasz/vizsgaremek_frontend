import { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from "react-router-dom"
import logo from '../assets/carcardsLogo.png'
import marketImage from '../assets/market-image.png'
import mycardsImage from '../assets/mycards-image.png'
import openpacksImage from '../assets/openpacks-image.png'

export default function MainPage() {
    const navigation = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showNotifications, setShowNotifications] = useState(false)

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

    const goToMain = () => {
        navigation('/main')
    }

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications)
    }

    // Gomb stílus - flexbox a középre igazításhoz
    const buttonContainerStyle = {
        width: '350px',
        height: '650px',
        margin: '0 15px',
        cursor: 'pointer',
        borderRadius: '20px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        border: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    }

    const imageContainerStyle = {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#f0f0f0'
    }

    const imageStyle = {
        maxWidth: '100%',
        maxHeight: '100%',
        width: 'auto',
        height: 'auto',
        objectFit: 'contain',
        display: 'block'
    }

    const textStyle = {
        padding: '20px 0',
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        backgroundColor: '#f8f8f8',
        borderTop: '1px solid #eee',
        letterSpacing: '1px',
        width: '100%'
    }

    // Értesítések minta adatok
    const notifications = [
        { id: 1, message: "New card available in market!", time: "2 min ago", read: false },
        { id: 2, message: "Your offer was accepted", time: "1 hour ago", read: false },
        { id: 3, message: "Daily bonus available", time: "3 hours ago", read: true },
        { id: 4, message: "New pack available!", time: "5 hours ago", read: true }
    ]

    const unreadCount = notifications.filter(n => !n.read).length

    if (loading) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#f5f5f5' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="vh-100 d-flex flex-column">
            {/* Egységes navbar */}
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

                    {/* Középen a Car Cards szöveg */}
                    <span style={{
                        fontSize: '2rem',
                        fontWeight: '500',
                        color: '#000000',
                        lineHeight: '1',
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}>
                        Car Cards
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

            {/* Fő tartalom - gombok egymás mellett */}
            <div className="flex-grow-1 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#f5f5f5' }}>
                <div className="text-center">
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>

                        {/* Market gomb */}
                        <div
                            style={buttonContainerStyle}
                            onClick={() => navigation('/market')}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)'
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)'
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={imageContainerStyle}>
                                <img
                                    src={marketImage}
                                    alt="Market"
                                    style={imageStyle}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/350x250?text=Market'
                                    }}
                                />
                            </div>
                            <div style={textStyle}>
                                MARKET
                            </div>
                        </div>



                        {/* Open Packs gomb */}
                        <div
                            style={buttonContainerStyle}
                            onClick={() => navigation('/openpacks')}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)'
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)'
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={imageContainerStyle}>
                                <img
                                    src={openpacksImage}
                                    alt="Open Packs"
                                    style={imageStyle}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/350x250?text=Open+Packs'
                                    }}
                                />
                            </div>
                            <div style={textStyle}>
                                OPEN PACKS
                            </div>
                        </div>
                        {/* My Cards gomb */}
                        <div
                            style={buttonContainerStyle}
                            onClick={() => navigation('/mycards')}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)'
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)'
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={imageContainerStyle}>
                                <img
                                    src={mycardsImage}
                                    alt="My Cards"
                                    style={imageStyle}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/350x250?text=My+Cards'
                                    }}
                                />
                            </div>
                            <div style={textStyle}>
                                MY CARDS
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        </div>
    )
}