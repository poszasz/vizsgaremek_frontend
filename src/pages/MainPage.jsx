import { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from "react-router-dom"
import logo from '../assets/carcardsLogo.png'

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
            <div className="vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#0a0a0a' }}>
                <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="vh-100 d-flex flex-column">
            {/* Egységes navbar - mint a login-nál */}
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
                        Menu
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
                                    backgroundColor: '#1a1a1a',
                                    border: '1px solid #333',
                                    borderRadius: '10px',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                                    zIndex: 1001,
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        padding: '15px',
                                        borderBottom: '1px solid #333',
                                        backgroundColor: '#2a2a2a'
                                    }}>
                                        <h4 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>Notifications</h4>
                                    </div>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {notifications.length > 0 ? (
                                            notifications.map(notif => (
                                                <div key={notif.id} style={{
                                                    padding: '12px 15px',
                                                    borderBottom: '1px solid #333',
                                                    backgroundColor: notif.read ? '#1a1a1a' : '#2a2a2a',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.2s ease'
                                                }}
                                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                                                    onMouseLeave={(e) => e.target.style.backgroundColor = notif.read ? '#1a1a1a' : '#2a2a2a'}
                                                >
                                                    <div style={{ color: 'white', fontSize: '0.95rem', marginBottom: '4px' }}>
                                                        {notif.message}
                                                    </div>
                                                    <div style={{ color: '#888', fontSize: '0.8rem' }}>
                                                        {notif.time}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                                                No notifications
                                            </div>
                                        )}
                                    </div>
                                    <div style={{
                                        padding: '10px 15px',
                                        borderTop: '1px solid #333',
                                        backgroundColor: '#2a2a2a',
                                        textAlign: 'center'
                                    }}>
                                        <button
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#5dade2',
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

            <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                <div className="text-center">
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
                    >🏪Market</button>

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
                </div>
            </div>
        </div>
    )
}