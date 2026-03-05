import { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from "react-router-dom"
import logo from '../assets/carcardsLogo.png'
import { getMarketListings, makeOffer, getMyCards } from "../api"

export default function MarketPage() {
    const navigation = useNavigate()
    const [listings, setListings] = useState([])
    const [myCards, setMyCards] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [showNotifications, setShowNotifications] = useState(false)
    const [selectedListing, setSelectedListing] = useState(null)
    const [selectedCard, setSelectedCard] = useState(null)
    const [showOfferModal, setShowOfferModal] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        
        if (!token) {
            navigation('/login')
            return
        }
        
        setUser(JSON.parse(userData || '{}'))
        loadListings()
        loadMyCards()
    }, [])

    const loadListings = async () => {
        setLoading(true)
        const res = await getMarketListings()
        if (res.result) {
            setListings(res.listings)
        }
        setLoading(false)
    }

    const loadMyCards = async () => {
        const res = await getMyCards()
        if (res.result) {
            setMyCards(res.cards)
        }
    }

    const handleMakeOffer = (listing) => {
        setSelectedListing(listing)
        setShowOfferModal(true)
    }

    const handleOfferSubmit = async () => {
        if (!selectedCard) {
            alert("Please select a card to offer")
            return
        }

        const res = await makeOffer(selectedListing.listing_id, selectedCard.id)
        if (res.result) {
            alert("Offer sent successfully!")
            setShowOfferModal(false)
            setSelectedListing(null)
            setSelectedCard(null)
            loadListings()
        } else {
            alert(res.message || "Failed to send offer")
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

    // Kép placeholder (amíg nincs valódi kép)
    const getImageUrl = (listing) => {
        // Ha van image_url, azt használjuk, különben placeholder
        return listing.image_url || `https://via.placeholder.com/300x150?text=${listing.manufacturer}+${listing.name}`;
    }

    return (
        <div className="vh-100 d-flex flex-column">
            {/* Navbar */}
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

                            {/* Értesítési ablak - világos téma */}
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

            {/* Fő tartalom - világos háttér */}
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
                                    Available Listings ({listings.length})
                                </h3>
                            </div>
                        </div>
                        
                        <div className="row">
                            {listings.map(listing => (
                                <div key={listing.listing_id} className="col-md-3 mb-4">
                                    <div style={{
                                        backgroundColor: '#ffffff',
                                        borderRadius: '15px',
                                        overflow: 'hidden',
                                        border: '1px solid #ddd',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
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
                                        {/* Kép */}
                                        <img 
                                            src={getImageUrl(listing)}
                                            alt={`${listing.manufacturer} ${listing.name}`}
                                            style={{
                                                width: '100%',
                                                height: '120px',
                                                objectFit: 'cover',
                                                borderBottom: '1px solid #eee'
                                            }}
                                            onError={(e) => {
                                                e.target.src = `https://via.placeholder.com/300x120?text=${listing.manufacturer}+${listing.name}`
                                            }}
                                        />
                                        
                                        {/* Tartalom */}
                                        <div style={{ padding: '12px', flex: 1 }}>
                                            <h5 style={{ 
                                                margin: '0 0 8px 0', 
                                                color: '#333',
                                                fontSize: '1rem',
                                                fontWeight: '600'
                                            }}>
                                                {listing.manufacturer} {listing.name}
                                            </h5>
                                            
                                            <p style={{ 
                                                margin: '4px 0', 
                                                color: '#666',
                                                fontSize: '0.9rem'
                                            }}>
                                                <strong>Seller:</strong> {listing.seller_username}
                                            </p>
                                            
                                            <p style={{ 
                                                margin: '4px 0', 
                                                color: '#e67e22',
                                                fontSize: '1rem',
                                                fontWeight: '600'
                                            }}>
                                                {listing.horsepower} HP
                                            </p>
                                            
                                            <p style={{ 
                                                margin: '4px 0', 
                                                color: '#666',
                                                fontSize: '0.85rem'
                                            }}>
                                                0-100: {listing.acceleration}s
                                            </p>
                                        </div>
                                        
                                        {/* Gomb */}
                                        {listing.seller_id !== user?.id && (
                                            <div style={{ padding: '0 12px 12px 12px' }}>
                                                <button
                                                    style={{
                                                        width: '100%',
                                                        padding: '8px',
                                                        backgroundColor: '#3498db',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '25px',
                                                        fontSize: '0.9rem',
                                                        fontWeight: '500',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = '#2980b9'
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = '#3498db'
                                                    }}
                                                    onClick={() => handleMakeOffer(listing)}
                                                >
                                                    MAKE OFFER
                                                </button>
                                            </div>
                                        )}
                                        
                                        {listing.seller_id === user?.id && (
                                            <div style={{ padding: '0 12px 12px 12px' }}>
                                                <p style={{ 
                                                    color: '#e67e22', 
                                                    textAlign: 'center', 
                                                    margin: 0,
                                                    fontSize: '0.9rem',
                                                    fontWeight: '500'
                                                }}>
                                                    YOUR LISTING
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {listings.length === 0 && (
                            <div className="text-center mt-5">
                                <h4 style={{ fontSize: '2rem', fontWeight: '300', color: '#333' }}>No listings available</h4>
                                <p style={{ color: '#666' }}>Check back later or create your own listing!</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Offer Modal - világos téma */}
            {showOfferModal && selectedListing && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000
                }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '20px',
                        padding: '25px',
                        maxWidth: '450px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '15px', color: '#333', fontSize: '1.3rem' }}>Make an Offer</h3>
                        <p style={{ marginBottom: '15px', color: '#666', fontSize: '0.95rem' }}>
                            For: <strong style={{ color: '#e67e22' }}>{selectedListing.manufacturer} {selectedListing.name}</strong>
                        </p>
                        
                        <h4 style={{ marginBottom: '12px', color: '#333', fontSize: '1.1rem' }}>Select a card to offer:</h4>
                        
                        <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '15px' }}>
                            {myCards.length > 0 ? (
                                myCards.map(card => (
                                    <div
                                        key={card.id}
                                        style={{
                                            padding: '12px',
                                            margin: '8px 0',
                                            border: selectedCard?.id === card.id ? '2px solid #e67e22' : '1px solid #ddd',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            backgroundColor: selectedCard?.id === card.id ? '#fff9f0' : '#ffffff',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={() => setSelectedCard(card)}
                                        onMouseEnter={(e) => {
                                            if (selectedCard?.id !== card.id) {
                                                e.currentTarget.style.backgroundColor = '#f5f5f5'
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedCard?.id !== card.id) {
                                                e.currentTarget.style.backgroundColor = '#ffffff'
                                            }
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {/* Mini placeholder kép */}
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                backgroundColor: '#f0f0f0',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#999',
                                                fontSize: '0.7rem'
                                            }}>
                                                🚗
                                            </div>
                                            <div>
                                                <strong style={{ color: '#333' }}>{card.manufacturer} {card.name}</strong>
                                                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.8rem' }}>
                                                    {card.horsepower} HP | 0-100: {card.acceleration}s
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                                    You don't have any cards to offer
                                </p>
                            )}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: 'transparent',
                                    color: '#666',
                                    border: '1px solid #ddd',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#f5f5f5'
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent'
                                }}
                                onClick={() => {
                                    setShowOfferModal(false)
                                    setSelectedListing(null)
                                    setSelectedCard(null)
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                style={{
                                    padding: '10px 25px',
                                    backgroundColor: selectedCard ? '#3498db' : '#cccccc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    cursor: selectedCard ? 'pointer' : 'not-allowed',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedCard) {
                                        e.target.style.backgroundColor = '#2980b9'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedCard) {
                                        e.target.style.backgroundColor = '#3498db'
                                    }
                                }}
                                onClick={handleOfferSubmit}
                                disabled={!selectedCard}
                            >
                                Send Offer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}