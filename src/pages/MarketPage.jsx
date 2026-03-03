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

    const goToHome = () => {
        navigation('/')
    }

    const goToMain = () => {
        navigation('/main')
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
                        Market
                    </span>

                    <div className="ms-auto d-flex align-items-center">
                        {user && (
                            <span className="text-white me-3">{user.username}</span>
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

            <div className="flex-grow-1 container-fluid p-4" style={{ overflowY: 'auto', backgroundColor: '#0a0a0a' }}>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="row mb-4">
                            <div className="col-12">
                                <h3 className="text-white">
                                    Available Offers ({offers.length})
                                </h3>
                            </div>
                        </div>
                        
                        <div className="row">
                            {offers.map(offer => (
                                <div key={offer.id} className="col-md-4 mb-4">
                                    <div style={{
                                        backgroundColor: '#1a1a1a',
                                        color: 'white',
                                        borderRadius: '15px',
                                        padding: '20px',
                                        border: '2px solid #e67e22'
                                    }}>
                                        <h4 className="mb-3">{offer.card_name}</h4>
                                        <p><strong>Seller:</strong> {offer.seller_username}</p>
                                        <p><strong>Type:</strong> {offer.card_type}</p>
                                        <p><strong>Rarity:</strong> {offer.rarity}</p>
                                        <p><strong>Price:</strong> {offer.price} coins</p>
                                        
                                        {offer.seller_id !== user?.id && (
                                            <button
                                                className="btn btn-success w-100 mt-3"
                                                onClick={() => handleAcceptOffer(offer.id)}
                                                style={{ borderRadius: '10px', padding: '10px' }}
                                            >
                                                Buy for {offer.price} coins
                                            </button>
                                        )}
                                        
                                        {offer.seller_id === user?.id && (
                                            <p className="text-warning text-center mt-3">Your offer</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {offers.length === 0 && (
                            <div className="text-center text-white mt-5">
                                <h4>No offers available</h4>
                                <p>Check back later or create your own offer!</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}