import { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from "react-router-dom"
import logo from '../assets/carcardsLogo.png'
import { getMarketListings, makeOffer, getMyCards, getMyListings, createListing, deleteListing, getMyPendingOffers, deleteOffer } from "../api"

export default function MarketPage() {
    const navigation = useNavigate()
    const [listings, setListings] = useState([])
    const [filteredListings, setFilteredListings] = useState([])
    const [myCards, setMyCards] = useState([])
    const [myPendingOffers, setMyPendingOffers] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [showNotifications, setShowNotifications] = useState(false)
    const [selectedListing, setSelectedListing] = useState(null)
    const [selectedUserCardId, setSelectedUserCardId] = useState(null)
    const [showOfferModal, setShowOfferModal] = useState(false)
    const [showPostOfferModal, setShowPostOfferModal] = useState(false)
    const [selectedCardForListing, setSelectedCardForListing] = useState(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [listingToDelete, setListingToDelete] = useState(null)
    const [showDeleteOfferConfirm, setShowDeleteOfferConfirm] = useState(false)
    const [offerToDelete, setOfferToDelete] = useState(null)

    // Szűrő állapot
    const [filterType, setFilterType] = useState('all')

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
        loadMyPendingOffers()
    }, [])

    useEffect(() => {
        applyFilter()
    }, [listings, filterType, user])

    const loadMyPendingOffers = async () => {
        const res = await getMyPendingOffers()
        if (res.result) {
            console.log("Saját függőben lévő offerek:", res.offers)
            setMyPendingOffers(res.offers)
        }
    }

    const applyFilter = () => {
        if (!user) return

        let filtered = [...listings]

        switch (filterType) {
            case 'mine':
                filtered = listings.filter(listing => listing.seller_id === user.id)
                break
            case 'others':
                filtered = listings.filter(listing => listing.seller_id !== user.id)
                break
            case 'all':
            default:
                filtered = listings
                break
        }

        setFilteredListings(filtered)
    }

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
            console.log("===== KÁRTYÁK BACKEND VÁLASZ =====")
            console.log("Teljes válasz:", res.cards)
            res.cards.forEach(card => {
                console.log(`${card.manufacturer} ${card.name}: id=${card.id}, is_listed=${card.is_listed}, is_offered=${card.is_offered}`)
            })
            
            const cardsWithUserCardId = res.cards.map(card => {
                console.log(`MAPPING: ${card.manufacturer} ${card.name} - cards.id=${card.id}, user_cards.id lesz: ${card.id}`)
                return {
                    ...card,
                    user_card_id: card.id  // Ez a user_cards.id
                }
            })
            
            const availableCards = cardsWithUserCardId.filter(
                card => !card.is_listed && !card.is_offered
            )
            
            console.log("Elérhető kártyák (nem listingelve, nem offerben):", availableCards.length)
            availableCards.forEach(card => {
                console.log(`- ${card.manufacturer} ${card.name} (user_card_id: ${card.user_card_id})`)
            })
            console.log("=========================")
    
            setMyCards(availableCards)
        }
    }

    const handleMakeOffer = (listing) => {
        console.log("Kiválasztott listing:", listing)
        setSelectedListing(listing)
        setSelectedUserCardId(null)
        setShowOfferModal(true)
    }

    const handlePostOffer = () => {
        setSelectedCardForListing(null)
        setShowPostOfferModal(true)
    }

    const handleCreateListing = async () => {
        if (!selectedCardForListing) {
            alert("Please select a card to list")
            return
        }
    
        console.log("===== LISTING LÉTREHOZÁS =====")
        console.log("Kiválasztott kártya teljes objektuma:", selectedCardForListing)
        console.log("Kiválasztott kártya neve:", selectedCardForListing.manufacturer, selectedCardForListing.name)
        console.log("Küldött user_card_id:", selectedCardForListing.user_card_id)
        console.log("Küldött típusa:", typeof selectedCardForListing.user_card_id)
        console.log("==============================")
    
        const res = await createListing(selectedCardForListing.user_card_id)
        console.log("Válasz a szervertől:", res)
        
        if (res.result) {
            alert("Listing created successfully!")
            setShowPostOfferModal(false)
            setSelectedCardForListing(null)
            await loadListings()
            await loadMyCards()
        } else {
            alert(res.message || "Failed to create listing")
        }
    }

    const handleDeleteClick = (listing) => {
        setListingToDelete(listing)
        setShowDeleteConfirm(true)
    }

    const handleDeleteConfirm = async () => {
        if (!listingToDelete) return

        const res = await deleteListing(listingToDelete.listing_id)
        if (res.result) {
            alert("Listing deleted successfully!")
            setShowDeleteConfirm(false)
            setListingToDelete(null)
            await loadListings()
            await loadMyCards()
        } else {
            alert(res.message || "Failed to delete listing")
        }
    }

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false)
        setListingToDelete(null)
    }

    const handleDeleteOfferClick = (offer) => {
        setOfferToDelete(offer)
        setShowDeleteOfferConfirm(true)
    }

    const handleDeleteOfferConfirm = async () => {
        if (!offerToDelete) return

        const res = await deleteOffer(offerToDelete.offer_id)
        if (res.result) {
            alert("Offer cancelled successfully!")
            setShowDeleteOfferConfirm(false)
            setOfferToDelete(null)
            // Frissítsük a kártyákat és az offereket
            await loadMyPendingOffers()
            await loadMyCards()
        } else {
            alert(res.message || "Failed to delete offer")
        }
    }

    const handleDeleteOfferCancel = () => {
        setShowDeleteOfferConfirm(false)
        setOfferToDelete(null)
    }

    const handleOfferSubmit = async () => {
        if (!selectedUserCardId) {
            alert("Please select a card to offer")
            return
        }
    
        const selectedCard = myCards.find(c => c.user_card_id === selectedUserCardId)
    
        console.log("===== OFFER KÜLDÉS =====")
        console.log("Listing ID:", selectedListing.listing_id)
        console.log("Selected User Card ID (user_cards.id):", selectedUserCardId)
        console.log("Selected Card details:", selectedCard)
        console.log("=========================")
    
        const res = await makeOffer(selectedListing.listing_id, selectedUserCardId)
        console.log("Offer response:", res)
    
        if (res.result) {
            alert("Offer sent successfully!")
    
            setShowOfferModal(false)
            setSelectedListing(null)
            setSelectedUserCardId(null)
            
            // Frissítsük a listingeket, kártyákat és offereket
            await loadListings()
            await loadMyCards()
            await loadMyPendingOffers()
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

    // Kép placeholder
    const getImageUrl = (item) => {
        return item.image_url || `https://via.placeholder.com/300x150?text=${item.manufacturer}+${item.name}`;
    }

    // Kártya stílus a Post Offer modalhoz
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

    const specsPreviewStyle = {
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

            {/* Fő tartalom */}
            <div className="flex-grow-1 container-fluid p-4" style={{ overflowY: 'auto', backgroundColor: '#f5f5f5' }}>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Szűrő sor */}
                        <div className="row mb-4 align-items-center">
                            <div className="col-12 d-flex justify-content-between align-items-center">
                                <div style={{ width: '120px' }}></div>
                                
                                {/* Középen a szűrők */}
                                <div style={{
                                    display: 'flex',
                                    gap: '10px',
                                    backgroundColor: '#ffffff',
                                    padding: '8px',
                                    borderRadius: '50px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    border: '1px solid #ddd'
                                }}>
                                    <button
                                        style={{
                                            padding: '8px 20px',
                                            borderRadius: '30px',
                                            border: 'none',
                                            backgroundColor: filterType === 'all' ? '#000000' : 'transparent',
                                            color: filterType === 'all' ? 'white' : '#666',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={() => setFilterType('all')}
                                        onMouseEnter={(e) => {
                                            if (filterType !== 'all') {
                                                e.target.style.backgroundColor = '#333333'
                                                e.target.style.color = 'white'
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (filterType !== 'all') {
                                                e.target.style.backgroundColor = 'transparent'
                                                e.target.style.color = '#666'
                                            }
                                        }}
                                    >
                                        All Listings ({listings.length})
                                    </button>
                                    <button
                                        style={{
                                            padding: '8px 20px',
                                            borderRadius: '30px',
                                            border: 'none',
                                            backgroundColor: filterType === 'mine' ? '#000000' : 'transparent',
                                            color: filterType === 'mine' ? 'white' : '#666',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={() => setFilterType('mine')}
                                        onMouseEnter={(e) => {
                                            if (filterType !== 'mine') {
                                                e.target.style.backgroundColor = '#333333'
                                                e.target.style.color = 'white'
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (filterType !== 'mine') {
                                                e.target.style.backgroundColor = 'transparent'
                                                e.target.style.color = '#666'
                                            }
                                        }}
                                    >
                                        My Listings ({listings.filter(l => l.seller_id === user?.id).length})
                                    </button>
                                    <button
                                        style={{
                                            padding: '8px 20px',
                                            borderRadius: '30px',
                                            border: 'none',
                                            backgroundColor: filterType === 'others' ? '#000000' : 'transparent',
                                            color: filterType === 'others' ? 'white' : '#666',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={() => setFilterType('others')}
                                        onMouseEnter={(e) => {
                                            if (filterType !== 'others') {
                                                e.target.style.backgroundColor = '#333333'
                                                e.target.style.color = 'white'
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (filterType !== 'others') {
                                                e.target.style.backgroundColor = 'transparent'
                                                e.target.style.color = '#666'
                                            }
                                        }}
                                    >
                                        Others ({listings.filter(l => l.seller_id !== user?.id).length})
                                    </button>
                                </div>
                                
                                {/* Jobb oldalon a Post Offer gomb */}
                                <button
                                    style={{
                                        padding: '10px 25px',
                                        backgroundColor: '#000000',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '30px',
                                        fontSize: '0.95rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        width: '120px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#333333'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#000000'
                                    }}
                                    onClick={handlePostOffer}
                                >
                                     POST OFFER
                                </button>
                            </div>
                        </div>

                        {/* Saját függőben lévő offerek szekció */}
                        {myPendingOffers.length > 0 && (
                            <div className="row mb-4">
                                <div className="col-12">
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '300', color: '#333', marginBottom: '15px' }}>
                                        My Pending Offers ({myPendingOffers.length})
                                    </h3>
                                    <div className="row">
                                        {myPendingOffers.map(offer => (
                                            <div key={offer.offer_id} className="col-md-3 mb-4">
                                                <div style={{
                                                    backgroundColor: '#ffffff',
                                                    borderRadius: '15px',
                                                    overflow: 'hidden',
                                                    border: '1px solid #ddd',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }}>
                                                    <div style={{ padding: '15px', flex: 1 }}>
                                                        <h5 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '1rem', fontWeight: '600' }}>
                                                            Your offer
                                                        </h5>
                                                        <p style={{ margin: '4px 0', color: '#666', fontSize: '0.9rem' }}>
                                                            <strong>Card:</strong> {offer.manufacturer} {offer.name}
                                                        </p>
                                                        <p style={{ margin: '4px 0', color: '#666', fontSize: '0.9rem' }}>
                                                            <strong>HP:</strong> {offer.horsepower} HP
                                                        </p>
                                                        <p style={{ margin: '4px 0', color: '#666', fontSize: '0.8rem' }}>
                                                            Created: {new Date(offer.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div style={{ padding: '0 12px 12px 12px' }}>
                                                        <button
                                                            style={{
                                                                width: '100%',
                                                                padding: '8px',
                                                                backgroundColor: '#dc3545',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '25px',
                                                                fontSize: '0.9rem',
                                                                fontWeight: '500',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.backgroundColor = '#c82333'
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.backgroundColor = '#dc3545'
                                                            }}
                                                            onClick={() => handleDeleteOfferClick(offer)}
                                                        >
                                                            DELETE OFFER
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="row mb-4">
                            <div className="col-12">
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '300', color: '#333' }}>
                                    {filterType === 'all' && `All Listings (${filteredListings.length})`}
                                    {filterType === 'mine' && `My Listings (${filteredListings.length})`}
                                    {filterType === 'others' && `Others' Listings (${filteredListings.length})`}
                                </h3>
                            </div>
                        </div>

                        <div className="row">
                            {filteredListings.map(listing => (
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
                                            e.currentTarget.style.borderColor = '#000000'
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
                                                color: '#333',
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

                                        {/* Gombok */}
                                        {listing.seller_id !== user?.id && (
                                            <div style={{ padding: '0 12px 12px 12px' }}>
                                                <button
                                                    style={{
                                                        width: '100%',
                                                        padding: '8px',
                                                        backgroundColor: '#000000',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '25px',
                                                        fontSize: '0.9rem',
                                                        fontWeight: '500',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = '#333333'
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = '#000000'
                                                    }}
                                                    onClick={() => handleMakeOffer(listing)}
                                                >
                                                    MAKE OFFER
                                                </button>
                                            </div>
                                        )}

                                        {listing.seller_id === user?.id && (
                                            <div style={{ padding: '0 12px 12px 12px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <p style={{
                                                        color: '#666',
                                                        textAlign: 'center',
                                                        margin: 0,
                                                        fontSize: '0.9rem',
                                                        fontWeight: '500',
                                                        flex: 1,
                                                        alignSelf: 'center'
                                                    }}>
                                                        YOUR LISTING
                                                    </p>
                                                    <button
                                                        style={{
                                                            padding: '6px 12px',
                                                            backgroundColor: '#dc3545',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '20px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: '500',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.backgroundColor = '#c82333'
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.backgroundColor = '#dc3545'
                                                        }}
                                                        onClick={() => handleDeleteClick(listing)}
                                                    >
                                                        DELETE
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredListings.length === 0 && (
                            <div className="text-center mt-5">
                                <h4 style={{ fontSize: '2rem', fontWeight: '300', color: '#333' }}>No listings found</h4>
                                <p style={{ color: '#666' }}>
                                    {filterType === 'all' && "Check back later or create your own listing!"}
                                    {filterType === 'mine' && "You don't have any active listings. Create one from your cards!"}
                                    {filterType === 'others' && "No other listings available at the moment."}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Delete Listing Confirmation Modal */}
            {showDeleteConfirm && listingToDelete && (
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
                        padding: '30px',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '15px', color: '#333', fontSize: '1.3rem' }}>Delete Listing</h3>
                        <p style={{ marginBottom: '20px', color: '#666', fontSize: '1rem' }}>
                            Are you sure you want to delete your listing for <strong>{listingToDelete.manufacturer} {listingToDelete.name}</strong>?
                        </p>
                        <p style={{ marginBottom: '25px', color: '#666', fontSize: '0.9rem' }}>
                            This will remove it from the market and you can trade this card again.
                        </p>
                        
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
                                onClick={handleDeleteCancel}
                            >
                                Cancel
                            </button>
                            <button
                                style={{
                                    padding: '10px 25px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#c82333'
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#dc3545'
                                }}
                                onClick={handleDeleteConfirm}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Offer Confirmation Modal */}
            {showDeleteOfferConfirm && offerToDelete && (
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
                        padding: '30px',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '15px', color: '#333', fontSize: '1.3rem' }}>Delete Offer</h3>
                        <p style={{ marginBottom: '20px', color: '#666', fontSize: '1rem' }}>
                            Are you sure you want to delete your offer for <strong>{offerToDelete.manufacturer} {offerToDelete.name}</strong>?
                        </p>
                        <p style={{ marginBottom: '25px', color: '#666', fontSize: '0.9rem' }}>
                            This will remove the offer and you can use this card again.
                        </p>
                        
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
                                onClick={handleDeleteOfferCancel}
                            >
                                Cancel
                            </button>
                            <button
                                style={{
                                    padding: '10px 25px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#c82333'
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#dc3545'
                                }}
                                onClick={handleDeleteOfferConfirm}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Offer Modal */}
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
                            For: <strong style={{ color: '#000000' }}>{selectedListing.manufacturer} {selectedListing.name}</strong>
                        </p>

                        <h4 style={{ marginBottom: '12px', color: '#333', fontSize: '1.1rem' }}>Select a card to offer:</h4>

                        <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '15px' }}>
                            {myCards.length > 0 ? (
                                myCards.map(card => (
                                    <div
                                        key={card.user_card_id}
                                        style={{
                                            padding: '12px',
                                            margin: '8px 0',
                                            border: selectedUserCardId === card.user_card_id ? '2px solid #000000' : '1px solid #ddd',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            backgroundColor: selectedUserCardId === card.user_card_id ? '#f5f5f5' : '#ffffff',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={() => setSelectedUserCardId(card.user_card_id)}
                                        onMouseEnter={(e) => {
                                            if (selectedUserCardId !== card.user_card_id) {
                                                e.currentTarget.style.backgroundColor = '#f5f5f5'
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedUserCardId !== card.user_card_id) {
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
                                    You don't have any cards available to offer
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
                                    setSelectedUserCardId(null)
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                style={{
                                    padding: '10px 25px',
                                    backgroundColor: selectedUserCardId ? '#000000' : '#cccccc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    cursor: selectedUserCardId ? 'pointer' : 'not-allowed',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedUserCardId) {
                                        e.target.style.backgroundColor = '#333333'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedUserCardId) {
                                        e.target.style.backgroundColor = '#000000'
                                    }
                                }}
                                onClick={handleOfferSubmit}
                                disabled={!selectedUserCardId}
                            >
                                Send Offer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Post Offer Modal */}
            {showPostOfferModal && (
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
                        padding: '30px',
                        maxWidth: '900px',
                        width: '95%',
                        maxHeight: '85vh',
                        overflowY: 'auto',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '15px', color: '#333', fontSize: '1.5rem' }}>Post a Listing</h3>
                        <p style={{ marginBottom: '20px', color: '#666', fontSize: '1rem' }}>
                            Select a card to put on the market
                        </p>

                        <h4 style={{ marginBottom: '15px', color: '#333', fontSize: '1.2rem' }}>Your available cards:</h4>

                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(2, 1fr)', 
                            gap: '20px', 
                            marginBottom: '25px',
                            maxHeight: '500px',
                            overflowY: 'auto',
                            padding: '5px'
                        }}>
                            {myCards.length > 0 ? (
                                myCards.map(card => (
                                    <div 
                                        key={card.user_card_id}
                                        style={{
                                            ...cardStyle,
                                            border: selectedCardForListing?.user_card_id === card.user_card_id ? '2px solid #000000' : '1px solid #ddd',
                                            boxShadow: selectedCardForListing?.user_card_id === card.user_card_id ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.05)',
                                            transform: selectedCardForListing?.user_card_id === card.user_card_id ? 'scale(1.02)' : 'scale(1)'
                                        }}
                                        onClick={() => setSelectedCardForListing(card)}
                                        onMouseEnter={(e) => {
                                            if (selectedCardForListing?.user_card_id !== card.user_card_id) {
                                                e.currentTarget.style.transform = 'scale(1.02)'
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                                                e.currentTarget.style.borderColor = '#000000'
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedCardForListing?.user_card_id !== card.user_card_id) {
                                                e.currentTarget.style.transform = 'scale(1)'
                                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'
                                                e.currentTarget.style.borderColor = '#ddd'
                                            }
                                        }}
                                    >
                                        {/* Kép */}
                                        <img 
                                            src={getImageUrl(card)}
                                            alt={`${card.manufacturer} ${card.name}`}
                                            style={imageStyle}
                                            onError={(e) => {
                                                e.target.src = `https://via.placeholder.com/300x150?text=${card.manufacturer}+${card.name}`
                                            }}
                                        />
                                        
                                        {/* Tartalom */}
                                        <div style={contentStyle}>
                                            <div style={carNameStyle}>
                                                {card.manufacturer} {card.name}
                                            </div>
                                            
                                            <div style={specsPreviewStyle}>
                                                <div style={specItemStyle}>
                                                    <span style={specLabelStyle}>HP</span>
                                                    <span style={specValueStyle}>{card.horsepower || 'N/A'} hp</span>
                                                </div>
                                                <div style={specItemStyle}>
                                                    <span style={specLabelStyle}>0-100</span>
                                                    <span style={specValueStyle}>{card.acceleration || 'N/A'}s</span>
                                                </div>
                                                <div style={specItemStyle}>
                                                    <span style={specLabelStyle}>Fuel</span>
                                                    <span style={specValueStyle}>{card.fuel || 'N/A'}</span>
                                                </div>
                                                <div style={specItemStyle}>
                                                    <span style={specLabelStyle}>Gearbox</span>
                                                    <span style={specValueStyle}>{card.gearbox || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                                    <p style={{ color: '#666', fontSize: '1.1rem' }}>
                                        You don't have any cards available to list
                                    </p>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '10px' }}>
                            <button
                                style={{
                                    padding: '12px 25px',
                                    backgroundColor: 'transparent',
                                    color: '#666',
                                    border: '1px solid #ddd',
                                    borderRadius: '30px',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#f5f5f5'
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent'
                                }}
                                onClick={() => {
                                    setShowPostOfferModal(false)
                                    setSelectedCardForListing(null)
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                style={{
                                    padding: '12px 30px',
                                    backgroundColor: selectedCardForListing ? '#000000' : '#cccccc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '30px',
                                    cursor: selectedCardForListing ? 'pointer' : 'not-allowed',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedCardForListing) {
                                        e.target.style.backgroundColor = '#333333'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedCardForListing) {
                                        e.target.style.backgroundColor = '#000000'
                                    }
                                }}
                                onClick={handleCreateListing}
                                disabled={!selectedCardForListing}
                            >POST OFFER</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}