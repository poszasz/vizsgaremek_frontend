import { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from "react-router-dom"
import logo from '../assets/carcardsLogo.png'
import { openPack, getMyPacks } from "../api"

export default function OpenpacksPage() {
    const navigation = useNavigate()
    const [packs, setPacks] = useState(0)
    const [opening, setOpening] = useState(false)
    const [lastCard, setLastCard] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        
        if (!token) {
            navigation('/login')
            return
        }
        
        setUser(JSON.parse(userData || '{}'))
        loadPacks()
    }, [])

    const loadPacks = async () => {
        const res = await getMyPacks()
        if (res.result) {
            setPacks(res.packs)
        }
    }

    const handleOpenPack = async () => {
        if (packs <= 0) {
            alert("You don't have any packs to open!")
            return
        }

        setOpening(true)
        const res = await openPack()
        setOpening(false)

        if (res.result) {
            setLastCard(res.card)
            setPacks(prev => prev - 1)
            alert(`You got: ${res.card.card_name} (${res.card.rarity})!`)
        } else {
            alert(res.message || "Failed to open pack")
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
                        Open Packs
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

            <div className="flex-grow-1 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#0a0a0a' }}>
                <div className="text-center">
                    <h2 className="text-white mb-4">You have {packs} pack{packs !== 1 ? 's' : ''}</h2>
                    
                    <button
                        style={{
                            width: '300px',
                            padding: '20px 0',
                            fontSize: '1.5rem',
                            borderRadius: '20px',
                            border: 'none',
                            backgroundColor: '#27ae60',
                            color: 'white',
                            cursor: packs > 0 ? 'pointer' : 'not-allowed',
                            opacity: packs > 0 ? 1 : 0.5,
                            marginBottom: '30px'
                        }}
                        onClick={handleOpenPack}
                        disabled={opening || packs === 0}
                    >
                        {opening ? 'Opening...' : '🎁 Open Pack'}
                    </button>

                    {opening && (
                        <div className="mt-4">
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Opening...</span>
                            </div>
                        </div>
                    )}

                    {lastCard && !opening && (
                        <div className="mt-5">
                            <h3 className="text-white mb-3">Last Card:</h3>
                            <div style={{
                                backgroundColor: '#1a1a1a',
                                color: 'white',
                                borderRadius: '16px',
                                padding: '20px',
                                border: '2px solid #27ae60',
                                maxWidth: '300px',
                                margin: '0 auto'
                            }}>
                                <h4>{lastCard.card_name}</h4>
                                <p>Type: {lastCard.card_type}</p>
                                <p>Rarity: {lastCard.rarity}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}